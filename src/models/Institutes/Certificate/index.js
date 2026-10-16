import mongoose from "mongoose";
import { Sequence } from "../../common/common.js";
import { generateUUID } from "../../../utils/helpers.js";

const certificateSchema = new mongoose.Schema({
    id:{type: Number},
    uuid: {type: String},
    institute_id:{
        type:mongoose.ObjectId,
        ref:'institutes',
        required:true,
    },
    branch_id:{
        type:mongoose.ObjectId,
        ref:'branches',
        required:true,
    },
    course:{
        type:mongoose.ObjectId,
        ref:'courses',
        required:true,
   },
    batch_id:{
        type:mongoose.ObjectId,
        ref:'batch',
        required:true,        
    },    
    certificate_name:{
        type:String,
        required:true,  
    },
    student:[{
        type:mongoose.ObjectId,
        ref:'Instituteuserlist',
    }],
    description:{
        type:String,
    },
    file_upload:{
        type:String,
        ref:'upload',
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

certificateSchema.pre('save', async function(next) {
    try {
        
        if (!this.id) {
            const uuid = await generateUUID()
            this.uuid = uuid
            const sequence = await Sequence.findByIdAndUpdate(
                { _id: "CertificateId" },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this.id = sequence.seq;
        }
        next();
    } catch (error) {
        (error,"error")
        return next(error);
    }
});

export default mongoose.model('certificate',certificateSchema);