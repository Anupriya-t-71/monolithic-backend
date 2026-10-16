import express from "express";
import * as staffNotificationControllers from "../../../controllers/Institutes/Notification/staff/index.js"
import { VerifyToken } from "../../../middlewares/permission/index.js";

const staffNotificationRouter = express.Router()



staffNotificationRouter.post("/",staffNotificationControllers.AddStaffNotifications)
staffNotificationRouter.get("/all",staffNotificationControllers.getAllStaffNotificationController)
staffNotificationRouter.get("/",VerifyToken,staffNotificationControllers.getStaffNotificationWithStaffIdController)
staffNotificationRouter.put('/status/:id',VerifyToken,staffNotificationControllers.UpdateStaffNotificationWithUUID)
staffNotificationRouter.delete('/:id',staffNotificationControllers.deleteStaffNotificationController)

export default staffNotificationRouter