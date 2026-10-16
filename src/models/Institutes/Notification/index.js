import mongoose from "mongoose";
import { Sequence } from "../../common/common.js";
import { generateUUID } from "../../../utils/helpers.js";
import { sendNotification } from '../../../services/socket/notificationService.js';
import sendNotifications from "../../../config/webpush.js";
import NotificationModel from "./notificationSubscription.js";

const notificationSchema = new mongoose.Schema({
    id:{type: Number},
    uuid: {type: String},
    institute_id:{
        type:mongoose.ObjectId,
        ref:'institutes',
        required:true,
    },
    branch_id:{
        type:mongoose.ObjectId,
        ref:'branches',
    },
    batch_id:{
        type:mongoose.ObjectId,
        ref:'batch',
        // required:true,        
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        // required:true,
    },
    type:{
        type: String,
    },
    student:[{
        type:mongoose.ObjectId,
        ref:'Instituteuserlist',
    }],
    staff:[{
        type:mongoose.ObjectId,
        ref:'staff',
    }],
    course:{
        type:mongoose.ObjectId,
        ref:'courses',
    },
    remainder:{
        type:String,
    },
    is_active:{
        type:Boolean,
        default:true,
    },
    is_deleted:{
        type:Boolean,
        default:false,
    },
    status: { 
        type: String, 
        enum: ['read','unread','delivered'], 
        default: "unread" 
    },
},
{
    timestamps:true,
})

notificationSchema.pre('save', async function(next) {
    try {
       if(!this.id){
        const uuid = await generateUUID()
        const sequence = await Sequence.findByIdAndUpdate(
            {_id:"NotificationId"},
            { $inc: { seq: 1 } }, 
          { new: true, upsert: true }
          )
        this.uuid = uuid
        this.id = sequence.seq
        next();
       }else{
        next()
       }
    } catch (error) {
        return next(error);
    }
});


export default mongoose.model('notification',notificationSchema);
