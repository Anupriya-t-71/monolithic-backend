import mongoose, { mongo } from "mongoose";
import { Sequence } from "../../common/common.js";
import { generateUUID } from "../../../utils/helpers.js";
import { generateTicketId } from "../../common/TicketHelper.js";
import NotificationModel from "../Notification/notificationSubscription.js";
import sendNotifications from "../../../config/webpush.js";
import sendEmail from "../../../Notification/Mail.js";


const TicketSchema = new mongoose.Schema({
    id:{type: Number},
    uuid: {type: String},
    ticket_id: { type: String },
    issue_type:{
        type: String,
        // required: true
    },
    institute:{
        type:mongoose.ObjectId,
        ref:'institutes',
        required:true,
    },
    branch:{
        type:mongoose.ObjectId,
        ref:'branches',
        required:true,
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref : "Instituteuserlist"
    },
    query: {
        type: String,
        required: true
    },
    category : {
        type : String,
        required : true,
    },
    solution : {
      type : String,
      default:null
    },
    description: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        default : Date()
    },
    priority:{
        type: String,
        required: true,
        enum : ["High","Medium","Low","Urgent"],
        default : "Low"
    },
    file : {
       type : String,
       default : null
    },
    status:{
        type: String,
        // required: true,
        enum : ["opened","resolved","closed"],
        default : "opened"
    },
    is_active:{
        type: Boolean,
        default: true
    },
    is_deleted:{
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

TicketSchema.pre('save', async function(next) {
    try {
        if (!this.id) {
            const uuid = await generateUUID();
            const sequence = await Sequence.findByIdAndUpdate(
                { _id: "TicketId" },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );

            this.uuid = uuid;
            this.id = sequence.seq;
            

            if (!this.ticket_id) {
                const ticketData = {
                    institute: this.institute,
                    branch: this.branch,
                    user: this.user
                };
    
                const ticket_id = await generateTicketId(ticketData);
                this.ticket_id = ticket_id;
            }
            next(); 
        }
    } catch (error) {
        next(error); 
    }
});

export default mongoose.model("ticket", TicketSchema);



const TeachingStaffMessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Types.ObjectId, required: true, refPath: 'senderType' },
    content: { type: String, required: true },
    senderType: { 
        type: String, 
        enum: ["InstituteAdmin", "Instituteuserlist"], 
        required: true 
    },
    date: { type: Date, default: Date.now },
}, { timestamps: true });



