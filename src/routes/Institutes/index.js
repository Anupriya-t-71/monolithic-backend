import express from "express"

const InstituteRouter = express.Router({mergeParams:true})


import Instituterouter from "./Institute/index.js"
import BranchRouter from "./Branch/index.js"
import CategoryRouter from "./Course/Category_Route.js"
import CourseRouter from "./Course/Course_Route.js"
import ClassRouter from "./Class/index.js"
import BatchRouter from "./Batch/index.js"
import PaymentRouter from "./payment/index.js"
import AttedanceRouter from "./Attendance/Common.js"
import InstituteFaqRouter from "./Faq/Faq_Route.js"
import InstituteAdminAuthRouter from "./Administration/Authorization/instituteAdmin.js"
import InstituteFaqCategoryRouter from "./Faq/Category_Route.js"
import CourseModuleRouter from "./Course/Module_Route.js"

import ChatRouter from "./Community/Chat_Router.js"
import MessageRouter from "./Community/Message_Router.js"
import { NonstaffRouter, StudentRouter, coordinatorRouter, profileRouter, staffRouter } from "./Administration/Authorization/index.js"
import StudyMaterialRouter from "./Course/Study_Material_Route.js"
import NotesRouter from "./Course/Note_Route.js"
import studentrouter from "./Ticket/Student.js"
import Staff_Ticket_Router from "./Ticket/Non_Teaching.js"
import TicketRouter from "./Ticket/Teacher.js"
import nonStaffAttedenceRouter from "./Attendance/Staff/index.js"
import studentNotificationRouter from "./Notification/student.js"
import staffNotificationRouter from "./Notification/staff.js"
import instituteNotificationRouter from "./Notification/common.js"
import activityLogsRouter from "../ActivityLogs/index.js"
import ReportRouter from "./Reports/index.js"
import AttendanceRouter from "./Attendance/Common.js"
import Adminrouter from "./Ticket/Admin_Ticket.js"
import TaskProjectRouter from "./Course/Task_Project.js"


InstituteRouter.use("/:instituteId/branches/",BranchRouter)
InstituteRouter.use("/:instituteId/categories",CategoryRouter)
InstituteRouter.use("/:instituteId/categories/:categoryId/courses",CourseRouter)
InstituteRouter.use("/:instituteId/branches/:branchId/",CourseRouter)
InstituteRouter.use("/class",ClassRouter)
InstituteRouter.use("/course-module/", CourseModuleRouter)
InstituteRouter.use("/study-material",StudyMaterialRouter)
InstituteRouter.use("/course/note",NotesRouter)
InstituteRouter.use("/non-attedence",nonStaffAttedenceRouter)
InstituteRouter.use("/:instituteId/branches/:branchId/",BatchRouter)
InstituteRouter.use("/payments",PaymentRouter)
InstituteRouter.use("/attedance",AttendanceRouter)
InstituteRouter.use("/general/FAQ",InstituteFaqRouter)
InstituteRouter.use("/auth/admin/",InstituteAdminAuthRouter)
InstituteRouter.use("/auth/teaching-staff",staffRouter)
InstituteRouter.use("/auth/Non-teaching-staff",NonstaffRouter)
InstituteRouter.use("/auth/student",StudentRouter)
InstituteRouter.use("/auth/profile",profileRouter)
InstituteRouter.use("/faq",InstituteFaqRouter)
InstituteRouter.use("/faq",InstituteFaqCategoryRouter)
InstituteRouter.use("/:instituteId/branches/",staffRouter)
// InstituteRouter.use("/:instituteId/branches/",BranchRouter)
// InstituteRouter.use("/student",StudentRouter)
InstituteRouter.use("/:instituteId/students/",StudentRouter)
InstituteRouter.use("/:instituteId/",Instituterouter)
InstituteRouter.use("/platform",Instituterouter)
InstituteRouter.use("/students/notifications/",studentNotificationRouter)
InstituteRouter.use("/staff/notifications",staffNotificationRouter)
InstituteRouter.use("/branch/notifications",instituteNotificationRouter)
InstituteRouter.use("/user/activity/",activityLogsRouter)
InstituteRouter.use("/user/activities/",activityLogsRouter)



InstituteRouter.use("/community/", ChatRouter);
InstituteRouter.use("/community/messages/", MessageRouter);
InstituteRouter.use("/student-ticket",studentrouter)
InstituteRouter.use("/non-staff/ticket",Staff_Ticket_Router)
InstituteRouter.use("/staff/ticket",TicketRouter)
InstituteRouter.use("/admin/ticket",Adminrouter)
InstituteRouter.use("/reports",ReportRouter)
InstituteRouter.use("/",coordinatorRouter)
// InstituteRouter.use("/task-project", TaskProjectRouter)

export default InstituteRouter