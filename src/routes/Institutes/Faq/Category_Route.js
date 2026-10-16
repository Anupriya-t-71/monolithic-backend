import express from "express";
import * as CategoryController from "../../../controllers/Institutes/Faq/Category.js"
import { checkTokenAndPermission } from "../../../middlewares/permission/index.js";

const FaqCategoryRouter = express.Router();


FaqCategoryRouter.post('/',CategoryController.createFaqCategoryController);
FaqCategoryRouter.get('/',CategoryController.getAllFaqCategorysController);
FaqCategoryRouter.get('/getid/:id',CategoryController.getFaqCategoryByIdController);
FaqCategoryRouter.put('/update/:uuid',CategoryController.updateFaqCategoryController);
FaqCategoryRouter.delete('/delete/:uuid',CategoryController.deleteFaqCategoryController);


export default FaqCategoryRouter;

