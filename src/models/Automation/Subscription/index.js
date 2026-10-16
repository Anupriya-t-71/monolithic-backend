import mongoose from "mongoose"
import { generateUUID } from "../../../utils/helpers.js"
import { Sequence } from "../../common/common.js"
const Schema = mongoose.Schema


const subscriptionUpdateSchema = new Schema({
  id: { type: Number },
  uuid: { type: String },
  institute: { type: mongoose.Types.ObjectId, ref: "institutes" },
  newsubscription: { type: mongoose.Types.ObjectId, ref: "subscriptionsplans" },
  reason_for_rejection: { type: String },
  oldsubscriptions: [{
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "subscriptionsplans" },
    identity: { type: String },
    subscription_status:{ type: String }

  },],
  is_readed: { type: Boolean, default: false },
  is_approved: { type: Boolean },
  is_triggered: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  is_deleted: { type: Boolean, default: false },
}, { timestamps: true })


subscriptionUpdateSchema.pre("save", async function (next) {
  try {
    if (!this.id) {
      const uuid = await generateUUID()
      const sequence = await Sequence.findOneAndUpdate({ _id: "subscriptionUpdateRequestId" }, { $inc: { seq: 1 } }, { new: true, upsert: true })
      this.id = sequence.seq
      this.uuid = uuid
      next()
    } else {
      next()
    }
  } catch (error) {
    next(error)
  }
})

const SubscriptionUpdateRequestModle = mongoose.model("subscriptionUpdateRequestModel", subscriptionUpdateSchema)

export default SubscriptionUpdateRequestModle