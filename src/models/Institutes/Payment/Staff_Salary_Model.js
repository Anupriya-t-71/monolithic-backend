import mongoose from "mongoose";
import { Sequence } from "../../common/common.js";
import { generateUUID } from "../../../utils/helpers.js";

const salarySchema = new mongoose.Schema({
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
    },
    staff_type:{
        type: String,
        enum:["Teaching","Non Teaching"],
        required:true,
    },
    staff:{
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'userModel'
    },
    userModel: {
        type: String,
        enum: ['teachingstaff_login', 'non-teachingstaff_login']
    },
    payment_date:{
        type:String,
        required:true,
    },
    transaction_id:{
        type:Number,
        required:true,
    },
    salary_amount:{
        type:Number,
        required:true,
    },
    balance:{
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

salarySchema.pre('save', async function(next) {
    try {
        if(!this.id){
            const uuid = await generateUUID()
            const sequence = await Sequence.findByIdAndUpdate(
                {_id:"SatffSalaryId"},
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

export default mongoose.model('staffsalary',salarySchema);
