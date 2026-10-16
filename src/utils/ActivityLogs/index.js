
// import mongoose from "mongoose"
// import { 
//   InstituteAdminLogs, 
//   InstituteTeachingStaffLog, 
//   InstituteNonTeachingStaffLog, 
//   InstituteStudentLog, 
//   PlatformAdminLog 
// } from "../../models/Institutes/Activity Logs/index.js";

// const loggers = {
//   InstituteAdminLogs,
//   InstituteTeachingStaffLog,
//   InstituteNonTeachingStaffLog,
//   InstituteStudentLog,
//   PlatformAdminLog
// };

export const logActivity = async function (logType, action,user, model, timestamp) {
  // try {
  //   const LogModel = loggers[logType];
  //   if (!LogModel) {
  //     throw new Error('Invalid log type specified');
  //   }
    
  //   const log = new LogModel({
  //     action,
  //     model,
  //     user: mongoose.Types.ObjectId(id),  
  //     timestamp: timestamp || Date.now()
  //   });
    
  //   await log.save();
  // } catch (error) {
  //   console.error('Error logging activity:', error);
  // }
};
