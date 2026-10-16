import mongoose from "mongoose";
import { Sequence } from "../../common/common.js";
import { generateUUID } from "../../../utils/helpers.js";




const emiDetailsSchema = new mongoose.Schema({
    course_id: {
        type: String,
    },

    amount: {
        type: Number,
        required: true,
    },
    due_date: {
        type: Date,
        required: true,
    },
    paymentstatus: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending',
    },
    transaction_id: {
        type: Number,
    },
});
const EMI = mongoose.model('EMI', emiDetailsSchema);

const paymentHistorySchema = new mongoose.Schema({
    
    paid_amount: {
        type: Number,
        required: true,
    },
    balance: {
        type: Number, 
        required: true,
    },
    payment_date: {
        type: String,
        required: true,
    },
    transaction_id: {
        type: Number,
        required: true,
    },
    payment_method: {
        type: String,
        enum: ['offline', 'online'],
        default: 'offline',
    },
    duepaymentdate: {
        type: String, 
    },
}, { _id: false });


const studentfeeSchema = new mongoose.Schema({
    id: { type: Number },
    uuid: { type: String },
    institute_id: {
        type: mongoose.ObjectId,
        ref: 'institutes',
        required: true,
    },
    branch_id: {
        type: mongoose.ObjectId,
        ref: 'branches',
    },
    course_name: {
        type: String,
        // ref: 'courses',
    },
    course_id:{
        type:mongoose.ObjectId,
        ref: 'courses'
    },
    course_price:{
        type:Number,
        ref: 'courses'
    },
    batch_id: {
        type: mongoose.ObjectId,
        ref: 'batch',
    },
    student: {
        type: mongoose.ObjectId,
        ref: 'Instituteuserlist',
        required: true,
    },
    total_fee: {
        type: Number, // Add a field to store the total fee for the course
        // required: true,
    },
    paid_amount: {
        type: Number,
        required: true,
    },
    balance: {
        type: Number, 
        required: true,
    },
    is_fullpayment: {
        type: Boolean,
        default: false,
    },
    is_emi: {
        type: Boolean,
        default: false,
    },
    fullpayment_status: {
        type: String,
    },
    payment_date: {
        type: String,
        required: true,
    },
    payment_method: {
        type: String,
        enum: ['offline', 'online'],
        default: 'offline',
    },
    duepaymentdate: {
        type: String, 
    },
    gst: {                 
        type: Number,
        // required: true,
    },
    other_taxes: {
        type: Number,
        // required: true,
    },
    payment_history: [paymentHistorySchema],
    is_active: {
        type: Boolean,
        default: true,
    },
    is_deleted: {
        type: Boolean,
        default: false,
    },
    emi_details: [emiDetailsSchema],

}, {
    timestamps: true,
});


studentfeeSchema.pre('save', async function(next) {
    try {
        if (!this.id) {
            const uuid = await generateUUID();
            const sequence = await Sequence.findByIdAndUpdate(
                { _id: "StudentFeesId" },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this.uuid = uuid;
            this.id = sequence.seq;
            this.balance = this.total_fee - this.paid_amount; // Ensure balance is set properly before saving
            next();
        } else {
            this.balance = this.total_fee - this.paid_amount; // Ensure balance is set properly before saving
            next();
        }
    } catch (error) {
        return next(error);
    }
});

studentfeeSchema.methods.addPayment = async function(paymentDetails) {
    const { paid_amount, payment_date, transaction_id, payment_method, duepaymentdate } = paymentDetails;

    if (this.payment_history.some(payment => payment.transaction_id === transaction_id)) {
        throw new Error('Transaction ID must be unique.');
    }

    const newBalance = this.balance - paid_amount;

    
    this.payment_history.push({
        paid_amount,
        balance: newBalance,
        payment_date,
        transaction_id,
        payment_method,
        duepaymentdate
    });
   
    this.paid_amount += paid_amount;
    this.balance = newBalance;

    if (newBalance < 0) {
        throw new Error('Paid amount exceeds total fee.');
    }

    return this.save(); // Save the updated student fees document
};
export default mongoose.model('studentfees', studentfeeSchema);
