import Batch from "../../../../models/Institutes/Batch/index.js";
import Course from "../../../../models/Institutes/Course/index.js";
import IdCard from "../../../../models/Institutes/IdCard/Student_IdCard.js";
import { Student } from "../../../../models/Administration/Authorization/index.js";
import qrcode from 'qrcode'; 
import studentValidationSchema from "../../../../validations/Institutes/User/Student/index.js";


export const CreateStudent = async (req, res) => {
    try {
        const { error,value} = studentValidationSchema.validate (req.body);
        if(error&&error.details){
            const {message} = error.details[0]
            return res.status(400).json({status:"failed",message:message})
         }

         const {institute_id} = value;


        const existing = await Student.findOne({ email, institute_id, branch_id});
        
        if (existing) {
            if (existing.is_deleted) {
                return res.status(400).send({
                    success: false,
                    message: 'Email with the same name already exists but is deleted contact admin to retrive',
                });
            } else {
                return res.status(400).send({
                    success: false,
                    message: 'Email name already exists',
                });
            }
        }

        const student = new Student(req.body);
    

        // Save student 
        let savedStudent;        
        try {
            savedStudent = await student.save();
        } catch (error) {
            return res.status(500).send({
                success: false,
                message: "Failed to save student",
                error: error.message
            });
        }

        // roll_id check
        if (!savedStudent.roll_id) {
            return res.status(500).send({
                success: false,
                message: "Failed to generate roll_id for the student",
                error: error.message
            });
        }

        // Create QR CODE  
        const qrCodeData = {
            name: `${first_name} ${last_name}`,
            email,
            username,
            institute_id, 
            branch_id,
            role: 'student',
            contact: contact_info.phone_number,
            address: `${contact_info.address1}, ${contact_info.address2}, ${contact_info.city}, ${contact_info.state}, ${contact_info.pincode}`,
            roll_id: savedStudent.roll_id 
        };
        const qrCodeString = JSON.stringify(qrCodeData);
        const qrCodeBuffer = await qrcode.toDataURL(qrCodeString);

        // Create ID card 
        const idCard = new IdCard({
            name: `${first_name} ${last_name}`,
            email,
            username,
            institute_id,
            branch_id,
            role: 'student',
            contact: contact_info.phone_number,
            address: `${contact_info.address1}, ${contact_info.address2}, ${contact_info.city}, ${contact_info.state}, ${contact_info.pincode}`,
            qr_code: qrCodeBuffer,
            roll_id: savedStudent.roll_id 
        });

          // Save idCard 
        let savedIdCard;
      
        try {
            savedIdCard = await idCard.save();
        } catch (error) {
            await Student.deleteOne({ _id: savedStudent._id });
            return res.status(500).send({
                success: false,
                message: "Failed to create ID Card. Student creation rolled back.",
                error: error.message
            });
        }

        res.status(200).send({
            success: true,
            message: "Student and ID Card created successfully",
            student: savedStudent,
            IDCARD: savedIdCard,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to create Student and ID Card",
            error: error.message
        });
    }
}

export const UpdateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active, ...updatedFields } = req.body;

        if (Object.keys(updatedFields).length === 0) {
            return res.status(400).send({
                success: false,
                message: 'No fields provided for update',
            });
        }

        if (is_active !== undefined) {
            return res.status(400).send({
                success: false,
                message: 'Updating the "is_active" field is not allowed',
            });
        }

    
        const updatedStudent = await Student.findByIdAndUpdate(id, updatedFields, { new: true });

        const student = await Student.findById(id);
        const idCard = await IdCard.findOne({ email: student.email });

        if (idCard) {
            idCard.name = `${updatedStudent.first_name} ${updatedStudent.last_name}`;
            idCard.email = updatedStudent.email;
            idCard.username = updatedStudent.username;
            idCard.institute_id = updatedStudent.institute_id;
            idCard.branch_id = updatedStudent.branch_id;  
            idCard.role = 'student';
            idCard.contact = updatedStudent.contact_info.phone_number;
            idCard.address = `${updatedStudent.contact_info.address1}, ${updatedStudent.contact_info.address2}, ${updatedStudent.contact_info.city}, ${updatedStudent.contact_info.state}, ${updatedStudent.contact_info.pincode}`;
            await idCard.save();
        }
        
        res.status(200).send({
            success: true,
            message: "Student updated successfully",
            updatedStudent,
            IDCARD: idCard
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to update Student",
            error: error.message
        });
    }
}


export const DeleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findById(id);
        await Student.findByIdAndUpdate(id, { is_deleted: true });
        
        await IdCard.findOneAndUpdate({ email: student.email },  { is_deleted: true });

        res.status(200).send({
            success: true,
            message: "Student deleted successfully"
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to delete Student",
            error: error.message
        });
    }
}


export const GetAllStudents = async (req, res) => {
    try {
        const allStudents = await Student.find({ is_deleted: false }).select("-password");
        res.status(200).send({
            success: true,
            message: "All Students retrieved successfully",
            students: allStudents
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to retrieve Students",
            error: error.message
        });
    }
}


