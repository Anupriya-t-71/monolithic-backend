import express from "express";
import { VerifyToken } from "../../../middlewares/permission/index.js";
import * as AuthModels from "../../../controllers/Administration/Authorization/index.js"
import { getMasterAdminActivityLogs } from "../../../controllers/ActivityLogs/index.js";
import { uploadFiles, uploadMiddleware } from "../../../controllers/Administration/Authorization/index.js";

const authRouter = express.Router();

authRouter.post("/register",AuthModels.registerUser)
authRouter.post('/resend-otp',AuthModels.resendOtp)
authRouter.post("/verify-otp",AuthModels.validateOTP)
authRouter.get("/me",VerifyToken,AuthModels.getUserDetails)
authRouter.post("/login",AuthModels.Login)
// authRouter.post("/forget-password",VerifyToken,AuthModels.forgotPassword)
authRouter.post("/forget-password",AuthModels.forgotPassword)
authRouter.post("/validate-otp",AuthModels.validateOtpAndResetPassword)
authRouter.post("/update-password",AuthModels.updatePassword)
authRouter.post('/logout',AuthModels.logout)
authRouter.get('/activity',VerifyToken,getMasterAdminActivityLogs)
authRouter.post("/Email-sender",AuthModels.sendingMailToAll);
authRouter.post("/uploadfiles", uploadMiddleware, uploadFiles);
authRouter.patch('/edit-profile',VerifyToken,AuthModels.updateUserDetails)
export default authRouter;

