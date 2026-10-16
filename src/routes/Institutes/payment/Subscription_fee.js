import express from "express";
import * as  SubscriptionController from "../../../controllers/Institutes/Payment/Subscription/index.js"
import { checkTokenAndPermission } from "../../../middlewares/permission/index.js";

const InstituteSubscriptionRouter = express.Router();

InstituteSubscriptionRouter.get('/all', SubscriptionController.getAllSubscriptions);
InstituteSubscriptionRouter.get('/:InstituteId', SubscriptionController.getSubscriptionById);
InstituteSubscriptionRouter.put('/update/:id', SubscriptionController.updateSubscription);
// InstituteSubscriptionRouter.put('/update-status/:id', SubscriptionController.updateSubscriptionStatus);
InstituteSubscriptionRouter.delete('/:id', SubscriptionController.deleteSubscription);
InstituteSubscriptionRouter.get('/:query',SubscriptionController.searchSubscription);



export default InstituteSubscriptionRouter;

