import { Non_TeachingStaff } from "../../../../../models/Administration/Authorization/index.js";
import IdCard from "../../../../../models/Institutes/IdCard/Staff_IdCard.js";
import qrcode from "qrcode";
import Course from "../../../../../models/Institutes/Course/index.js";
import nonTeachingStaffValidationSchema from "../../../../../validations/Institutes/User/Non_Staff/index.js";


export const CreateNonTeachingStaff = async (req, res) => {
    try {
        const { error,value} = nonTeachingStaffValidationSchema.validate (req.body);
        if(error&&error.details){
            const {message} = error.details[0]
            return res.status(400).json({status:"failed",message:message})
         }

         const {institute_id} = value;

        const existing = await Non_TeachingStaff.findOne({ email, institute_id, branch_id });
        
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

        const staff = new Non_TeachingStaff(req.body); 

        let savedStaff;
        try {
            savedStaff = await staff.save();
        } catch (error) {
            return res.status(500).send({
                success: false,
                message: "Failed to save staff",
                error: error.message
            });
        }

        if (!savedStaff.roll_id) {
            return res.status(500).send({
                success: false,
                message: "Failed to generate roll_id for the staff",
                error: "Roll_id is not available in the saved staff object"
            });
        }

        const qrCodeData = {
            name: full_name,
            email,
            username,
            institute_id,
            branch_id,
            role: 'staff', 
            type: 'nonteaching',
            contact: contact_info.phone_number,
            address: `${contact_info.address1}, ${contact_info.address2}, ${contact_info.city}, ${contact_info.state}, ${contact_info.pincode}`,
            roll_id: savedStaff.roll_id 
        };
        
        const qrCodeString = JSON.stringify(qrCodeData);
        const qrCodeBuffer = await qrcode.toDataURL(qrCodeString);

  
        const idCard = new IdCard({
            name: full_name,
            email,
            username, 
            institute_id,
            branch_id,
            role: 'staff',
            type: 'nonteaching',
            contact: contact_info.phone_number,
            address: `${contact_info.address1}, ${contact_info.address2}, ${contact_info.city}, ${contact_info.state}, ${contact_info.pincode}`,
            qr_code: qrCodeBuffer,
            roll_id: savedStaff.roll_id 
        });

        let savedIdCard;
        try {
            savedIdCard = await idCard.save();
        } catch (error) {
            await Non_TeachingStaff.deleteOne({ _id: savedStaff._id });
            return res.status(500).send({
                success: false,
                message: "Failed to create ID Card. Staff creation rolled back.",
                error: error.message
            });
        }

        res.status(200).send({
            success: true,
            message: 'Staff Created Successfully',
            staff: savedStaff,
            idCard: savedIdCard
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to Create Staff",
            error: error.message
        });
    }
}


export const UpdateNonTeachingStaff = async (req, res) => {
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

    
        const updatedStaff = await Non_TeachingStaff.findByIdAndUpdate(id, req.body, { new: true });

        const staff = await Non_TeachingStaff.findById(id);
        const idCard = await IdCard.findOne({ email: staff.email });

        if (idCard) {
            idCard.name = `${updatedStaff.first_name} ${updatedStaff.last_name}`;
            idCard.email = updatedStaff.email;
            idCard.username = updatedStaff.username;
            idCard.institute_id = updatedStaff.institute_id;
            idCard.branch_id = updatedStaff.branch_id;            
            idCard.role = 'staff';
            idCard.type = 'nonteaching';
            idCard.contact = updatedStaff.contact_info.phone_number;
            idCard.address = `${updatedStaff.contact_info.address1}, ${updatedStaff.contact_info.address2}, ${updatedStaff.contact_info.city}, ${updatedStaff.contact_info.state}, ${updatedStaff.contact_info.pincode}`;
            await idCard.save();
        }
        
        res.status(200).send({
            success: true,
            message: "Staff updated successfully",
            updatedStaff,
            IDCARD: idCard
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to update Non-Teaching Staff",
            error: error.message
        });
    }
}


export const DeleteNonTeachingStaff = async (req, res) => {
    try {
        const { id } = req.params;

        const staff = await Non_TeachingStaff.findById(id);

        await Non_TeachingStaff.findByIdAndUpdate(id, { is_deleted: true });
        
        await IdCard.findOneAndUpdate({ email: staff.email },  { is_deleted: true });

        res.status(200).send({
            success: true,
            message: "Non-Teaching Staff deleted successfully"
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to delete Non-Teaching Staff",
            error: error.message
        });
    }
}


export const GetAllNonTeachingStaff = async (req, res) => {
    try {
        const allStaff = await Non_TeachingStaff.find({ is_deleted: false }).select("-password");
        res.status(200).send({
            success: true,
            message: "All Non-Teaching Staff retrieved successfully",
            staff: allStaff
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to retrieve Non-Teaching Staff",
            error: error.message
        });
    }
}


