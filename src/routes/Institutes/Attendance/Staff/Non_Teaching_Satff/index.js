import express from "express";
import { CreateNonTeachingStaffAttendance, DeleteNonTeachingStaffAttendance, GetNonTeachingStaffAttendance, GetNonTeachingStaffAttendanceById, UpdateNonTeachingStaffAttendance, UpdateNonTeachingStaffStatusAttendance } from "../../../../../controllers/Institutes/Attendance/Staff/Non_Teachinh_Staff/index.js";


 



const NonTeachingattendance = express.Router();

NonTeachingattendance.post ("/createnonteachstaff",CreateNonTeachingStaffAttendance)
NonTeachingattendance.get("/getall", GetNonTeachingStaffAttendance);
NonTeachingattendance.get('/getbyid/:id',GetNonTeachingStaffAttendanceById);
NonTeachingattendance.put("/update/:id", UpdateNonTeachingStaffAttendance);
NonTeachingattendance.delete("/delete/:id",DeleteNonTeachingStaffAttendance );
NonTeachingattendance.put("/updatestatus/:id", UpdateNonTeachingStaffStatusAttendance);



export default NonTeachingattendance;