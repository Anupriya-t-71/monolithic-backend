import Institute from "../../../models/Institutes/Institute/index.js";
import Category from "../../../models/Institutes/Category/index.js";
import { InstitutesRoles } from "../../../models/Administration/Roles_And_Permissions/index.js";
import Course from "../../../models/Institutes/Course/index.js";
import { InstituteNon_TeachingStaff, InstituteStudent, InstituteTeaching_Staff, InstituteUser } from "../../../models/Institutes/Administration/Authorization/index.js";
import { SubscriptionPlans } from "../../../models/Administration/Subscription/index.js";
import { Sequence } from "../../../models/common/common.js";
import Branch from "../../../models/Institutes/Branch/index.js";
import Batch from "../../../models/Institutes/Batch/index.js";



export const getInstituteSubscriptionPaymentSequenceId = async () => {
   const paymentSequence = await Sequence.findOneAndUpdate({ _id: "instituteSubscipritonPaymentId"},{ $inc: { seq: 1}},{new: true, upsert: true})
   const seqId = String(paymentSequence.seq).padStart(3,0)
   return `eflowINSPAY${seqId}`
}

export const getSubscriptionDateDetails = async (subscription) => {
  try {
    const { value, unit } = subscription;
    
    const currentDate = new Date();
    
    let start_date_of_plan = currentDate;
    let end_date_of_plan;

    if (unit === "monthly") {
    
      const daysToAdd = value * 31;
      end_date_of_plan = new Date(currentDate);
      end_date_of_plan.setDate(currentDate.getDate() + daysToAdd);

    } else if (unit === "yearly") {

      const endYear = currentDate.getFullYear() + value;
      
      end_date_of_plan = new Date(endYear, currentDate.getMonth(), currentDate.getDate());
    }
    else if (unit === "day") {
      end_date_of_plan = new Date(currentDate);
      console.log("the date i am going to add is +"+currentDate.getDate() + value);
      // end_date_of_plan.setDate(currentDate.getDate() + value); 
      end_date_of_plan.setDate(currentDate.getDate() + Number(value));
// Adds the specified number of days
  }
    
    return { start_date:  start_date_of_plan, end_date: end_date_of_plan };
    
  } catch (error) {
    throw new Error(error?.message);
  }
};


export const getSubscriptionPlanDetailsWithUUID = async (subscriptionId) => {
       const subscription = await SubscriptionPlans.findOne({ uuid: subscriptionId })
       if(!subscription){
          throw new Error("Subscription Not found")
       }
       return subscription
}

export const getInstituteDetailswithUUID = async  (institue)=>{
   
    let uuid = institue?.replace(/["]/g, '').trim();
    const institute = await Institute.findOne({uuid})

    if(!institute){
       throw new Error("institute not found")
    }
    return institute
}

export const getBranchDetailsWithUUID = async (branch_id) => {
    try {
        let uuid = branch_id.replace(/["]/g, '').trim();
        const branch = await Branch.findOne({uuid})
        
        if (!branch) {
            throw new Error("Branch not found");
        }


        return branch;
    } catch (error) {
        throw new Error("Error in fetching branch details: " + error.message);
    }
};


export const getCategoryDetailsWithUUID = async (categoryId) => {
    console.log(categoryId,"category")
    const category = await Category.findOne({uuid:categoryId})
    if(!category){
     throw new Error("category not found")
    }
    return category
}

export const getCourseDetailsWithUUID = async(uuid) => {
    const course = await Course.findOne({uuid:uuid})
    if(!course){
     throw new Error("course not found")
    }
    return course
}

export const getRoleDetailsWithName = async (name) => {
    const role = await InstitutesRoles.findOne({identity:name})
    if(!role){
     throw new Error("role not found")
    }
    return role
}

export const getRoleDetailsWithObjectId = async (id) => {

  const role = await InstitutesRoles.findById(id)

  if(!role){
    throw new Error("role not found")
   }

   return role
}

export const getFullUserDetailsWithPopulate = async (userId,model) => {
   const user = await InstituteUser.findById(userId).populate({ path: "userDetail",model:model})
   if(!user){
    throw new Error("User not found")
   }
   return user
}

export const getUserDetailsWithUUID = async (user_details, userModal) => {
  try {
    const userDetailPromises = user_details.map(async (user) => {
      let userDetailModel;

      switch (userModal) {
        case "InstituteTeachingStaff":
          userDetailModel = InstituteTeaching_Staff;
          break;
        case "InstituteNon_TeachingStaff":
          userDetailModel = InstituteNon_TeachingStaff;
          break;
        case "InstituteStudent":
          userDetailModel = InstituteStudent;
          break;
        default:
          throw new Error(`Invalid user model: ${userModal}`);
      }

      const userDetail = await userDetailModel.findOne({ uuid: user.uuid });

      if (!userDetail) {
        throw new Error(`User detail not found for UUID: ${user.uuid}`);
      }

      return userDetail;
    });

    const resolvedUserDetails = await Promise.all(userDetailPromises);
    return resolvedUserDetails;
  } catch (error) {
    throw new Error(`Error fetching user details: ${error.message}`);
  }
};

  

  export const getStudentIdsWithUUIDs = async (uuids) => {
    const students = await InstituteUser.find({uuid:{$in:uuids}})
    if(!students || students.length===0){
       throw new Error("students not found")
    }
    const ids = students.map((item)=>item._id)
    return ids
}

export const getInstructorDetailsWithUUIDs = async (uuids) => {
  const instructors = await InstituteUser.find({ uuid: {$in: uuids}})
  if(!instructors || instructors.length === 0 ){
    throw new Error('instructor not found')
  }
  const ids = instructors.map((item) => item._id)
  return ids
}
  
export const getInstituteUserDetailsWithUUID = async (userId,role) => {
   const role_details = await getRoleDetailsWithName(role)
   const user = await InstituteUser.findOne({uuid:userId,role:role_details?._id})
   if(!user){
     throw new Error("user not found")
   }
   return user
}

export const getBatchDetailsWithUUID = async (batchId) => {
  const Batch_Details = await Batch.findOne({uuid:batchId})
  if(!Batch_Details){
    throw new Error("Batch not found")
  }
  return Batch_Details
}
