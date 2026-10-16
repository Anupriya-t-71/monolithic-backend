import mongoose from "mongoose";

const userActivitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'student'
    },
    date: { 
        type: Date,
        required: true
    },
    loginTime: { 
        type: Date,
        required: true
    },
    logoutTime: { 
        type: Date,
       
    }
});

export default mongoose.model('UserActivity', userActivitySchema);
