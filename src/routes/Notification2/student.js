import express from 'express'
import { createNotification,getStudentNotificationWithUserId } from '../../controllers/Notification/Student.js'
const StudentRouter = express.Router()

StudentRouter.post('/create',createNotification)
StudentRouter.get('/:UserId', getStudentNotificationWithUserId)

export default StudentRouter