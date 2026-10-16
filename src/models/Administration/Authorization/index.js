import mongoose from "mongoose"
const Schema = mongoose.Schema 

import { Sequence } from "../../common/common.js";
import { generateUUID } from "../../../utils/helpers.js";

const userSchema = new Schema({
    id:{type: Number},
    uuid: {type: String},
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    username:{type:String},
    password:{
        type : String,
        required : true
    },
        phone_number: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: function(v) {
                    return /\+?\d{1,3}[- ]?\d{3}[- ]?\d{3}[- ]?\d{4}/.test(v);
                },
                message: props => `${props.value} is not a valid phone number!`
            }
        },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /\S+@\S+\.\S+/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    is_super_user:{
     type:Boolean,default:false
    },
    role: {
        type: Number,
        required: true,
    },
    user_group:{
        type:String,
    },
    is_active: {
        type: Boolean,
        default: true
    },
    is_delete : {
        type : Boolean,
        default :false
    },
    is_two_auth_completed: {
        type : Boolean,
        default :false
    },
    is_email_verified: {
        type: Boolean,
        default: false
    },
    image : {
        type:String,
        default:null
    },
    two_auth_completed_at: { type: Date }
});

userSchema.pre("save", async function(next){
    if(!this.id){
    try {
        const uuid = await generateUUID()
        const sequence = await Sequence.findByIdAndUpdate(
            {_id:"UsersId"},
            { $inc: { seq: 1 } }, 
          { new: true, upsert: true }
          )
        this.uuid = uuid
        this.id = sequence.seq
        next()    
    } catch (error) {
       next(error) 
    }

    }else{
        next()
    }
})

export const UserModel = mongoose.model('Users', userSchema);

export const InstituteAdminSchema = new Schema({
        id:{type: Number},
        uuid: {type: String},
        institute_id:{ type: Schema.Types.ObjectId,ref: "institutes",require: true},
        branch : {type : Schema.Types.ObjectId,default:null,ref:"branches"},
        first_name: {
            type: String,
            required: true
        },
        last_name: {
            type: String,
            required: true
        },
        username:{type:String},
        password:{
            type : String,
            required : true
        },
        phone_number: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: function(v) {
                    return /\+?\d{1,3}[- ]?\d{3}[- ]?\d{3}[- ]?\d{4}/.test(v);
                },
                message: props => `${props.value} is not a valid phone number!`
            }
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: function(v) {
                    return /\S+@\S+\.\S+/.test(v);
                },
                message: props => `${props.value} is not a valid email address!`
            }
        }, 
        role: {
            type: Schema.Types.ObjectId,
            required: true, 
            ref: "InstitutesRoles"
        },
        is_active: {
            type: Boolean,
            default: true
        },
        is_delete : {
            type : Boolean,
            default :false
        },
        is_two_auth_completed: {
            type : Boolean,
            default :false
        },
        is_email_verified: {
            type: Boolean,
            default: false
        },
        image : {
            type : String, default : null
        },
        designation : {
            type : String,default:null
        },
        two_auth_completed_at: 
        { type: Date },
        welcome_mail_sent: {
            type: Boolean, default: false 
        },
        welcome_mail_sent_at: { 
            type: Date, default: null 
        },
        first_time_login: {
            type: Boolean, default: true},
        temporaryPassword: {
            type: String
        },    
        tour_status: { 
            type: String,
            enum: ["completed", "pending", "skip"], 
            default: "pending" 
        } // Add TourStatus field
})

InstituteAdminSchema.virtual("InstituteAdmin",{
    ref:"InstitutesRoles",
    localField: "role",
    foreignField: "_id"
})

InstituteAdminSchema.pre("save",async function(next){
    if (!this.id) {
        try {
            const uuid = await generateUUID();
            const sequence = await Sequence.findOneAndUpdate(
                { _id: "InstituteAdmin" },
                { $inc: { seq: 1 } },
                { upsert: true, new: true }
            );
            this.id = sequence.seq;
            this.uuid = uuid;
        } catch (error) {
            return next(error);
        }
    }

    if (this.isModified('is_two_auth_completed') && this.is_two_auth_completed) {
        this.two_auth_completed_at = new Date();
    } else if (this.isModified('is_two_auth_completed') && !this.is_two_auth_completed) {
        this.two_auth_completed_at = undefined;
    }

    next();
})

export const 
    InstituteAdmin = mongoose.model("InstituteAdmin",InstituteAdminSchema)



