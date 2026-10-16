import { InstituteUser } from "../../../../models/Institutes/Administration/Authorization"
import Branch from "../../../../models/Institutes/Branch"
import Institute from "../../../../models/Institutes/Institute"
import AdminReport from "../../../../models/Institutes/Reports/AdminReport"
import { generateUUID } from "../../../../utils/helpers"

export const CreateLevelReport=async(req,res)=>{
   try {
    const {userId,institute,branch}=req.body
    const user = await AdminReport.find({userId:userId})
    if (user) {
       throw new Error(" user founded") 
    }
    const institutes = await Institute.find({uuid:institute})
    const brach = await Branch.find({uuid:branch})
     const data = await FinancialDetial.find({institute,branch})
    await AdminReport.create({
        uuid:generateUUID(),
        userId:userId,
        Institute:institutes,
        branch:brach,
        Finance:data
    })
    res.json({status:"done"})
   } catch (error) {
    console.log(error)
   }
}

export const FinancialDetial =async(req,res)=>{
    try {
        const {institute,branch,userId}=req.body
        const data = await FinancialDetial.find({institute,branch})
        res.json({data})
    } catch (error) {
        console.log(error)
    }
}

