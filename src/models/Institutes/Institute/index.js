import mongoose, { Schema } from "mongoose";
import { Sequence } from "../../common/common.js";
import { generateUUID } from "../../../utils/helpers.js";

const instituteSchema = new mongoose.Schema({
    id: { type: Number },
    uuid: { type: String },
    institute_name: { type: String, unique: true, trim: true, required: true },
    slug: { type: String, lowercase: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    subscription: { type: Schema.Types.ObjectId, ref: "subscriptionsPlans", required: true },
    registered_date: { type: String, default: Date.now },
    contact_info: {
        phone_no: { type: String, validate: { validator: isValidPhoneNumber, message: "Invalid phone number" } },
        alternate_no: { type: String, validate: { validator: isValidPhoneNumber, message: "Invalid phone number" } },
        address: {
            address1: { type: String },
            address2: { type: String },
            state: { type: String },
            city: { type: String },
            pincode: { type: String, validate: { validator: isValidPincode, message: "Invalid pincode" } }
        }
    },
    primary_branch: { type: Schema.Types.ObjectId, ref: "branches" },
    admin : { type : Schema.Types.ObjectId, ref : "InstituteAdmin"},
    branches : [{ type: Schema.Types.ObjectId, ref: "branches"}],
    website: { type: String },
    description: { type: String },
    logo: { type: String },
    image: { type: String, default: null },
    gallery_images: [{ type: String }],
    is_subscription_expired : {  type: Boolean, default: false},
    institute_active_status: {
        type: String,
        default: "Active",
        enum : ["Active","Blocked","Suspended"]
    },
    social_media: {
        twitter_id: { type: String },
        facebook_id: { type: String },
        instagram_id: { type: String },
        linkedin_id: { type: String },
        pinterest_id: { type: String }
    },
    docs : {
      gst : {
        number : { type: String },
        file : { type: String }
      },
      pan : {
        number : { type: String },
        file : { type: String }
      },
      license : {
        number : { type: String },
        file : { type: String }
      }
    },
    Institute_Status:{ type: String, default: "active" },
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
    welocme_mail_sent : { type: Boolean, default: false},
    welocme_mail_sent_at : {type: Date, default: null}
}, { timestamps: true });

async function generateUniqueID() {
    const uuid = await generateUUID();
    const sequence = await Sequence.findByIdAndUpdate(
        { _id: "InstituteId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return { uuid, id: sequence.seq };
}

instituteSchema.pre('save', async function (next) {
    try {
        if (!this.id) {
            const { uuid, id } = await generateUniqueID();
            this.uuid = uuid;
            this.id = id;
        }
        next();
    } catch (error) {
        next(error);
    }
});

function isValidPhoneNumber(value) {
    const phoneRegex = /^\+?\d{1,3}?\d{10}$/;
    return phoneRegex.test(String(value));
}


function isValidPincode(value) {
    const pincodeRegex = /^\d{6}$/;
    return pincodeRegex.test(value);
}

export default mongoose.model('institutes', instituteSchema);
