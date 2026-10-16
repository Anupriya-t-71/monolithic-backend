import mongoose from "mongoose";
import { Sequence } from "../../common/common.js";
import { generateUUID } from "../../../utils/helpers.js";
const Schema = mongoose.Schema

const NotificationSchema = new Schema({
    id : { type: Number },
    uuid : { type: String },
    endpoint : { type: String },
    expirationTime : { type: Number },
    role : { type: mongoose.Types.ObjectId, ref : "InstitutesRoles"  },
    user : { type: mongoose.Types.ObjectId, ref : "Instituteuserlist"},
    keys : {
        p256dh : { type: String },
        auth : { type: String }
    }
})

NotificationSchema.pre("save",async function(next){
    if(!this.id){
       try {
       const uuid = generateUUID()
       const sequence = await Sequence.findByIdAndUpdate({ _id : "notificationSubscriptionId"},{ $inc: { seq: 1}}, { new: true, upsert: true}) 
       this.id = sequence.seq
       this.uuid = uuid
       next()
       } catch (error) {
         next(error)
       }
    }else{
        next()
    }
})

// NotificationSchema.index({ endpoint: 1, 'keys.p256dh': 1, 'keys.auth': 1 }, { unique: true });


const NotificationModel = mongoose.model("notification_subscription",NotificationSchema)

export default NotificationModel