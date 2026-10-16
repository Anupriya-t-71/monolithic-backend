import mongoose from "mongoose";
import { generateUUID } from "../../../utils/helpers.js";
import { Sequence } from "../../common/common.js";

const commonNotificationSchema = new mongoose.Schema({
    id: { type: Number },
    uuid: { type: String},
    title: { type: String, required: true },
    body: { type: String, required: true },
    institute: { type: mongoose.Schema.Types.ObjectId, ref: 'institutes', required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'branches', required: true },
    status: { type: String, enum: ['delivered', 'seen'], default: "delivered" },
    is_active: { type: Boolean, default: true },
    is_delete: { type: Boolean, default: false }
});

commonNotificationSchema.pre('save', async function (next) {
    try {
        
        if (!this.id) {
            const uuid = await generateUUID();
            const sequence = await Sequence.findOneAndUpdate(
                { _id: "instituteNotificationId" },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this.id = sequence.seq;
            this.uuid = uuid;
        }
        next();
    } catch (error) {
        next(error);
    }
});

const instituteNotifications = mongoose.model("institute_notifications", commonNotificationSchema);

export default instituteNotifications;
