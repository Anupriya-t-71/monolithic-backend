import staff_notifications from "../../../../models/Institutes/Notification/staff/index.js";
import { Sequence } from "../../../../models/common/common.js";
import Validations from "../../../../validations/index.js";
import { getBranchDetailsWithUUID, getInstituteDetailswithUUID } from "../../common/index.js";
import { generateUUID, getApplicationURL } from "../../../../utils/helpers.js";
import NotificationModel from "../../../../models/Institutes/Notification/notificationSubscription.js";
import sendNotifications from "../../../../config/webpush.js";
import { sendNotification } from "../../../../services/socket/notificationService.js";
import StaffSettingModel from "../../../../models/Settings/Staff.js";
import NotificationWaitingModel from "../../../../models/WaitingNotification/index.js";
import { onlineuser } from "../../../../config/socketConfig.js";

export const AddStaffNotifications = async (req,res) => {
    try {
        const data = Validations.staffNotification(req.body)
        const institute = await getInstituteDetailswithUUID(data?.institute)
        const branch = await getBranchDetailsWithUUID(data?.branch)

        if (!Array.isArray(data.staff)) {
            throw new Error("Staff field should be an array");
        }

        const notifications = []

        for (const staff of data.staff) {
            const uuid = await generateUUID()
            const sequence = await Sequence.findOneAndUpdate(
                { _id: "staffNotificationId" },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );

            const notify = await StaffSettingModel.findOne({userId:staff})
             if(notify?.notification.cummunityNotification == false){
                 continue
               }

            const notification = new staff_notifications({
                id: sequence.seq,
                uuid: uuid,
                title: data.title,
                body: data.body,
                type : data.type,
                link : data.link,
                institute: institute?._id,
                branch: branch?._id,
                staff: staff,
            });

            notifications.push(notification.save());
            const userId = staff
            sendNotification(userId?._id,notification.populate({path:"staff"}))
            const subscription = await NotificationModel.findOne({user:staff})
            if(subscription){
            const payload = JSON.stringify({
                title : data.title,
                body : data.body,
                icon : getApplicationURL + institute?.image,
                data : {
                    url : "http://localhost:3000/instructor/notifications"
                }
            })
            
            await sendNotifications(payload,subscription)

                if(!onlineuser.has(data.student)){
                await NotificationWaitingModel.create({
                student:data.student,
                payload:payload
                })
                }
          }
        }
        const staff_notification = await Promise.all(notifications);

        res.status(200).json({status:"success",message:"Staff Notification created successfully",data:staff_notification})
    } catch (error) {
        console.error("Error creating notifications:", error);
        res.status(500).json({status:"failed",message:error?.message})
    }
}

export const getAllStaffNotificationController = async (req,res) => {
    try {
        const {institute,branch} = req.query  
        let {page=1,perPage=10} = req.query

        parseInt(page),
        parseInt(perPage)

        const institue_details = await getInstituteDetailswithUUID(institute)
        const branch_details = await getBranchDetailsWithUUID(branch) 


        
        const count = await staff_notifications.countDocuments({institute:institue_details?._id,branch:branch_details?._id})
        const data = await staff_notifications.find({institute:institue_details?._id,branch:branch_details?._id})
        .populate({path:"staff"})
        .skip((page-1)*perPage).limit(perPage)

        //  const result = await staff_notifications.aggregate([
        //     { $match: {branch:branch_details?._id} }, 
        //     {$lookup:{
        //       from:"Instituteuserlist",
        //       localField:"staff",
        //       foreignField:"_id",
        //       as:"staff"
        //     }},
        //     { $sort: { createdAt: -1 } }, 
        //     { $facet: {
        //         data: [
        //             { $skip: (page - 1) * perPage }, 
        //             { $limit: perPage },
        //         ],
        //         totalCount: [
        //             { $count: "count" }, 
        //         ],
        //         },
        //     },
        //     ]);
    
        const notifications = data || [];
        const totalNotifications = count || 0;

        const last_page = Math.ceil(totalNotifications/perPage)

        
        res.status(200).json({status:"success",message:'notifications retrieved successfully',data:notifications,count:totalNotifications,last_page})
        } catch (error) {
          res.status(500).json({status:"failed",message:error?.message}) 
        }
}

export const getStaffNotificationWithStaffIdController = async (req,res) => {
    try {
    const { _id } = req.user
     let { page = 1, perPage = 10 } = req.query;

    // const notifications = await staff_notifications.find({staff:_id})
    // .populate({ path: "staff"}) 
    // .sort({createdAt:-1})
    // .skip((page - 1) * perPage)
    // .limit(perPage)

     const result = await staff_notifications.aggregate([
  { $match: { staff: _id , is_delete:false} }, 
  { $sort: { createdAt: -1 } }, 
  { $facet: {
      data: [
        { $skip: (page - 1) * perPage }, 
        { $limit: perPage },
      ],
      totalCount: [
        { $count: "count" }, 
      ],
    },
  },
]);
const notifications = result[0]?.data || [];
const totalNotifications = result[0]?.totalCount[0]?.count || 0;

    const last_page = Math.ceil(totalNotifications / perPage);

    res.status(200).json({ status:"success",message:"notification",data:notifications,last_page,totalNotifications})   
    } catch (error) {
      res.status(500).json({status:"failed",message:error?.message})   
    }
}


export const deleteStaffNotificationController = async (req, res) => {
    try {
        const { id } = req.params;


        const notification = await staff_notifications.findOneAndUpdate(
          { uuid: id },
          { is_delete: true },
          { new: true }
        );

        if (!notification) {
            return res.status(404).json({ status: "failed", message: "Notification not found" });
        }

        res.status(200).json({ status: "success", message: "Notification deleted successfully" });
    } catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).json({ status: "failed", message: error?.message });
    }
};

export const StaffResendNotification=async(req,res)=>{
  try {
    const {id,notification_id} =req.body
    const data = await staff_notifications.findOne({uuid:notification_id})

    const payload = JSON.stringify({
          title: data.title,
          body: data.body,
          // icon: getApplicationURL + institue?.image,
          data: {
            url: "http://localhost:3000/student/notifications",
          },
        });
    
     const notify = await StaffSettingModel.findOne({userId:data.staff})      
     if(notify?.notification.cummunityNotification == false){
         res.end().status(200)
      }

    const subscription = await NotificationModel.findOne({ user: data.staff });
      if (subscription) {
        await sendNotifications(payload, subscription);
      }

        if(!onlineuser.has(data.staff)){
         await NotificationWaitingModel.create({
           student:data.staff,
           payload:payload
         })
    
      }

   res.status(200).json({status:'success',message:"resend message send success"})
  } catch (error) {
    console.log(error,"resend")
    res.status(500).json({status:"failed",message:error.message})
  }
}

export const UpdateStaffNotificationWithUUID = async(req,res) => {
  try{
   const { id } = req.params
   const updated_notification = await staff_notifications.findOneAndUpdate({ uuid: id },{ status: "read"},{ new: true })
   res.status(200).json({ status: 'success',message: "Notifiaction status updated successfully",data:updated_notification})
  }catch(error){
    res.status(500).json({ status:"failed",message:error?.message})
  }
}
