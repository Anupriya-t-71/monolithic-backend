import express from 'express'
const NotificationRouter = express.Router()
import StudentRouter from './student.js'

NotificationRouter.use("/students",StudentRouter)
// NotificationRouter.use("/staff")
// NotificationRouter.use("/admin")

export default NotificationRouter
