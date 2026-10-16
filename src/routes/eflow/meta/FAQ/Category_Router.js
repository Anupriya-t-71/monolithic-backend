import express from "express";
import * as FaqCategoryController from "../../../../controllers/Platform/Category.js"
import { checkTokenAndPermission } from "../../../../middlewares/permission/index.js";

const FaqCategoryRouter = express.Router();    



FaqCategoryRouter.post('/',checkTokenAndPermission("faq-category","create_permission"),FaqCategoryController.createFaqCategoryController);
FaqCategoryRouter.get('/',checkTokenAndPermission('faq-category',"read_permission"), FaqCategoryController.getAllFaqCategoryController);
FaqCategoryRouter.patch('/:id',checkTokenAndPermission("faq-category","update_permission"),FaqCategoryController.updateFaqCategoryController);
FaqCategoryRouter.delete('/:id',checkTokenAndPermission("faq-category","delete_permission"),FaqCategoryController.deleteFaqCategoryController);

export default FaqCategoryRouter;


