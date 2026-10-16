import express from "express";
import * as BatchController from "../../../controllers/Institutes/Batch/index.js"
import { checkTokenAndPermission } from "../../../middlewares/permission/index.js";
import { checkSubscription, checkSubscriptionController } from "../../../middlewares/subscription/index.js";

const BatchRouter = express.Router({mergeParams:true});



BatchRouter.get("/batches/batch-students/",BatchController.getStudentsWithBatchId)

BatchRouter.post('/courses/:courseId/batches/',checkTokenAndPermission("Batches","create_permission"),
checkSubscription("Batches"),
BatchController.createBatchController);
BatchRouter.get('/courses/:courseId/batches/',checkTokenAndPermission("Batches","read_permission"),BatchController.getBatchDetailsWithCourseId)
BatchRouter.get('/batches/all',checkTokenAndPermission("Batches","read_permission"),BatchController.getAllBatchController);

BatchRouter.get("/batches/:batchId/",checkTokenAndPermission("Batches","read_permission"),BatchController.getBatchDetailsWithUUID)

BatchRouter.get("/instructors/:courseId",BatchController.getInstructorDetailsWithCourseId)
BatchRouter.get("/students",BatchController.getStudentsWithBatchDetails)
BatchRouter.put('/update/:batchId',checkTokenAndPermission("Batches","update_permission"), BatchController.updateBatchController);
BatchRouter.delete('/batches/:batchId',checkTokenAndPermission("Batches","delete_permission"),BatchController.deleteBatchController);



export default BatchRouter;

