import mongoose from "mongoose";
import { generateUUID } from "../../../utils/helpers.js";
import { Sequence } from "../../common/common.js";

const answerSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instituteuserlist',
    },
    file: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['pending','submitted', 'completed'],
        default: 'pending'
    },
    mark: {
        type: Number,
    },
    remark: {
        type: String,
    },
    completed_at: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });


const taskProjectSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    uuid: {
        type: String
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instituteuserlist',
        required: true
    },
    module: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course_modules',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course',
        required: true
    },
    task_name: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    task_type: {
        type: String,
        enum: ['task', 'project'],
        default: 'task'
    },
    question_file: {
        type: String,
        default: null
    },
    answers: [answerSchema],

    deadline: {
        type: Date,
        default: null
    },
    is_delete: {
        type: Boolean,
        default: false
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

taskProjectSchema.pre('save', async function (next) {
    try {
        if (!this.id) {
            const uuid = await generateUUID();
            const sequence = await Sequence.findByIdAndUpdate(
                { _id: "taskId" },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            )
            this.uuid = uuid;
            this.id = sequence.seq;
        }
        next();
    } catch (error) {
        return next(error);
    }
});

export const TaskProject = mongoose.model('taskproject', taskProjectSchema)