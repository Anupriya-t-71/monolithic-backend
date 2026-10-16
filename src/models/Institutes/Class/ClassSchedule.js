import mongoose from "mongoose";
import { generateUUID } from "../../../utils/helpers.js";

const ClassScheduleSchema = new mongoose.Schema({
    uuid:{
        type:String,
    },
    classTime:{
        type:Date,
        required:true,
        default: Date.now()
    },
    classDate:{
        type:Date,
        required:true,
        default:Date.now()
    },
    className:{
        type:String,
        required:true
    },
    onlineclassId:{
        type:mongoose.Types.ObjectId,
        // required:true,
        ref:"onlineclass"
    },
    offlineclassId:{
        type:mongoose.Types.ObjectId,
        // required:true,
        ref:"offlineclass"
    },
    batch:{
        type:mongoose.Types.ObjectId,
        ref:'batch'
    },
    schedule:{
        type:Boolean,
        default:false,
    },
    is_deleted:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

ClassScheduleSchema.pre("save",async function(next){
    if(!this.uuid){
       const uuid = await generateUUID()
       this.uuid = uuid
    }else{
        next()
    }   
})

export const ClassScheduleModel = mongoose.model("ClassScheduleModel",ClassScheduleSchema)