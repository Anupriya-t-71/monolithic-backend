import express from "express";
import * as NonTeachingStaffAttedenceController from "../../../../controllers/Institutes/Attendance/Staff/index.js"

const nonStaffAttedenceRouter = express.Router()

nonStaffAttedenceRouter.post("/non-teaching-staff/attedence",NonTeachingStaffAttedenceController.addNonTeachingStaffAttedenceController)
nonStaffAttedenceRouter.get("/non_teaching_staff/:nonStaffId/",NonTeachingStaffAttedenceController.getNonTeachingStaffAttedenceWithId)
nonStaffAttedenceRouter.get("/non-teaching-staff/attedence",NonTeachingStaffAttedenceController.getallNonTeachingStaffAttedence)


export default nonStaffAttedenceRouter