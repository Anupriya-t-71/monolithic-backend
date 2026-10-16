import mongoose from "mongoose";
import { Sequence } from "../../../common/common.js";
import { generateUUID } from "../../../../utils/helpers.js";

const nonTeachingStaffSchema = new mongoose.Schema({
    nonteachingstaff_id: {
        type: String,
        unique: true,
    },
    staff_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    working_days: {
        type: Number,
        required: true
    },
    branches: [{
        branch_name: String,
        attendance: {
            present: {
                type: Number,
                default: 0
            },
            absent: {
                type: Number,
                default: 0
            }
        }
    }],
    is_active: {
        type: Boolean,
        default: true,
    },
    is_deleted: {
        type: Boolean,
        default: false,
    }
});

nonTeachingStaffSchema.pre('save', async function(next) {
    try {
        // const count = await this.constructor.countDocuments();
        // this.nonteachingstaff_id = `staff${String(count + 1).padStart(10, '0')}`;
        const uuid = await generateUUID()
        const sequence = await Sequence.findByIdAndUpdate(
            {_id:"BatchId"},
            { $inc: { seq: 1 } }, 
          { new: true, upsert: true }
          )
        this.uuid = uuid
        this.id = sequence.seq
        next();
    } catch (error) {
        return next(error);
    }
});

export default mongoose.model("NonTeachingStaff", nonTeachingStaffSchema);
