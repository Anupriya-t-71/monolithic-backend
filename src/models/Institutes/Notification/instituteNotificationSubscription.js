import mongoose from "mongoose";
import { Sequence } from "../../common/common.js";
import { generateUUID } from "../../../utils/helpers.js";
const Schema = mongoose.Schema

const InstituteNotificationSchema = new Schema({
    id : { type: Number },
    uuid : { type: String },
    institute_id : { type: Schema.Types.ObjectId, ref: "institutes"},
    branch_id : { type: Schema.Types.ObjectId, ref: "branches"},
    endpoint : { type: String },
    expirationTime : { type: Number },
    role : { type: mongoose.Types.ObjectId, ref : "InstitutesRoles"  },
    user : { type: mongoose.Types.ObjectId, ref : "InstituteAdmin"},
    keys : {
        p256dh : { type: String },
        auth : { type: String }
    }
})

InstituteNotificationSchema.pre("save",async function(next){
    if(!this.id){
       try {
       const uuid = generateUUID()
       const sequence = await Sequence.findByIdAndUpdate({ _id : "InstitutenotificationSubscriptionId"},{ $inc: { seq: 1}}, { new: true, upsert: true}) 
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

const InstituteNotificationSubscriptionModel = mongoose.model("institute_notification_subscription",InstituteNotificationSchema)

export default InstituteNotificationSubscriptionModel