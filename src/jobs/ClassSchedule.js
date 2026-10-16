import corn from "node-cron"
import { ClassScheduleModel } from "../models/Institutes/Class/ClassSchedule.js"

export const ClassSchedule = ()=>{
    corn.schedule("0 9 * * 1-7",async()=>{
       const now = new Date()
       const ScheduleDate = now.getDate()

       const data = await ClassScheduleModel.find({classDate:ScheduleDate,schedule:false})
       .populate({
        path:'batch',
        model:'batch',
        populate:{
            path:student,
            model:'instituteuserlist'
        }
       })
       .populate('onlineclass')
       .populate('offlineclass')

       const sended = data.map(async(classData)=>{
          // send function
          
          return ClassScheduleModel.findOneAndUpdate({_id:classData._id},{schedule:true,is_deleted:false})
       })

       await Promise.all(sended)
       console.log(data)
    })

    corn.schedule("5 * * * *",async()=>{

    })
}