import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'student'
        },
     loginTime: { 
       type: Date,
       required: true
     },
     logoutTime: {
        type: Date
        },
},
{
    timestamps:true,
})


export default mongoose.model('session',sessionSchema);
