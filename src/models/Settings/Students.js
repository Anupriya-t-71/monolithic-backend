
import mongoose, { Schema } from "mongoose";

const StudentsettingSchema =new mongoose.Schema({
     uuid:{
        type:String,
        unique:true,
     },
     userId:{
       type:String,
       ref:"students",
       required:true,
     },
     personal:{
       type:mongoose.Schema.Types.ObjectId,
       ref:'Instituteuserlist'
     },
     notification:{
      assignmentDeadlines:{type:Boolean,default:true},
      classReminder:{type:Boolean,default:true},
      examAlerts:{type:Boolean,default:true},
      cummunityNotification:{type:Boolean,default:true},
      FeePaymentNotifications:{type:Boolean,default:true},
      InstallmentSchedules:{type:Boolean,default:true},  
     },
     BatchRequest:{
      FormId:{type:Schema.Types.ObjectId,ref:"FormModel"},
     },
     TicketId:{
      type:Schema.Types.ObjectId,
      ref:"Student_tickets"
     }

})

const FormSchema = new mongoose.Schema({
     uuid:{
        type:String,
        unique:true,
     },
     userId:{
       type:String,
       ref:"students"
     },
     title:{
        type:String,
        required:true
     },
     content:{
        type:String,
        required:true
     },

})
const StudentSettingModel = mongoose.model("StudentSettingModel",StudentsettingSchema)
const FormModel = mongoose.model("FormModel",FormSchema)

export  {StudentSettingModel,FormModel}