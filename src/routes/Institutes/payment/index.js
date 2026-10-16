import express from "express"

const PaymentRouter = express.Router()

import RefundRouter from "./Refund.js"
import StaffSalaryRouter from "./Staff_Salary.js"
import StudentFeeRouter from "./Student_fee.js"
import InstituteSubscriptionRouter from "./Subscription_fee.js"

PaymentRouter.use("/refund",RefundRouter)
PaymentRouter.use("/staff-salary",StaffSalaryRouter)
PaymentRouter.use("/student-fee",StudentFeeRouter)
PaymentRouter.use("/subscription",InstituteSubscriptionRouter)


export default PaymentRouter