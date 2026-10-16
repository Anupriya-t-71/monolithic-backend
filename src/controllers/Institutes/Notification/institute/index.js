import { io } from "../../../../config/socketConfig.js"
import sendNotifications from "../../../../config/webpush.js"
import Institute from "../../../../models/Institutes/Institute/index.js"
import InstituteNotificationSubscriptionModel from "../../../../models/Institutes/Notification/instituteNotificationSubscription.js"
import InstituteNotification from "../../../../models/Platform/Notifications/index.js"
import Notification from "../../../../models/Institutes/Notification/index.js"
import { DefaultFilterQuerys, DefaultUpdateFields } from "../../../../utils/data.js"
import { FilterQuery, getApplicationURL } from "../../../../utils/helpers.js"
import { getBranchDetailsWithUUID, getInstituteDetailswithUUID } from "../../common/index.js"



export const createInstituteNotificationController = async (req,res) => {
    try {
    const { institute_id , branches , title, body, link } = req.body
    
    const institute = await getInstituteDetailswithUUID(institute_id)
    const data = await Promise.all( branches?.map(async (branch) => {
          const branch_details = await getBranchDetailsWithUUID(branch)

          const notification = new InstituteNotification({
            instituteId: institute?._id,
            branch : branch_details?._id,
            title: title,
            link : link,
            body: body
          })
          await notification.save()
          const findSubscription = await InstituteNotificationSubscriptionModel.findOne({ institute_id: institute, branch_id: branch_details?._id})
          io.to(branch_details?.uuid).emit("triggerInstituteNotification",{notification})
          console.log(findSubscription,"findSubscription")
          if(findSubscription){
             const payload = JSON.stringify({
               title : title,
               body: body,
               icon : getApplicationURL + institute?.image,
               data : {
                url : "http://localhost:3000/#/profile-management/notifications"
               }
             })
            await sendNotifications(payload,findSubscription)
          }
    }))
    res.status(200).json({ status: 'success', message: "notification sended successfully"})
    } catch (error) {
      res.status(500).json({ status: 'failed', message: error?.message})  
    }
}

export const getNotificationList = async (req,res) => {
  try {
  //  let { page=1, perPage = 10} = req.query

   const unseen_notifications = await InstituteNotification.countDocuments({ status: "unread"})
   const seen_notifications = await InstituteNotification.countDocuments({ status: "read"})
   const total_documents = await InstituteNotification.countDocuments()
   const notification_list = await InstituteNotification.find().populate({ path: "instituteId", model: "institutes"}).populate( {path: "branch", model:"branches"})
   
  //  const total_pages = Math.ceil( total_documents/perPage)
   res.status(200).json({ status: 'success', message: "all notifications retrieved successfully",data: { data: notification_list, report: { total: total_documents, read: seen_notifications, unread: unseen_notifications}}})
  } catch (error) {
    res.status(500).json({ status: 'failed', message: error?.message})
  }
}

export const getInstituteNotificationsWithInstituteId = async (req,res) => {
  try {
   let { page = 1, perPage = 10, branch_id, status } = req.query
   const { institute_id } = req.params
   const FilterArgs = FilterQuery(req.query,DefaultFilterQuerys.institute_notification)
   const institute = await getInstituteDetailswithUUID(institute_id)
   const branchs = await getBranchDetailsWithUUID(branch_id)

   console.log(req.params)

   const notifications = await Notification.find({institute_id:institute._id,branch_id:branchs._id})

   if (!notifications) {
      return res.status(200).json({status:"failed",message:"no notification"})
   }

   const totalNotifications = notifications.length || 0;

   const last_page = Math.ceil( totalNotifications/perPage)

   res.status(200).json({ status: "success", message: "all notification retrived successfully",data: { data: notifications, last_page , total: totalNotifications} })
  } catch (error) {
    res.status(500).json({ status: 'failed', message: error?.message})
  }
}

export const updateInstituteNotificationWithId = async (req,res) => {
  try {
   const { notification_id } = req.params
   const update_fields = FilterQuery(req.body,DefaultUpdateFields.institute_notification)
    
   const updated_notifications = await InstituteNotification.findOneAndUpdate({ uuid: notification_id},{...update_fields})
   res.status(200).json({ status: 'success', message: "Notification status Updated sucessfully"})
  } catch (error) {
    res.status(500).json({ status: "failed", message: error?.message })
  }
}

export const ResentNotificationResendController = async (req,res) => {
   try {
    const { institute_id, notification_id, branch_id } = req.query
    const instituteId = await getInstituteDetailswithUUID(institute_id)
    const branchId = await getBranchDetailsWithUUID(branch_id)
    const institute = await Institute.findById(instituteId?._id)
    const notification_details = await InstituteNotification.findOne({uuid:notification_id})
    const findSubscription = await InstituteNotificationSubscriptionModel.findOne({ institute_id: instituteId?._id, branch_id: branchId?._id})
    if(findSubscription){
      const payload = JSON.stringify({
        title : notification_details?.title,
        body: notification_details?.body,
        icon : getApplicationURL + institute?.image,
        data : {
         url : `http://localhost:${process.env.PORT}/#/profile-management/notifications`
        }
      })
     await sendNotifications(payload,findSubscription)
    }
    res.status(200).json({ status: 'success', message: "Notification resend successfully"})
   } catch (error) {
     res.status(500).json({ status: 'failed', message: error?.message })
   }
}