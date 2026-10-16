import express from "express";
import * as BranchController from "../../../controllers/Institutes/Branch/index.js"

import { checkTokenAndPermission } from "../../../middlewares/permission/index.js";
import { checkSubscription, checkSubscriptionController, updateSubscription } from "../../../middlewares/subscription/index.js";
import * as Controllers from "../../../controllers/Institutes/Administration/Authorization/index.js"
import { deleteNonstaffById, deleteStaffById, getNonstaffDetailsWithId, getteachstaffDetailsWithID, searchNonstaff, updateNonstaff, updateStaff,  } from "../../../controllers/Institutes/Administration/Authorization/index.js";

const BranchRouter = express.Router({mergeParams:true});



BranchRouter.post('/',checkTokenAndPermission("Branches","create_permission"),checkSubscription("Branch"), BranchController.createBranchController);

BranchRouter.get('/',checkTokenAndPermission("Branches","read_permission"),BranchController.getAllBranchesController);
BranchRouter.get("/institute/all",checkTokenAndPermission("institute-branches","read_permission"),BranchController.getInstituteAllBranchesController)
BranchRouter.get("/:branchId/",checkTokenAndPermission("Branches","read_permission"),BranchController.getBrachDetailswithId)

BranchRouter.get("/:branchId/students/",checkTokenAndPermission("Student Details","read_permission"),BranchController.getBranchStudentDetails)

BranchRouter.patch('/:branchId/',checkTokenAndPermission("Branches","update_permission"),BranchController.updateBranchController);

BranchRouter.delete('/:branchId/', checkTokenAndPermission("Branches","delete_permission"),BranchController.deleteBranchController);

BranchRouter.get("/:branchId/non-teaching-staff/",checkTokenAndPermission("Non TeachingStaffs", "read_permission"),getNonstaffDetailsWithId)
BranchRouter.get("/:branchId/nonstaff/:nonstaffId",checkTokenAndPermission("Student Details","read_permission"),Controllers.getNonstaffById)
BranchRouter.get("/:branchId/staff/:staffId",checkTokenAndPermission("TeachingStaffs","read_permission"),Controllers.getStaffById)
BranchRouter.get("/:branchId/teaching-staff/",checkTokenAndPermission("TeachingStaffs", "read_permission"), getteachstaffDetailsWithID)
BranchRouter.put("/:branchId/non-teaching-staff/update/:id",checkTokenAndPermission("Non TeachingStaffs", "update_permission"), updateNonstaff)
BranchRouter.get("/:branchId/non-teaching-staff/search", checkTokenAndPermission("Non TeachingStaffs", "read_permission"), searchNonstaff);
// BranchRouter.get("/:branchId/non-teaching-staff/active", checkTokenAndPermission("Non TeachingStaffs", "read_permission"), Controllers.getAllActiveNonstaff);
BranchRouter.delete("/:branchid/non-teaching-staff/:id", checkTokenAndPermission("Non TeachingStaffs", "delete_permission"), deleteNonstaffById);

BranchRouter.put("/:branchId/teaching-staff/update/:id",checkTokenAndPermission("TeachingStaffs", "update_permission"), updateStaff)
BranchRouter.delete("/:branchId/teaching-staff/:id",checkTokenAndPermission("TeachingStaffs", "delete_permission"), deleteStaffById)



export default BranchRouter;

