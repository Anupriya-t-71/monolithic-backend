import express from "express";
import * as FaqController from "../../../controllers/Institutes/Faq/index.js"
import { checkTokenAndPermission, ExtractTokenID, VerifyToken } from "../../../middlewares/permission/index.js";
import FaqCategoryRouter from "./Category_Route.js";


const InstituteFaqRouter = express.Router({mergeParams:true});


InstituteFaqRouter.use("/category",FaqCategoryRouter);
InstituteFaqRouter.use(ExtractTokenID);
InstituteFaqRouter.post('/',FaqController.createFaqController);
InstituteFaqRouter.get('/all',FaqController.getAllFaqsController);
InstituteFaqRouter.get('/', VerifyToken, FaqController.getFaqsByRoleController);
// InstituteFaqRouter.get('/:_id', FaqController.getFaqByIdController);
InstituteFaqRouter.put('/update/:uuid',checkTokenAndPermission("Faqs","update_permission"),FaqController.updateFaqController);

     //InstituteFaqRouter.put('/update/:uuid',FaqController.updateFaqController);

// InstituteFaqRouter.put('/updatestatus/:id',checkTokenAndPermission("Faqs","update_permission"),FaqController.updateFaqStatusController);
     InstituteFaqRouter.delete('/delete/:uuid',checkTokenAndPermission("Faqs","delete_permission"),FaqController.deleteFaqController);


// InstituteFaqRouter.delete('/delete/:uuid',FaqController.deleteFaqController);


export default InstituteFaqRouter;

