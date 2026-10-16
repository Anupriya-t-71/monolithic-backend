import express from "express";
import * as StaffSalaryController from "../../../controllers/Institutes/Payment/Staff_Salary/index.js"
import { VerifyToken, checkTokenAndPermission } from "../../../middlewares/permission/index.js";

const StaffSalaryRouter = express.Router();


StaffSalaryRouter.post('/', checkTokenAndPermission("staff_salaries","create_permission"),StaffSalaryController.createStaffsalaryController);
StaffSalaryRouter.get('/all',checkTokenAndPermission("staff_salaries","read_permission"),StaffSalaryController.getAllStaffsalarysController,);
StaffSalaryRouter.get("/salary",VerifyToken,StaffSalaryController.getStaffSalayWithStaffId)
StaffSalaryRouter.get('/:id',checkTokenAndPermission("staff_salaries","read_permission"),StaffSalaryController.getStaffsalaryByIdController);
StaffSalaryRouter.put('/update/:_id',checkTokenAndPermission("staff_salaries","update_permission"), StaffSalaryController.updateStaffsalaryController);
// StaffSalaryRouter.put('/update-status/:id',checkTokenAndPermission("staff_salaries","udpate_permission"),StaffSalaryController.updateStaffsalaryStatusController);
StaffSalaryRouter.delete('/:_id',checkTokenAndPermission("staff_salaries","delete_permission"),StaffSalaryController.deleteStaffsalaryController);
StaffSalaryRouter.get('/:query',checkTokenAndPermission("staff_salaries","read_permission"),StaffSalaryController.searchStaffSalaryStatusController);
StaffSalaryRouter.get('/staff-type',checkTokenAndPermission("staff_salaries","read_permission"),StaffSalaryController.searchStaffTypeController);



export default StaffSalaryRouter;

