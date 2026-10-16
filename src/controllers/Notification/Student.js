import { Sequence } from "../../models/common/common.js"
import student_notifications from "../../models/Institutes/Notification/student/index.js"
import { generateUUID,getApplicationURL } from "../../utils/helpers.js"
import { studentNotification } from "../../validations/Institutes/Notification/student.js"
import { getBranchDetailsWithUUID, getInstituteDetailswithUUID } from "../Institutes/common/index.js"
import sendNotifications from "../../config/webpush.js"
import NotificationModel from "../../models/Institutes/Notification/notificationSubscription.js"

export const createNotification= async(req,res)=>{
    try {
        const data = studentNotification(req.body)
        await generatePDF(data)
        const institute = await getInstituteDetailswithUUID(data?.institute)
        const branch = await getBranchDetailsWithUUID(data?.branch)

        if (!Array.isArray(data.student)) {
            throw new Error("Student field should be an array");
         }

         const notifications=[]
        
        for(const student of data.student){
            const uuid = await generateUUID()
              const sequence = await Sequence.findOneAndUpdate(
                { _id: "studentNotificationId" },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );

            const notification = new student_notifications(
                {
                    id: sequence.seq,
                    uuid: uuid,
                    title: data.title,
                    body: data.body,
                    link: data?.link,
                    type: data?.type,
                    institute: institute?._id,
                    branch: branch?._id,
                    course: data.course,
                    batch: data.batch,
                    student: student,
                    status: data.status,
                    is_active: data.is_active,
                    is_delete: data.is_delete,
                }
            )
            notifications.push(notification.save())
            console.log('check',notifications)
         const subscription = await NotificationModel.findOne({ user: student });
         if (subscription) {
          const payload = JSON.stringify({
          title: data.title,
          body: data.body,
          icon: getApplicationURL + institute?.image,
          data: {
            url: "http://localhost:3003/student/notifications",
          },
        });

        await sendNotifications(payload, subscription);
          }
        }
         const notification = await Promise.all(notifications);
         res.status(200).json({
            status: "success",
            message: "notification created successfully",
            data: notification,
            });
        
    } catch (error) {
        res.json({status:'failed',message:error.message})
    }

}

export const getStudentNotificationWithUserId = async(req,res)=>{
   try {
     const {UserId} = req.params
     const notifications = await student_notifications.find({student:UserId})

     res.status(200).json({
      status: "sucess",
      message: "notification retrived successfully",
      data: notifications,
    });
    
   } catch (error) {
     res.json({status:'failed',message:error.message})
   }
}