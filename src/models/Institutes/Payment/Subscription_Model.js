import mongoose from "mongoose";
import { Sequence } from "../../common/common.js";
import { generateUUID } from "../../../utils/helpers.js";

const featureSchema = new mongoose.Schema({
    feature: {
        type: mongoose.ObjectId,
        ref:"InstituteFeatures",
        required: true
    },
    count: {
        type: mongoose.Mixed, 
        required: true
    }
}, { _id: false });

const subscriptionSchema = new mongoose.Schema({
    id: { type: Number },
    uuid: { type: String },
    instituteId: {
        type: mongoose.ObjectId,
        ref: 'institutes',
        required: true,
    },
    subscriptionId: {
        type: mongoose.ObjectId,
        ref: 'institutesubscriptions',
        required: true,
    },
    features: [featureSchema],
    expirationDate: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    __v: { type: Number, select: false }
},
{
    timestamps: true,
});
subscriptionSchema.pre('save', async function(next) {
    try {
        if(!this.id){
            const uuid = await generateUUID()
            const sequence = await Sequence.findByIdAndUpdate(
                {_id:"SubscriptionId"},
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

export default mongoose.model('subscriptionpayment',subscriptionSchema);
