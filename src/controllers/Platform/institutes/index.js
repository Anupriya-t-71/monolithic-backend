import Branch from "../../../models/Institutes/Branch/index.js";
import * as UserModels from "../../../models/Administration/Authorization/index.js"
import Institute from "../../../models/Institutes/Institute/index.js";
import Validations from "../../../validations/index.js";
import {SubscriptionPlans ,InstituteSubscription} from "../../../models/Administration/Subscription/index.js"
import slugify from "slugify";
import { InstitutesRoles } from "../../../models/Administration/Roles_And_Permissions/index.js";
import {hashPassword} from "../../../services/authServices.js"
import mongoose from "mongoose";
import { generatePassword } from "../../../utils/generateRandomPassword.js";
import { sendWelcomeTemplate } from "../../../utils/index.js";
import { CreateSubscriptionPaymentController } from "../Payments/index.js";
import { getInstituteDetailswithUUID } from "../../Institutes/common/index.js";
import Course from "../../../models/Institutes/Course/index.js";
import { InstituteStudent, InstituteTeaching_Staff } from "../../../models/Institutes/Administration/Authorization/index.js";
import OnlineClass from "../../../models/Institutes/Class/Online_Model.js";
import OfflineClass from "../../../models/Institutes/Class/Offline_Model.js";
import { FilterQuery } from "../../../utils/helpers.js";
import { DefaultUpdateFields } from "../../../utils/data.js";

const getSubscriptionExpireDate = ( value,unit) => {
    const expirationDate = new Date()
    
    if(unit === 'monthly'){
      expirationDate.setMonth(expirationDate.getMonth()+value)
      expirationDate.setHours(0,0,0,0)
    }else if (unit === 'yearly') {
      const currentMonth = expirationDate.getMonth(); 
      expirationDate.setFullYear(expirationDate.getFullYear() + value); 
      expirationDate.setMonth(currentMonth); 
      expirationDate.setHours(0, 0, 0, 0); 
  } else {
      throw new Error('Invalid duration unit');
  }
  return expirationDate
}

export const CreateInstituteController = async (req, res) => {
    console.log("came into create insitityue controller");

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { institute, branch, admin } = req.body;

        const value = await Validations.InstituteCreate({...institute});

        const { branch_identity, subscription } = value;
        
        const findSubscription = await SubscriptionPlans.findById(subscription);
        if (!findSubscription) {
            throw new Error("Subscription is required");
        }
        
        const existingInstitute = await Institute.findOne({ slug: slugify(value.institute_name) });

        if (existingInstitute) {
            throw new Error("Institute Name already exists");
        }

        const registered_date = new Date().toLocaleDateString();

        const newInstitute = new Institute({ ...value, registered_date });
        newInstitute.slug = slugify(value.institute_name);
        await newInstitute.save({ session });     

        const expireDate = getSubscriptionExpireDate(findSubscription.duration.value, findSubscription.duration.unit);

        const instituteFeatures = findSubscription.features.map(feature => ({
            feature: feature.feature,
            count: typeof (feature.count) === 'string' ? '0' : 0
        }));

        await InstituteSubscription.create(
            [{
                instituteId: newInstitute._id,
                subscriptionId: findSubscription._id,
                features: instituteFeatures,
                expirationDate: expireDate,
                paymentMethod: "cash",
                endDate: expireDate 
            }],
            { session }
        );
    
        const newBranch = new Branch({...branch,institute_id:newInstitute._id});
        // newBranch.slug = slugify(branch_identity);
        await newBranch.save({ session });
        const AdminRole = await InstitutesRoles.findOne({identity:"Institute Admin"})
        const dummy_password = "Testpass@2024"
        const password = await hashPassword(dummy_password);
        const new_institute_admin = await UserModels.InstituteAdmin.create([{...admin,institute_id:newInstitute._id,role:AdminRole._id,password:password}], { session });
        const updateInstitute = await Institute.findByIdAndUpdate(newInstitute._id,{primary_branch:newBranch._id,admin:new_institute_admin._id})
        
        await CreateSubscriptionPaymentController(newInstitute?._id,newInstitute?.institute_name, findSubscription?.uuid, session);

        await session.commitTransaction();
        session.endSession();

        // await CreateSubscriptionPaymentController(newInstitute?.uuid,findSubscription?.uuid)
        
        const admin_details = { name: admin?.first_name + admin?.last_name, email: admin?.email, password: dummy_password}
        await sendWelcomeTemplate(admin?.email, admin_details)
        console.log(admin,admin_details)
        res.status(200).json({ status: "success", message: "Received", data: { institute } });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log(error,"error")
        res.status(500).json({ status: 'failed', message: error.message });
    }
}

