import mongoose from "mongoose";
import { generateUUID } from "../../../utils/helpers.js";
import { Sequence } from "../../common/common.js";

const studymaterialSchema = new mongoose.Schema({
    id:{type: Number},
    uuid: {type: String},
    institute:{
        type:mongoose.ObjectId,
        ref:'institutes',
        required:true,
    },
    branch:{
        type:mongoose.ObjectId,
        ref:'branchs',
        required:true,
    },
    course:{
        type:mongoose.ObjectId,
        ref:'courses',
        required:true,      
    },
    title:{
        type:String,
        required:true,
    },
    slug:{
        type:String,
        lowercase:true,
    },
    description:{
        type:String,
        required:true,
    },
    file:{
        type:String,
        require : true
    },
    is_active:{
        type:Boolean,
        default:true,
    },
    is_delete:{
        type:Boolean,
        default:false,
    },     
},
{
    timestamps:true,
})

studymaterialSchema.pre('save', async function(next) {
    try {
        if (this.isNew || this.isModified('title')) {
            // const existingtitle = await this.constructor.findOne({ institute: this.institute, branch: this.branch, title : this.title });
            // if (existingtitle) {
            //     throw new Error('Title  must be unique within the scope of institute/branch');
            // }
        }
        if(!this.id){
            const uuid = await generateUUID()
            const sequence = await Sequence.findByIdAndUpdate(
                {_id:"StudyMaterialId"},
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

export default mongoose.model('study_materials',studymaterialSchema);
