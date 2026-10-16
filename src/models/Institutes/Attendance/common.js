import mongoose from "mongoose";
import sendNotifications from "../../../config/webpush.js"
import NotificationModel from "../Notification/notificationSubscription.js";

const attendanceSchema = new mongoose.Schema({
    attendance_id:{
        type:String,
    },
    institute_id:{
        type:mongoose.ObjectId,
        ref:'institutes',
        required:true,
    },
    branch_id:{
        type:mongoose.ObjectId,
        ref:'branches',
        required:true,
    },
    date: {
        type: String,
        required:true,
    },
    user: {
        type: mongoose.ObjectId,
        ref: 'Instituteuserlist'
    },
    is_present: {
        type: Boolean,
        default: true
    },
    staff_type: {
        type: String,
        enum: ['teaching_staff', 'non_teaching_staff', 'student'],
        required: true,
    },
       is_deleted:{
        type:Boolean,
        default:false,
    },
},
{
    timestamps:true,
});


attendanceSchema.pre('save', async function(next) {
    try {
        if (this.isNew) {

            const branchCount = await this.constructor.countDocuments({ institute_id: this.institute_id, branch_id: this.branch_id });
                        
            this.attendance_id = `attendance${String(branchCount + 1).padStart(3, '0')}`;
        } 
        
        next();
    } catch (error) {
        return next(error);
    }
});

attendanceSchema.post('update', async function(doc,next) {
    try {
        if(this.is_present == false){
            // send notification that user
        //    const subscription = await NotificationModel.findOne({user:doc.st})
        //    await sendNotifications(payload,subscription)
        }
    } catch (error) {
        
    }
})

export default mongoose.model('allattendance', attendanceSchema);
