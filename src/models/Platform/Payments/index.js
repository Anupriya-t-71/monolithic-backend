import mongoose from "mongoose";
import { generateUUID } from "../../../utils/helpers.js";
import { Sequence } from "../../common/common.js";
import { getInstituteSubscriptionPaymentSequenceId } from "../../../controllers/Institutes/common/index.js";

const subscriptionHistorySchema = new mongoose.Schema({
  planId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'subscriptionsPlans', 
    required: true 
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { 
    type: Boolean, 
    default: false
  },
  isExpired : {
    type: Boolean, default : true
  }
});

const paymentHistorySchema = new mongoose.Schema({
  paymentId: { 
    type: String, 
    unique: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Completed', 'Failed'], 
    default: 'Pending' 
  },
  paymentMethod: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

const paymentSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  uuid: {
    type: String,
    unique: true,
  },
  paymentId: {
    type: String,
    unique: true,
  },
  institute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'institutes',
    required: true,
  },
  currentSubscriptionPlan: {
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'subscriptionsPlans',
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { 
      type: Boolean, 
      default: true 
    },
  },
  subscriptionHistory: [subscriptionHistorySchema],
  paymentHistory: [paymentHistorySchema],
  // amount: {
  //   type: Number,
  //   required: true,
  // },
  status: {
    type: String,
    enum: ['Active', 'Pending', 'Failed',"Blocked"],
    default: 'Active',
  },
  paymentMethod: {
    type: String,
    required: true,
  }, 
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });


paymentSchema.pre('save', async function (next) {
  try {
    if (!this.id) {
      const uuid = await generateUUID();
     
      const payment_id = await getInstituteSubscriptionPaymentSequenceId()
      const sequence = await Sequence.findOneAndUpdate({ _id : "paymentSequeneceId"},{ $inc: { seq: 1}},{ upsert: true, new: true})
      this.paymentId = payment_id;
      this.id = sequence.seq
      this.uuid = uuid;
      console.log(payment_id,uuid,"this is called dude",this.id,this.paymentId)
      // this.subscriptionHistory.push({
      //   planId: this.currentSubscriptionPlan.planId,
      //   startDate: this.currentSubscriptionPlan.startDate,
      //   endDate: this.currentSubscriptionPlan.endDate,
      //   isActive: true,
      // });

      next();
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
