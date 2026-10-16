import express from "express";
import { VerifyToken } from "../../../../middlewares/permission/index.js";
import * as StudentReportController from "../../../../controllers/Institutes/Reports/users/Student.js"


const StudentReportRouter = express.Router()

StudentReportRouter.get("/",VerifyToken,StudentReportController.getStudentStaffReportsController)
StudentReportRouter.get('/student-reports/:studentId', StudentReportController.getStudentReports);
export default StudentReportRouter