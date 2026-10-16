import mongoose from "mongoose"
import { Sequence } from "../../../common/common.js";
import { generateUUID, getNextNonTeachingStaffRollNo, getNextRollNo, getNextStudentRollNo, getNextTeachingStaffRollNo } from "../../../../utils/helpers.js";
const Schema = mongoose.Schema


const InstituteRolesSchema = new Schema({
    name: { 
        type: String, 
        required: true, 
    },
    institute_id: {
        type: mongoose.ObjectId, 
        ref: "institutes", 
        required: true
    },
    
}, {
    timestamps: true 
});


InstituteRolesSchema.index({ name: 1, institute_id: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });


InstituteRolesSchema.pre('save', async function(next) {
    try {
        const existingRole = await mongoose.model('InstituteRoles').findOne({ 
            name: this.name, 
            institute_id: this.institute_id 
        });

        if (existingRole) {
            throw new Error(`Role name "${this.name}" already exists within this institute.`);
        }

        next();  
    } catch (error) {
        return next(error);  
    }
});

export const InstituteRoles = mongoose.model('InstituteRoles', InstituteRolesSchema);

const InstituteUserSchema = new Schema({
    id: { type: Number },
    uuid: { type: String },
    first_name: { type: String },
    last_name: { type: String },
    password: { type: String, required: true },
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
    
    // roll_id: { type: mongoose.ObjectId, ref: "instituteroles", required: true },
    roll_no: { type: Number },
    full_name: { type: String, required: true },
    institute_id: { type: mongoose.ObjectId, ref: "institutes", required: true },
    branch_id: { type: mongoose.ObjectId, ref: "branches", required: true },
    dob: { type: String, required: true },
    gender: { type: String, required: true },
    qualification: { type: String, required: true },
    contact_info: {
        state: { type: String, required: true },
        city: { type: String, required: true },
        pincode: { type: Number, required: true },
        address1: { type: String},
        address2: { type: String},
        alternate_phone_number : {
            type: String,
            required: true,
            unique: true,
           validate: {
            validator: function(v) {
                return /\d{3}[- ]?\d{3}[- ]?\d{4}/.test(v);
            },
          message: props => `${props.value} is not a valid phone number!`
        }},
        phone_number: {
            type: String,
            required: true,
            unique:true,
            validate: {
            validator: function(v) {
                return /\d{3}[- ]?\d{3}[- ]?\d{4}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
}

        },
        alternate_number: {
            type: String,
           validate: {
            validator: function(v) {
                return /\d{3}[- ]?\d{3}[- ]?\d{4}/.test(v);
            },
    message: props =>` ${props.value} is not a valid phone number!`
}

        },
        
    },
    is_super_user: { type: Boolean, default: false },
    role: { type: mongoose.ObjectId, ref: "institutesroles", required: true },
    user: { type: String },
    is_active: { type: Boolean, default: true },
    is_delete: { type: Boolean, default: false },
    is_two_auth_completed: { type: Boolean, default: false },
    is_email_verified: { type: Boolean, default: false },
    userDetail: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'userModel'
    },
    userModel: {
        type: String,
        enum: ['teachingstaff_login', 'non-teachingstaff_login', 'Student_Login']
    },
    image : {type:String,default:null},
    spoken_english:{
       grammarCompleted: { type: Boolean, default: false },
        grammarTestScore: { type: Number, default: 0 },
        levelScores: { type: Map, of: Number, default: {} },
        unlockedLevels: { type: [String], default: ['Beginner'] },
        unlockedTopics: {
            type: Map,
            of: [String],
            default: {
            Beginner: ['Professional Introduction'],
            Intermediate: [],
            Advanced: [],
            Professional: []
            }
        },
        dailyStreak: { type: Number, default: 0 },
        totalXP: { type: Number, default: 0 },
        achievements: { type: [String], default: [] },
        lastPracticeDate: { type: Date, default: null }
    },
    
    two_auth_completed_at: { type: Date },
    welcome_mail_sent: { type: Boolean, default: false },
    welcome_mail_sent_at: { type: Date, default: null }, 
    first_time_login: { type: Boolean, default: true },
    
});