const TeachingStaffTicketSchema = new mongoose.Schema({
    id:{type: Number},
    uuid: {type: String},
    ticket_id: { type: String },
    issue_type:{
        type: String,
        // required: true
    },
    institute:{
        type:mongoose.ObjectId,
        ref:'institutes',
        required:true,
    },
    branch:{
        type:mongoose.ObjectId,
        ref:'branches',
        required:true,
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref : "Instituteuserlist"
    },
    messages: { type: [TeachingStaffMessageSchema], default: []},
    query: {
        type: String,
        required: true
    },
    category : {
        type : String,
        required : true,
    },
    solution : {
      type : String,
      default:null
    },
    description: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        default : Date()
    },
    priority:{
        type: String,
        required: true,
        enum : ["High","Medium","Low","Urgent"],
        default : "Low"
    },
    file : {
       type : String,
       default : null
    },
    status:{
        type: String,
        // required: true,
        enum : ["opened","resolved","closed"],
        default : "opened"
    },
    is_active:{
        type: Boolean,
        default: true
    },
    is_deleted:{
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

TeachingStaffTicketSchema.pre('save', async function(next) {
    try {
        if (!this.id) {
            const uuid = await generateUUID();
            const sequence = await Sequence.findByIdAndUpdate(
                { _id: "TicketId" },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );

            this.uuid = uuid;
            this.id = sequence.seq;
            

            if (!this.ticket_id) {
                const ticketData = {
                    institute: this.institute,
                    branch: this.branch,
                    user: this.user
                };
    
                const ticket_id = await generateTicketId(ticketData);
                this.ticket_id = ticket_id;
            }
            next(); 
        }
    } catch (error) {
        next(error); 
    }
});

export const TeachingTicket =  mongoose.model("Teachingticket", TeachingStaffTicketSchema);



const StaffTicketSchema = new mongoose.Schema({
    id:{type: Number},
    ticket_id:{type: Number},
    uuid: {type: String},
    issue_type:{
        type: String,
        // required: true
    },
    institute:{
        type:mongoose.ObjectId,
        ref:'institutes',
        required:true,
    },
    branch:{
        type:mongoose.ObjectId,
        ref:'branches',
        required:true,
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref : "Instituteuserlist"
    },
    query: {
        type: String,
        required: true
    },
    solution : {
      type : String,
      default:null
    },
    description: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        default : Date()
    },
    priority:{
        type: String,
        // required: true,
        enum : ["High","Medium","Low"]
    },
    status:{
        type: String,
        // required: true,
        enum : ["opened","resolved","closed"]
    },
    is_active:{
        type: Boolean,
        default: true
    },
    is_deleted:{
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

StaffTicketSchema.pre('save', async function(next) {
    try {
        if(!this.id){
            const uuid = await generateUUID()
        const sequence = await Sequence.findByIdAndUpdate(
            {_id:"StaffTicketId"},
            { $inc: { seq: 1 } }, 
          { new: true, upsert: true }
          )
        this.uuid = uuid
        this.id = sequence.seq
        this.ticket_id = await generateTicketId(this.institute, this.branch, this.user);
        
        next();
        }else{
            next()
        }
    
    } catch (error) {
        return next(error);
    }

});

export const StaffTicket =  mongoose.model("staff_ticket", StaffTicketSchema);

const StudentMessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Types.ObjectId, required: true, refPath: 'senderType' },
    content: { type: String, required: true },
    senderType: { 
        type: String, 
        enum: ["InstituteAdmin", "Instituteuserlist"], 
        required: true 
    },
    date: { type: Date, default: Date.now },
}, { timestamps: true });

const StudentTicketSchema  = new mongoose.Schema({
    id:{type: Number},
    uuid: {type: String},
    ticket_id: { type: String },
    issue_type:{
        type: String,
        // required: true
    },
    institute:{
        type:mongoose.ObjectId,
        ref:'institutes',
        required:true,
    },
    branch:{
        type:mongoose.ObjectId,
        ref:'branches',
        required:true,
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref : "Instituteuserlist"
    },
    query: {
        type: String,
        required: true
    },
    category : {
        type : String,
        required : true,
    },
    solution : {
      type : String,
      default:null
    },
    description: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        default : Date()
    },
    priority:{
        type: String,
        required: true,
        enum : ["High","Medium","Low","Urgent"],
        default : "Low"
    },
    file : {
       type : String,
       default : null
    },
    messages : { type: [StudentMessageSchema], default: [] },
    status:{
        type: String,
        enum : ["opened","resolved","closed"],
        default : "opened"
    },
    is_active:{
        type: Boolean,
        default: true
    },
    is_deleted:{
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

StudentTicketSchema.post('findOneAndUpdate',async function(next){
    try {
        if(this.institute){
            const subscription =  await NotificationModel.findOne({user:this.institute})
             if (subscription) {
                      const payload = JSON.stringify({
                      title:"ticket updated",
                      body: "Vist Ticket Page",
                      data: {
                        url: "http://localhost:3003/student/notifications",
                      },
                    });
                    await sendNotifications(payload,subscription)
                }

        }

         const mailOption = {
          from: process.env.sender_mail,
          to: process.env.reciver_mail,
          subject: "Ticket Updated",
          html: `<h1>Visit oru ticket ${this.status}</h1><p>Lets check our tickets Resoluved</p>`,
        };

        await sendEmail(mailOption)

    } catch (error) {
        console.log(error,"student ticket noti")
    }
})

StudentTicketSchema.post('save',async function(next){
    try {
        if(this.id){
            const subscription =  await NotificationModel.findOne({user:this.user?._id})
             if (subscription) {
                      const payload = JSON.stringify({
                      title:"New Ticket sended",
                      body: "Vist Ticket Page",
                      data: {
                        url: "http://localhost:3003/student/notifications",
                      },
                    });
                    await sendNotifications(payload,subscription)
                }
        }

        const mailOption = {
          from: process.env.sender_mail,
          to: process.env.reciver_mail,
          subject: "New Ticket Created",
          html: `<h1>Visit New ticket ${this.uuid}</h1><p>Let Read and Resolved the ticket</p>`,
        };
        
        await sendEmail(mailOption)
    } catch (error) {
        console.log(error,"student ticket noti")
    }
})

StudentTicketSchema.pre('save', async function(next) {
    try {
        if (!this.id) {
            const uuid = await generateUUID();
            const sequence = await Sequence.findByIdAndUpdate(
                { _id: "TicketId" },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );

            this.uuid = uuid;
            this.id = sequence.seq;
            

            if (!this.ticket_id) {
                const ticketData = {
                    institute: this.institute,
                    branch: this.branch,
                    user: this.user
                };
    
                const ticket_id = await generateTicketId(ticketData);
                this.ticket_id = ticket_id;
            }
            next(); 
        }
    } catch (error) {
        next(error); 
    }
});

export const StudentTicket =  mongoose.model("Student_tickets", StudentTicketSchema);

const MessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Types.ObjectId, required: true, refPath: 'senderType' },
    content: { type: String, required: true },
    senderType: { 
        type: String, 
        enum: ["InstituteAdmin", "Users"], 
        required: true 
    },
    date: { type: Date, default: Date.now },
}, { timestamps: true });

const InstituteAdminTicketSchema = new mongoose.Schema({
    id: { type: String },
    uuid : { type: String },
    ticket_id : { type: String },
    query : { type: String, required: true },
    description : { type: String, required: true },
    date : { type: Date, default: new Date()},
    priority: { type: String, required: true, enum: ["High","Medium","Low","Urgent"], default: "Low" },
    file : { type: String, default: null},
    status: { type: String, enum: ["opened","closed","resolved"],default: "opened"},
    institute : { type: mongoose.Types.ObjectId, ref: "institutes", required: true },
    branch : { type: mongoose.Types.ObjectId, ref: "branch", required: true },
    user : { type: mongoose.Types.ObjectId, ref: "InstituteAdmin", required: true },
    is_active : { type: Boolean, default: true },
    is_deleted : { type: Boolean, default: false },
    solution: { type: String , default: null},
    resolved: { type: Boolean, default: false },
    messages : { type: [MessageSchema], default: [] }
}, { timestamps: true })

InstituteAdminTicketSchema.pre("save",async function(next){
    try {
      if(!this.id){
        const uuid = await generateUUID()
        const sequence = await Sequence.findOneAndUpdate({ _id: "InstituteAdminTicketId" },{ $inc: { seq: 1}},{ new: true, upsert: true})
        this.id = sequence.seq
        this.uuid = uuid
        next()
      }    
    } catch (error) {
      next(error)  
    }
})

export const InstituteAdminTicket = mongoose.model("InstituteAdminTickets",InstituteAdminTicketSchema)