import mongoose from "mongoose";
import { Sequence } from "../../../common/common.js";
import { generateUUID } from "../../../../utils/helpers.js";

const { Schema } = mongoose;

const TeachingStaffReportSchema = new Schema({
    id: { type: Number },
    uuid: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "Instituteuserlist" },
    institute: { type: Schema.Types.ObjectId, ref: "institutes" },
    branch: { type: Schema.Types.ObjectId, ref: "branches" },
    courses: [
        {
            course: { type: Schema.Types.ObjectId, ref: "courses" }
        }
    ],
    batches: [
        {
            batch: { type: Schema.Types.ObjectId, ref: "batch" }
        }
    ],
    classes: [
        {
            total: { type: Number },
            offline_class: {
                total: { type: Number, default: 0 },
                completed: { type: Number, default: 0 },
                pending: { type: Number, default: 0 }
            },
            online_class: {
                total: { type: Number, default: 0 },
                completed: { type: Number, default: 0 },
                pending: { type: Number, default: 0 }
            }
        }
    ],
    attendance: [
        {
            date: { type: Date, default: Date.now },
            month: { type: Number, default: new Date().getMonth() },
            year: { type: Number, default: new Date().getFullYear() },
            total: { percentage:{type: Number, default: 0},count:{ type: Number, default: 0} },
            present: { percentage: {type: Number, default: 0}, count:{ type: Number, default: 0} },
            absent: { percentage: { type: Number, default: 0 }, total: { type: Number, default: 0} }
        }
    ],
    tickets : {
     total: { type: Number, default: 0},
     opened : { type: Number, default: 0},
     closed : { type: Number, default: 0}
    },
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false }
});

TeachingStaffReportSchema.pre("save", async function(next) {
    if (!this.id) {
        const sequence = await Sequence.findByIdAndUpdate(
            { _id: "TeachingStaffReportId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.id = sequence.seq;
        this.uuid = await generateUUID();
    }
    next();
});

const TeachingStaffReportModel = mongoose.model("TeachingStaffReport", TeachingStaffReportSchema);

export default TeachingStaffReportModel;
