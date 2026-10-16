import mongoose from "mongoose";
import { Sequence } from "../../common/common.js";
import { generateUUID } from "../../../utils/helpers.js";

const IdcardSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
    },
    uuid : {
       type: String, 
       unique : true
    },
    name: {
        type: String,
        required: true
    },
    institute: {
        type: mongoose.ObjectId,
        ref: "institutes",
        required: true
    },
    branch: {
        type: mongoose.ObjectId,
        ref: "branchs",
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    role: {
        type: mongoose.Types.ObjectId,
        ref: "InstitutesRoles",
        required: true,
    },
    student_id : {
        type: String
    },
    image : {
        type: String
    },
    student : {
       type: mongoose.Types.ObjectId,
       ref: "Instituteuserlist"
    },
    contact: {
        type: String,
        required: true,
    },
    address: {
        address_line_one : { type: String },
        address_line_two : { type: String },
        state : { type: String },
        city : { type: String },
        pin_code : { type: Number}
    },
    is_active: {
        type: Boolean,
        default: true 
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

IdcardSchema.pre('save', async function(next) {
    try {
        if(!this.id){
          const sequence = await Sequence.findByIdAndUpdate({ _id: "StudentIdCards"},{$inc:{ seq: 1}},{ new: true, upsert: true })
          const uuid = await generateUUID()
          this.id = sequence.seq
          this.uuid = uuid
          next()
        }else{
            next()
        }
    } catch (error) {
        return next(error);
    }
});

const StudentIdCard = mongoose.model("student_id_cards", IdcardSchema)

export default StudentIdCard

