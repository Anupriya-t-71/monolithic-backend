import student_notifications from "../../../../models/Institutes/Notification/student/index.js";
import Validations from "../../../../validations/index.js";
import {
  getBranchDetailsWithUUID,
  getInstituteDetailswithUUID,
} from "../../common/index.js";
import { Sequence } from "../../../../models/common/common.js";
import { generateUUID, getApplicationURL } from "../../../../utils/helpers.js";
import NotificationModel from "../../../../models/Institutes/Notification/notificationSubscription.js";
import sendNotifications from "../../../../config/webpush.js";
import { sendNotification } from "../../../../services/socket/notificationService.js";
import institutes from "../../../../models/Institutes/Institute/index.js";
import branches from "../../../../models/Institutes/Branch/index.js";
import { StudentSettingModel } from "../../../../models/Settings/Students.js";
import { onlineuser } from "../../../../config/socketConfig.js";
import NotificationWaitingModel from "../../../../models/WaitingNotification/index.js";

export const createStudentNotification = async (req, res) => {
  try {
   
    const data = Validations.studentNotification(req.body);
    const institue = await getInstituteDetailswithUUID(data?.institute);
    const branch = await getBranchDetailsWithUUID(data?.branch);

    if (!Array.isArray(data.student)) {
      throw new Error("Student field should be an array");
    }
 
    const notifications = [];

    for (const student of data.student) {
      const uuid = await generateUUID();
      const sequence = await Sequence.findOneAndUpdate(
        { _id: "studentNotificationId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      // const notify = await StudentSettingModel.findOne({userId:student})
      // if(notify?.notification.cummunityNotification == false){
      //    continue
      // }

       const payload = JSON.stringify({
          title: data.title,
          body: data.body,
          icon: getApplicationURL + institue?.image,
          data: {
            url: "http://localhost:3000/student/notifications",
          },
        });

    

      const notification = new student_notifications({
        id: sequence.seq,
        uuid: uuid,
        title: data.title,
        body: data.body,
        link: data?.link,
        type: data?.type,
        institute: institue?._id,
        branch: branch?._id,
        course: data.course,
        batch: data.batch,
        student: student,
        status: data.status,
        is_active: data.is_active,
        is_delete: data.is_delete,
      });
      notifications.push(await notification.save());

      sendNotification(student, await notification.populate({ path: "student" }));

    

      const subscription = await NotificationModel.findOne({ user: student });
      if (subscription) {
        await sendNotifications(payload, subscription);
      }

        if(!onlineuser.has(student)){
         await NotificationWaitingModel.create({
           student:student,
           payload:payload
         })
         console.log("add waiting list")
      }
    }

    const notification = await Promise.all(notifications);
    res.status(200).json({
      status: "success",
      message: "notification created successfully",
      data: notification,
    });
  } catch (error) {
    res.status(500).json({ status: "failed",err:"create", message: error?.message });
  }
};


export const getAllStudentsNotification = async (req, res) => {
  try {
    const { institute, branch } = req.query;
    let { page = 1, perPage = 10 } = req.query;

    parseInt(page), parseInt(perPage);

    const institue_details = await getInstituteDetailswithUUID(institute);
    const branch_details = await getBranchDetailsWithUUID(branch);

    const count = await student_notifications.countDocuments({
      institute: institue_details?._id,
      branch: branch_details?._id,
      is_delete: false,
    });
    const data = await student_notifications
      .find({
        institute: institue_details?._id,
        branch: branch_details?._id,
        is_delete: false,
      })
      .populate({ path: "student" })
      .sort({createdAt:-1})
      .skip((page - 1) * perPage)
      .limit(perPage)

    const last_page = Math.ceil(count / perPage);

    res.status(200).json({
      status: "success",
      message: "notifications retrieved successfully",
      data,
      count,
      last_page,
    });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error?.message });
  }
};



export const getStudentNotificationWithUserId = async (req, res) => {
  try {
    const { _id } = req.user;
    let { page = 1, perPage = 10 } = req.query;

    // const notifications = await student_notifications
    //   .find({ student: _id })
    //   .populate({ path: "student", select: "-password" })
    //   .sort({createdAt:-1})
    //   .skip((page - 1) * perPage)
    //   .limit(perPage)

    const result = await student_notifications.aggregate([
  { $match: { student: _id , is_delete:false} }, 
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

    res.status(200).json({
      status: "sucess",
      message: "notification retrived successfully",
      data: notifications,
      last_page,
      totalNotifications
    });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error?.message });
  }
};

export const updateStudentNotificationWithId = async (req, res) => {
  try {
    const { id } = req.params;
    const update = await student_notifications.findOneAndUpdate(
      { uuid: id },
      { status: "read" },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      message: "status updated successfully",
      data: update,
    });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error?.message });
  }
};

export const deleteStudentNotificationController = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await student_notifications.findOneAndUpdate(
      { uuid: id },
      { is_delete: true },
      { new: true }
    );

    if (!notification) {
      return res
        .status(404)
        .json({ status: "failed", message: "Notification not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ status: "failed", message: error?.message });
  }
};

export const StudentResendNotification=async(req,res)=>{
  try {
    const {id,notification_id} =req.body
    const data = await student_notifications.findOne({uuid:notification_id})

    if(!data){
      res.status(403).json({status:'failed',message:"notification not found"})
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
          return res.status(200).json({status:'success',message:"user is offline"})
      }

    const subscription = await NotificationModel.findOne({ user: data.student });
      if (subscription) {
        await sendNotifications(payload, subscription);
      }

    res.status(200).json({status:'success',message:"resend message send success"})
  } catch (error) {
    console.log(error,"resend")
    res.status(500).json({status:"failed",message:error.message})
  }
};

 // student Fee notification 

export const createStudentfeeNotification = async (notificationData) => {
    try {
        const notification = new student_notifications(notificationData);
        await notification.save();
        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
        throw error;
    }
};

