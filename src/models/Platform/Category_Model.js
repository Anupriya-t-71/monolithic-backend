import mongoose from "mongoose"
import { Sequence } from "../common/common.js"
import { generateUUID } from "../../utils/helpers.js"

const platformCategorySchema=new mongoose.Schema({
    id : {
       type : Number
    },
    uuid:{
        type:String,
        unique:true,
    },
    identity:{
        type:String,
        unique:true,
        trim:true,
    },
    description:{
        type:String,
        trim:true,
        default : null,
    },
    is_active:{
        type:Boolean,
        default:true,
    },
    is_deleted:{
        type:Boolean,
        default:false,
    },
},
    {
       timestamps:true
    })

    platformCategorySchema.pre('save',async function(next){
        try{
           if(!this.id){
            const uuid = await generateUUID()
            const sequence = await Sequence.findOneAndUpdate({_id:"PlatformFaqCategory"},{$inc:{seq:1}},{new:true,upsert:true})
            this.id = sequence.seq
            this.uuid = uuid 
            next()
           }else{
            next()
           }
        }
        catch(error){
            return next(error);
        }
        
    })

    export default mongoose.model('platform-faq-categoryes',platformCategorySchema)