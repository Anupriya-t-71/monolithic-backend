import express from "express";
import { checkSubscriptionController } from "../../../middlewares/subscription/index.js";
import * as TicketControllers from "../../../controllers/Institutes/Ticket/TeachingStaff.js"
import { checkTokenAndPermission } from "../../../middlewares/permission/index.js";

const router = express.Router();



router.post('/',checkTokenAndPermission("staff_tickets","create_permission"), TicketControllers.createTeachingTicketController);

router.get('/all',checkTokenAndPermission("staff_tickets","read_permission"), TicketControllers.getAllTeachingTicketsController);

router.get("/",checkTokenAndPermission("staff_tickets","read_permission"),TicketControllers.getTechingTicketControllerWithUserId)

router.get('/:id',checkTokenAndPermission("staff_tickets","read_permission"),TicketControllers.getTeachingTicketByIdController);

router.put('/update/:id',checkTokenAndPermission("staff_tickets","update_permission"),TicketControllers.updateTeachingTicketController);
router.put('/updatestatus/:id',checkTokenAndPermission("staff_tickets","update_permission"),TicketControllers.updateTeachingTicketStatusController);


router.delete('/delete/:id',checkTokenAndPermission("staff_tickets","delete_permission"),TicketControllers.deleteTeachingTicketController);

router.get('/search/:query',checkTokenAndPermission("staff_tickets","read_permission"),TicketControllers.searchTeachingTicketController);
        

export default router;