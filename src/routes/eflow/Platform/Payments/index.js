import express from "express";
import { CreateInstitutePaymentController, getInstitutePaymentController, getInstitutePaymentDetailsWithInstituteIdController,UpdatepaymentSubscription } from "../../../../controllers/Platform/Payments/index.js";


const PaymentRouter = express.Router()


PaymentRouter.post("/new-payment/",CreateInstitutePaymentController)
PaymentRouter.get("/all",getInstitutePaymentController)
PaymentRouter.get("/payment/:institute_id",getInstitutePaymentDetailsWithInstituteIdController)
// PaymentRouter.post("/payment/:institute_id/approval",UpdatepaymentSubscription)
PaymentRouter.post("/approval/",UpdatepaymentSubscription)


export default PaymentRouter