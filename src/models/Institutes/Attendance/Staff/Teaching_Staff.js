import mongoose from "mongoose";
import { Sequence } from "../../../common/common.js";
import { generateUUID } from "../../../../utils/helpers.js";

// Define the schema for teaching staff
const teachingStaffSchema = new mongoose.Schema({
    branch_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'branchs',
        required: true
    },
    teachingstaff_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeachingStaff_Attendance',
        required: true
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
    is_active: {
        type: Boolean,
        default: true
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
});

// Pre-save hook to generate teachingstaff_id
teachingStaffSchema.pre('save', async function(next) {
    try {
        if (!this.teachingstaff_id) {
            // const count = await this.constructor.countDocuments({ branch_id: this.branch_id });
            // this.teachingstaff_id = `staff${String(count + 1).padStart(10, '0')}`;
            const uuid = await generateUUID()
        const sequence = await Sequence.findByIdAndUpdate(
            {_id:"BatchId"},
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

// Create a model for TeachingStaff using the teachingStaffSchema
const TeachingStaff = mongoose.model("TeachingStaff", teachingStaffSchema);

// Define a separate schema for teaching staff attendance
const teachingStaffAttendanceSchema = new mongoose.Schema({
    teachingstaff_id: {
        type: String,
        required: true,
        unique: true,
    },
    date: {
        type: Date,
        required: true
    },
    attendance_status: {
        type: String,
        enum: ['present', 'absent'],
        required: true
    }
});

// Create a model for TeachingStaff_Attendance using the teachingStaffAttendanceSchema
const TeachingStaff_Attendance = mongoose.model("TeachingStaff_Attendance", teachingStaffAttendanceSchema);

export default { TeachingStaff, TeachingStaff_Attendance };
