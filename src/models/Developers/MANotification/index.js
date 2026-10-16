
import mongoose from "mongoose";

const propertiesSchema = new mongoose.Schema({
  type:{
     type:String,
     enum:["EMAIL", "SMS", "PUSH", "IN_APP"],
     required:true,
  },
  template:{
    type:mongoose.Types.ObjectId,
    required:true,
    ref:"NotificationTemplateModel"
  },
  data:{
    type:mongoose.Types.ObjectId,
    // required:true,
  },
  recipients:[{
    type:mongoose.Types.ObjectId,
    ref:'instituteuserlist'
  }]
},{_id:false})

const preferencesSchema = new mongoose.Schema({
    channels:[{
        type:String,
        enum:["EMAIL", "SMS", "PUSH", "IN_APP"],
        default:["EMAIL", "SMS", "PUSH", "IN_APP"]
    }],
    doNotDisturb:{
        startTime:{
            type:Date,
            default: null       
        },
        endTime:{
            type:Date,
            default: null  
        }
    }
},{_id:false})

const analyticsSchema = new mongoose.Schema({
        deliveryStatus:{
            type:String,
            enum: ["DELIVERED", "BOUNCED", "FAILED","PENDING"],
            default:"PENDING"
        },
        interaction:{          
                clicked:{type:Boolean},
                dismissed:{type:Boolean}
        }
},{_id:false})

const MANotificationSchema = new mongoose.Schema({
   uuid:{
    type:String,
   },
   properties:propertiesSchema,
   trigger:{
     type:String,
     required:true,
   },
   status:{
    type:String,
    enum:["PENDING", "SENT", "FAILED", "READ"],
    default:"PENDING"
   },
   sendAt:{
    type:Date,
    default:null
   },
   isRead:{
    type:Boolean,
    default:false,
   },
   meta:{
    type:mongoose.Types.ObjectId,
    default:null
   },
   preferences:preferencesSchema,
   analytics:analyticsSchema,
   retryCount:{
    type:Number,
    default:0,
   },
},{
    timestamps:true,
})

export const MANotificationModel = mongoose.model("MANotificationModel",MANotificationSchema)

const TemplateSchema = new mongoose.Schema({
    tempType:{
        type:String,
        enum:["EMAIL", "SMS", "PUSH", "IN_APP"],
        required:true
    },
    tempName:{
        type:String,
        unique:true,
        required:true,
    },
    tempContent:{
        type:String,
        required:true,
    },
    tempSubject:{
        type:String,
        required:true
    }, 
},{timestamps:true})

export const NotificationTemplateModel = mongoose.model("NotificationTemplateModel",TemplateSchema)