import express from "express";
import * as AttendanceController from "../../../controllers/Institutes/Attendance/common.js"
import { filterStudentAttendanceByBatchController, searchStudentAttendanceController} from "../../../controllers/Institutes/Attendance/Student.js";
import { NonTeachingStaffIsActiveFilterController, searchNonTeachingStaffAttendanceController } from "../../../controllers/Institutes/Attendance/Non_Teaching_Staff.js";
import { TeachingStaffIsActiveFilterController, filterTeachingStaffAttendanceByCoursesController, searchTeachingStaffAttendanceController } from "../../../controllers/Institutes/Attendance/Teaching_Staff.js";
import * as StudentAttedenceController from "../../../controllers/Institutes/Attendance/Student/index.js";
import * as StaffAttedenceController from "../../../controllers/Institutes/Attendance/Staff/index.js"
import { VerifyToken } from "../../../middlewares/permission/index.js";


const AttendanceRouter = express.Router();


AttendanceRouter.get("/student/:attedenceId",StudentAttedenceController.getStudentAttedenceDetailsWithId)
AttendanceRouter.get("/class/:classId",StudentAttedenceController.getStudentsAttedanceWithClassId)
AttendanceRouter.put("/class/:classId",StudentAttedenceController.updateStudentAttedenceWithClassId)
AttendanceRouter.get("/students",StudentAttedenceController.getStudentAttedanceDetails)
AttendanceRouter.post("/student/mark-attedence",StudentAttedenceController.MarkStudentAttedence)
AttendanceRouter.get("/student-attendance/",VerifyToken,StudentAttedenceController.getStudentAttendanceDetailsWithStudentId)
AttendanceRouter.get("/student-attendance/daily",VerifyToken,StudentAttedenceController.GetStudentDailyAttandanceDetails)

AttendanceRouter.post("/staff/attedence",StaffAttedenceController.addStaffAttedenceController)
AttendanceRouter.get("/staff/attedence",StaffAttedenceController.getAllStaffAttedence)
AttendanceRouter.get("/staff/:staffId",StaffAttedenceController.getStaffAttedenceWithUserId)
AttendanceRouter.get("/staff/:staffId/daily",StaffAttedenceController.GetStaffDailyDetails)

AttendanceRouter.post('/', AttendanceController.createAttendanceController);
AttendanceRouter.get('/:id?', AttendanceController.getAttendanceController);
AttendanceRouter.put('/update/:id', AttendanceController.updateAttendanceController);
AttendanceRouter.delete('/delete/:id', AttendanceController.deleteAttendanceController);
AttendanceRouter.put('/:id/:category/:itemid', AttendanceController.updateIsPresentFieldController);

//student
AttendanceRouter.get('/search/:institute-id/:branch-id/:keyword', searchStudentAttendanceController);
AttendanceRouter.post('/filter/batch/:institute-id/:branch-id', filterStudentAttendanceByBatchController);


//non-teaching-staff
AttendanceRouter.get('/search/non-teaching/:institute-id/:branch-id/:keyword', searchNonTeachingStaffAttendanceController);
AttendanceRouter.post('/active/non-teaching/:institute-id/:branch-id', NonTeachingStaffIsActiveFilterController);

//teaching-staff
AttendanceRouter.get('/search/teaching/:institute-id/:branch-id/:keyword', searchTeachingStaffAttendanceController);
AttendanceRouter.post('/active/teaching/:institute-id/:branch-id', TeachingStaffIsActiveFilterController);
AttendanceRouter.post('/filter/teaching/course/:institute-id/:branch-id', filterTeachingStaffAttendanceByCoursesController);



export default AttendanceRouter;