export const getAllNonTeachingStaffController = async (req, res) => {
    try {
        const Staffs = await Non_TeachingStaff.find({}).select("-password");
        const Count = Staffs.length; 
        res.status(200).send({
            success: true,
            message: 'All Staffs retrieved successfully with Deleted ',
            Count,
            Staffs
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};


export const GetNonTeachingStaffById = async (req, res) => {
    try {
        const { id } = req.params;
        const staff = await Non_TeachingStaff.findById(id).select("-password");
        if (!staff) {
            return res.status(404).send({
                success: false,
                message: "Non-Teaching Staff not found"
            });
        }
        res.status(200).send({
            success: true,
            message: "Non-Teaching Staff retrieved successfully",
            staff
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to retrieve Non-Teaching Staff",
            error: error.message
        });
    }
}

export const UpdateNonTeachingStaffStatus = async (req, res) => {
    try {
        const { id } = req.params;
        
        const { is_active, ...rest } = req.body;
            
        if (Object.keys(rest).length > 0) {
            return res.status(400).send({
                success: false,
                message: 'Only "is_active" field is allowed to be updated',
            });
        }

        const updatednonteachingstaff = await Non_TeachingStaff.findByIdAndUpdate(id, {is_active}, { new: true });
        res.status(200).send({
            success: true,
            message: "Non Teaching Staff Status Updated Successfully",
            updatednonteachingstaff
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to Update Status Teaching Staff Attendance",
            error: error.message
        });
    }
}



export const NonTeachingStaffFilterController = async (req, res) => {
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

        const nonteachingStaff = await Non_TeachingStaff.find(filterArgs);
        const Count = nonteachingStaff.length; 


        res.status(200).json({
            success: true,
            Count,
            nonteachingStaff,
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while filtering Non Teaching Staff.',
            error: error.message,
        });
    }
};


export const NonTeachingStaffFilterByCourseController = async (req, res) => {
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

        const NonTeachingStaffs = await Non_TeachingStaff.find(filterArgs).select("-password");
        const count = NonTeachingStaffs.length; 

        res.status(200).json({
            success: true,
            count,
            NonTeachingStaffs,
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while filtering Non Teaching Staff',
            error: error.message,
        });
    }
};


export const searchNonTeachingStaffController = async (req, res) => {
    try {
        const { keyword, instituteid, branchid} = req.params;

        const results = await Non_TeachingStaff.find({
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
                message: 'No Non_TeachingStaff found for the provided criteria.',
            });
        }

         const Count = results.length;

        res.json({ Count, results  });

    } catch (error) {
        res.status(400).send({
            success: false,
            message: 'Error in search Non_TeachingStaff ',
            error: error.message
        });
    }
}



export const getNonTeachingStaffByInstituteIdController = async (req, res) => {
    try {
        const { id } = req.params;
        
        const NonTeachingStaff = await Non_TeachingStaff.find({ institute_id: id });
        const Count = NonTeachingStaff.length; 

        if (!NonTeachingStaff || NonTeachingStaff.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No Non Teaching Staff records found for the institute'
            });
        }
        
        res.status(200).send({
            success: true,
            message: 'Non_TeachingStaff records retrieved successfully',
            Count,
            NonTeachingStaff
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};


export const getAllNonTeachingStaffByInstituteIdController = async (req, res) => {
    try {
        const { id } = req.params;
        
        const NonTeachingStaffs = await Non_TeachingStaff.find({ institute_id: id, is_deleted: false });
        const Count = NonTeachingStaffs.length; 

        if (!NonTeachingStaffs || NonTeachingStaffs.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No Non_TeachingStaff records found'
            });
        }
        
        res.status(200).send({
            success: true,
            message: 'All Non_TeachingStaff retrieved successfully with Deleted',
            Count,
            NonTeachingStaff: NonTeachingStaffs
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};




export const getNonTeachingStaffByInstituteAndBranchController = async (req, res) => {
    try {
        const { id, bid } = req.params;
        
        const NonTeachingStaff = await Non_TeachingStaff.find({institute_id: id ,branch_id: bid });

        if (!NonTeachingStaff || NonTeachingStaff.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No Non_TeachingStaff records found for the institute and branch'
            });
        }
        
        res.status(200).send({
            success: true,
            message: 'Non_TeachingStaff records retrieved successfully',
            NonTeachingStaff
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error:error.message
        });
    }
};


export const getAllNonTeachingStaffByInstituteAndBranchController = async (req, res) => {
    try {
        const { id, bid } = req.params;
    
        const NonTeachingStaffs = await Non_TeachingStaff.find({institute_id: id, branch_id: bid, is_deleted: false });

        if (!NonTeachingStaffs || NonTeachingStaffs.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No Non_TeachingStaff records found for the institute and branch'
            });
        }
        
        res.status(200).send({
            success: true,
            message: 'Non_TeachingStaff records retrieved successfully with Deleted',
            NonTeachingStaffs
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error:error.message
        });
    }
};



