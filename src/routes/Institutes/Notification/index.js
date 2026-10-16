import express from "express";
import * as  NotificationController from "../../../controllers/Institutes/Notification/index.js";
import { createInstituteNotificationController, getInstituteNotificationsWithInstituteId, getNotificationList, ResentNotificationResendController, updateInstituteNotificationWithId } from "../../../controllers/Institutes/Notification/institute/index.js";
import { getInstituteNotifications} from "../../../controllers/Institutes/Notification/common.js";
import studentNotificationRouter from "./student.js"
import { StudentResendNotification } from "../../../controllers/Institutes/Notification/student/index.js";
import { StaffResendNotification } from "../../../controllers/Institutes/Notification/staff/index.js";

const router = express.Router();

router.post('/student', NotificationController.createstudentNotificationController);
router.post('/staff', NotificationController.createstaffNotificationController);
router.post("/subscribe",NotificationController.createNotificationSubscription)
router.post("/institute/subscribe",NotificationController.createInstituteSubscriptionController)
router.post("/institute/notifications",createInstituteNotificationController)
router.get("/institute/:institute_id/all",getInstituteNotificationsWithInstituteId)
router.put("/institute/update/:notification_id",updateInstituteNotificationWithId)
router.get("/institute/all",getNotificationList)
router.get("/institute/resend-notification/",ResentNotificationResendController)
router.post("/student-notification-resend",StudentResendNotification)
router.post("/staff-notification-resend",StaffResendNotification)
router.get('/:InstituteId/:branchid', NotificationController.getAllNotificationsController);
router.put('/update/:id', NotificationController.updateNotificationController);
// router.put('/update-status/:id', NotificationController.updateNotificationStatusController);
router.delete('/delete/:id', NotificationController.deleteNotificationController);


export default router;

