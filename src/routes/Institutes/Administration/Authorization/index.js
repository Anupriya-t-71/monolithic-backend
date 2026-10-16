import express from "express";
import * as AuthController from "../../../../controllers/Institutes/Administration/Authorization/index.js";
import { checkSubscription} from "../../../../middlewares/subscription/index.js";
import { checkTokenAndPermission } from "../../../../middlewares/permission/index.js";
import { VerifyToken } from "../../../../middlewares/permission/index.js";
import { resendWelcomeEmail } from "../../../../utils/CentralizedeEmailHandler/centralizedEmailControler.js";

const NonstaffRouter = express.Router({ mergeParams : true });

NonstaffRouter.post("/register",checkTokenAndPermission("Non TeachingStaffs","create_permission"),AuthController.InstituteregisterNonStaff);
NonstaffRouter.post("/verify-otp",AuthController.validateOTP);
NonstaffRouter.post("/resend-otp",AuthController.resendOtp);
NonstaffRouter.post("/login", AuthController.NonstaffLogin);
// NonstaffRouter.get("/getall/Nonteachstaff", checkTokenAndPermission("Non TeachingStaffs", "read_permission"), AuthController.getNonstaffDetailsWithId);
// NonstaffRouter.get("/active", checkTokenAndPermission("Non TeachingStaffs", "read_permission"), AuthController.getAllActiveNonstaff);
// NonstaffRouter.get("/search", checkTokenAndPermission("Non TeachingStaffs", "read_permission"), AuthController.searchNonstaff);
NonstaffRouter.delete("/delete", checkTokenAndPermission("Non TeachingStaffs", "delete_permission"), AuthController.deleteNonstaffById);
// NonstaffRouter.put("/:branchId/teaching-staff/update/:id", checkTokenAndPermission("Non TeachingStaffs", "update_permission"), AuthController.updateNonstaff);
NonstaffRouter.get("/:_id", checkTokenAndPermission("Non TeachingStaffs", "read_permission"), AuthController.getStudentDetailsWithId);
NonstaffRouter.post('/logout',AuthController.staffLogout)



const StudentRouter = express.Router({mergeParams:true});


StudentRouter.post("/register",
    checkTokenAndPermission("Students","create_permission"),
    checkSubscription("Students"),
    AuthController.InstituteregisterStudent);

StudentRouter.post("/verify-otp", AuthController.validateOTP);
StudentRouter.post("/resend-otp",AuthController.resendOtp)

StudentRouter.post("/login", AuthController.StudentLogin);


StudentRouter.get("/student/activity/:studentId",checkTokenAndPermission("Student Details","read_permission"),AuthController.getStudentActivityLogsWithId)

StudentRouter.get("/student/classes/:studentId",checkTokenAndPermission("Student Details","read_permission"),AuthController.getStudentClassDetails)

StudentRouter.get("/:instituteId/students/:studentId",checkTokenAndPermission("Student Details","read_permission"),AuthController.getStudentDetailsWithId)

StudentRouter.put("/update/:studentId",checkTokenAndPermission("Student Details","update_permission"),AuthController.updateStudentDetailsWithUUID)

StudentRouter.delete("/student/:studentId",checkTokenAndPermission("Students","delete_permission"),AuthController.deleteStudentWithUUID)

StudentRouter.post('/logout',VerifyToken,AuthController.StudentLogout)

StudentRouter.post('/resendemail', resendWelcomeEmail);
StudentRouter.post("/change-password", VerifyToken, AuthController.StudentChangePassword);

const staffRouter = express.Router();


staffRouter.post("/register", checkTokenAndPermission("TeachingStaffs","create_permission"),AuthController.InstituteregisterStaff);
staffRouter.post("/verify-otp", AuthController.validateOTP);
staffRouter.post("/login", AuthController.staffLogin);

staffRouter.get("/getall/staff", checkTokenAndPermission("TeachingStaffs", "read_permission"), AuthController.getteachstaffDetailsWithID);
staffRouter.get("/active", checkTokenAndPermission("TeachingStaffs", "read_permission"), AuthController.getAllActiveStaff);
staffRouter.get("/search", checkTokenAndPermission("TeachingStaffs", "read_permission"), AuthController.searchStaff);
staffRouter.delete("/delete", checkTokenAndPermission("TeachingStaffs", "delete_permission"), AuthController.deleteStaffById);
staffRouter.put("/:branchId/teaching-staff/update/:id", checkTokenAndPermission("TeachingStaffs", "update_permission"), AuthController.updateStaff);
staffRouter.get("/:_id", checkTokenAndPermission("TeachingStaffs", "read_permission"), AuthController.getStaffById);
staffRouter.post("/change-password", VerifyToken, AuthController.staffChangePassword);
staffRouter.put("/:id/status", checkTokenAndPermission("TeachingStaffs", "update_permission"), AuthController.staffStatusChange);
staffRouter.post('/logout',VerifyToken,AuthController.staffLogout)


const coordinatorRouter = express.Router();

coordinatorRouter.get("/:instituteId/:branchId/coordinators/getall",  AuthController.getCoordinatorsDetailsWithID);

const profileRouter = express.Router();

profileRouter.get("/me/",VerifyToken,AuthController.getProfile);
profileRouter.put("/me/",VerifyToken,AuthController.updateProfile)
profileRouter.post("/forgot-password",AuthController.forgotPassword)
profileRouter.post("/reset-password",AuthController.resetPassword)
profileRouter.get("/", AuthController.getAllProfiles);
profileRouter.get("/temporary-reset", async (req, res)=>{
    res.render('TemporaryResetPassword')
})
profileRouter.post("/temporary-reset", AuthController.temporaryPasswordReset)
profileRouter.get("/temporary-resetsuccess", async (req, res)=>{
    res.render('SuccessTemporaryReset')
})

export { NonstaffRouter, StudentRouter, staffRouter, profileRouter, coordinatorRouter};

