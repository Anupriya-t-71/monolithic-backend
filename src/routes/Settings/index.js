import express from "express";
import AdminSettingsRouter from "./admin.js";
import StudentSettingsRouter from "./student.js";
import StaffSettingsRouter from "./staff.js";

const settingsRouter = express.Router();

settingsRouter.use('/admin',AdminSettingsRouter)
settingsRouter.use('/student',StudentSettingsRouter)
settingsRouter.use('/staff',StaffSettingsRouter)

export default settingsRouter