import express from "express";
// import { CreateTeachingStaffAttendance, DeleteTeachingStaffAttendance, GetTeachingStaffAttendance, GetTeachingStaffAttendanceById, UpdateTeachingStaffAttendance, UpdateTeachingStaffStatusAttendance } from "../../../../../controllers/Institutes/Attendance/Staff/Teaching_Staff/index.js";


import { markAttendance } from "../../../../../controllers/Institutes/Attendance/Staff/Teaching_Staff/index.js";





 



const attendance = express.Router();

// attendance.post ("/createstaff",CreateTeachingStaffAttendance)
// attendance.get("/get", GetTeachingStaffAttendance);
// attendance.put("/update/:id", UpdateTeachingStaffAttendance);
// attendance.delete("/delete/:id", DeleteTeachingStaffAttendance);
// attendance.put("/updatestatus/:id", UpdateTeachingStaffStatusAttendance)
// attendance.get("/getby/:id",GetTeachingStaffAttendanceById)


// Route to mark attendance
attendance.post("/mark-attendance", markAttendance);



export default attendance;