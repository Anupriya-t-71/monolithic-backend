import express from "express";
import * as  StudentFeeController from "../../../controllers/Institutes/Payment/Student_Fee/index.js"
import { checkTokenAndPermission } from "../../../middlewares/permission/index.js";


const StudentFeeRouter = express.Router();

StudentFeeRouter.post('/create',checkTokenAndPermission("Student Fees","create_permission"), StudentFeeController.createStudentfeeController);

StudentFeeRouter.get('/all',checkTokenAndPermission("Student Fees","read_permission"),StudentFeeController.getAllStudentfeesController);


StudentFeeRouter.get('/:id',checkTokenAndPermission("Student Fees","read_permission"),StudentFeeController.getStudentfeeByIdController);

StudentFeeRouter.put('/update/emi-fees',checkTokenAndPermission("Student Fees","update_permission"),StudentFeeController.updateStudentfeeemiController);

StudentFeeRouter.put('/update',checkTokenAndPermission("Student Fees","update_permission"),StudentFeeController.updateStudentfeeController);
// StudentFeeRouter.put('/update-status/:id',checkTokenAndPermission("Student Fees","update_permission"),StudentFeeController.updateStudentfeeStatusController);

StudentFeeRouter.delete('/:uuid',checkTokenAndPermission("Student Fees","delete_permission"),StudentFeeController.deleteStudentfeeController);


StudentFeeRouter.get('/search/:query',checkTokenAndPermission("Student Fees","read_permission"),StudentFeeController.searchStudentFeeStatusController);



export default StudentFeeRouter;
