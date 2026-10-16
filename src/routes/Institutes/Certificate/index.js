import express from "express";
import {
  createcertificateController,
  deletecertificateController,
  getAllCertificatesBySutdent,
  getAllCertificatesController,
  PrintCertificate,
  updatecertificateController,
  } from "../../../controllers/Institutes/Certificate/index.js";
import multer from "multer";
import { checkTokenAndPermission } from "../../../middlewares/permission/index.js";

const router = express.Router();

const storage = multer()


router.get('/print/:id',PrintCertificate)
router.get('/getall/student/:studentId',getAllCertificatesBySutdent)

router.post('/create',checkTokenAndPermission("Student Certificates","create_permission"),storage.single("file"),createcertificateController);

router.get('/:InstituteId/:branchid', getAllCertificatesController);

router.put('/update/:certificateid',checkTokenAndPermission("Student Certificates","update_permission"),updatecertificateController);
// router.put('/updatestatus/:certificateid',checkTokenAndPermission("Student Certificates","update_permission"),updatecertificateStatusController);

router.delete('/delete/:certificateid', checkTokenAndPermission("Student Certificates","delete_permission"),deletecertificateController);



export default router;

