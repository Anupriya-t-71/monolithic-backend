import mongoose from "mongoose";
import { generateUUID } from "../../../utils/helpers.js";

const HelpSchema = new mongoose.Schema({
    uuid:{
        type:String,
    },
    title:{
        type:String,
        required:true,
    },
    module:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    is_delete:{
        type:Boolean,
        default:false,
    }
},{
    timestamps:true,
})

HelpSchema.pre('save',function(next){
    if (!this.uuid) {
        const id = generateUUID()
        this.uuid = id
        next()
    }else{
        next()
    }
})

export const HelpCenterModel = mongoose.model("HelpCenterModel",HelpSchema)