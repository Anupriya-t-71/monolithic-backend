import mongoose from "mongoose";
import { generateUUID } from "../../../utils/helpers.js";
import { Sequence } from "../../common/common.js";

const courseSchema = new mongoose.Schema({
    id: { type: Number },
    uuid: { type: String },
    institute_id: {
        type: mongoose.ObjectId,
        ref: 'institutes',
        require:true
    },
    branch_id: {
        type: mongoose.ObjectId,
        ref: 'branches',
        default:null
    },
    batches:[{
        type: mongoose.ObjectId,
        ref:"batch"
    }],
    category: {
        type: mongoose.ObjectId,
        ref: 'categories',
        require:true,
    },
    coursemodules:[{
        type:mongoose.ObjectId,
        ref:'course_modules',        
    }],
    notes:[{
        type:mongoose.ObjectId,
        ref:'notes',  
    }],
    studymaterials: [{
        type:mongoose.ObjectId,
        ref:'study_materials',default: null
    }],
    videos : [
        { type: mongoose.Types.ObjectId, ref: "course_video"}
    ],
    course_templates : [{ type: mongoose.Types.ObjectId,ref:"course_template"}],
    course_name: {
        type: String,
        trim: true,
        required: true,
    },
    slug: {
        type: String,
        lowercase: true,
    },
    duration: {
        type: String,
        required: true,
    },  
    durationInYears: {
        type: Number,
    },
    durationInMonths: {
        type: Number,
    },
    durationInWeeks: {
        type: Number,
    },
    durationInDays: {
        type: Number,
    },
    actual_price: {
        type: Number,
        required: true,
    },
    current_price: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        enum: [1, 2, 3, 4, 5],
    },
    reviews:{
        type: Number,
        required: true,
    },
    class_type: [{
        type: String,
        enum: ["online", "offline", "hybrid"],
        default: "offline",
        required: true,
    }],
    overview: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    thumbnail : {
       type : String
    },
    is_active: {
        type: Boolean,
        default: true,
    },
    is_deleted: {
        type: Boolean,
        default: false,
    },
},
{
    timestamps: true,
});


courseSchema.index({ institute_id: 1, branch_id: 1, course_name: 1 }, { unique: true });


courseSchema.pre('save', async function(next) {
    try {
        if(this.isNew || this.isModified("course_name")){
            
            const existingCourse = await this.constructor.findOne({
                institute_id: this.institute_id,
                course_name: this.course_name,
                branch_id:this.branch_id
            });
            if (existingCourse && (!this.isNew || existingCourse._id.toString() !== this._id.toString())) {
                const error = new Error('Course with the same institute, category, and name already exists');
                throw error;
            }
        }

        next();
    } catch (error) {
        next(error);
    }
});

courseSchema.pre('save', async function(next) {
    try {
        if (!this.id) {
            const uuid = await generateUUID();
            const sequence = await Sequence.findByIdAndUpdate(
                { _id: "CourseId" },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this.uuid = uuid;
            this.id = sequence.seq;
            next();
        } else {
            next();
        }
    } catch (error) {
        return next(error);
    }
});

const Course = mongoose.model('courses', courseSchema);

export default Course
