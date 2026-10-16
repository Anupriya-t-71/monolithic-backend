import slugify from "slugify";
import Batch from "../../../models/Institutes/Batch/index.js";
import Course from "../../../models/Institutes/Course/index.js";
import Chat from "../../../models/Institutes/Community/Chat_Model.js"; 
import { getBranchDetailsWithUUID, getCourseDetailsWithUUID, getInstituteDetailswithUUID, getInstructorDetailsWithUUIDs, getStudentIdsWithUUIDs,getUserDetailsWithUUID } from "../common/index.js";
import Validations from "../../../validations/index.js";
import { InstituteUser } from "../../../models/Institutes/Administration/Authorization/index.js";
import { FilterData, FilterQuery } from "../../../utils/helpers.js";
import { DefaultFilterQuerys, DefaultUpdateFields } from "../../../utils/data.js";
import { InstituteAdmin, Student } from "../../../models/Administration/Authorization/index.js";
import { InstituteTeaching_Staff } from "../../../models/Institutes/Administration/Authorization/index.js";
import { updateSubscription } from "../../../middlewares/subscription/index.js";
import { createLogger } from "../../ActivityLogs/index.js";
import { cleanObjectId, formatChanges, getChanges } from "../../../utils/db_helpers/index.js";
import {sendBatchDetailEmail} from "../../../utils/CentralizedeEmailHandler/centralizedEmailControler.js"
import mongoose from 'mongoose';

export const createBatchController = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
   
        const { instituteId, branchId, courseId } = req.params;
        const value = Validations.CreateBatch(req.body);
        const institute = await getInstituteDetailswithUUID(instituteId);
        const branch = await getBranchDetailsWithUUID(branchId);
        const course = await getCourseDetailsWithUUID(courseId);
        const studentIds = await getStudentIdsWithUUIDs(value.student);
        const instructorIds = await getInstructorDetailsWithUUIDs(value.instructor) // Assuming instructors are also users
        
        console.log(instructorIds,"instructorIds")
        const { batch_name, student } = value;

        const existingBatch = await Batch.findOne(
            { slug: slugify(batch_name), institute_id: institute._id, branch_id: branch._id },
            null,
            { session }
        );

        if (existingBatch) {
            if (existingBatch.is_deleted) {
                await session.abortTransaction();
                return res.status(400).send({
                    success: false,
                    message: 'Batch with the same name already exists but is deleted, contact admin to retrieve',
                });
            } else {
                await session.abortTransaction();
                return res.status(400).send({
                    success: false,
                    message: 'Batch name already exists',
                });
            }
        }

        const newBatch = new Batch({
            ...value,
            institute_id: institute._id,
            branch_id: branch._id,
            course: course._id,
            student: studentIds,
            instructor: instructorIds,
        });

        newBatch.slug = slugify(batch_name);

        await newBatch.save({ session });
        const log_data = {
            role: req?.user?.role,
            user: req.user?._id,
            model: "Batch",
            action: "create",
            title: "New batch created",
            details: `${newBatch?.batch_name} batch created`,
            institute: req.user?.institute_id,
            branch: req.user?.branch_id,
        };
        await createLogger(log_data, session);
        await updateSubscription("Batches", req.user.institute_id, session);

        const teachingStaff = await InstituteTeaching_Staff.find(
            { institute_id: institute._id, branch_id: branch._id, course_id: course._id },
            null,
            { session }
        );

        const instituteAdmin = await InstituteAdmin.findOne(
            { institute_id: institute._id },
            null,
            { session }
        );

        const teachingstaffid = teachingStaff.map(staff => staff._id);

        const users = [...studentIds, ...instructorIds];

        const groupChat = await Chat.create(
            [
                {
                    institute: institute._id,
                    branch: branch._id,
                    batch: newBatch._id,
                    groupimage: course?.image,
                    group: batch_name,
                    users: users?.map((i) => ({ user : i,"isblock":false})),
                    admin: instituteAdmin._id,
                },
            ],
            { session }
        );
        

        const studentDetails = await InstituteUser.find({ _id: { $in: studentIds } }, null, { session });
        const instructorDetails = await InstituteUser.findOne({ _id: { $in: instructorIds } }, null, { session });
        const courseDetails = await Course.findById(course._id, null, { session });
        const batchDetails = newBatch;

        await sendBatchDetailEmail(studentDetails, instructorDetails, courseDetails, batchDetails);
        console.log(instructorDetails,"instructorIds")
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            status: true,
            message: 'New Batch and Group Chat Created Successfully',
            data: newBatch,
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log(error,"error")
        res.status(500).send({
            success: false,
            message:  error.message,
        });
    }
};


export const getBatchDetailsWithCourseId = async (req,res) => {
    try {
        const { instituteId,branchId,courseId} = req.params 
        
        const institute = await getInstituteDetailswithUUID(instituteId)
        const branch = await getBranchDetailsWithUUID(branchId)
        const course = await getCourseDetailsWithUUID(courseId)

        const batches = await Batch.find({ institute_id: institute?._id, branch_id: branch?._id, course: course?._id})
        .populate({path:"classes",populate:[{path:"study_materials"},{path:"notes"}]})
        res.status(200).json({ status: 'success', message: "batch details retrived successfully",data:batches})
    } catch (error) {
      res.status(500).json({ status: "failed", message : error?.message }) 
    }
}

