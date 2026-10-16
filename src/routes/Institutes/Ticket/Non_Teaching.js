import express from "express";
import { checkSubscriptionController } from "../../../middlewares/subscription/index.js";
import { createNonTeachingTicketController, deleteNonTeachingTicketController, getAllNonTeachingTicketsController, getNonTeachingTicketByIdController, searchNonTeachingTicketController, updateNonTeachingTicketController} from "../../../controllers/Institutes/Ticket/Non_TeachingStaff.js";


const Staff_Ticket_Router = express.Router();


Staff_Ticket_Router.post('/create', createNonTeachingTicketController);
Staff_Ticket_Router.get('/getall', getAllNonTeachingTicketsController);
Staff_Ticket_Router.get('/getbyid/:id', getNonTeachingTicketByIdController);
Staff_Ticket_Router.put('/update/:id', updateNonTeachingTicketController);
Staff_Ticket_Router.delete('/delete/:id', deleteNonTeachingTicketController);
Staff_Ticket_Router.get('/search/:query', searchNonTeachingTicketController);


export default Staff_Ticket_Router;