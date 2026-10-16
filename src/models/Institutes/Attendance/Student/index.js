import mongoose from "mongoose";
import { generateUUID } from "../../../../utils/helpers.js";
import { Sequence } from "../../../common/common.js";

const student_attedence_schema = new mongoose.Schema({
    id: { type: Number },
    uuid: { type: String },
    student_class: { type: mongoose.Types.ObjectId, refPath: "classModel" },
    classModel: { type: String, enum: ["offlineclass", "onlineclass"] },
    institute: { type: mongoose.Types.ObjectId, ref: "institutes" },
    branch: { type: mongoose.Types.ObjectId, ref: "branches" },
    students: [{
        id: { type: Number },
        student: { type: mongoose.Types.ObjectId, ref: "Instituteuserlist" },
        attedence: { type: String, enum: ["present", "absent"], default : null },
        in_time: { type: Date, default: null },
        out_time: { type: Date, default: null }
    }]
},{ timestamps: true });

student_attedence_schema.pre("save", async function(next) {
    try {
        if (!this.id) {
            const uuid = await generateUUID();
            const sequence = await Sequence.findOneAndUpdate(
                { _id: "StudentAttedenceId" },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this.uuid = uuid;
            this.id = sequence.seq;
        }
        next();
    } catch (error) {
        next(error);
    }
});

const student_attedence = mongoose.model("student_attedence", student_attedence_schema);


export default student_attedence;
