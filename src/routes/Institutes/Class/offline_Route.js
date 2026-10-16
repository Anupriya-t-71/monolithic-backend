import express from "express";
import * as ClassController from "../../../controllers/Institutes/Class/Offline/index.js"
import { checkTokenAndPermission } from "../../../middlewares/permission/index.js";
import { checkSubscription } from "../../../middlewares/subscription/index.js";

const OfflineClassRouter = express.Router();


 
OfflineClassRouter.post('/',checkTokenAndPermission("Offline Classes","create_permission"),ClassController.createofflineclassController);

 
OfflineClassRouter.get('/all',checkTokenAndPermission("Offline Classes","read_permission"), ClassController.getAllOfflineClassesController);

OfflineClassRouter.get("/:offlineClassId/",checkTokenAndPermission("OfflineClass Details","read_permission"),ClassController.getOfflineClassWithUUID)

OfflineClassRouter.put('/update/:offlineclassid',checkTokenAndPermission("Offline Classes","update_permission"),ClassController.updateofflineclassController);

OfflineClassRouter.delete('/:offlineclassid',checkTokenAndPermission("Offline Classes","delete_permission"),ClassController.deleteofflineclassController);


export default OfflineClassRouter;

