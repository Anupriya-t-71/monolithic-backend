import Faq_Model from "../../models/Institutes/Faq/Faq_Model.js"
import { StudentTicket } from "../../models/Institutes/Ticket/Ticket.js"
import {FormModel, StudentSettingModel} from "../../models/Settings/Students.js"
import { generateUUID } from "../../utils/helpers.js"


export const notificationSetting = async(req,res)=>{
    try {
      const {
        assignmentDeadlines,
        classReminder,
        examAlerts,
        cummunityNotification,
        FeePaymentNotifications,
        InstallmentSchedules,   
        userId
      }=req.body

      const data = await StudentSettingModel.updateOne({userId},
        {notification:{assignmentDeadlines,classReminder,examAlerts,cummunityNotification,FeePaymentNotifications,InstallmentSchedules}})
      if(!data){
         res.json({status:'failed'})
      }
      res.status(200).json({status:'done'})
    } catch (error) {
      console.log("notiffy",error)
      res.json({status:"failed"})
    }
}

//populate usage
export const StudentSettingInfo=async(req,res)=>{
   try {
     const {userId}=req.body
    
    const data = await StudentSettingModel.findOne({userId})

     if(!data){
         res.json({status:'failed'})
      }
      res.status(200).json({status:'done',data})

   } catch (error) {
     console.log("student setting error", error)
   }
}

export const UpdatePersonal=async(req,res)=>{
 try {
    const {userId,name,email,contact,image}=req.body
    const data = await StudentSettingModel.findOneAndUpdate({userId},{name,email,contact,image},{new:true}).populate('Instituteuserlist')
      if(!data){
         res.json({status:'failed'})
      }
      res.status(200).json({status:'done',data})
 } catch (error) {
  console.log("student setting error", error)
 }
}

export const academicPreference =async(req,res)=>{
   try {
      const {userId,title,content}=req.body
      const uuid = await generateUUID()
      const data = await FormModel.create({
        uuid,
        userId,
        title,
        content
      })
      if(!data){
        throw new Error("data not insert")
      }

      res.json({status:'done'})
    } catch (error) {
      console.log("academic",error)
      res.json({status:"failed"})
    }
}

//help and support
export const AccessFAQ=async(req,res)=>{
     try {
      const {input}=req.body
      const data = await Faq_Model.find({})
      // const data = await Faq_Model.find({title:{ $regex:input, $option:'i' },description:{ $regex:input, $option:'i' }})
      if(!data){
        res.json({message:'no Faq are match'})
      }
      res.json({status:'done',data})
    } catch (error) {
      console.log("AccessFAQ",error)
      res.json({status:"failed"})
    }
}

export const SubmitTickets=async(req,res)=>{
    try {
       const {
        issue_type,
        institute,
        branch,
        user,
        query,
        category,
        description,
        priority
       }=req.body

      const data = await StudentTicket.create({ 
        issue_type,
        institute,
        branch,
        user,
        query,
        category,
        description,
        priority})

       if(!data){
        res.json({message:'ticket not submited occur error'})
      }
      res.json({status:'done',data})
    } catch (error) {
      console.log("notiffy",error)
      res.json({status:"failed"})
    }
}

export const ViewTickets=async(req,res)=>{
    try {
      const {ticketId}=req.params
      const data = await StudentTicket.find({ticket_id:ticketId})
       if(!data){
        res.json({message:'no ticket are match'})
      }
      res.json({status:'done',data})
    } catch (error) {
      console.log("notiffy",error)
      res.json({status:"failed"})
    }
}



