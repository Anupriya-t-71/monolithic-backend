import express from "express";
import TeachingStaffReportRouter from "./TeachingStaff.js";
import StudentReportRouter from "./Student.js";

const UserReportRouter = express.Router();

UserReportRouter.use("/teaching-staff", TeachingStaffReportRouter);
UserReportRouter.use("/student", StudentReportRouter);

export default UserReportRouter;
