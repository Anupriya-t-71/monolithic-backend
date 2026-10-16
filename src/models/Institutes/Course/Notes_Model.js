import mongoose from "mongoose";
import { Sequence } from "../../common/common.js";
import { generateUUID } from "../../../utils/helpers.js";

const noteSchema = new mongoose.Schema({
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

noteSchema.pre('save', async function(next) {
    try {
        if (this.isNew || this.isModified('title')) {
            // const existingtitle = await this.constructor.findOne({ institute: this.institute, branch: this.branch, title: this.title });
            // if (existingtitle) {
            //     throw new Error('Title  must be unique within the scope of institute/branch');
            // }
        }
        if(!this.id){
            const uuid = await generateUUID()
            const sequence = await Sequence.findByIdAndUpdate(
                {_id:"NotesId"},
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

export default mongoose.model('notes',noteSchema);
