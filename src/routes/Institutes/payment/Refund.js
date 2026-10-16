import express from "express";
import * as RefundController from "../../../controllers/Institutes/Payment/Refund/index.js"
import { checkTokenAndPermission } from "../../../middlewares/permission/index.js";


const RefundRouter = express.Router();


RefundRouter.post('/create',checkTokenAndPermission("Student Fees","create_permission"), RefundController.createrefundController);
RefundRouter.get('/all',checkTokenAndPermission("Student Fees","read_permission"),RefundController.getAllrefundsController);
RefundRouter.get('/:id',checkTokenAndPermission("Student Fees","read_permission"), RefundController.getrefundByIdController);
RefundRouter.put('/update/:id',checkTokenAndPermission("Student Fees","read_permission"),RefundController.updaterefundController);  
// RefundRouter.put('/update-status/:id', checkTokenAndPermission("Student Fees","update_permission"),RefundController.updaterefundStatusController);
RefundRouter.delete('/:_id',checkTokenAndPermission("Student Fees","delete_permission"),RefundController.deleterefundController);
RefundRouter.get("/:query",checkTokenAndPermission("Student Fees","read_permission"),RefundController.searchRefundsController);

        

export default RefundRouter;

