import express from "express";
import { createModuleController, deleteModuleController, getAllModulesController, updateModuleController, updateModuleStatusController, updateModuleStatusTrackController } from "../../../controllers/Institutes/Course/Modules/index.js";
import { checkTokenAndPermission } from "../../../middlewares/permission/index.js";

const CourseModuleRouter = express.Router();


CourseModuleRouter.post("/",checkTokenAndPermission("Course Modules","create_permission"),createModuleController);
CourseModuleRouter.get('/',checkTokenAndPermission("Course Modules","read_permission"),getAllModulesController);
CourseModuleRouter.put('/update/:moduleId',checkTokenAndPermission("Course Modules","update_permission"),updateModuleController);
CourseModuleRouter.put('/update/track-status/:moduleId',checkTokenAndPermission("Course Modules","update_permission"),updateModuleStatusTrackController);
CourseModuleRouter.put('/update-status/:moduleId',checkTokenAndPermission("Course Modules","update_permission"), updateModuleStatusController);
CourseModuleRouter.delete('/:moduleId',checkTokenAndPermission("Course Modules","delete_permission"),deleteModuleController);


export default CourseModuleRouter;