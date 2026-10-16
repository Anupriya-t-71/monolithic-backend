import mongoose from "mongoose";
import { Sequence } from "../../common/common.js";
import { generateUUID } from "../../../utils/helpers.js";

const refundSchema = new mongoose.Schema({
    id:{type: Number},
    uuid: {type: String},
    institute_id:{
        type:mongoose.ObjectId,
        ref:'institutes',
        required:true,
    },
    branch_name:{
        type:mongoose.ObjectId,
        ref:'branches',
        required:true,
    },
    course_name:{
        type:mongoose.ObjectId,
        ref:'courses',
        required:true,
    },
    batch_name:{
        type:mongoose.ObjectId,
        ref:'batchs',
        required:true,
    },
    student:{
        type:mongoose.ObjectId,
        ref:'Instituteuserlist',
        required:true,
    },
    studentfees: {
        type: mongoose.ObjectId,
        ref: 'studentfees',
        required: true,
    },
    payment_date:{
        type:String,
        required:true,
    },
    // transaction_id:{
    //     type:String,
    //     required:true,
    // },
    // total_amount:{
    //     type:mongoose.ObjectId,
    //     ref:'courses',
    //     required:true,
    // },
    amount:{
        type:Number,
        required:true,
    },
    file_upload:{
        type:String,
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

refundSchema.pre('save', async function(next) {
    try {
        if(!this.id){
            const uuid = await generateUUID()
            const sequence = await Sequence.findByIdAndUpdate(
                {_id:"RefundId"},
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

const refund = mongoose.model('refund',refundSchema);
export default refund