export const getAllStudentController = async (req, res) => {
    try {
        const Students = await Student.find({}).select("-password");
        const Count = Students.length; 
        res.status(200).send({
            success: true,
            message: 'All Students retrieved successfully with Deleted ',
            Count,
            Students
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};


export const GetStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findById(id).select("-password");
        if (!student) {
            return res.status(404).send({
                success: false,
                message: "Student not found"
            });
        }
        res.status(200).send({
            success: true,
            message: "Student retrieved successfully",
            error: error.message
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to retrieve Student",
            error: error.message
        });
    }
}

export const UpdateStudentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active, ...rest } = req.body;
        
        if (Object.keys(rest).length > 0) {
            return res.status(400).send({
                success: false,
                message: 'Only "is_active" field is allowed to be updated',
            });
        }

        const updatedStudentstatus = await Student.findByIdAndUpdate(id, {is_active}, { new: true });
        
        const student = await Student.findById(id);
        await IdCard.findOneAndUpdate({ email: student.email }, { is_active }, { new: true });

        res.status(200).send({
            success: true,
            message: "Stutent Status Updated Successfully",
            updatedStudentstatus
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to Update Status Student",
            error: error.message
        });
    }
}


export const StudentfilterController = async (req, res) => {
    try {
        const { instituteid, branchid  } = req.params;
        const { isActive } = req.body; 

        if (typeof isActive !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'Invalid isActive parameter. It should be a boolean value.',
            });
        }
      
        const filterArgs = {
            institute_id: instituteid,
            branch_id: branchid ,
            is_deleted: false,
        };
        
        if (isActive !== undefined) {
            filterArgs.is_active = isActive;
        }

        const student = await Student.find(filterArgs);
        const Count = student.length; 


        res.status(200).json({
            success: true,
            Count,
            student,
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while filtering Student.',
            error: error.message,
        });
    }
};

export const StudentfilterByCourseController = async (req, res) => {
    try {
        const { instituteid, branchid } = req.params;
        const { courseName } = req.body; 

        const filterArgs = {
            institute_id: instituteid,
            branch_id: branchid,
            is_deleted: false,
        };       

        if (courseName) {
            const course = await Course.findOne({ slug: courseName });
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found.',
                });
            }
            filterArgs.course = course._id; 
        }

        const students = await Student.find(filterArgs).select("-password").populate("course");
        const count = students.length; 

        res.status(200).json({
            success: true,
            count,
            students,
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while filtering students.',
            error: error.message,
        });
    }
};


export const StudentfilterByBatchController = async (req, res) => {
    try {
        const { instituteid, branchid } = req.params;
        const { BatchName } = req.body; 

        const filterArgs = {
            institute_id: instituteid,
            branch_id: branchid,
            is_deleted: false,
        };       

        if (BatchName) {
            const batch = await Batch.findOne({ slug: BatchName });
            if (!batch) {
                return res.status(404).json({
                    success: false,
                    message: 'Batch not found.',
                });
            }
            filterArgs._id = { $in: batch.student };                       
        }

        const students = await Student.find(filterArgs).select("-password");
        const count = students.length; 

        res.status(200).json({
            success: true,
            count,
            students,
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while filtering students.',
            error: error.message,
        });
    }
};

export const searchStudentController = async (req, res) => {
    try {
        const { keyword, instituteid, branchid} = req.params;

        const results = await Student.find({
            $and: [
                { institute_id: instituteid },
                { branch_id: branchid }, 
                { is_deleted: false },
                {
                    $or: [
                        { first_name: { $regex: keyword, $options: "i" } },
                        { username: { $regex: keyword, $options: "i" } },
                    ],
                },
            ],
        });
        
        if (!results || results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No Student found for the provided criteria.',
            });
        }

         const Count = results.length;

        res.json({ Count, results  });

    } catch (error) {
        res.status(400).send({
            success: false,
            message: 'Error in search Student ',
            error: error.message
        });
    }
}



export const getStudentByInstituteIdController = async (req, res) => {
    try {
        const { id } = req.params;
        
        const student = await Student.find({ institute_id: id });
        const Count = student.length; 

        if (!student || student.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No Student records found for the institute'
            });
        }
        
        res.status(200).send({
            success: true,
            message: 'Student records retrieved successfully',
            Count,
            student
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};


export const getAllStudentByInstituteIdController = async (req, res) => {
    try {
        const { id } = req.params;
        
        const Students = await Student.find({ institute_id: id, is_deleted: false });
        const Count = Students.length; 

        if (!Students || Students.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No Students records found'
            });
        }
        
        res.status(200).send({
            success: true,
            message: 'All Students retrieved successfully with Deleted',
            Count,
            Students: Students
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};




export const getStudentByInstituteAndBranchController = async (req, res) => {
    try {
        const { id, bid } = req.params;
        
        const student = await Student.find({institute_id: id ,branch_id: bid });

        if (!student || student.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No Student records found for the institute and branch'
            });
        }
        
        res.status(200).send({
            success: true,
            message: 'Student records retrieved successfully',
            student
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error:error.message
        });
    }
};


export const getAllStudentByInstituteAndBranchController = async (req, res) => {
    try {
        const { id, bid } = req.params;
    
        const Students = await Student.find({institute_id: id, branch_id: bid, is_deleted: false });

        if (!Students || Students.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No Student records found for the institute and branch'
            });
        }
        
        res.status(200).send({
            success: true,
            message: 'Student records retrieved successfully with Deleted',
            Students
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error:error.message
        });
    }
};

