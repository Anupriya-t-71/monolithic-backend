import mongoose from "mongoose";

const dailyAttendanceSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['present', 'absent'],
        required: true
    }
});

const DailyAttendance = mongoose.model("DailyAttendance", dailyAttendanceSchema);

export default DailyAttendance;
