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
        ref:'branches',default:null
    },
    courses : [{
        type: mongoose.Types.ObjectId,
        ref: "courses",
        required: true
    }],
    category_name:{
        type:String,
        trim:true,
        required:true,
    },
    slug:{
        type:String,
        lowercase:true,
    },
    image : {
        type : String
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

categorySchema.index({institute_id:1,category_name:1},{unique:true})

categorySchema.pre('save', async function(next) {
    try {
        if(this.isNew || this.isModified('category_name)')){
           const existingCategory = await this.constructor.findOne({institute_id:this.institute_id,category_name:this.category_name})
           if(existingCategory){
            throw new Error("category already exists")
           }
        }
        if(!this.id){
        const uuid = await generateUUID()
        const sequence = await Sequence.findByIdAndUpdate(
            {_id:"CategoryId"},
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

export default mongoose.model('categories',categorySchema);
