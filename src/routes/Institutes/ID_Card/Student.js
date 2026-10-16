import express from "express";
import { downloadStudentIdCard, getAllIdCardsController, updateCardStatusController, viewStudentIdCard } from "../../../controllers/Institutes/ID_Card/Student.js";
import { checkTokenAndPermission } from "../../../middlewares/permission/index.js";


const router = express.Router();



router.get('/all', checkTokenAndPermission("student_idcards","read_permission"),getAllIdCardsController);
router.put('/:id',checkTokenAndPermission("student_idcards","update_permission"),updateCardStatusController);
router.get("/student/:id", viewStudentIdCard);
router.post("/download", downloadStudentIdCard);


export default router;

