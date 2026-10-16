import slugify from "slugify";
import Branch from "../../../models/Institutes/Branch/index.js";
import Validations from "../../../validations/index.js";
import * as Helpers from "../../../utils/helpers.js"
import { DefaultFilterQuerys ,DefaultUpdateFields} from "../../../utils/data.js";
import Institute from "../../../models/Institutes/Institute/index.js";
import { getBranchDetailsWithUUID, getInstituteDetailswithUUID, getRoleDetailsWithName } from "../common/index.js";
import { InstituteUser } from "../../../models/Institutes/Administration/Authorization/index.js";
import { Student } from "../../../models/Administration/Authorization/index.js";
import mongoose from "mongoose";
import { cleanObjectId, formatChanges, getChanges } from "../../../utils/db_helpers/index.js";
import {createLogger} from "../../ActivityLogs/index.js";
import { updateSubscription } from "../../../middlewares/subscription/index.js";
import { getStudentFeesCountWithBranchId,getBatchCountWithBranchId,getCourseCountWithBranchId,getInstitutePayoutsWithBranchId,getStudentCountsWithBranchId,getTechingStaffCountsWithBranchId } from "../common/branch/index.js";
import { Sequence } from "../../../models/common/common.js";
import StudentIdCard from "../../../models/Institutes/IdCard/Student_IdCard.js";
import { createStudentsIdCards } from "../ID_Card/Student.js";


export const createBranchController = async (req,res) => {
    try{    

        const { instituteId } = req.params;
        const institute = await Institute.findOne({uuid:instituteId})
        const value = Validations.BranchCreate(req.body)

        const {branch_identity} = value;
        
        const existingbranch = await Branch.aggregate([
            {
                $match:{
                    "branch_identity":branch_identity,is_deleted:false
                }
            },
            { 
               $lookup: { 
                  from: "institutes", 
                  localField: "institute_id", 
                  foreignField: "_id", 
                  as: "institute" 
               } 
            }, 
            { 
               $match: { 
                  'institute.uuid': instituteId,
               } 
            }
         ]).exec();

        if (existingbranch&&Array.isArray(existingbranch)&&existingbranch.length!==0) {

            if (existingbranch.is_deleted) {
                throw new Error('Branch with the same name already exists but is deleted contact admin to retrive')
            } else {
                throw new Error('Branch name already exists')
            }
        }

        const newBranch = new Branch({...req.body,institute_id:institute._id}); 
        newBranch.slug = slugify(branch_identity);       
    
        await newBranch.save();
        
        await updateSubscription("Branch",req.user.institute_id)
        const log_data = {role:req?.user?.role,user:req.user?._id,model:"Branch",action : "create",title:"New Branch Created Successfully",details:`${newBranch?.branch_identity} branch created`,institute:req.user?.institute_id,branch:req.user?.branch_id}
        await createLogger(log_data)
        res.status(200).send({
            status: true,
            message: 'New Branch Created Successfully',
            newBranch
        })

    } catch(error){
        res.status(500).send({
            status: false,
            message: error.message
        })
    }
 
}



