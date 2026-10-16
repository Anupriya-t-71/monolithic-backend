import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
    level: {
        type: String,
        enum: ['info', 'warn', 'error'],
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    stack: {
        type: String,
    },
    endpoint: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Log', logSchema);