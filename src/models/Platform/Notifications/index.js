import mongoose from 'mongoose';
import { Sequence } from '../../common/common.js';
import { generateUUID } from '../../../utils/helpers.js';
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  id : {
     type : Number,
     unique : true
  },
  uuid : {
    type: String, 
    unique : true
  },
  instituteId: {
    type: Schema.Types.ObjectId,
    ref: 'institutes',
    required: true
  },
  branch: {
    type: Schema.Types.ObjectId,
    ref: "branches",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'archived'],
    default: 'unread',
    required: true
  },
  type: {
    type: String,
    enum: ['general', 'urgent', 'info'], 
    default: 'general',
  },
  isImportant: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  is_deleted:{
    type:Boolean,
    default:false,
},
}, {
  timestamps: true
});


notificationSchema.pre('save', async function (next) {
 try {
    this.updatedAt = Date.now(); 
    if(!this.id){
       const sequence = await Sequence.findOneAndUpdate({ _id: "PlatformNotificationIds"},{$inc: { seq: 1}},{ new : true, upsert: true})
       const uuid = await generateUUID()
       this.id = sequence.seq
       this.uuid = uuid
       next()
    }else{
        next()
    }
 } catch (error) {
   return next(error)
 }
 
   
});

const InstituteNotification = mongoose.model('Notification', notificationSchema);
export default InstituteNotification;
