import mongoose from "mongoose";
import { generateUUID } from "../../../utils/helpers.js";
import { Sequence } from "../../common/common.js";
const Schema = mongoose.Schema;

const activityLogSchema = new Schema({
    id : { type : Number},
    uuid : { type : String },
    institue : { type : mongoose.Schema.Types.ObjectId,ref:"institutes"},
    branch : { type : mongoose.Schema.Types.ObjectId,ref:"institutes"},
    action: { type: String, required: true },
    model: { type: String, required: true },
    title : { type : String, required : true},
    details : { type : String},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'InstituteAdmin', required:true },
    is_delete : { type : Boolean,default : false},
    timestamp: { type: Date, default: Date.now },    
},{timestamps:true});

activityLogSchema.pre("save",async function(next){
    try {
    if(!this.id){
     const uuid = await generateUUID()
     const sequence = await Sequence.findOneAndUpdate({_id:"InstituteAdminLogId"},{$inc:{seq:1}},{new:true,upsert:true})
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

export const InstituteAdminLogs = mongoose.model('InstituteAdminActivityLogs', activityLogSchema);

const teachingActivitySchema =new Schema({
    id : { type : Number},
    uuid : { type : String },
    institue : { type : mongoose.Schema.Types.ObjectId,ref:"institutes"},
    branch : { type : mongoose.Schema.Types.ObjectId,ref:"institutes"},
    action: { type: String, required: true },
    title : { type : String, required : true},
    details : { type : String},
    model: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Instituteuserlist',required:true },
    timestamp: { type: Date, default: Date.now },
    is_delete : { type : Boolean,default : false},
},{timestamps:true})

teachingActivitySchema.pre("save",async function(next){
    try {
        if(!this.id){
         const uuid = await generateUUID()
         const sequence = await Sequence.findOneAndUpdate({_id:"TeachingStaffLogId"},{$inc:{seq:1}},{new:true,upsert:true})
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

export const InstituteTeachingStaffLog=mongoose.model('TeachingStaffActivity',teachingActivitySchema)


const instituteNonTeachingStaffSchema =new Schema({
    id : { type : Number},
    uuid : { type : String },
    institue : { type : mongoose.Schema.Types.ObjectId,ref:"institutes"},
    branch : { type : mongoose.Schema.Types.ObjectId,ref:"institutes"},
    action: { type: String, required: true },
    model: { type: String, required: true },
    title : { type : String, required : true},
    details : { type : String},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Instituteuserlist',required:true },
    timestamp: { type: Date, default: Date.now },
    is_delete : { type : Boolean,default : false},
},{timestamps:true})

instituteNonTeachingStaffSchema.pre("save",async function(next){
    try {
        if(!this.id){
         const uuid = await generateUUID()
         const sequence = await Sequence.findOneAndUpdate({_id:"InstituteNonTeachingLogId"},{$inc:{seq:1}},{new:true,upsert:true})
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

export const InstituteNonTeachingStaffLog=mongoose.model('InstituteNonTeachingActivity',instituteNonTeachingStaffSchema)

const InstituteStudentLogSchema=new Schema({
    id : { type : Number},
    uuid : { type : String },
    institue : { type : mongoose.Schema.Types.ObjectId,ref:"institutes"},
    branch : { type : mongoose.Schema.Types.ObjectId,ref:"institutes"},
    action:{ type:String, required:true},
    model:{ type:String, required:true},
    title : { type : String, required : true},
    details : { type : String},
    user:{ type:mongoose.Schema.Types.ObjectId, ref:'Instituteuserlist' },
    timestamp: { type: Date, default: Date.now },
    is_delete : { type : Boolean,default : false},
},{timestamps:true})

InstituteStudentLogSchema.pre("save",async function(next){
    try {
        if(!this.id){
         const uuid = await generateUUID()
         const sequence = await Sequence.findOneAndUpdate({_id:"InstituteStudentLogId"},{$inc:{seq:1}},{new:true,upsert:true})
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

export const InstituteStudentLog=mongoose.model('InstituteStudentActivity',InstituteStudentLogSchema)

const PlatformAdminSchema=new Schema({
    id : { type : Number},
    uuid : { type : String },
    action:{ type:String, required:true},
    title : { type : String, required : true},
    details : { type : String},
    model:{ type:String, required:true},
    user:{ type:mongoose.Schema.Types.ObjectId, ref:'users',required:true },
    timestamp: { type: Date, default: Date.now },
    is_delete : { type : Boolean,default : false}
},{timestamps:true})

PlatformAdminSchema.pre("save",async function(next){
    try {
        if(!this.id){
         const uuid = await generateUUID()
         const sequence = await Sequence.findOneAndUpdate({_id:"PlatformAdminLogId"},{$inc:{seq:1}},{new:true,upsert:true})
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

export const PlatformAdminLog=mongoose.model('PlatformAdminActivity',PlatformAdminSchema)

const DeveloperActivityLogSchema = new Schema({
    id : { type : Number},
    name : { type: String},
    uuid : { type : String },
    action: { type: String, required: true },
    model: { type: String, required: true },
    title : { type : String, required : true},
    details : { type : String},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'devusers', required:true },
    is_delete : { type : Boolean,default : false},
    timestamp: { type: Date, default: Date.now },    
},{timestamps:true});

export const DeveloperActivityLog = mongoose.model('DeveloperActivityLog', DeveloperActivityLogSchema);