import Studentfee from "../../../../models/Institutes/Payment/Student_Fee_Model.js";
import Validations from "../../../../validations/index.js";
import { getBranchDetailsWithUUID, getCourseDetailsWithUUID, getInstituteDetailswithUUID } from "../../common/index.js";
import Refund_Model from "../../../../models/Institutes/Payment/Refund_Model.js";
import { InstituteUser } from "../../../../models/Institutes/Administration/Authorization/index.js";
import { createStudentfeeNotification } from "../../Notification/student/index.js";


const GST_RATE = 0.18; // Example GST rate
const OTHER_TAX_RATE = 0.02;


export const createStudentfeeController = async (req, res) => {
    try {
        const value = Validations.createstudentfees(req.body);
        console.log(value, "value")
        const institute = await getInstituteDetailswithUUID(value.institute_id)
        const branch = await getBranchDetailsWithUUID(value.branch_id)
        const course = await getCourseDetailsWithUUID(value.course_name)

        const { transaction_id } = value;

        // const existingtransaction_id  = await Studentfee.findOne({
        //     'payment_history': { $elemMatch: { transaction_id: transaction_id } }
        // });

        const existingtransaction_id = await Studentfee.findOne({ transaction_id });

        if (existingtransaction_id) {
            return res.status(400).send({
                success: false,
                message: 'Transaction_id already exists',
            });
        }




        const newStudentfee = new Studentfee({ ...value, institute_id: institute._id, branch_id: branch._id, course_name: course._id });
        await newStudentfee.save();
        res.status(200).send({
            success: true,
            message: 'New Studentfee Created Successfully',
            data: newStudentfee
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'something went wrong',
            error: error.message
        })
    }

}



export const getAllStudentfeesController = async (req, res) => {
    try {
        const { branch_id } = req.query
        const branch = await getBranchDetailsWithUUID(branch_id)

        let { page = 1, perPage = 10 } = req.query
        const count = await Studentfee.countDocuments({ is_deleted: false, branch_id: branch?._id })
        const Studentfees = await Studentfee.find({ is_deleted: false, branch_id: branch?._id }).populate("student").populate("batch_id")
            .skip((page - 1) * perPage).limit(perPage)
        const last_page = Math.ceil(count / perPage)
        res.status(200).send({
            success: true,
            message: 'All Studentfees retrieved successfully',
            data: Studentfees, last_page, count
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};


export const getStudentfeeByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const StudentId = await InstituteUser.findOne({ uuid: id });
    if (!StudentId) {
      return res.status(404).send({ success: false, message: "Student not found" });
    }

    const student = await InstituteUser.findOne({ _id: StudentId._id }).populate({
      path: "userDetail",
      model: "Student_Login",
      populate: { path: "course", model: "courses" }
    });

    const studentfee = await Studentfee.find({ student: StudentId._id })
      .populate("student")
      .populate("course_id")
      .populate("institute_id")
      .populate("branch_id")
      .populate("batch_id");

    if (!studentfee || studentfee.length === 0) {
      return res.status(404).send({ success: false, message: "Studentfee not found" });
    }

    const totalAmount = studentfee.reduce((sum, fee) => sum + (fee.paid_amount || 0), 0);

    const paymentHistories = studentfee.flatMap(fee => fee.payment_history || []);

    const courseFees = Array.isArray(student?.userDetail?.course)
      ? student.userDetail.course[0]?.current_price
      : student?.userDetail?.course?.current_price;

    const studentFeesData = {
      course_fees: courseFees,
      payment_history: paymentHistories
    };

    const pending_payment = Math.floor((studentFeesData.course_fees || 0) - totalAmount);
    const payment_status =
      (studentFeesData.course_fees || 0) == totalAmount ? "completed" : "pending";

    const balanceRows = paymentHistories.map(payment => ({
      type: "Balance",
      amount: payment.balance,
      payment_date: payment.payment_date,
      transaction_id: payment.transaction_id,
      payment_method: payment.payment_method,
      duepaymentdate: payment.duepaymentdate
    }));

    res.status(200).send({
      success: true,
      message: "Studentfee retrieved successfully",
      data: {
        fees: studentfee,
        course_fees: "₹" + (studentFeesData.course_fees || 0),
        totalAmount: "₹" + totalAmount,
        pending_payment: "₹" + pending_payment,
        payment_status: `Payment ${payment_status}`,
        course: student?.userDetail?.course,
        payment_history: studentFeesData.payment_history,
        balance: balanceRows
      }
    });
  } catch (error) {
    console.log(error, "error");
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: error.message
    });
  }
};



