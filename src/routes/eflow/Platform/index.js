import express from "express"
const PlatformRouter = express.Router()

import { checkTokenAndPermission } from "../../../middlewares/permission/index.js";
import { CreateInstituteController,getAllInstituteController,getInstituteCourseListWithInstituteId,getInstituteWithUUID,UpdateInstituteController,UpdateInstituteStatusController, getCourseDetailWithCourseId } from "../../../controllers/Platform/institutes/index.js";
import { VerifyToken } from "../../../middlewares/permission/index.js";
import PaymentRouter from "./Payments/index.js";

const chekPermission = (req, res, next) => {
    checkTokenAndPermission("institute", "create_permission", "platform")(req, res, () => {
        checkTokenAndPermission("institute-admin", "create_permission", "platform")(req, res, () => {
            checkTokenAndPermission("institute-primary-branch", "create_permission", "platform")(req, res, () => {
                next();
            });
        });
    }).catch(err => {
        console.error("Permission check failed:", err);
        res.status(403).send("Permission denied");
    });
};
PlatformRouter.put("/update/:instituteId", checkTokenAndPermission("Institutes", "update_permission"),UpdateInstituteController);
PlatformRouter.patch("/update/:instituteId", checkTokenAndPermission("Institutes", "update_permission"), UpdateInstituteStatusController);
PlatformRouter.post("/",VerifyToken,chekPermission,CreateInstituteController)
PlatformRouter.get("/getAll",checkTokenAndPermission("institute","read_permission"),getAllInstituteController)
PlatformRouter.get("/:instituteId/",checkTokenAndPermission("institute","read_permission"),getInstituteWithUUID)
PlatformRouter.get('/:instituteId/courses',getInstituteCourseListWithInstituteId)
PlatformRouter.get('/course/:courseId',getCourseDetailWithCourseId)
PlatformRouter.use("/payments/subscription-management/",PaymentRouter)

export default PlatformRouter