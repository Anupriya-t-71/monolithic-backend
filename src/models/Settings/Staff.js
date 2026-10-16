
import mongoose, { Schema } from "mongoose";


const StaffSettinsSchema = new mongoose.Schema({
    uuid:{
        type:String,
        unique:true,
     },
    personal:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Instituteuserlist'
      },
      notification:{
      NewStudentAssignments:{type:Boolean,default:true},
      ClassScheduleUpdates:{type:Boolean,default:true},
      CommunityMessages:{type:Boolean,default:true},
      PaymentNotifications:{type:Boolean,default:true},
      CourseContentNotifications:{type:Boolean,default:true},
     },
     
})

const StaffSettingModel=mongoose.model("StaffSettingModel",StaffSettinsSchema)

export default StaffSettingModel
