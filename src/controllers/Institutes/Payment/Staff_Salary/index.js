import { InstituteUser } from "../../../../models/Institutes/Administration/Authorization/index.js";
import Staffsalary from "../../../../models/Institutes/Payment/Staff_Salary_Model.js";
import Validations from "../../../../validations/index.js";
import { getBranchDetailsWithUUID, getCourseDetailsWithUUID, getInstituteDetailswithUUID } from "../../common/index.js";

import mongoose from "mongoose";


export const createStaffsalaryController = async (req,res) => {
    try{

        const value  =Validations.createstaffsalary (req.body);
        console.log(value, "value")
        const institute = await getInstituteDetailswithUUID(value.institute_id)
        const branch = await getBranchDetailsWithUUID(value.branch_id)
        // const course = await getCourseDetailsWithUUID(value.course_name)
        const user = await InstituteUser.findById(value?.staff)
        let staffModel;
        if (value.staff_type === 'Teaching') {
            staffModel = mongoose.model('teachingstaff_login');
            value.userModel = 'teachingstaff_login';
        } else {
            staffModel = mongoose.model('non-teachingstaff_login');
            value.userModel = 'non-teachingstaff_login';
        }
        console.log("user", user)
        const staff = await staffModel.findById(user?.userDetail);
        
        if (!staff) {
            return res.status(404).send({
                success: false,
                message: 'Staff not found'
            });
        }

        
         const {transaction_id} = value;

        const existingtransaction_id = await Staffsalary.findOne({ transaction_id });

        if (existingtransaction_id) {
            return res.status(400).send({
                success: false,
                message: 'Transaction_id already exists',
            });
        } 
    
            const newStaffsalary = new Staffsalary({...value,institute_id:institute._id,branch_id:branch._id,staff:staff?._id}); 
            await newStaffsalary.save();
            res.status(200).send({
                success: true,
                message: 'New Staffsalary Created Successfully',
                data:newStaffsalary
            })

    } catch(error){
        res.status(500).send({
            success: false,
            message: 'something went wrong',
            error: error.message
        })
    }

}


export const getAllStaffsalarysController = async (req, res) => {
    try {
        const teachingStaffSalaries = await Staffsalary.find({is_deleted:false})
        const datwithPopulate= await Promise.all(teachingStaffSalaries?.map(async(salary)=>{

            if(salary.staff_type==="Teaching"){
              const pop = await Staffsalary.findById({_id:salary?._id}).populate({path:"staff",model:"teachingstaff_login"})
              return pop
            }else if(salary.staff_type === "Non Teaching"){
                const pop = await Staffsalary.findById({_id:salary?._id}).populate({path:"staff",model:"non-teachingstaff_login"})
            }
            return salary
        }))

        res.status(200).send({
            success: true,
            message: 'All Staff salaries retrieved successfully',
            data: datwithPopulate
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};


export const getStaffsalaryByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const staffsalary = await Staffsalary.findById(id);
        if (!staffsalary) {
            return res.status(404).send({
                success: false,
                message: 'Staffsalary not found'
            });
        }
        res.status(200).send({
            success: true,
            message: 'Staffsalary retrieved successfully',
            staffsalary
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

export const getStaffSalayWithStaffId = async (req,res) => {
    try {
    const user = req.user 
    const salaries = await Staffsalary.find({staff:user?.userDetail})
    .populate([{ path: "staff", populate:{path:"institute_id"}}])
    res.status(200).json({status:"success",message:"salaries received sucessfully",data:salaries})   
    } catch (error) {
      res.status(500).json({ status:"failed",message:error?.message})  
    }
}


export const updateStaffsalaryController = async (req, res) => {
    try {
        const { _id } = req.params;
        const { is_active } = req.body;

        if (is_active !== undefined) {
            return res.status(400).send({
                success: false,
                message: 'Updating the "is_active" field is not allowed',
            });
        }

        const updatedStaffsalary = await Staffsalary.findByIdAndUpdate(_id, req.body, { new: true });
       
        res.status(200).send({
            success: true,
            message: 'Staffsalary updated successfully',
            updatedStaffsalary
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};


export const updateStaffsalaryStatusController = async (req, res) => {
    try {
        const { id } = req.params;
        
        const { is_active, ...rest } = req.body;
            
        if (Object.keys(rest).length > 0) {
            return res.status(400).send({
                success: false,
                message: 'Only "is_active" field is allowed to be updated',
            });
        }
        const updatedStaffsalaryStatus = await Staffsalary.findByIdAndUpdate(id, { is_active }, { new: true });

        res.status(200).send({
            success: true,
            message: 'Staffsalary status updated successfully',
            updatedStaffsalaryStatus
        })
    
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};


export const deleteStaffsalaryController = async (req, res) => {
    try {
        const { _id } = req.params;
        await Staffsalary.findByIdAndUpdate(_id, { is_deleted: true });
        res.status(200).send({
            success: true,
            message: 'Staffsalary deleted successfully'
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

export const searchStaffSalaryStatusController = async (req, res) => {
    try {
        const { search } = req.query;

        const searchResults = await Staffsalary.find({
            $or: [
                { staff_name: { $regex: search, $options: 'i' } },
                { transaction_id: { $regex: search, $options: 'i' } }
            ]
        });

        if (staffSalaries.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No staff salaries found matching the search criteria'
            });
        }

        res.status(200).send({
            success: true,
            message: 'Staff salaries retrieved successfully',
            staffSalaries
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

export const searchStaffTypeController = async (req, res) => {
    try {
        const { staff_type } = req.params;

        if (!staff_type) {
            return res.status(400).send({
                success: false,
                message: 'Staff type is required',
            });
        }

        const staffTypeResults = await Staffsalary.find({ staff_type });

        res.status(200).send({
            success: true,
            message: 'Staff type results retrieved successfully',
            data: staffTypeResults
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};
