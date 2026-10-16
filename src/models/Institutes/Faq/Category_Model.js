import mongoose from "mongoose";
import { Sequence } from "../../common/common.js";
import { generateUUID } from "../../../utils/helpers.js";

const categorySchema = new mongoose.Schema({
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
        // required:true,
    },
    category_name:{
        type:String,    
        unique:true,
        trim:true,
    },
    slug:{
        type:String,
        lowercase:true,
    },
    // title:{
    //     type:String,
    //     trim:true,        
    // },
    description:{
        type:String,
        trim:true,        
    },
    // accessby:{
    //     type: [String],
    // }
    // ,
    accessby: {
        type: [String],
        enum: ["Student", "Institute Admin", "Teaching Staff", "Non Teaching Staff"],
        // required: true,
      },

    is_active:{
        type:Boolean,
        default:true,
    },
    is_deleted:{
        type:Boolean,
        default:false,
    },},
{
    timestamps:true,
});

categorySchema.pre('save', async function(next) {
    try {
        if(!this.id){
            const uuid = await generateUUID()
            const sequence = await Sequence.findByIdAndUpdate(
                {_id:"FAQId"},
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

export default mongoose.model('faqcategories', categorySchema);
