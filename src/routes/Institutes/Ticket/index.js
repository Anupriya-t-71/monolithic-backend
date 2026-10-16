import express from "express";
import { createTicketController, deleteTicketController, getAllTicketsController, getTicketByIdController, searchTicketController, updateTicketController, updateTicketStatusController } from "../../../controllers/Institutes/Ticket/index.js";
import { checkSubscriptionController } from "../../../middlewares/subscription/index.js";


const router = express.Router();


router.post('/create', createTicketController);
router.get('/getall', getAllTicketsController);
router.get('/getbyid/:id', getTicketByIdController);
router.put('/update/:id', updateTicketController);
// router.put('/updatestatus/:id', updateTicketStatusController);
router.delete('/delete/:id', deleteTicketController);
router.get('/search/:query', searchTicketController);


export default router;