export const updateBranchController = async (req, res) => {
    try {
        const { branchId ,instituteId} = req.params;

        const data = Helpers.FilterQuery(req.body,DefaultUpdateFields.branch)

        const institue = await getInstituteDetailswithUUID(instituteId) 

        const existingBranch = await Branch.findOne({ uuid: branchId, institute_id: institue?._id});

        const updatedBranch = await Branch.findOneAndUpdate({uuid:branchId,institute_id:institue._id },data, { new: true });
        
        const changes = getChanges(cleanObjectId(existingBranch?.toObject()),cleanObjectId(updatedBranch?.toObject()))
        
        const log_data = {user:req?.user?._id,role:req?.user?.role,type:"institute",action:"update",title:`Brach Details Update`,details:formatChanges(changes),model:"branch",institute : req?.user?.institute_id,branch:req?.user?.branch_id}
        await createLogger(log_data)
        
        res.status(200).send({
            status: true,
            message: 'Branch updated successfully',
            data:updatedBranch
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

const branchDetails = async (branch) => {
  const profits = await getStudentFeesCountWithBranchId(branch)
  const payouts = await getInstitutePayoutsWithBranchId(branch) 
  const courses = await getCourseCountWithBranchId(branch)
  const batches = await getBatchCountWithBranchId(branch)
  const students = await getStudentCountsWithBranchId(branch)
  const instructors = await getTechingStaffCountsWithBranchId(branch)
  return {profits,payouts,courses,batches,students,instructors}
}

export const getBrachDetailswithId =  async(req,res) => {
    try {
       const {instituteId,branchId} = req.params
       const insitute = await getInstituteDetailswithUUID(instituteId)
       const branch = await Branch.findOne({institute_id:insitute._id,uuid:branchId}) 
       const details = await branchDetails(branch?._id)
       res.status(200).json({status:"success",message:"branch retrieved successfully",data:branch,...details})
    } catch (error) {
      res.status(500).json({status:"failed",message:error.message})  
    }
}


export const deleteBranchController = async (req, res) => {
    try {
        const { instituteId,branchId } = req.params;
        console.log("Brrr", branchId)
       
        const institute = await getInstituteDetailswithUUID(instituteId)
        console.log("Inss",institute)
        
        const data = await Branch.findOneAndUpdate({uuid:branchId,institute_id:institute?._id}, { is_deleted: true }, {new: true});
        console.log("Deleted", data)
        const log_data = {user:req?.user?._id,action:"delete",model:"branch",title:"branch deleted successfully",details:`${data?.branch_identity} - branch deleted`,role:req.user.role,institute:req.user?.institute_id,branch:req.user?.branch_id}
        await createLogger(log_data)
        res.status(200).send({
            status: true,
            message: 'Branch deleted successfully'
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

export const getInstituteAllBranchesController = async (req,res) => {
     try {
      const { instituteId } = req.params
      const institute = await getInstituteDetailswithUUID(instituteId) 
      const branch_list = await Branch.find({ institute_id: institute?._id, is_deleted: false }) 
      res.status(200).json({ status: 'success', message : "institute branches retrieved successfully",data: branch_list})
     } catch (error) {
       res.status(500).json({ status: "failed", message: error?.message}) 
     }
}

export const getAllBranchesController = async (req, res) => {
    try {
         
        const { instituteId } = req.params;

        const institute = await Institute.findOne({uuid:instituteId})

        if(!institute){
            throw new Error("institute not found")
        }
        
        let filterArgs = Helpers.FilterQuery(req.query,DefaultFilterQuerys.branch)

       if (filterArgs.branch_identity) {
            const regex = new RegExp(filterArgs.branch_identity, 'i'); 
            filterArgs.branch_identity = { $regex: regex };
        }

        let { page = 1, perPage = 10 } = req.query
        page = parseInt(page)
        perPage = parseInt(perPage)

        const totalBranchCount = await Branch.countDocuments({ ...filterArgs, institute_id: institute._id, is_deleted: false });

        const branches = await Branch.find({...filterArgs,institute_id:institute._id,is_deleted:false})
        .skip((page-1)*perPage)
        .limit(perPage)
    
        const branchCount = branches.length;

        const totalPages = Math.ceil(totalBranchCount / perPage);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        res.status(200).json({
            status: true,
            branchCount,
            currentPage: page,
            last_page:totalPages,
            hasNextPage,
            hasPreviousPage,
            data:branches,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'An error occurred while fetching branches',
            error: error.message,
        });
    }
};

export const getBranchStudentDetails = async (req, res) => {
    try {
        const { instituteId, branchId } = req.params;
        let { page, perPage } = req.query;

        perPage = page ? 10 : undefined;
        page = page ? Math.max(1, page) : null;

        const value = Helpers.FilterQuery(req.query, DefaultFilterQuerys.batch_student);
        const value1 = Helpers.FilterQuery(req.query, DefaultFilterQuerys.batch_user);
        const institue = await getInstituteDetailswithUUID(instituteId);
        const branch = await getBranchDetailsWithUUID(branchId);
        const role = await getRoleDetailsWithName("Student");

        const query = { 
            ...value1, 
            ...value, 
            institute_id: institue._id, 
            branch_id: branch._id, 
            role: role._id, 
            is_delete: false 
        };

        const totalDocs = await InstituteUser.countDocuments(query);

        let studentsList;
        if (page) {
            studentsList = await InstituteUser.find(query)
                .populate({ path: "userDetail", model: "Student_Login", match: value })
                .skip((page - 1) * perPage)
                .limit(perPage);
        } else {
            studentsList = await InstituteUser.find(query)
                .populate({ path: "userDetail", model: "Student_Login", match: value });
        }

        const totalPages = page ? Math.ceil(totalDocs / perPage) : 1;

        res.status(200).json({
            status: true,
            message: "Students retrieved successfully",
            data: studentsList,
            pagination: { totalPages, page: page || "all", perPage }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: error.message });
    }
};



export const getBranchNonteachDetails = async (req,res) => {
    try{
     const {instituteId,branchId} = req.params
     const institue = await getInstituteDetailswithUUID(instituteId)
     const branch = await getBranchDetailsWithUUID(branchId)

     const NonstaffList = await InstituteUser.find({institute_id:institue._id,branch_id:branch._id})
     
     res.status(200).json({status:true,message:"student retrieved successfully",data:NonstaffList})
    }catch(error){
      res.status(500).json({status:"failed",message:error.message})
    }
}
