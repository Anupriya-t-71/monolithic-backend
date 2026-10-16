import mongoose from "mongoose";
import { Sequence } from "../../../common/common.js";
import { sendNotification } from "../../../../services/socket/notificationService.js";

const staffNotificationSchema = new mongoose.Schema({
    id : { type : Number},
    uuid : { type : String},
    title: { type: String, required: true },
    body: { type: String, required: true },
    link : { type: String },
    institute: { type: mongoose.Schema.Types.ObjectId, ref: 'institutes', required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'branches', required: true },
    staff : { type: mongoose.Schema.Types.ObjectId,ref:"Instituteuserlist"},
    status: { type: String, enum: ['read','unread','delivered'], default: "unread" },
    type:{type:String,enum:['Notification','Placement','Alerts','Reminders','Warning','Payment','Attendance','Classes','fee_setup','Events','Holiday'], default:"notification",required : true},
    is_active: { type: Boolean, default: true },
    is_delete: { type: Boolean, default: false },
},{ timestamps : true})

staffNotificationSchema.pre("save",async function(next){
    try {
        if(!this.id){
        const uuid = await generateUUID()
        const sequence = await Sequence.findOneAndUpdate({_id:"staffNotificationId"},{$inc:{seq:1}},{new:true,upsert:true})
        this.id = sequence.seq
        this.uuid = uuid
        next()
        }else{
           next()
        }   
       } catch (error) {
        return next(error)  
       }
})



const staff_notifications = mongoose.model("staff_notifications",staffNotificationSchema)
export default staff_notifications