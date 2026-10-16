import express from "express";
import { checkSubscriptionController } from "../../../middlewares/subscription/index.js";
import { createStudentTicketController, deleteStudentTicketController, getAlllStudentTicketsController, getAllStudentTicketsController,  getStudentTicketByIdController,  updateStudentTicketController, updateTicketStatusController} from "../../../controllers/Institutes/Ticket/Student.js";
import { checkTokenAndPermission } from "../../../middlewares/permission/index.js";


const studentrouter = express.Router();


studentrouter.post('/create',checkTokenAndPermission("Student Tickets","read_permission"),createStudentTicketController);

studentrouter.get('/getall', checkTokenAndPermission("Student Tickets","read_permission"),getAllStudentTicketsController);

studentrouter.get('/getalll', checkTokenAndPermission("Student Tickets","read_permission"),getAlllStudentTicketsController);

studentrouter.get('/:id',checkTokenAndPermission("Student Tickets","read_permission"),getStudentTicketByIdController);
studentrouter.put('/update/:id',checkTokenAndPermission("Student Tickets","update_permission"),updateStudentTicketController);
// studentrouter.put('/updatestatus/:id',checkTokenAndPermission("Student Tickets","update_permission"),updateTicketStatusController);

studentrouter.delete('/delete/:id',checkTokenAndPermission("Student Tickets","delete_permission"),deleteStudentTicketController);


export default studentrouter;