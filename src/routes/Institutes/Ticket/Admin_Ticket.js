import express from "express";
import { checkTokenAndPermission, VerifyToken } from "../../../middlewares/permission/index.js";
import { closeAdminTicketController, createInstituteAdminTicketController, deleteInstituteAdminTicketController, getAllAdminTicketsController, getAllInstituteAdminTicketsController, getInstituteAdminTicketByIdController, updateInstituteAdminTicketController } from "../../../controllers/Institutes/Ticket/Admin_Ticket.js";


const Adminrouter = express.Router();


Adminrouter.post('/',VerifyToken,createInstituteAdminTicketController);

Adminrouter.get('/all',VerifyToken,getAllInstituteAdminTicketsController);

Adminrouter.get('/get-alll',VerifyToken,getAllAdminTicketsController);

Adminrouter.get('/:id',getInstituteAdminTicketByIdController);
Adminrouter.put('/update/:id',VerifyToken,updateInstituteAdminTicketController);
Adminrouter.put("/close-ticket/:id",closeAdminTicketController)
// studentrouter.put('/updatestatus/:id',checkTokenAndPermission("Student Tickets","update_permission"),updateTicketStatusController);
Adminrouter.delete('/delete/:id',deleteInstituteAdminTicketController);


export default Adminrouter;