import { getRoleDetailsWithName } from "../index.js"
import { InstituteUser } from "../../../../models/Institutes/Administration/Authorization/index.js"
import Course from "../../../../models/Institutes/Course/index.js"
import Staff_Salary_Model from "../../../../models/Institutes/Payment/Staff_Salary_Model.js"
import Student_Fee_Model from "../../../../models/Institutes/Payment/Student_Fee_Model.js"
import Batch from "../../../../models/Institutes/Batch/index.js"
import { StudentTicket, TeachingTicket } from "../../../../models/Institutes/Ticket/Ticket.js"


export const getStudentFeesCountWithBranchId = async(branch) => {
       try {
       const fees = await Student_Fee_Model.find({branch_id:branch})
       let total = 0 
       const count = fees?.map((fee)=>{
              total+=fee?.paid_amount
              return total
       }) 
       return total
       } catch (error) {
        throw new error
       }
}

export const getInstitutePayoutsWithBranchId = async (branch) => {
       try {
       const payouts = await Staff_Salary_Model.find({branch_id:branch}) 
       let total = 0
       payouts?.map((pay)=>{
         total += pay?.salary_amount
       })
       return total    
       } catch (error) {
        throw new error      
       }
}

export const getCourseCountWithBranchId = async (branch) => {
       try {
        const courses = await Course.countDocuments({branch_id:branch}) 
        return courses     
       } catch (error) {
         throw new error     
       }
}

export const getBatchCountWithBranchId = async (branch) => {
       try {
       const batches = await Batch.countDocuments({branch_id:branch})
       return batches       
       } catch (error) {
         throw new error     
       }
}

export const getStudentCountsWithBranchId = async (branch) => {
    try {
    const role = await getRoleDetailsWithName("Student")
    const students = await InstituteUser.countDocuments({branch_id:branch,role:role?._id}) 
    return students  
    } catch (error) {
      throw new error
    }
}

export const getTechingStaffCountsWithBranchId = async (branch) => {
    try {
    const role = await getRoleDetailsWithName("Teaching Staff") 
    const teaching_staffs = await InstituteUser.countDocuments({branch_id:branch,role:role?._id})
    return teaching_staffs     
    } catch (error) {
    throw new error    
    }
}

export const getTicketCountsWithBranchId = async (branch) => {
       try {
       const student_open_tickets = await StudentTicket.countDocuments({ branch: branch , status: "opened"})
       const student_closed_tickets = await StudentTicket.countDocuments({ branch: branch, status: "closed"  })
       const total_student_tickets = await StudentTicket.countDocuments({ branch: branch})
       
       const open_instructor_tickets = await TeachingTicket.countDocuments({ branch: branch, status: "opened"})
       const closed_instructor_tickets = await TeachingTicket.countDocuments({ branch: branch, status: "closed" })
       const total_instructor_tickets = await TeachingTicket.countDocuments({ branch: branch})
       } catch (error) {
         throw new error     
       }
}