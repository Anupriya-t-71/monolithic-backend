import mongoose from "mongoose";
import { ref } from "pdfkit";

const ReportInstituteSchema = new mongoose.Schema({
    uuid:{
        type:String,
        required:true
    },
     userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    Activeinstitute:{
      type:Array
    },
    Blockedinstitute:{
      type:Array
    },
    ActiveCount:{
        type:Number
    },
    BlokedCount:{
        type:Number
    }
})


const ReportInstituteModel = mongoose.model("ReportInstituteModel",ReportInstituteSchema)

const ReportSubscriptionSchema = new mongoose.Schema({
    uuid:{
        type:String,
        required:true
    },
     userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    expSubscription:{
      type:Array
    },
    ActiveSubscription:{
      type:Array
    },
})

const ReportSubscriptionModel = mongoose.model("ReportSubscriptionModel",ReportSubscriptionSchema)

const ReportPaymentSchema = new mongoose.Schema({
    uuid:{
        type:String,
        required:true
    },
     userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    ReportData:{
        type:Array
    }
})

const ReportPaymentModel = mongoose.model("ReportPaymentModel",ReportPaymentSchema)

const MasterReportSchema = new mongoose.Schema({
    uuid:{type:String},
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    InstituteReport:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ReportInstituteModel"
    },
    SubscriptionReport:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ReportSubscriptionModel"
    },
    PaymentReport:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ReportPaymentModel"
    }

},{
    timestamps:true
})

const MasterReportModel = mongoose.model("MasterReportModel",MasterReportSchema)

export {ReportInstituteModel,ReportSubscriptionModel,ReportPaymentModel,MasterReportModel}