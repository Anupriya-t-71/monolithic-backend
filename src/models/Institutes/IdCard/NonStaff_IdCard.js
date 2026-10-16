import mongoose from "mongoose";
import { generateUUID } from "../../../utils/helpers.js";
import { Sequence } from "../../common/common.js";

const IdcardSchema = new mongoose.Schema({
    id:{type: Number},
    uuid: {type: String},
    qr_code: {
        type: String,
        required: true,
        
    },
    username: {
        type: String,
        // required: true,
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
            const uuid = await generateUUID()
            const sequence = await Sequence.findByIdAndUpdate(
                {_id:"NonTeachingStaffId"},
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

export default mongoose.model("Idcard_nonteaching_staff", IdcardSchema);

