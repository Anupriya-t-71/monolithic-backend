import { InstituteSubscription } from "../../models/Administration/Subscription.js"
import SubscriptionUpdateRequestModle from "../../models/Automation/Subscription.js"
import Institute from "../../models/Institutes/Institute"
import Payment from "../../models/Platform/Payments/index.js"
import {ReportInstituteModel, ReportSubscriptionModel} from "../../models/Report/masterReport.js"
import { generateUUID } from "../../utils/helpers"

export const InstituteCountReport=async(req,res)=>{
    try {
        const {userId} =req.params
       const result = await Institute.aggregate([
                {
                    $facet: {
                    active: [{ $match: { is_active: false, is_deleted: false } }],
                    blocked: [{ $match: { is_deleted: true } }]
                    }
                }
                ]);

                const Activeinstitute = result[0].active
                const Blockedinstitute = result[0].blocked
                const ActiveCount = result[0].active.length;
                const BlokedCount = result[0].blocked.length;


        
        const Repo = await ReportInstituteModel.create({
             uuid:generateUUID(),
             instituteId:userId,
             Activeinstitute,
             Blockedinstitute,
             ActiveCount,
             BlokedCount
        })

        res.json({status:'done',Repo})

    } catch (error) {
        console.log(error)
    }
}

export const subscriptionReport = async(req,res)=>{
    try {
        const date = new Date()

        const currentDate = new Date();

                const subscriptionSummary = await InstituteSubscription.aggregate([
                {
                    $addFields: {
                    status: {
                        $cond: [
                        { $lt: ["$endDate", currentDate] }, 
                        "expired", 
                        "active"
                        ]
                    }
                    }
                },
                {
                    $group: {
                    status: "$status",
                    subscriptions: { $push: "$$ROOT" },
                    count: { $sum: 1 }
                    }
                }
                ]);

                console.log(subscriptionSummary);

        
        const repo = await ReportSubscriptionModel.create({
            uuid:generateUUID(),
            userId,
            expSubscription,
            ActiveSubscription,
        })
        
        res.json({status:'done',repo})

    } catch (error) {
        console.log(error)
    }
}

export const paymentStatus=async(req,res)=>{
    try {
        const{userId,TypeofReport,startDate,endDate}=req.body
        if(TypeofReport == 'MONTHLY'){
           const endOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
           const startOfMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);


           const data = await Payment.find({userId,createdAt: { $gte: startOfMonth, $lt: endOfMonth }})

           res.json(data)

        }else if(TypeofReport == 'YEARLY'){
           
           const endOfYear = new Date(now.getFullYear(), 1);
           const startOfYear = new Date(now.getFullYear() - 1 ,1);

           const data = await Payment.find({userId,createdAt: { $gte:  startOfYear, $lt: endOfYear }})

           res.json(data)
        }else{
          const data = await Payment.find({userId,createdAt: { $gte:  startDate, $lt: endDate }})

          res.json(data)
        }
    } catch (error) {
        console.log(error)
    }

}

