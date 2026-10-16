import express from "express";

import * as FAQController from "../../../../controllers/Platform/Faq.js"
import { checkTokenAndPermission } from "../../../../middlewares/permission/index.js";

const FaqRouter = express.Router();


FaqRouter.post('/',checkTokenAndPermission("faq","create_permission"), FAQController.createFaqController);
FaqRouter.get('/',checkTokenAndPermission("faq","read_permission"), FAQController.getAllFaqsController);
FaqRouter.patch('/:id',checkTokenAndPermission("faq","update_permission"),FAQController.updateFaqController);
FaqRouter.delete('/:id',checkTokenAndPermission("faq","delete_permission"),FAQController.deleteFaqController);


export default FaqRouter;
    