const StudentSchema = new mongoose.Schema({
    id:{type: Number},
    uuid: {type: String},
    role: {
        type: String,
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
        type: String,
        required: true
    },
    institute_id: {
        type: mongoose.ObjectId,
        ref: "institutes",
        required: true
    },
    branch_id: {
        type: mongoose.ObjectId,
        ref: "branchs",
        required: true
    },
    batch_id: {
        type: mongoose.ObjectId,
        ref: "batch",
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Other"]
    },
    course: {
        type: mongoose.ObjectId,
        ref: "courses",
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    contact_info: {
        state: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        pincode: {
            type: Number,
            required: true
        },
        address1: {
            type: String,
            required: true
        },
        address2: {
            type: String,
            required: true
        },
        phone_number: {
            type: Number,
            required: true,
            validate: {
                validator: function (v) {
                    return /^\d{10}$/.test(v);
                },
                message: props => `${props.value} is not a valid phone number! Please enter a 10-digit mobile number.`
            }
        },
        alternate_phone_number: {
            type: Number,
            required: true,
            validate: {
                validator: function (v) {
                    return /^\d{10}$/.test(v);
                },
                message: props => `${props.value} is not a valid phone number! Please enter a 10-digit mobile number.`
            }
        },
    },
    is_active:{
        type:Boolean,
        default:true,
    },
    is_deleted:{
        type:Boolean,
        default:false,
    },
    tour_status: {
         type: String, 
         enum: ["completed", "pending", "skip"], 
         default: "pending" 
        } // Add TourStatus field 
}, {
    timestamps: true
});


StudentSchema.pre('save', async function(next) {
    try {
        const uuid = await generateUUID()
        const sequence = await Sequence.findByIdAndUpdate(
            {_id:"StudentId"},
            { $inc: { seq: 1 } }, 
          { new: true, upsert: true }
          )
        this.uuid = uuid
        this.id = sequence.seq
        next();
    } catch (error) {
        return next(error);
    }
});

export const Student = mongoose.model('Student', StudentSchema);

const TeachingStaffSchema = new mongoose.Schema({
    id:{type: Number},
    uuid: {type: String},
    roll_id: {
        type: String,
    },
    full_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
        type: String,
        required: true
    },
    institute_id: {
        type: mongoose.ObjectId,
        ref: "institutes",
        required: true
    },    
    branch_id: {
        type: mongoose.ObjectId,
        ref: "branchs",
        required: true
    },
    course: [{
        type: mongoose.ObjectId,
        ref: "courses",
        required: true,
    }],
    // username:{
    //     type: String,
    //     required: true,
    // },   
    dob: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
   
    contact_info: {
        state: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        pincode: {
            type: Number,
            required: true
        },
        address1: {
            type: String,
            required: true
        },
        address2: {
            type: String,
            required: true
        },
        phone_number: {
            type: Number,
            required: true,
            validate: {
                validator: function (v) {
                    return /^\d{10}$/.test(v);
                },
                message: props => `${props.value} is not a valid phone number! Please enter a 10-digit mobile number.`
            }
        },
        alternate_phone_number: {
            type: Number,
            required: true,
            validate: {
                validator: function (v) {
                    return /^\d{10}$/.test(v);
                },
                message: props => `${props.value} is not a valid phone number! Please enter a 10-digit mobile number.`
            }
        },
    },
    is_active:{
        type:Boolean,
        default:true,
    },
    is_deleted:{
        type:Boolean,
        default:false,
    },
    tour_status: {
        type: String, 
        enum: ["completed", "pending", "skip"], 
        default: "pending" 
       } // Add TourStatus field  
}, {
    timestamps: true
});

TeachingStaffSchema.pre('save', async function(next) {
    try {
        const uuid = await generateUUID()
        const sequence = await Sequence.findByIdAndUpdate(
            {_id:"TeachingStaffId"},
            { $inc: { seq: 1 } }, 
          { new: true, upsert: true }
          )
        this.uuid = uuid
        this.id = sequence.seq
        
        next();
    } catch (error) {
        return next(error);
    }
});


export const Teaching_Staff = mongoose.model("teachingstaff", TeachingStaffSchema);


const Non_TeachingStaffSchema = new mongoose.Schema({
    id:{type: Number},
    uuid: {type: String},
    roll_id: {
        type: String,
    },
    full_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    institute_id: {
        type: mongoose.ObjectId,
        ref: "institutes",
        required: true,
    },
    // username: {
    //     type: String,
    //     required: true,
    // },
    branch_id: {
        type: mongoose.ObjectId,
        ref: "branchs",
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Other"]
    },
    qualification: {
        type: String,
        required: true
    },
    contact_info: {
        state: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        pincode: {
            type: Number,
            required: true
        },
        address1: {
            type: String,
            required: true
        },
        address2: {
            type: String,
            required: true
        },
        phone_number: {
            type: Number,
            required: true,
            validate: {
                validator: function (v) {
                    return /^\d{10}$/.test(v);
                },
                message: props => `${props.value} is not a valid phone number! Please enter a 10-digit mobile number.`
            }
        },
        alternate_phone_number: {
            type: Number,
            required: true,
            validate: {
                validator: function (v) {
                    return /^\d{10}$/.test(v);
                },
                message: props => `${props.value} is not a valid phone number! Please enter a 10-digit mobile number.`
            }
        },
    },
    is_active:{
        type:Boolean,
        default:true,
    },
    is_deleted:{
        type:Boolean,
        default:false,
    }, 
}, {
    timestamps: true
});


Non_TeachingStaffSchema.pre('save', async function(next) {
    try {
        const uuid = await generateUUID()
        const sequence = await Sequence.findByIdAndUpdate(
            {_id:"NonTeachingStaffId"},
            { $inc: { seq: 1 } }, 
          { new: true, upsert: true }
          )
        this.uuid = uuid
        this.id = sequence.seq
        
        next();
    } catch (error) {
        return next(error);
    }
});


export const Non_TeachingStaff =  mongoose.model("non-teachingStaff", Non_TeachingStaffSchema);


const OtpSchema = new mongoose.Schema({
    email : { type: String , required : true},
    otp : {type : String , required :true},
    token : {type : String , required : true}, 
    validated: { type: Boolean, default: false },
    is_active : {type : Boolean ,default : true},
    is_delete : {type : Boolean , default : false},
    type : { type: String ,default : null},
    attempt:{type:Number,default:1},
    createdAt:{type : Date,expires:600,default:Date.now()},
    expiryDate:{type: Date, default: () => new Date(Date.now() + 10 * 60 * 1000)}
})

OtpSchema.index({ expiryDate: 1 }, { expireAfterSeconds: 0 });

export const Otps = mongoose.model("Otps",OtpSchema)

const TokenSchema = new mongoose.Schema({
    email:{type:String,required:true},
     token:{type:String,required:true},
     createdAt: { type: Date, expires: '1d', default: Date.now },
   
})

export const    Tokens = mongoose.model("Tokens",TokenSchema)
