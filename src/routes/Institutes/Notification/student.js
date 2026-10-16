import express from "express";
import * as StudentNotificationControllers from "../../../controllers/Institutes/Notification/student/index.js"
import { VerifyToken } from "../../../middlewares/permission/index.js";

const studentNotificationRouter = express.Router()


studentNotificationRouter.post("/",StudentNotificationControllers?.createStudentNotification)
studentNotificationRouter.get("/all",StudentNotificationControllers.getAllStudentsNotification)
studentNotificationRouter.get("/",VerifyToken,StudentNotificationControllers.getStudentNotificationWithUserId)
studentNotificationRouter.put("/status/:id",StudentNotificationControllers.updateStudentNotificationWithId)
studentNotificationRouter.delete("/student-notifications/:id", StudentNotificationControllers.deleteStudentNotificationController);


export default studentNotificationRouter