export const UpdateInstituteController = async (req,res)=>{

  try {
         
        const {instituteId} = req.params
        const validatedData = await Validations.InstituteUpdate(req.body)
   
        const filteredData = FilterQuery(validatedData, DefaultUpdateFields.institute);

        const updatedInstitute = await Institute.findOneAndUpdate(
            { uuid: instituteId },
            { $set: filteredData },
            { new: true }
        );
        

        if (!updatedInstitute) {
            return res.status(404).json({ status: "failed", message: "Institute not found" });
        }

        res.status(200).json({ status: "success", data: updatedInstitute });
        
       
    } catch (error) {   
        res.status(500).json({status:"failed",message:error.message})
    }      


}

export const UpdateInstituteStatusController = async (req, res) => {
    try {
        const { instituteId } = req.params;
        const validatedData = Validations.InstituteUpdateStatus(req.body);

        const updatedInstituteStatus = await Institute.findOneAndUpdate(
            { uuid: instituteId },
            { $set: validatedData },
            { new: true }
        );

        if (!updatedInstituteStatus) {
            return res.status(404).json({ status: "failed", message: "Institute not found" });
        }

        res.status(200).json({ status: "success", data: updatedInstituteStatus });
    } catch (error) {
        res.status(500).json({ status: "failed", message: error.message });
    }
};



export const  getAllInstituteController = async (req,res) => {
   try {
   let { page  , perPage} = req.query
   page = 1 , perPage = 10 
   const totalInstitutes = await Institute.countDocuments()
   const institutes = await  Institute.find().populate({ path: "subscription"})
   .skip((page-1)*perPage).limit(perPage)
   const totalPages = Math.ceil( totalInstitutes / perPage)
   res.status(200).json({status:"success",message:"institutes retrived successfully",data:institutes,last_page:totalPages})
   } catch (error) {
     res.status(500).json({status:"failed",message:error.message})
   }
}

export const getInstituteWithUUID = async (req,res) => {
    try {
     const {instituteId} = req.params
     const institute = await Institute.findOne({uuid:instituteId}).populate("primary_branch").populate("admin")
     res.status(200).json({status:"success",message:"institute reterived sucessfully",data:institute})
    } catch (error) {
      res.status(500).json({status:"failed",message:error.message}) 
    }
}

export const getInstituteCourseListWithInstituteId = async (req,res) => {
    try {
    const { instituteId } = req.params
    const institute_details = await getInstituteDetailswithUUID(instituteId)
    const CourseList = await Course.find({ institute_id: institute_details?._id}).populate({ path: "institute_id"})
    res.status(200).json({ status: "success", message: "Institute Courses retrived successfully",data: CourseList})
    } catch (error) {
       res.status(500).json({status: "failed", message: error?.message }) 
    }
}

export const getCourseDetailWithCourseId = async (req,res) => {
    try {
      
    const { courseId } = req.params
    const course_details = await Course.findOne({ _id: courseId })
    const student_list = await InstituteStudent.find({ course: courseId})
    const instructor_list = await InstituteTeaching_Staff.find({ course: { $in: courseId}})
    const online_class_list = await OnlineClass.countDocuments({ course: courseId})
    const offline_class_list = await OfflineClass.countDocuments({ course: courseId })
    const class_list_count = online_class_list + offline_class_list
    res.status(200).json({ status: "success", message: "Course details received successfully",data: { course_details, student_list, instructor_list,class_list_count}})
    } catch (error) {
      res.status(500).json({ status: "failed", message: error?.message })  
    }
}