import mongoose from "mongoose";
import { Sequence } from "../common/common.js";
import { generateUUID } from "../../utils/helpers.js";


const platformFaqSchema = new mongoose.Schema({
    id:{
        type:String,
        unique:true,
     },
     uuid:{
        type:String,
        unique:true,
     },
     category:{
        type: mongoose.ObjectId ,   
        ref:"platform-faq-categoryes",
        required:true,
     },
     identity:{
         type:String,
         trim:true,
         require: true
     },
     description:{
        type:String,
        trim:true,
        default: null,
     },
     is_active:{
        type:Boolean,
        default:true,
     },
     is_delete:{
         type:Boolean,
         default:false
     }    
 },
    {
     timestamps:true
    });


    platformFaqSchema.pre('save', async function(next) {
        try {
            if(!this.id){
                const sequence = await Sequence.findOneAndUpdate({_id:"PlatformFaqs"},{$inc:{seq:1}},{new:true,upsert:true})
                const uuid = await generateUUID()
                this.id = sequence.seq
                this.uuid = uuid
                next();
            }else{
                next()
            }
        } catch (error) {
            return next(error);
        }
    });
    
    export default mongoose.model('platform-faq', platformFaqSchema);