InstituteUserSchema.pre('save', async function (next) {
    try {
        
        if (!this.roll_no) {
            const nextRollNo = await getNextRollNo();
            this.roll_no = nextRollNo;
        }

       
        if (!this.id) {
            const uuid = await generateUUID();
            const sequence = await Sequence.findByIdAndUpdate(
                { _id: 'InstituteLoginId' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this.uuid = uuid;
            this.id = sequence.seq;
        }

        
        // const role = await InstituteRoles.findOne({
        //     _id: this.role,
        //     institute_id: this.institute_id
        // });
        // console.log(role,"role")
        // if (!role) {
        //     throw new Error(`Role with name "${this.role}" already exists within this institute.`);
        // }

    } catch (error) {
        return next(error);
    }


    if (this.isModified("is_two_auth_completed") && this.is_two_auth_completed) {
        this.two_auth_completed_at = new Date();
    } else if (this.isModified("is_two_auth_completed") && !this.is_two_auth_completed) {
        this.two_auth_completed_at = undefined;
    }

    next();  
});


export const InstituteUser = mongoose.model('Instituteuserlist', InstituteUserSchema);



const InstituteTeachingStaffSchema = new Schema({
    id:{type: Number},
    role: {
        type: mongoose.ObjectId,
        ref: "instituteroles",
        required: true
    },
    roll_no: { type: String },  
    type:{ type: String }, 
    institute_id: {
        type: mongoose.ObjectId,
        ref: "institutes",
        required: true
    },    
    branch_id: {
        type: mongoose.ObjectId,
        ref: "branches",
        required: true
    },
    course: [{
        type: mongoose.ObjectId,
        ref: "courses",
        required: true,
    }],
    designation: {
        type: String,
        required: true
    },
    username:{
        type: String,
        // required: true,
    },
    is_active:{
        type:Boolean,
        default:true,
    },
    is_deleted:{
        type:Boolean,
        default:false,
    }, 
    staffId: {
        type: String,
        unique: true,
        required: true,
        default: ""
    },
    bank_details:{
        bank_name : {
            type: String,
            default: null
        },
        branch : {
            type: String,
            default: null
        },
        IFSC : {
            type: String,
            default: null
        },
        account_number : {
            type: String,
            default: null
        }
    }
}, {
    timestamps: true
});

InstituteTeachingStaffSchema.virtual('institute', {
    ref: 'institutes',
    localField: 'institute_id',
    foreignField: '_id',
    justOne: true
});

InstituteTeachingStaffSchema.virtual('branch', {
    ref: 'branches',
    localField: 'branch_id',
    foreignField: '_id',
    justOne: true
});



InstituteTeachingStaffSchema.pre('save', async function(next) {
    try 
    {
        if (!this.roll_no) {
            const nextRollNo = await getNextTeachingStaffRollNo("TS");
            this.roll_no = nextRollNo;
        }
        const uuid = await generateUUID()
        
        const sequence = await Sequence.findByIdAndUpdate(
            {_id:"TeachingStaffLoginId"},
            { $inc: { seq: 1 } }, 
          { new: true, upsert: true }
          )
        this.uuid = uuid
        this.id = sequence.seq  
        
        // const role = await InstituteRoles.findOne({
        //     _id: this.role,
        //     institute_id: this.institute_id
        // });

        // if (!role) {
        //     throw new Error(`Role with name "${this.role}" already exists within this institute.`);
        // }

        next();
    } catch (error) {
        return next(error);
    }
});


export const InstituteTeaching_Staff = mongoose.model("teachingstaff_login", InstituteTeachingStaffSchema);



const InstituteNon_TeachingStaffSchema = new Schema({
    id:{type: Number},
    uuid: {type: String},
    role: {
        type: mongoose.ObjectId,
        ref: "instituteroles",
        required: true
    },
    roll_no: { type: String },
    type:{ type: String },
    designation: {
        type: String,
        required: true
    },
    institute_id: {
        type: mongoose.ObjectId,
        ref: "institutes",
        required: true,
    },
    username: {
        type: String,
        // required: true,
    },
    branch_id: {
        type: mongoose.ObjectId,
        ref: "branches",
        required: true
    },
    is_active:{
        type:Boolean,
        default:true,
    },
    NonstaffId: {
        type: String,
        unique: true,
        required: true
    },
    is_deleted:{
        type:Boolean,
        default:false,
    }, 
    
}, {
    timestamps: true
});




InstituteNon_TeachingStaffSchema.pre('save', async function(next) {
    try {
        const uuid = await generateUUID()
        if (!this.roll_no) {
            const nextRollNo = await getNextNonTeachingStaffRollNo("NTS");
            this.roll_no = nextRollNo;
        }
        const sequence = await Sequence.findByIdAndUpdate(
            {_id:"NonTeachingStaffLoginId"},
            { $inc: { seq: 1 } }, 
          { new: true, upsert: true }
          )
        this.uuid = uuid
        this.id = sequence.seq
        const role = await InstituteRoles.findOne({
            _id: this.role,
            institute_id: this.institute_id
        });

        if (!role) {
            throw new Error(`Role with name "${this.role}" already exists within this institute.`);
        }

        next();
    } catch (error) {
        return next(error);
    }
});


export const InstituteNon_TeachingStaff =  mongoose.model("non-teachingstaff_login", InstituteNon_TeachingStaffSchema);

const InstituteStudentSchema = new Schema({
    id:{type: Number},
    uuid: {type: String},
    role: {
        type: mongoose.Types.ObjectId,
        ref: "instituteroles",
        required: true
    },
    
        roll_no: { type: Number },
    institute_id: {
        type: mongoose.ObjectId,
        ref: "institutes",
        required: true
    },
    branch_id: {
        type: mongoose.ObjectId,
        ref: "branches",
        required: true
    },
    batch_id: {
        type: mongoose.ObjectId,
        ref: "batch",
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
    is_active:{
        type:Boolean,
        default:true,
    },
    studentId: {
        type: String,
        unique: true,
        default: ""
    },
    is_deleted:{
        type:Boolean,
        default:false,
    }, 
    ongoing_courses: [{
        id: { type: String },
        course: { type: mongoose.Types.ObjectId, ref: 'courses' },
        batch: { type: mongoose.Types.ObjectId, ref: 'batch' },
        start_date: { type: Date },
        end_date: { type: Date },
        
    }],
    completed_courses: [{
        id: { type: String },
        course: { type: mongoose.Types.ObjectId, ref: 'courses' },
        batch: { type: mongoose.Types.ObjectId, ref: 'batch' },
        start_date: { type: Date },
        end_date: { type: Date }
    }],
}, {
    timestamps: true
});




InstituteStudentSchema.pre('save', async function(next) {
    try {
        const uuid = await generateUUID()
        if (!this.roll_no) {
            const nextRollNo = await getNextStudentRollNo("ST"); 
            this.roll_no = nextRollNo;
        }
        const sequence = await Sequence.findByIdAndUpdate(
            {_id:"StudentLoginId"},
            { $inc: { seq: 1 } }, 
          { new: true, upsert: true }
          )
        this.uuid = uuid
        this.id = sequence.seq 

        // const role = await InstituteRoles.findOne({
        //     _id: this.role,
        //     institute_id: this.institute_id
        // });

        // if (!role) {
        //     throw new Error(`Role with name "${this.role}" already exists within this institute.`);
        // }
      

        next();

    } catch (error) {
        return next(error);
    }
});

export const InstituteStudent = mongoose.model('Student_Login', InstituteStudentSchema);




const InstituteOtpSchema = new mongoose.Schema({
    email : { type: String , required : true},
    otp : {type : String , required :true},
    token : {type : String , required : true}, 
    role : { type: Schema.Types.ObjectId, ref: "InstitutesRoles",require: true },
    validated: { type: Boolean, default: false },
    is_active : {type : Boolean ,default : true},
    is_delete : {type : Boolean , default : false},
    createdAt:{type : Date,expires:600,default:Date.now}
})

InstituteOtpSchema.virtual("otp_role",{
    localField:"role",
    foreignField:"_id",
    ref: "InstitutesRoles"
})
 
// InstituteOtpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

export const InstituteOtps = mongoose.model("InstituteOtps",InstituteOtpSchema)


const InstituteTokenSchema = new mongoose.Schema({
    email:{type:String,required:true},
    token:{type:String,required:true},
    createdAt: { type: Date, expires: '1d', default: Date.now },
    uuid: {type:String},
    is_delete : { type: Boolean, default: false }
})

export const InstituteTokens = mongoose.model("InstituteTokens",InstituteTokenSchema)

const idCardSchema = new Schema({
    uuid: {type: String},
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
       },
    institute_id:{
        type:mongoose.ObjectId,
        ref:'institutes',
        required:true,
    },
    branch_id:{
        type:mongoose.ObjectId,
        ref:'branchs',
        required:true,
    },
    batch_id: {
        type: mongoose.ObjectId,
        ref: "batch",
  
    },
    type: {
        type: String,
        enum: ["nonteaching","teaching"]
      },
    role: 
        {   type: mongoose.ObjectId,
            ref: 'InstitutesRoles',
            required: true
        },   
    contact: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    qr_code: {
        type: String,
        required: true
    },
    roll_no:  {        
        type: Number,
    },
    is_active: {
        type: Boolean,
        default: true 
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
});


idCardSchema.pre('save', async function(next) {
    try {       
        const uuid = await generateUUID()
        this.uuid = uuid
    
        
        next();
    } catch (error) {
        return next(error);
    }
});



export const IdCard = mongoose.model('IdCard', idCardSchema);