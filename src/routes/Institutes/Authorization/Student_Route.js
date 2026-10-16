import express from "express";

import { loginController, logoutController } from "../../../controllers/Institutes/Authorization/Student_Login.js";


const router = express.Router();


router.post('/login', loginController);
router.post('/logout',logoutController);






export default router;

