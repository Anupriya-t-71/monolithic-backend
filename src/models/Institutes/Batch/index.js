import mongoose from "mongoose";
import { Sequence } from "../../common/common.js";
import { generateUUID } from "../../../utils/helpers.js";

const batchSchema = new mongoose.Schema({
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
        ref:"courses",
    },
    classes:[{
        type: mongoose.Types.ObjectId,
        ref:"onlineclass",
    }],
    batch_name:{
        type:String,
        required:true,
    },
    slug:{
        type:String,
        lowercase:true,
    },
    start_date:{
        type:String,
        required:true,
    },
    end_date:{
        type:String,
        required:true,
    },
    student:[{
        type:mongoose.ObjectId,
        ref:'Instituteuserlist',
        required:true,
    }],
    instructor: [{ 
        type: mongoose.ObjectId, 
        ref: 'Instituteuserlist', 
        required: true 
    }],
        
    attendance: [{
        type: mongoose.ObjectId,
        ref: 'attendance'
    }],
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

batchSchema.pre('save', async function(next) {
    try {
        if (this.isNew || this.isModified('batch_name')) {
            const existingBatch = await this.constructor.findOne({ institute_id: this.institute_id, branch_id: this.branch_id,batch_name:this.batch_name });
            if (existingBatch) {
                throw new Error('Batch name  must be unique within the scope of institute&branch_id');
            }
        }
        if(!this.id){
        const uuid = await generateUUID()
        const sequence = await Sequence.findByIdAndUpdate(
            {_id:"BatchId"},
            { $inc: { seq: 1 } }, 
          { new: true, upsert: true }
          )
        this.uuid = uuid
        this.id = sequence.seq     
        }
        next();
    } catch (error) {
        return next(error);
    }
});

export default mongoose.model('batch',batchSchema);
