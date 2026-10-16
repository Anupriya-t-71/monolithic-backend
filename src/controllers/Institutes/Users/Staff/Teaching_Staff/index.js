import { Teaching_Staff } from "../../../../../models/Administration/Authorization/index.js";
import IdCard from "../../../../../models/Institutes/IdCard/Staff_IdCard.js";
import qrcode from "qrcode";
import Course from "../../../../../models/Institutes/Course/index.js";
import teachingStaffValidationSchema from "../../../../../validations/Institutes/User/Staff/index.js";


export const CreateTeachingStaff = async (req, res) => {
        try {
            const { error,value} = teachingStaffValidationSchema.validate (req.body);
            if(error&&error.details){
                const {message} = error.details[0]
                return res.status(400).json({status:"failed",message:message})
             }
    
             const {institute_id} = value;
    
    
            const existing = await Teaching_Staff.findOne({ email, institute_id, branch_id });
    
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
    
    
            const staff = new Teaching_Staff(req.body);
   
    
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
                await Teaching_Staff.deleteOne({ _id: savedStaff._id });
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
    
    
export const UpdateTeachingStaff = async (req, res) => {
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

    
        const updatedStaff = await Teaching_Staff.findByIdAndUpdate(id, req.body, { new: true });

        const staff = await Teaching_Staff.findById(id);
        const idCard = await IdCard.findOne({ email: staff.email });

        if (idCard) {
            idCard.name = `${updatedStaff.first_name} ${updatedStaff.last_name}`;
            idCard.email = updatedStaff.email;
            idCard.username = updatedStaff.username;
            idCard.institute_id = updatedStaff.institute_id;
            idCard.branch_id = updatedStaff.branch_id;  
            idCard.role = 'staff';
            idCard.type= 'nonteaching';
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
            message: "Failed to Update Staff",
            error: error.message
        });
    }
}


export const DeleteTeachingStaff = async (req, res) => {
    try {
        const { id } = req.params;

        const staff = await Teaching_Staff.findById(id);

        await Teaching_Staff.findByIdAndUpdate(id, { is_deleted: true });
        
        await IdCard.findOneAndUpdate({ email: staff.email },  { is_deleted: true });

        res.status(200).send({
            success: true,
            message: "Staff Deleted Successfully"
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to Delete Staff",
            error: error.message
        });
    }
}


export const GetAllTeachingStaff = async (req, res) => {
    try {
        const allStaff = await Teaching_Staff.find({ is_deleted: false }).select("-password");
        res.status(200).send({
            success: true,
            message: "All Staff Retrieved Successfully",
            staff: allStaff
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to Retrieve Staff",
            error: error.message
        });
    }
}


export const getAllTeachingStaffController = async (req, res) => {
    try {
        const Staffs = await Teaching_Staff.find({}).select("-password");
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



export const GetTeachingStaffById = async (req, res) => {
    try {
        const { id } = req.params;
        const staff = await Teaching_Staff.findById(id).select("-password");
        if (!staff) {
            return res.status(404).send({
                success: false,
                message: "Staff not found"
            });
        }
        res.status(200).send({
            success: true,
            message: "Staff Retrieved Successfully",
            staff
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to Retrieve Staff",
            error: error.message
        });
    }
}

export const UpdateTeachingStaffStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active, ...rest } = req.body;
        
        if (Object.keys(rest).length > 0) {
            return res.status(400).send({
                success: false,
                message: 'Only "is_active" field is allowed to be updated',
            });
        }

        const updatedteachingstaff = await Teaching_Staff.findByIdAndUpdate(id, {is_active}, { new: true });
        res.status(200).send({
            success: true,
            message: "Teaching Staff Status Updated Successfully",
            updatedteachingstaff
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to Update Status Teaching Staff ",
            error: error.message
        });
    }
}




export const TeachingStafffilterController = async (req, res) => {
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

        const TeachingStaff = await Teaching_Staff.find(filterArgs);
        const Count = TeachingStaff.length; 


        res.status(200).json({
            success: true,
            Count,
            TeachingStaff,
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while filtering TeachingStaff.',
            error: error.message,
        });
    }
};

export const TeachingStafffilterByCourseController = async (req, res) => {
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

        const TeachingStaffs = await Teaching_Staff.find(filterArgs).select("-password");
        const count = TeachingStaffs.length; 

        res.status(200).json({
            success: true,
            count,
            TeachingStaffs,
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while filtering TeachingStaff',
            error: error.message,
        });
    }
};


export const searchTeachingStaffController = async (req, res) => {
    try {
        const { keyword, instituteid, branchid} = req.params;

        const results = await Teaching_Staff.find({
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
                message: 'No Teaching_Staff found for the provided criteria.',
            });
        }

         const Count = results.length;

        res.json({ Count, results  });

    } catch (error) {
        res.status(400).send({
            success: false,
            message: 'Error in search TeachingStaff ',
            error: error.message
        });
    }
}



export const getTeachingStaffByInstituteIdController = async (req, res) => {
    try {
        const { id } = req.params;
        
        const TeachingStaff = await Teaching_Staff.find({ institute_id: id });
        const Count = TeachingStaff.length; 

        if (!TeachingStaff || TeachingStaff.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No TeachingStaff records found for the institute'
            });
        }
        
        res.status(200).send({
            success: true,
            message: 'TeachingStaff records retrieved successfully',
            Count,
            TeachingStaff
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};


export const getAllTeachingStaffByInstituteIdController = async (req, res) => {
    try {
        const { id } = req.params;
        
        const TeachingStaffs = await Teaching_Staff.find({ institute_id: id, is_deleted: false });
        const Count = TeachingStaffs.length; 

        if (!TeachingStaffs || TeachingStaffs.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No TeachingStaffs records found'
            });
        }
        
        res.status(200).send({
            success: true,
            message: 'All TeachingStaffs retrieved successfully with Deleted',
            Count,
            TeachingStaff: TeachingStaffs
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};




export const getTeachingStaffByInstituteAndBranchController = async (req, res) => {
    try {
        const { id, bid } = req.params;
        
        const TeachingStaff = await Teaching_Staff.find({institute_id: id ,branch_id: bid });

        if (!TeachingStaff || TeachingStaff.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No TeachingStaff records found for the institute and branch'
            });
        }
        
        res.status(200).send({
            success: true,
            message: 'TeachingStaff records retrieved successfully',
            TeachingStaff
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error:error.message
        });
    }
};


export const getAllTeachingStaffByInstituteAndBranchController = async (req, res) => {
    try {
        const { id, bid } = req.params;
    
        const TeachingStaffs = await Teaching_Staff.find({institute_id: id, branch_id: bid, is_deleted: false });

        if (!TeachingStaffs || TeachingStaffs.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No TeachingStaff records found for the institute and branch'
            });
        }
        
        res.status(200).send({
            success: true,
            message: 'TeachingStaff records retrieved successfully with Deleted',
            TeachingStaffs
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error:error.message
        });
    }
};

