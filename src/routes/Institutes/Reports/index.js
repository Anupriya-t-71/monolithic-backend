import express from "express"
import UserReportRouter from "./users/index.js"


const ReportRouter = express.Router()

ReportRouter.use("/users",UserReportRouter)

export default ReportRouter




