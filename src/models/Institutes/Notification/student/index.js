import { generateUUID } from '../../../../utils/helpers.js';
import { Sequence } from '../../../common/common.js';
import mongoose from 'mongoose';
import axios  from 'axios';
import { sendNotification } from '../../../../services/socket/notificationService.js';

const studentNotificationSchema = new mongoose.Schema({
  id : { type : Number},
  uuid : { type : String},
  title: { type: String, required: true },
  body: { type: String, required: true },
  link : { type: String },
  institute: { type: mongoose.Schema.Types.ObjectId, ref: 'institutes', required: false },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: 'branches', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'courses', required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'batch', default: null },
  student : { type: mongoose.Schema.Types.ObjectId,ref:"Instituteuserlist"},
  type:{type:String,enum:['Notification','Placement','Alert','Remainder','Warning','Payment','Attendance','Classes','fee_setup','Events','Holiday'], default:"notification",required : true},
  status: { type: String, enum: ['read','unread','delivered'], default: "unread" },
  is_active: { type: Boolean, default: true },
  is_delete: { type: Boolean, default: false },
},{ timestamps: true });

studentNotificationSchema.pre("save",async function(next){
    try {
     if(!this.id){
     const uuid = await generateUUID()
     const sequence = await Sequence.findOneAndUpdate({_id:"studentNotificationId"},{$inc:{seq:1}},{new:true,upsert:true})
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


const student_notifications = mongoose.model('StudentNotification', studentNotificationSchema);

export default student_notifications
