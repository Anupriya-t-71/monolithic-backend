import mongoose from 'mongoose';

const DeveloperLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'devusers', required: true },
  action: { type: String, required: true },
  model: { type: String, required: true },
  title: { type: String, required: true },
  details: { type: Object },
  timestamp: { type: Date, default: Date.now },
});

export const DeveloperLog = mongoose.model('DeveloperLog', DeveloperLogSchema);
