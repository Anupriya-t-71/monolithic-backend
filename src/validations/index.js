import { validateInstitute,validateUpdateInstitute,validateUpdateStatusInstitute} from "./Institutes/institute/index.js"
import { validateBranchInput } from "./Institutes/branch/index.js"
import { ValidateCategory } from "./Institutes/Category/index.js"
import { CourseValidation } from "./Institutes/Course/Course/index.js"
import { CourseModuleValidation } from "./Institutes/Course/Module/index.js"
import { NotesValidation } from "./Institutes/Course/Notes/index.js"
import { StudyMaterialValidation } from "./Institutes/Course/Study_Material/index.js"
import { BatchValidation } from "./Institutes/batch/index.js"
import { OnlineClassValidation } from "./Institutes/OnlineClass/index.js"
import { OfflineClassValidation } from "./Institutes/OfflineClass/index.js"
import { EventValidation } from "./Institutes/Event/index.js"
import AuthValidation, { InstituteOtpValidation } from "./Institutes/Administration/Authorization/index.js"
import { createPlatformFaqValidation,createPlatformFaqsValidations } from "./platform/faq/index.js"
import { LoginValiation,OtpValidation, ResetPasswordValidations } from "./platform/Authentication/index.js"
import { RefundValidation } from "./Institutes/Payment/Refund/index.js"
import { GroupValidation } from "./Institutes/Group/index.js"
import { InstituteUserValidation } from "./Institutes/User/InstituteAdmin/index.js"
import { getStudentFeesValidationSchema } from "./Institutes/Payment/Students_Fees/index.js"
import { salaryValidation } from "./Institutes/Payment/Staff_Salary/index.js"
import { certificatevalidation } from "./Institutes/Certificate/index.js"
import { TicketValidation } from "./Institutes/Ticket/index.js"
import { StaffAttedenceValidations } from "./Institutes/Attendance/index.js"
import { studentNotification } from "./Institutes/Notification/student.js"
import { staffNotification } from "./Institutes/Notification/staff.js"
import instituteNotification from "./Institutes/Notification/common.js"
import { validateNotification } from "./platform/Notification/index.js"
import { AdminTicketValidation } from "./Institutes/Ticket/Admin_ticket.js"
import Institute from "../models/Institutes/Institute/index.js"
import { getplacementValidationSchema } from "./Institutes/Placements/index.js"

const Validations = {

     InstituteCreate : validateInstitute,
     InstituteUpdate : validateUpdateInstitute,
     InstituteUpdateStatus : validateUpdateStatusInstitute,  
     BranchCreate : validateBranchInput,
     CategoryCreate: ValidateCategory,
     CourseCreate : CourseValidation,
     CourseModuleCreate : CourseModuleValidation,
     NotesCreate : NotesValidation,
     StudyMaterialCreate : StudyMaterialValidation,
     ChangePassword : AuthValidation.ChangePassword,
     CreateBatch : BatchValidation,
     CreateOnlineClass : OnlineClassValidation,
     CreateOfflineClass : OfflineClassValidation,
     CreateEvent : EventValidation,
     CreateInstituteUser : AuthValidation.InstituteUserValidation,
     CreateStudent : AuthValidation.InstituteStudentValidation,
     CreateTeachingStaff : AuthValidation.InstituteStudentValidation,
     CreateNonTeachingStaff : AuthValidation.InstituteNonTeachingStaffValidation,
     CreateToken : AuthValidation.InstituteTokenValidation,
     CreateOtp : AuthValidation.InstituteOtpValidation,
     CreateIdCard : AuthValidation.IdCardValidation,
     InstituteResetPassword : AuthValidation.InstituteResetPasswordValidation,
     createPlatformFaq : createPlatformFaqValidation,
     createPlatformFaqs : createPlatformFaqsValidations,
     platformLogin : LoginValiation,
     OtpValidation : OtpValidation,
     ResetPasswordValidations:ResetPasswordValidations,
     createRefund : RefundValidation,
     createGroup : GroupValidation,
     createInstituteUser : InstituteUserValidation,
     createstudentfees : getStudentFeesValidationSchema,
     createstaffsalary : salaryValidation,
     createcertificate: certificatevalidation,
     createticket: TicketValidation,
     staffAttedence : StaffAttedenceValidations,
     studentNotification : studentNotification,
     staffNotification : staffNotification,
     instituteNotification : instituteNotification,
     createAdminTicket : AdminTicketValidation,
     platform : {
         instituteNotification : validateNotification
     },
     createPlacement:getplacementValidationSchema,
     insttituteotp:InstituteOtpValidation
}

export default Validations