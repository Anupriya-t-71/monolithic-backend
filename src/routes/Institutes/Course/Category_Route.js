import express from "express";
import * as CategoryController from "../../../controllers/Institutes/Course/Category/index.js"
import { checkTokenAndPermission } from "../../../middlewares/permission/index.js";


const CategoryRouter = express.Router({mergeParams:true});

CategoryRouter.post('/',checkTokenAndPermission("Categories","create_permission"),CategoryController.createCategoryController);


CategoryRouter.get('/', checkTokenAndPermission("Categories","read_permission"),CategoryController.getAllCategoriesController);


CategoryRouter.get("/:categoryId",checkTokenAndPermission("Categories","read_permission"),CategoryController.getCategoryWithUUID)

CategoryRouter.put('/:categoryId',checkTokenAndPermission("Categories","update_permission"),CategoryController.updateCategoryController);

CategoryRouter.delete('/:categoryId', checkTokenAndPermission("Categories","delete_permission"),CategoryController.deleteCategoryController);


export default CategoryRouter;