export const getInstructorDetailsWithCourseId = async (req,res) => {
    try {
        const { courseId } = req.params;
        const Instructor = await InstituteTeaching_Staff.find({ course: courseId })
        console.log(courseId,"courseId",Instructor)
        const UserIds = Instructor.map((user) => user?._id)
        const InstructorList = await InstituteUser.find({ userDetail: { $in: UserIds}}).select(["-password","-two_auth_completed_at"])
        res.status(200).json({ status: "success", message: "Instrctor details retrived successfully!",data: InstructorList})         
    } catch (error) {
      res.status(500).json({ status: "failed", message: error?.message })
    }
}

export const updateBatchController = async (req, res) => {
    try {
        const { batchId } = req.params;
        const value = FilterQuery(req.body,DefaultUpdateFields.batch)
        const { batch_name ,is_active } = value

        const existingBatch = await Batch.findOne({uuid:batchId})
        const updatedBatch = await Batch.findOneAndUpdate({uuid:batchId}, {...value,slug:slugify(batch_name)}, { new: true })
        await updatedBatch.save();   
        const changes = getChanges(cleanObjectId(existingBatch.toObject()),cleanObjectId(updatedBatch.toObject()))
         if(changes.length!==0){       
        const log_data = {user:req?.user?._id,role:req?.user?.role,type:"institute",action:"update",title:`Batch Details Update`,details:formatChanges(changes),model:"batch",institute : req?.user?.institute_id,branch:req?.user?.branch_id}
        await createLogger(log_data)
         }
        res.status(200).send({
            success: true,
            message: 'Batch updated successfully',
            data:updatedBatch
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};


export const updateBatchStatusController = async (req, res) => {
    try {
        const { batchId } = req.params;                
        const { is_active, ...rest } = req.body;

        const updatedBatchStatus = await Batch.findOneAndUpdate({uuid:batchId}, { is_active }, { new: true });

        res.status(200).send({
            success: true,
            message: 'Batch status updated successfully',
            updatedBatchStatus
        })
    
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};



export const deleteBatchController = async (req, res) => {
    try {
        const { batchId } = req.params;
       const data = await Batch.findOneAndUpdate({uuid:batchId}, { is_deleted: true });
        const log_data = {user:req?.user?._id,action:"delete",model:"batch",title:"batch deleted",details:`${data?.batch_name} - batch deleted`,role:req.user.role,institute:req.user?.institute_id,branch:req.user?.branch_id}
        await createLogger(log_data)
        res.status(200).send({
            success: true,
            message: 'Batch deleted successfully'
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

export const getAllBatchController = async (req, res) => {
    try {
        const {instituteId,branchId} = req.params
        let {page=1,perPage=10} = req.query
        const institute = await getInstituteDetailswithUUID(instituteId)
        const branch = await getBranchDetailsWithUUID(branchId)
        
        let filterArgs = FilterData(req.query,DefaultFilterQuerys.batch)

        
        if (filterArgs.start_date && filterArgs.end_date) {
        
            filterArgs.start_date = { $gte: filterArgs.start_date };
            filterArgs.end_date = { $lte: filterArgs.end_date };
        }
    
        const Batchs = await Batch.find({...filterArgs,institute_id:institute._id,branch_id:branch?._id,is_deleted:false})
        .populate({path:"course",match:filterArgs}).populate("branch_id").populate("student").populate({path:"instructor",select:"-password"})
        .skip((page-1)*perPage)
        .limit(perPage)

        //change for testing api only batch flter not work proper me
        // const Batchs = await Batch.find({is_deleted:false})
        // .populate({path:"course",match:filterArgs}).populate("branch_id").populate("student")
        // .skip((page-1)*perPage)
        // .limit(perPage)
        const Batches = await Batch.countDocuments({...filterArgs,institute_id:institute._id,branch_id:branch?._id,is_deleted:false})

        const last_page = Math.ceil(Batches/perPage)
        res.status(200).json({
            status: 'success',
            message : "All Batches Retrived successfully",
            Count:Batches,
            data:Batchs,
            last_page
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getBatchDetailsWithUUID = async (req,res) => {
    try {
     const {instituteId,branchId,batchId} = req.params

     const insitute = await getInstituteDetailswithUUID(instituteId)
     const branch = await getBranchDetailsWithUUID(branchId)

     const batch = await Batch.findOne({institute_id:insitute._id,branch_id:branch._id,uuid:batchId}).populate({path:"course"}).populate("student")

     res.status(200).json({status:true,message:"batch details retrived succesfully",data:batch})

    } catch (error) {

       res.status(500).json({status:"failed",message:error.message}) 

    }
}


export const getStudentsWithBatchDetails = async(req,res) => {
    try {
    const {instituteId,branchId,courseId} = req.params
    const institute = await getInstituteDetailswithUUID(instituteId)
    const students = await InstituteUser.find({institute_id:institute._id})  
    res.status(200).json({status:true,message:"students retrived succesfully",data:students})
    } catch (error) {
      res.status(500).json({status:"failed",message:error.message}) 
    }
}

export const getStudentsWithBatchId = async (req,res) => {
    try {
    const {insitute_id,branch_id} = req.params
    const {batch_id} = req.query
    const Batches = await Batch.findOne({uuid:batch_id}).populate("student")
    const students = Batches.student

    res.status(200).json({status:"sucess",message:"Students retrived successfully",data:students})   
    } catch (error) {
      res.status(500).json({status:"failed",message:error.message})  
     }
}
