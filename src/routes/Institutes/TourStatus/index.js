import express from 'express';
import { updateTourStatus, getTourStatus } from '../../../controllers/Institutes/TourStatus/index';

const router = express.Router();

router.post('/update-tour-status', updateTourStatus);
router.get('/get-tour-status/:userId/:userType', getTourStatus);

export default router;