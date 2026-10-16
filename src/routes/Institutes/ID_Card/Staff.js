import express from "express";
import { getAllIdCardsController, updateCardStatusController } from "../../../controllers/Institutes/ID_Card/Staff.js";
import { checkTokenAndPermission } from "../../../middlewares/permission/index.js";



const router = express.Router();

router.get('/:InstituteId/:branchid',checkTokenAndPermission("Staff IdCards","read_permission"),getAllIdCardsController);
router.put('/:id',checkTokenAndPermission("Staff IdCards","update_permission"), updateCardStatusController);


export default router;

