import mongoose, { Schema } from "mongoose";

const TrackingSchema = new mongoose.Schema({
   uuid:String,
   user:{
    type:Schema.Types.ObjectId,
    ref:'instituteuserlist'
   },
   course:{
    type:Array
   },
   batch:{
    type:Array
   }
},{
    timestamps:true
}) 

export const trackingModel = mongoose.model("trackingModel",TrackingSchema)