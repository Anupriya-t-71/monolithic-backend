import mongoos from "mongoose"
import { generateUUID } from "../../../utils/helpers.js"
// import { type } from "os"
// import { required } from "joi"

const companySchema = new mongoos.Schema({
    name:{
    type:String
    },
    email:{
        type:String,
    },
    phone:{
        type:Number,
    },
    address:{
        type:String,
    },
})

const eligibleSchema = new mongoos.Schema({
    courseName:{
        type:String,
    },
    education:[{type:String,required:true}],
})

const jobSchema = new mongoos.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    skils:[{
        type:String,
        required:true
    }]
})

const scheduleSchema = new mongoos.Schema({
    interviewDate:{
        type:Date,
        required:true,
    },
    venue:{
        type:String,
        required:true
    },
    address:{
        type:String,
    }
})


const placementSchema = new mongoos.Schema({
    uuid:{
      type:String,
    },
    student:[{
        type:mongoos.Types.ObjectId,
        ref:"Instituteuserlist",
        required:true
    }],
    institute:{
        type:mongoos.Types.ObjectId,
        ref:"institutes",
        required:true
    },
    is_delete:{
        type:Boolean,
        default:false
    },
    is_active:{
        type:Boolean,
        default:true,
    },
    job:jobSchema,
    company:companySchema,
    schedule:scheduleSchema,
    eligible:eligibleSchema,
},{
    timestamps:true
})

placementSchema.pre('save',async function (next){
   try {
     const uuid = await generateUUID()
     this.uuid = uuid
     next()
   } catch (error) {
     console.log("placement schema",error)
     next()
   }
})



export const PlacementModel = mongoos.model("PlacementModel",placementSchema)