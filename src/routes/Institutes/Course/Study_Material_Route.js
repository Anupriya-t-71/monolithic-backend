import express from "express";
import * as StudyMaterialController from "../../../controllers/Institutes/Course/Study_Materials/index.js"
import { checkTokenAndPermission } from "../../../middlewares/permission/index.js";

const StudyMaterialRouter = express.Router();

StudyMaterialRouter.post("/",checkTokenAndPermission("Study Materials","create_permission"),StudyMaterialController.createStudyMaterialController);
StudyMaterialRouter.get('/',checkTokenAndPermission("Study Materials","read_permission"),StudyMaterialController.getAllStudyMaterialsController);
StudyMaterialRouter.put('/:studymaterialId',checkTokenAndPermission("Study Materials","update_permission"), StudyMaterialController.updateStudyMaterialController);
StudyMaterialRouter.delete('/:studymaterialId',checkTokenAndPermission("Study Materials","delete_permission"),StudyMaterialController.deleteStudyMaterialController);

export default StudyMaterialRouter;