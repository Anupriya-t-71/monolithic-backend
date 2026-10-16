import express from "express"
const eflowRouter = express.Router()

import FaqRouter from "./meta/FAQ/Faq_Router.js"
import FaqCategoryRouter from "./meta/FAQ/Category_Router.js"
import PlatformRouter from "./Platform/index.js"
import adminRouter from "../Administration/Roles_and_Permissions/adminRoute.js"

eflowRouter.use("/",adminRouter)
eflowRouter.use("/faq",FaqRouter)
eflowRouter.use("/platform",PlatformRouter)
eflowRouter.use("/faq-category",FaqCategoryRouter)

export default eflowRouter