import express from "express";
import * as CourseController from "../../../controllers/Institutes/Course/Course/index.js"

import NotesRouter from "./Note_Route.js";
import StudyMaterialRouter from "./Study_Material_Route.js";

import { checkTokenAndPermission, VerifyToken } from "../../../middlewares/permission/index.js";
import { checkSubscription, checkSubscriptionController } from "../../../middlewares/subscription/index.js";

const CourseRouter = express.Router({mergeParams:true});


CourseRouter.post("/course-templates",checkTokenAndPermission("Courses", "create_permission"),CourseController.createCourseController)

CourseRouter.get("/teaching-staff/courses",VerifyToken,CourseController.getTeachingStaffCourseWithToken)
CourseRouter.get("/student-new/courses",VerifyToken,CourseController.getStudentCourseWithToken)

CourseRouter.get("/courses", checkTokenAndPermission("Courses", "read_permission"), CourseController.getCourseDetailsWithBranchId);

CourseRouter.get("/course/:courseId",CourseController.getCourseDetailsWithCourseId)

CourseRouter.post('/', VerifyToken,
    // checkTokenAndPermission("Courses", "create_permission"),
    checkSubscription("Courses"),
     CourseController.createCourseController);

CourseRouter.get('/', checkTokenAndPermission("Courses", "read_permission"), CourseController.getAllCourseController);

CourseRouter.get("/:courseId/students/", CourseController.getStudentDetailsWithCourseId);

CourseRouter.get("/:courseId/classes/", CourseController.getClassDetailsForCourse);

CourseRouter.get('/:courseId', checkTokenAndPermission("Courses", "update_permission"), CourseController.getCourseWithId);

CourseRouter.put('/:courseId', checkTokenAndPermission("Courses", "update_permission"), CourseController.updateCourseController);

CourseRouter.delete('/:courseId', checkTokenAndPermission("Courses", "delete_permission"), CourseController.deleteCourseController);

CourseRouter.post('/ongoing-course', CourseController.ongoingCourse);

export default CourseRouter;
