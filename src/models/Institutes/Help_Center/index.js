import mongoose from "mongoose";
import { Sequence } from "../../common/common.js";
import { generateUUID } from "../../../utils/helpers.js";

const helpcenterSchema = new mongoose.Schema({
    id:{type: Number},
    uuid: {type: String},
    institute_id:{
        type:mongoose.ObjectId,
        ref:'institutes',
        required:true,
    },
    branch_id:{
        type:mongoose.ObjectId,
        ref:'branchs',
        required:true,
    },
    question:{
        type:String,
        required:true,
    },
    answer:{
        type:String,
        required:true,
    },
    videolink:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
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
    timestamps:true,
})

helpcenterSchema.pre('save', async function(next) {
    try {
       if(!this.id){
        const uuid = await generateUUID()
        const sequence = await Sequence.findByIdAndUpdate(
            {_id:"HelpCenterId"},
            { $inc: { seq: 1 } }, 
          { new: true, upsert: true }
          )
        this.uuid = uuid
        this.id = sequence.seq
        next();
       }else{
        next()
       }

    } catch (error) {
        return next(error);
    }
});

export default mongoose.model('helpcenter',helpcenterSchema);
