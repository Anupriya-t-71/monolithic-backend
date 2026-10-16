import express from "express"
import { getClassDetailsWithCourse, getClassDetailsWithId, getClassDetailsWithTeachingStaffId, getClassTimeWithId, getStudentClassWithId, updateClassDetailsWithUUID } from "../../../controllers/Institutes/Class/index.js"

const ClassRouter = express.Router()

import OfflineClassRouter from "./offline_Route.js"
import OnlineClassRouter from "./Online_Route.js"
import { ExtractTokenID } from "../../../middlewares/permission/index.js"
ClassRouter.use(ExtractTokenID);

ClassRouter.get("/:courseId",getClassDetailsWithCourse)
ClassRouter.get("/course/:classId",getClassDetailsWithId)
ClassRouter.get("/staff/:staffId",getClassDetailsWithTeachingStaffId)
ClassRouter.put("/:classId",updateClassDetailsWithUUID)
ClassRouter.get("/gettime/:classId",getClassTimeWithId)
ClassRouter.get("/student/:studentId",getStudentClassWithId)

ClassRouter.use("/offline",OfflineClassRouter)
ClassRouter.use("/online",OnlineClassRouter)

export default ClassRouter