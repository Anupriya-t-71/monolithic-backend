import express from "express";
import * as ClassController from "../../../controllers/Institutes/Class/Online/index.js"
import { checkTokenAndPermission } from "../../../middlewares/permission/index.js";
import { checkSubscription } from "../../../middlewares/subscription/index.js";


const OnlineClassRouter = express.Router();


OnlineClassRouter.post('/', checkTokenAndPermission("Live Classes","create_permission"),ClassController.createOnlineclassController);

OnlineClassRouter.get('/all', checkTokenAndPermission("Live Classes","read_permission"),ClassController.getAllOnlineClassesController);

OnlineClassRouter.get("/:onlineclassId",checkTokenAndPermission("Live Classes","read_permission"),ClassController.getOnlineClassDetailsWithId)

OnlineClassRouter.put('/update/:onlineclassId',checkTokenAndPermission("Live Classes","update_permission"), ClassController.updateOnlineclassController);

OnlineClassRouter.put('/update-status/:onlineclassId',checkTokenAndPermission("Live Classes","update_permission"),ClassController.updateOnlineclassStatusController);

OnlineClassRouter.delete('/:onlineclassId',checkTokenAndPermission("Live Classes","delete_permission"),ClassController.deleteOnlineclassController);


export default OnlineClassRouter;

