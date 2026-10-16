import express from "express";
import * as instituteNotificationController from "../../../controllers/Institutes/Notification/common.js"

const instituteNotificationRouter = express.Router()

instituteNotificationRouter.post("/",instituteNotificationController.addInstituteNotifications)
instituteNotificationRouter.get("/",instituteNotificationController.getInstituteNotifications)

export default instituteNotificationRouter