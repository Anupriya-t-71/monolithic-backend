import express from "express";
import * as TeachingStaffReportController from "../../../../controllers/Institutes/Reports/users/TeachingStaff.js"
import { VerifyToken } from "../../../../middlewares/permission/index.js";


const TeachingStaffReportRouter = express.Router()

TeachingStaffReportRouter.get("/",VerifyToken,TeachingStaffReportController.getTeachingStaffReportsController)
TeachingStaffReportRouter.get('/teacher-reports/:teacherId',TeachingStaffReportController.getTeacherReports);

export default TeachingStaffReportRouter