import express from "express"
import * as AdminController from "../../../../controllers/Institutes/Administration/Authorization/instituteAdminController.js"
import { checkTokenAndPermission, VerifyToken } from "../../../../middlewares/permission/index.js"
import { checkSubscription } from "../../../../middlewares/subscription/index.js"
import { resendOtp } from "../../../../controllers/Institutes/Administration/Authorization/index.js"

const InstituteAdminAuthRouter = express.Router()

InstituteAdminAuthRouter.post("/register",checkTokenAndPermission("Users","create_permission"),AdminController.InstituteAdminUserRegisterController)
InstituteAdminAuthRouter.get("/users/all",checkTokenAndPermission("Users","read_permission"),AdminController.getInstituteUserListWithBranch)
InstituteAdminAuthRouter.get("/user/:userId",checkTokenAndPermission("Users","read_permission"),AdminController.getInstituteAdminUserDetailsWithUserId)
InstituteAdminAuthRouter.put("/user/update/:userId",checkTokenAndPermission("Users","update_permission"),AdminController.updateInstituteUserDetailsWithUUID)
InstituteAdminAuthRouter.delete("/user/delete/:userId",checkTokenAndPermission("Users","delete_permission"),AdminController.deleteInstituteUserWithUUID)
InstituteAdminAuthRouter.post("/login",AdminController.InstituteAdminLoginController)
InstituteAdminAuthRouter.post("/verify-otp/",AdminController.OtpValidator)
InstituteAdminAuthRouter.get("/me",VerifyToken,AdminController.GetInstituteAdminController)
InstituteAdminAuthRouter.post('/forget-password',AdminController.forgetPassword)
InstituteAdminAuthRouter.post('/resend-otp',resendOtp)
InstituteAdminAuthRouter.post('/reset-password',AdminController.validateOtpAndResetPassword)
InstituteAdminAuthRouter.post("/change-password",VerifyToken,AdminController.ChangePassword)
InstituteAdminAuthRouter.post("/validate-otp",AdminController.validateOtp)
InstituteAdminAuthRouter.post("/update-password",AdminController.updatePassword)
InstituteAdminAuthRouter.post('/logout',AdminController.InstituteAdminLogoutController)



export default InstituteAdminAuthRouter