import express from "express";

const router = express.Router();
import adminRouter from "./Administration/Roles_and_Permissions/adminRoute.js";
import authRouter from "./Administration/Authorization/index.js";
import subscriptionRouter from "./Administration/Subscription/index.js";
import InstituteRouter from "./Institutes/index.js";
import eflowRouter from "./eflow/index.js";

import FileUploadRouter from "./upload/index.js";
import {FileRestoreRouter,FileDeleteRouter} from "./upload/index.js";

import certificateRouter from "./Institutes/Certificate/index.js";
import helpcenterRouter from "./Institutes/Help_Center/index.js";
import notificationRouter from "./Institutes/Notification/index.js";
// import eventRouter from "./Institutes/Event/index.js";
import studentidcardrouter from "./Institutes/ID_Card/Student.js";
import staffidcardrouter from "./Institutes/ID_Card/Staff.js";
import ticketRouter from "./Institutes/Ticket/index.js";

import studentloginRouter from "./Institutes/Authorization/Student_Route.js";
import allattendanceRouter from "./Institutes/Attendance/Common.js";
import developerRouter from "./Developers/index.js";



import settingsRouter from "./Settings/index.js";
import { TrackCourseAndBatch } from "../controllers/Automation/index.js";
import PlacementRouter from "./Institutes/Placements/index.js";
import { CourseBasedView } from "../controllers/Platform/institutes/course.js";
import TaskProjectRouter from "./Institutes/Course/Task_Project.js";
import HelpFaqRoutes from "./Institutes/Help_Center/HelpCenter.js";





router.use("/admin",adminRouter)
router.use("/auth",authRouter)
router.use("/subscription",subscriptionRouter)
router.use("/eflow",eflowRouter)
router.use("/institutes",InstituteRouter)
router.use("/upload",FileUploadRouter)

router.use("/restore",FileRestoreRouter)
router.use("/delete",FileDeleteRouter)

//Institute-Router

router.use("/certificate", certificateRouter);
router.use("/helpcenter", helpcenterRouter);
router.use("/notification", notificationRouter);

// router.use("/event",eventRouter);
router.use("/institute/student/id_cards/",studentidcardrouter);
router.use("/staffidcard",staffidcardrouter);
router.use("/ticket",ticketRouter);


router.use('/studentauth',studentloginRouter);
router.use('/attendance',allattendanceRouter);
router.use('/developer', developerRouter);

//Developer Router

//placement router
router.use('/placements',PlacementRouter)
router.get('/platform/:instituteId/fetched/:courseId/details',CourseBasedView)


//tracking course and batch
router.get("/track/:studentId",TrackCourseAndBatch)
router.use("/task-project", TaskProjectRouter)
router.use("/help-center",HelpFaqRoutes)


export default router;
