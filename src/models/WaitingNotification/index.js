import mongoose from "mongoose";

const WaitinglistSchema = new mongoose.Schema({
    branch:{
        type:mongoose.Types.ObjectId,
    },
    institute:{
        type:mongoose.Types.ObjectId,
    },
   student : { type: mongoose.Schema.Types.ObjectId,},
   payload:{type:Object},

},{
    timestamps:true,
})

const NotificationWaitingModel = mongoose.model("NotificationWaitingModel",WaitinglistSchema)

export default NotificationWaitingModel