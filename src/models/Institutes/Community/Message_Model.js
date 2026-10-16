import mongoose from "mongoose";
import { generateUUID } from "../../../utils/helpers.js";
import { Sequence } from "../../common/common.js";
import { Filter } from "bad-words";
import Chat_Model from "./Chat_Model.js";

const filter = new Filter();

// Adding words to the filter
filter.addWords('love','hells','harse');

// Removing words from the filter
filter.removeWords('hells');

const messageSchema  = new mongoose.Schema({
    id : {
       type : Number
    },
    uuid : {
       type : String
    },
    sender: { 
        type: mongoose.ObjectId, 
        ref: 'Instituteuserlists',
        required:true,
     },
    sender_name : {
        type : String, 
        required : true
    },
    message: { 
        type: String, 
        trim: true,
        required:true,
     },
    group: { 
        type: mongoose.ObjectId,
         ref: "Chat",
         required:true,
         },
    timestamp: {
        type : Date,
        default:Date.now,
    },
    status: [{
         user : { type: mongoose.Types.ObjectId, ref: 'Instituteuserlist' },
         read : { type : Boolean, default : false },
         delivered : { type: Boolean, default : false },
         timestamps : { type: Date }
         }],
  },
  { timestamps: true }
);

messageSchema.pre("save", async function(next){
    if(!this.id){
    const uuid = generateUUID()
    const sequence = await Sequence.findByIdAndUpdate({_id:"ChatMessageId"},{$inc:{seq:1}},{ new: true, upsert: true})
    this.id = sequence.seq
    this.uuid = uuid  

    await Chat_Model.findOneAndUpdate({_id:this.group},{last_message:this._id})
    }else{
        next()
    }
})

messageSchema.pre('save', function (next) {
    if (this.isModified('message')) {
        this.message = filter.clean(this.message);
    }
    next();
});

export default mongoose.model('Messages', messageSchema);