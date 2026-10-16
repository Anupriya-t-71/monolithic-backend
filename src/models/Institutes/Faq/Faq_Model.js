import mongoose from "mongoose";
import { Sequence } from "../../common/common.js";
import { generateUUID } from "../../../utils/helpers.js";
import { InstituteUser } from "../Administration/Authorization/index.js";

const faqSchema = new mongoose.Schema(
  {
    id: { type: Number },
    uuid: {
      type: String,
      unique: true,
    },
    category_id: {
      type: mongoose.ObjectId,
      ref: "faqcategories",
      required: true,
    },
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    accessby: {
      type: [String],
      enum: ["Student", "Institute Admin", "Teaching Staff", "Non Teaching Staff"],
      required: true,
    },
    vidlink: {
      type: String,
      trim: true,
    },
    pagelink: {
      type: String,
      trim: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

faqSchema.pre("save", async function (next) {
  try {
    if (!this.id) {
      const uuid = await generateUUID();
      const sequence = await Sequence.findByIdAndUpdate(
        { _id: "FAQ_Model_Id" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.uuid = uuid;
      this.id = sequence.seq;
      next();
    } else {
      next();
    }
  } catch (error) {
    return next(error);
  }
});

export default mongoose.model("faqs", faqSchema);
