import mongoose from "mongoose";
import { Sequence } from "../common/common.js";
import { generateUUID } from "../../utils/helpers.js";

const MasterNotificationSchema = new mongoose.Schema({
        uuid: { type: String},
        title: { type: String, required: true },
        body: { type: String, required: true },
        institute: { type: mongoose.Schema.Types.ObjectId, ref: 'institutes', required: true },
        branch: { type: mongoose.Schema.Types.ObjectId, ref: 'branches', required: true },
        status: { type: String, enum: ['delivered', 'seen','waiting'], default: "delivered" },
        is_active: { type: Boolean, default: true },
        is_delete: { type: Boolean, default: false }
})

MasterNotificationSchema.pre('save', async function (next) {
    try {      
        if (!this.id) {
            const uuid = await generateUUID();
            this.uuid = uuid;
        }
        next();
    } catch (error) {
        next(error);
    }
});

export const MasterNotificationModel = mongoose.model("masterNotificationModel",MasterNotificationSchema)

