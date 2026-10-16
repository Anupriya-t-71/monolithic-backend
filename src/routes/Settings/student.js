import express from 'express'
import { notificationSetting } from '../../controllers/Settings/StudentSettings.js'

const StudentSettingsRouter = express.Router()


StudentSettingsRouter.post('/notification',notificationSetting)


export default StudentSettingsRouter