import mongoose, { now } from "mongoose";
import { generateUUID } from "../../../utils/helpers.js";
import { Sequence } from "../../common/common.js";
import moment from "moment";
const { Schema } = mongoose;

const classSchema = new mongoose.Schema({
    id: { type: Number },
    uuid: { type: String },
    institute: {
        type: mongoose.ObjectId,
        ref: 'institutes',
        required: true,
    },
    branch: {
        type: mongoose.ObjectId,
        ref: 'branches',
        required: true,
    },
    batch: {
        type: mongoose.ObjectId,
        ref: 'batch',
        required: true,
    },
    course: {
        type: mongoose.ObjectId,
        ref: 'courses',
        required: true
    },
    teacher:{ 
        type: Schema.Types.ObjectId, 
        ref: 'Teacher', 
        // required: true 
    },
    students: [{ 
        type: Schema.Types.ObjectId,
        ref: 'Student'
     }],
  
    class_name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        lowercase: true,
    },
    start_date: {
        type: String,
        required: true,
    },
    start_time: {
        type: String,
        required: true,
    },
    end_time: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    instructors: [{
        type: mongoose.ObjectId,
        ref: "Instituteuserlist",
        required: true,
    }],
    coordinators: [{
        type: mongoose.ObjectId,
        ref: "Instituteuserlist",
        required: false,
    }],
    study_materials : [{
      file : String,
      title : String,
      description : String,
      is_deleted : { type: Boolean, default: false}
    }],
    notes : [{
     file : String,
     title : String, 
     description : String,
     is_deleted : { type: Boolean, default: false}
    }],
    videos : [{
     url : String,
     is_deleted : { type: Boolean, default: false}
    }],
    is_active: {
        type: Boolean,
        default: true,
    },
    is_deleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

classSchema.pre('save', async function (next) {
    try {

        const existingClass = await mongoose.models.offlineclass.findOne({
            class_name: this.class_name,
            institute: this.institute,
            branch: this.branch,
            batch: this.batch,
            is_deleted : false,
            _id: { $ne: this._id }
        });
    
        if (existingClass) {
            throw new Error('Class name must be unique within the same institute, branch, and batch');
        }
        
        const currentDate = moment().startOf('day');
        const startDate = moment(this.start_date).startOf('day');

        if (startDate.isBefore(currentDate)) {
            throw new Error('Start date cannot be in the past');
        }
        
        //...
        const startDateTime = moment(`${this.start_date} ${this.start_time}`, "YYYY-MM-DD HH:mm");
        const endDateTime = moment(`${this.start_date} ${this.end_time}`, "YYYY-MM-DD HH:mm");
         

        if (endDateTime.isBefore(startDateTime)) {
            throw new Error("End time cannot be before start time");
        }

        this.duration = moment.duration(endDateTime.diff(startDateTime)).asMinutes();

       
        if (!this.id) {
            const uuid = await generateUUID();
            const sequence = await Sequence.findByIdAndUpdate(
                { _id: "OfflineClassId" },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this.uuid = uuid;
            this.id = sequence.seq;
        }
        next();
    } catch (error) {
        return next(error);
    }
});

classSchema.pre('findOneAndUpdate', async function (next) {
    try {
        const update = this.getUpdate();
        const query = this.getQuery();
       
        const currentDoc = await mongoose.models.offlineclass.findOne(query);
    
        const { class_name, start_date,start_time, end_time} = update;
        if(currentDoc?.class_name!==class_name){
            if (class_name) {
                const existingClass = await mongoose.models.offlineclass.findOne({
                    class_name: class_name,
                    institute: currentDoc?.institute,
                    branch: currentDoc?.branch,
                    batch: currentDoc?.batch,
                    is_deleted : false,
                    _id: { $ne: this.getQuery()._id }
                });

                if (existingClass) {
                    throw new Error('Class name must be unique within the same institute, branch, and batch');
                }
            }
        }
       

        if (start_date || start_time || end_time) {
            const currentDate = moment().startOf('day');
            const startDate = moment(start_date || currentDoc.start_date).startOf('day');

            if (startDate.isBefore(currentDate)) {
                throw new Error('Start date cannot be in the past');
            }

            const startDateTime = moment(`${start_date || currentDoc.start_date} ${start_time || currentDoc.start_time}`, "YYYY-MM-DD HH:mm");
            const endDateTime = moment(`${start_date || currentDoc.start_date} ${end_time || currentDoc.end_time}`, "YYYY-MM-DD HH:mm");

            if (endDateTime.isBefore(startDateTime)) {
                throw new Error("End time cannot be before start time");
            }

            update.duration = moment.duration(endDateTime.diff(startDateTime)).asMinutes();
        }

        next();
    } catch (error) {
        return next(error);
    }
});

// setInterval(async()=>{
//     try {
//         const nowDate = new Date().toDateString()
//         console.log(nowDate)  
//         const Doc = await mongoose.models.offlineclass.find({});
//         if(Doc){
//            Doc.forEach(doc=>{
//             //   console.log(doc.start_time)
//            })
//         }

//     } catch (error) {
//         console.log('intervel error:',error)
//     }
// },20000)


const OfflineClass = mongoose.model('offlineclass', classSchema);


export default OfflineClass
