import express from "express";
import getAllHelpCentersController, { createhelpcenterController, deleteHelpCenterController, updateHelpCenterController, updateHelpCenterStatusController } from "../../../controllers/Institutes/Help_Center/index.js";



const router = express.Router();


router.post('/', createhelpcenterController);
router.get('/', getAllHelpCentersController);
router.put('/update/:id', updateHelpCenterController);
// router.put('/updatestatus/:id', updateHelpCenterStatusController);
router.delete('/delete/:id', deleteHelpCenterController);



export default router;

