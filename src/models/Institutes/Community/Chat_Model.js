import mongoose from "mongoose"
import { generateUUID } from "../../../utils/helpers.js"
import { Sequence } from "../../common/common.js";

const userSchema = new mongoose.Schema( 
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'Instituteuserlist',required:true },
            isblock: { type: Boolean, default: false }
        },
        {
            _id:false
        }
    )

const chatSchema = new mongoose.Schema({
    id : {
        type : Number,
    },
    uuid : {
        type : String, 
    },
    institute: {
        type: mongoose.ObjectId,
        ref: 'institutes',
        required: true,
    },
    branch: {
        type: mongoose.ObjectId,
        ref: 'branches',
        required: true,
    },
    batch: {
        type: mongoose.ObjectId,
        ref: 'batch',
        required:true,
    },
    group: {
        type: String,
        trim: true,
        required:true,
    },
    groupimage: {
        type: String,
        trim: true,
        required:true,
        default:'',
    },
    users: [userSchema],
    last_message : {
            type : mongoose.Types.ObjectId,
            ref:"Messages",
            default: null
    },
    admin: [{
        type: mongoose.Types.ObjectId,
        ref: "InstituteAdmin",
        required:true,
    }],
}, { timestamps: true });


chatSchema.pre('save',async function(next) {
    if(!this.id){
      const uuid = generateUUID()
      const sequence = await Sequence.findByIdAndUpdate({_id:"ChatGroupId"},{$inc:{seq:1}},{new:true,upsert:true})
      this.id = sequence.seq
      this.uuid = uuid
      next()
    }else{
        next()
    }
});

export default mongoose.model('Chat', chatSchema);
