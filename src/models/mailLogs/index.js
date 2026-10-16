import mongoose from 'mongoose'


const emailLogSchema = new mongoose.Schema({
    receiver: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    template: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['sent', 'failed'],
        default: 'sent'
    },
    error: {   
        type: Object,
        default: null 
    },
    additionalInfo: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export const EmailLog = mongoose.model('EmailLog', emailLogSchema);






// const mailLogSchema=new mongoose.Schema({
//   recipient: { type: String, required: true }, 
//   subject: { type: String, required: true }, 
//   body: { type: String, required: true },
//   sent_at: { type: Date, default: Date.now }, 
//   status: { type: String, enum: ['sent', 'failed'], default: 'sent' }, 
//   error_message: { type: String, default: null }, 
//   sender_email: { type: String, required: true }, 
//   cc: { type: [String], default: [] }, 
//   bcc: { type: [String], default: [] } 


// })

// export default mongoose.model('mailLog',mailLogSchema)