export const updateStudentfeeController = async (req, res) => {
    try {




        const uuid = req.params
        console.log(uuid + " the uuid id is ");

        const student_id = await InstituteUser.findOne({ uuid: uuid })
        const studentfee_id = await Studentfee.findOne({ student: student_id._id });
        const _id = studentfee_id._id




        const { is_active, is_fullpayment, paid_amount, transaction_id, payment_date } = req.body;

        const Student = await Studentfee.findById(_id);
        const studentObject = Student.toObject();
        const balance_fees = studentObject.balance;

        if (balance_fees === 0) {

            return res.status(400).send({
                success: false,
                message: 'There is no existing balance',
            });
        }

        if (is_active !== undefined) {
            return res.status(400).send({
                success: false,
                message: 'Updating the "is_active" field is not allowed',
            });
        }

        if (is_fullpayment) {
            const Student = await Studentfee.findById(_id);
            const studentObject = Student.toObject();
            studentObject.is_fullpayment = true
            studentObject.is_emi = false
            Student.balance = studentObject.balance;

            await Student.save();
            await Student.save()


            if (studentObject.balance === paid_amount) {
                Student.balance = 0;
                await Student.save();

                const updatedStudentfee = await Studentfee.findByIdAndUpdate(_id, req.body, { new: true });
                const paymentHistorySchema = {
                    paid_amount: paid_amount,
                    balance: 0,
                    payment_date: payment_date,
                    transaction_id: transaction_id,
                    duepaymentdate: null
                }


                console.log(paymentHistorySchema);
                // const Student = await Studentfee.findById(_id);
                await Studentfee.findByIdAndUpdate(
                    _id,
                    { $push: { payment_history: paymentHistorySchema } },
                    { new: true }
                ).then(updatedStudent => {
                    console.log("Updated Student Payment History:", updatedStudent);
                }).catch(error => {
                    console.error("Error updating payment history:", error);
                });
                res.status(200).send({
                    success: true,
                    message: 'Studentfee updated successfully',
                    updatedStudentfee
                })

            }
            else {
                res.status(400).send({
                    success: true,
                    message: 'Please pay the available pending amount ',
                })


            }
        }

        else {

            const { months, paid_amount } = req.body;
            if (!months || months <= 0) {
                return res.status(400).json({ message: "Invalid number of months for EMI." });
            }
            const Student = await Studentfee.findById(_id);
            const studentObject = Student.toObject();

            console.log(studentObject);

            const total_fees = (studentObject.balance == null || studentObject.balance === undefined) ? studentObject.total_fee : studentObject.balance;

            console.log(total_fees);

            // const course_name = studentObject.course_id
            // console.log(course_name);
            const monthlyInstallment = total_fees / months; // Total fee divided by months

            console.log(total_fees);
            console.log(monthlyInstallment);

            console.log(studentObject.balance - monthlyInstallment);
            const available_balance = studentObject.balance - monthlyInstallment

            if (paid_amount != monthlyInstallment) {

                return res.status(400).json({ message: "Invalid Emi amount for frst month." });

            }
            let emirecords = [];

            let currentDate = new Date(payment_date);

            for (let i = 0; i < months; i++) {
                let dueDate = new Date(currentDate);
                console.log(dueDate); // Check the calculated due date
                dueDate.setMonth(dueDate.getMonth() + i);

                // Ensure the due date doesn't exceed the last day of the month (handle month-end cases)
                const daysInMonth = new Date(dueDate.getFullYear(), dueDate.getMonth() + 1, 0).getDate();
                dueDate.setDate(Math.min(currentDate.getDate(), daysInMonth)); // Set the due date to the last valid day if necessary

                console.log(dueDate.toISOString().split('T')[0]); // Check the calculated due date

                let paymentstatus = "pending"
                let transaction_id = 0

                if (i === 0) {
                    paymentstatus = "completed"
                    transaction_id = transaction_id
                }
                emirecords.push({
                    // course_name: course_name,
                    amount: monthlyInstallment,
                    due_date: dueDate.toISOString().split('T')[0], // Save as YYYY-MM-DD format
                    transaction_id: transaction_id,
                    paymentstatus: paymentstatus
                });

            }

            await Studentfee.findByIdAndUpdate(
                _id,
                {
                    $set: { is_emi: true, is_fullpayment: false, balance: available_balance },
                    $push: { emi_details: { $each: emirecords } },
                },
                { new: true }
            ).then(updatedStudent => {
                console.log("Updated Student Payment History:", updatedStudent);
            }).catch(error => {
                console.error("Error updating payment history:", error);
            });

            res.status(200).send({
                success: true,
                message: 'Studentfee updated successfully',
                emirecords
            })



        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};




export const updateStudentfeeStatusController = async (req, res) => {
    try {
        const { id } = req.params;

        const { is_active, ...rest } = req.body;

        if (Object.keys(rest).length > 0) {
            return res.status(400).send({
                success: false,
                message: 'Only "is_active" field is allowed to be updated',
            });
        }
        const updatedStudentfeeStatus = await Studentfee.findByIdAndUpdate(id, { is_active }, { new: true });

        res.status(200).send({
            success: true,
            message: 'Studentfee status updated successfully',
            updatedStudentfeeStatus
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};


export const deleteStudentfeeController = async (req, res) => {
    try {

        const uuid = req.params
        const student_id = await InstituteUser.findOne(uuid)
        if (!student_id) {
            res.status(400).json({
                success: false,
                message: 'Student details not found',
            });
        }
        const studentfee_id = await Studentfee.findOne({ student: student_id._id });

        const _id = studentfee_id._id

        await Studentfee.findByIdAndUpdate(_id, { is_deleted: true });
        res.status(200).send({
            success: true,
            message: 'Studentfee deleted successfully'
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

export const searchStudentFeeStatusController = async (req, res) => {
    try {
        const { query } = req.params;


        const studentFees = await Studentfee.find({
            $and: [
                { is_deleted: false },
                { transaction_id: { $regex: new RegExp(query, 'i') } }

            ]
        });

        if (studentFees.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No student fees found matching the search criteria'
            });
        }

        res.status(200).send({
            success: true,
            message: 'Student fees retrieved successfully',
            studentFees
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};


export const updateStudentfeeemiController = async (req, res) => {
    try {
        const uuid = req.user.uuid


        const student_id = await InstituteUser.findOne({ uuid: uuid })

        const studentfee_id = await Studentfee.findOne({ student: student_id._id });

        const _id = studentfee_id._id



        // const { _id } = req.params;
        const { emi_id, paid_amount } = req.body;
        const Student = await Studentfee.findById(_id);
        const studentObject = Student.toObject();
        const total_fees = studentObject.emi_details
        const emiRecord = total_fees.find(record => record._id.toString() === emi_id);

        console.log(studentObject.balance - paid_amount);
        const available_balance = studentObject.balance - paid_amount

        if (!emiRecord) {
            return res.status(404).json({ message: 'EMI record not found' });
        }

        const student = await Studentfee.findOneAndUpdate(
            { _id, 'emi_details._id': emi_id },
            {
                $set: {
                    'emi_details.$.paymetstatus': 'completed',
                },
            },
            { new: true }
        );


        await Studentfee.findByIdAndUpdate(
            _id,
            {
                $set: { balance: available_balance },
            },
            { new: true }
        ).then(updatedStudent => {
            console.log("Updated Student Payment History:", updatedStudent);
        }).catch(error => {
            console.error("Error updating payment history:", error);
        });


        res.status(200).send({
            success: true,
            message: 'Studentfee emi updated successfully',

        })

        // }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

