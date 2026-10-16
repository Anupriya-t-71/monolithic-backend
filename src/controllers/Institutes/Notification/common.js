import sendNotifications from "../../../config/webpush.js";
import instituteNotifications from "../../../models/Institutes/Notification/common.js";
import NotificationModel from "../../../models/Institutes/Notification/notificationSubscription.js";
import NotificationWaitingModel from "../../../models/WaitingNotification/index.js";
import Validations from "../../../validations/index.js";
import { getBranchDetailsWithUUID, getInstituteDetailswithUUID } from "../common/index.js";

export const addInstituteNotifications = async (req,res) => {
    try {
    const value = Validations.instituteNotification(req.body)
    const institute = await getInstituteDetailswithUUID(value.institute) 
    const new_notification = new instituteNotifications({...value,institute:institute?._id})
    new_notification.save()
    res.status(200).json({status:"success",message:"New notification created sucessfuly",data:new_notification})
    } catch (error) {
      res.status(500).json({status:"failed",message:error?.message}) 
    }
}

export const getInstituteNotifications = async (req,res) => {
    try {
    const {institute,branch} = req.query
    const institue_details = await getInstituteDetailswithUUID(institute)    
    const branch_details = await getBranchDetailsWithUUID(branch)
    let {page=1,perPage=10} = req.query
    parseInt(page),parseInt(perPage)
    const count = await instituteNotifications.countDocuments({institute:institue_details?._id})
    const notifications = await instituteNotifications.find({institute:institue_details?._id})
    .skip((page-1)*perPage)
    .limit(perPage)
    const last_page = Math.ceil(count/perPage)
    res.status(200).json({status:"sucess",message:"notifications retrived successfully",data:notifications,count,last_page})
    }catch (error) {
     res.status(500).json({status:"sucess",message:error?.message})  
    }
}

export const ResendAllNotification = async(req,res)=>{
   try {
    const {notification_id} =req.body
    const data = await instituteNotifications.find({uuid:notification_id})

    if(!data){
      res.status(403).JSON({status:'failed',message:"notification not found"})
    }

    const payload = JSON.stringify({
          title: data?.title,
          body: data?.body,
          // icon: getApplicationURL + institue?.image,
          data: {
            url: "http://localhost:3001/student/community",
          },
        });
    
     const notify = await StudentSettingModel.findOne({userId:data?.student})      
     if(notify?.notification?.cummunityNotification == false){
        res.end().status(200)
      }

     if(!onlineuser.has(data?.student)){
         await NotificationWaitingModel.create({
           student:data?.student,
           payload:payload
         })
          return res.status(200).json({status:'done',message:"user is offline"})
      }

    const subscription = await NotificationModel.findOne({ user: data.student });
      if (subscription) {
        await sendNotifications(payload, subscription);
      }

    res.status(200).json({status:'done',message:"resend message send success"})

   } catch (error) {
      res.status(500).json({status:"failed",message:error?.message})
   }
}