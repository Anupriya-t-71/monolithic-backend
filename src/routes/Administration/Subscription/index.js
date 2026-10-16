import * as SubscriptionController from "../../../controllers/Administration/Subscription/index.js"
import { VerifyToken, PermissionChecker } from "../../../middlewares/permission/index.js"
import Express from "express"
import { checkTokenAndPermission } from "../../../middlewares/permission/index.js"

const subscriptionRouter = Express.Router()

subscriptionRouter.post("/feature", checkTokenAndPermission("subscription-features", "create_permission"), SubscriptionController.createSubscriptionFeatureController)
subscriptionRouter.get("/features", checkTokenAndPermission("subscription-features", "read_permission"), SubscriptionController.getSubscriptionFeatures)

subscriptionRouter.post("/plan", checkTokenAndPermission("subscription-plans", "create_permission"), SubscriptionController.createSubscriptionPlan)
subscriptionRouter.get("/plans", checkTokenAndPermission("subscription-plans", "read_permission"), SubscriptionController.getSubscriptionPlans)
subscriptionRouter.get("/plans/all", checkTokenAndPermission("subscription-plans", "read_permission"), SubscriptionController.getAllSubscriptionPlans)
subscriptionRouter.get("/subscription", checkTokenAndPermission("subscription-plans", "read_permission"), SubscriptionController.getSubscriptionDetailsWithInstituteIds)
subscriptionRouter.get("/institute-subscription/status/:instituteId", VerifyToken, SubscriptionController.getInstituteCurrentSubscriptionStatus)

subscriptionRouter.post("/institute/upgrade-subscription/:instituteId/request", SubscriptionController.UpdateSubscriptionRequestController)
subscriptionRouter.get("/institute/upgrade-subscription/request/:institute_id", SubscriptionController.getAllSubscriptionUpdateRequest)
subscriptionRouter.post("/institute/upgrade-subscription/susbcriptionupdate", SubscriptionController.AppproveSubscriptionRequest)

subscriptionRouter.put("/institute/upgrade-subscription/:instituteId/cancelsubscription", SubscriptionController.CancelSubscriptionRequest)
subscriptionRouter.put("/plan/:id",checkTokenAndPermission("subscription-plans","update_permission"),SubscriptionController.updateSubscriptionPlanByUUID)
subscriptionRouter.put("/institute/upgrade-subscription/:instituteId/request",VerifyToken,SubscriptionController.UpdateSubscriptionRequestController)

export default subscriptionRouter