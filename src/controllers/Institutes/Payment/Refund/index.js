import { Student } from "../../../../models/Administration/Authorization/index.js";
import refund from "../../../../models/Institutes/Payment/Refund_Model.js";
import StudentFee from "../../../../models/Institutes/Payment/Student_Fee_Model.js";
import Validations from "../../../../validations/index.js";
import { getBranchDetailsWithUUID, getCourseDetailsWithUUID, getInstituteDetailswithUUID } from "../../common/index.js";


export const createrefundController = async (req,res) => {
    try{      
        const value = Validations.createRefund(req.body);
        console.log(value, "Value")

        const institute = await getInstituteDetailswithUUID(value.institute_id)
        const branch = await getBranchDetailsWithUUID(value.branch_name)
        const course = await getCourseDetailsWithUUID(value.course_name)
        const student_Fees = await StudentFee.findById(value?.studentfees)

        const {transaction_id} = value;

        const existingtransaction_id = await refund.findOne( {studentfees:value?.studentfees} );
        
        if (existingtransaction_id) {
            return res.status(400).send({
                success: false,
                message: 'Transaction_id already exists',
            });
        } 
    
            const newrefund = new refund({...value,institute_id:institute._id,branch_name:branch._id,course_name:course._id}); 
            const populatedRefund = await refund.populate(newrefund, { path: 'institute_id branch_name course_name student studentfees' });

            await newrefund.save();
            res.status(200).send({
                success: true,
                message: 'New refund Created Successfully',
                data: populatedRefund
            })

    } catch(error){
        res.status(500).send({
            success: false,
            message: 'something went wrong',
            error: error.message
        })
    }

}


export const getAllrefundsController = async (req, res) => {
    try {
        const refunds = await refund.find({ is_deleted: false }).populate('institute_id branch_name course_name student').populate({path: "studentfees", model:"studentfees"});
        res.status(200).send({
            success: true,
            message: 'All refunds retrieved successfully',
            data:refunds
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};


export const getrefundByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const Refund = await refund.findById(id);
        if (!Refund) {
            return res.status(404).send({
                success: false,
                message: 'refund not found'
            });
        }
        res.status(200).send({
            success: true,
            message: 'refund retrieved successfully',
            error: error.message
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};


export const updaterefundController = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, is_active } = req.body;

        if (is_active !== undefined) {
            return res.status(400).send({
                success: false,
                message: 'Updating the "is_active" field is not allowed',
            });
        }

        const Refund = await refund.findById(id);
        if (!Refund) {
            return res.status(404).send({
                success: false,
                message: 'Refund not found',
            });
        }

        const studentFee = await StudentFee.findById(Refund.studentfees);
        if (!studentFee) {
            return res.status(404).send({
                success: false,
                message: 'Student fee record not found',
            });
        }

        if (amount > studentFee.paid_amount) {
            return res.status(400).send({
                success: false,
                message: 'Refund amount exceeds paid amount',
            });
        }

        // Update the student fee model
        studentFee.paid_amount -= amount;
        studentFee.balance += amount;
        await studentFee.save();

        // Update the refund model
        refund.amount = amount;
        const updatedRefund = await Refund.save();

        res.status(200).send({
            success: true,
            message: 'Refund updated successfully',
            updatedRefund
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};


export const updaterefundStatusController = async (req, res) => {
    try {
        const { id } = req.params;
       
        const { is_active, ...rest } = req.body;
            
        if (Object.keys(rest).length > 0) {
            return res.status(400).send({
                success: false,
                message: 'Only "is_active" field is allowed to be updated',
            });
        }

        const updatedrefundStatus = await refund.findByIdAndUpdate(id, { is_active }, { new: true });

        res.status(200).send({
            success: true,
            message: 'refund status updated successfully',
            updatedrefundStatus
        })
    
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};


export const deleterefundController = async (req, res) => {
    try {
        const { _id } = req.params;
        await refund.findByIdAndUpdate(_id, { is_deleted: true });
        res.status(200).send({
            success: true,
            message: 'refund deleted successfully'
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

export const searchRefundsController = async (req, res) => {
    try {
        const { query } = req.params;

        
        const refunds = await refund.find({
            $and: [
                { is_deleted: false }, 
                { transaction_id: { $regex: new RegExp(query, 'i') } } 
                
            ]
        });

        if (refunds.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No refunds found matching the search criteria'
            });
        }

        res.status(200).send({
            success: true,
            message: 'Refunds retrieved successfully',
            refunds
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

