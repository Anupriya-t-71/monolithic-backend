import mongoose, { Schema } from "mongoose";
import { Sequence } from "../../common/common.js";
import { generateUUID } from "../../../utils/helpers.js";
import { UUID } from "mongodb";


const branchSchema = new mongoose.Schema({
    id:{type: Number},
    uuid: {type: String},
    institute_id:{
        type:Schema.Types.ObjectId,
        ref:'institutes',      
        required:true,
    },
    branch_identity:{
        type:String,
        // unique:true,
        trim:true,
        required:true,
    },
    slug:{
        type:String,
        lowercase:true,
    },    
    contact_info: {
            phone_no: {
                type: Number
            },
            alternate_no: {
                type: Number
            },
            address: {
                type: String
            },
            landmark: {
                type: String
            },
            state: {
                type: String
            },
            city: {
                type: String
            },
            pincode: {
                type: Number
            },        
    }, 
    is_active:{
        type:Boolean,
        default:true,
    },
    is_deleted:{
        type:Boolean,
        default:false,
    },
    is_primary:{
        type:Boolean,
        default:false,
    }    
},
{
    timestamps:true,
})

branchSchema.index({institute_id:1,branch_identity:1},{unique:true})

branchSchema.pre('save', async function(next) {
    try {
        if (this.isNew || this.isModified('branch_identity')) {
            const existingBranch = await this.constructor.findOne({ institute_id: this.institute_id, branch_identity: this.branch_identity,is_deleted:false });
            if (existingBranch) {
                throw new Error('Branch identity must be unique within the scope of institute_id');
            }
        }
        if(!this.id){
            const uuid = await generateUUID()
            const sequence = await Sequence.findByIdAndUpdate(
                {_id:"BranchId"},
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

export default mongoose.model('branches',branchSchema);


