import { InstituteTeaching_Staff } from "../../../../models/Institutes/Administration/Authorization/index.js"
import Batch from "../../../../models/Institutes/Batch/index.js"
import Attendance from "../../../../models/Institutes/Attendance/common.js";
import OfflineClass from "../../../../models/Institutes/Class/Offline_Model.js"
import OnlineClass from "../../../../models/Institutes/Class/Online_Model.js"
import TeachingStaffReportModel from "../../../../models/Institutes/Reports/users/TeachingStaff.js"
import { TeachingTicket } from "../../../../models/Institutes/Ticket/Ticket.js"
import staff_attedence from "../../../../models/Institutes/Attendance/Staff/index.js"
import mongoose from "mongoose"
import { getBranchDetailsWithUUID, getInstituteDetailswithUUID } from "../../common/index.js";

//


export const getTeacherReports = async (req, res) => {
  try {
      const { teacherId } = req.params;
      const { instituteId, branchId, year, month } = req.query;

      const institute = await getInstituteDetailswithUUID(instituteId);
      const branch = await getBranchDetailsWithUUID(branchId);
   console.log(institute, branch)
      const dateFilter = {};
      if (year) {
          dateFilter.$gte = new Date(year, 0, 1);
          dateFilter.$lte = new Date(year, 11, 31);
      }
      if (month) {
          dateFilter.$gte = new Date(year, month - 1, 1);
          dateFilter.$lte = new Date(year, month, 0);
      }

      const attendance = await Attendance.find({
          user: teacherId,
          institute_id: institute._id,
          branch_id: branch._id,
          date: dateFilter
      });
  

      const tickets = await TeachingTicket.find({
          user: teacherId,
          institute: institute._id,
          branch: branch._id,
          date: dateFilter
      });
      
      const offlineClasses = await OfflineClass.find({
        teacher: teacherId,
        institute: institute._id,
        branch: branch._id,
        start_date: dateFilter
    });

    const onlineClasses = await OnlineClass.find({
        teacher: teacherId,
        institute: institute._id,
        branch: branch._id,
        start_date: dateFilter
    });

      const batches = await Batch.find({
          instructor: teacherId,
          institute_id: institute._id,
          branch_id: branch._id,
          start_date: dateFilter
      });

      res.status(200).json({
          success: true,
          attendance,
          offlineClasses,
          onlineClasses,
          tickets,
          batches,
          message: 'Teacher reports retrieved successfully'
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: 'Something went wrong',
          error: error.message
      });
  }
};

const ReportProvider = async (user) => {
    try {
      console.log(user)
    const user_details = await InstituteTeaching_Staff.findById(user?.userDetail)
    const batch_details = await Batch.findOne({ course: user_details?.course})

    if (!user_details?.course) {
      throw new Error("Course is required for the report");
    }
    console.log(user_details?.course)
    const create_new_report = TeachingStaffReportModel.create({
      institute : user?.institute_id,
      branch : user?.branch_id,
      user : user?._id,
      courses : { course: user_details?.course},
      batches : { batch : batch_details?._id }
    })
    return create_new_report
    } catch (error) {
      throw new Error(error)  
    }
}

const updateClassProvider = async (user) => {
  try {
    const user_details = await InstituteTeaching_Staff.findById(user?.userDetail);
    if (!user_details) {
      throw new Error('User details not found');
    }
    
    const currentDate = new Date().toISOString()
    
    const online_class = await OnlineClass.countDocuments({ course: user_details?.course, instructors:{$in:user?._id} });
    const offline_class = await OfflineClass.countDocuments({ course: user_details?.course, instructors:{$in:user?._id} });
    
    const pending_online_class = await OnlineClass.countDocuments({ course: user_details?.course,instructors:{$in:user?._id}, start_date: { "$gt": currentDate } });
    const pending_offline_class = await OfflineClass.countDocuments({ course: user_details?.course, instructors:{$in:user?._id}, start_date: { "$gt": currentDate } });

    const completed_online_class = await OnlineClass.countDocuments({ course: user_details?.course, instructors:{$in:user?._id}, start_date: { "$lt": currentDate } });
    const completed_offline_class = await OfflineClass.countDocuments({ course: user_details?.course, instructors:{$in:user?._id}, start_date: { "$lt": currentDate } });

    const update_class = await TeachingStaffReportModel.findOneAndUpdate(
      { user: user?._id },
      {
        classes: {
          total: online_class + offline_class,
          online_class: {
            total: online_class,
            completed: completed_online_class,
            pending: pending_online_class,
          },
          offline_class: {
            total: offline_class,
            completed: completed_offline_class,
            pending: pending_offline_class,
          },
        },
      },
      { new: true }
    );

    return update_class;
  } catch (error) {
    throw new Error(error.message);
  }
};


const updateTicketProvider = async (user) => {
  try {
  const tickets = await TeachingTicket.countDocuments({ user: user?._id})
  const open_tickets = await TeachingTicket.countDocuments({ user: user?._id , status: "opened"})
  const closed_tickets = await TeachingTicket.countDocuments({ user: user?._id, status:"closed"})
  const update_class = await TeachingStaffReportModel.findOneAndUpdate({ user: user?._id},{
    tickets:{
      total : tickets,
      opened : open_tickets,
      closed : closed_tickets
    }
  })
  return update_class
  } catch (error) {
    throw new Error(error?.message)
  }
}

const updateAttendanceProvider = async (user) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    

    const attendanceRecords = await staff_attedence.find({
      staff: user?._id,
      date: { $gte: startOfMonth, $lt: endOfMonth },
      is_active: true,
      is_delete: false
    });
    

    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter(record => record.status === 'present').length || 0
    const absentDays = attendanceRecords.filter(record => record.status === 'absent').length || 0

    const totalWorkingDays = 26;
    const totalPercentage = Math.floor((totalDays / totalWorkingDays) * 100) || 0
    const presentPercentage = Math.floor((presentDays / totalDays) * 100) || 0
    const absentPercentage = Math.floor((absentDays / totalDays) * 100) || 0

    const updateAttendance = await TeachingStaffReportModel.findOneAndUpdate(
      { user: user?._id, 'attendance.month': now.getMonth(), 'attendance.year': now.getFullYear() },
      {
        $set: {
          'attendance.$.date': now,
          'attendance.$.total': { percentage: totalPercentage, count: totalDays },
          'attendance.$.present': { percentage: presentPercentage, count: presentDays },
          'attendance.$.absent': { percentage: absentPercentage, count: absentDays }
        }
      },
      { new: true }
    );

    if (!updateAttendance) {
      await TeachingStaffReportModel.findOneAndUpdate(
        { user: user?._id },
        {
          $push: {
            attendance: {
              date: now,
              month: now.getMonth(),
              year: now.getFullYear(),
              total: { percentage: totalPercentage, count: totalDays },
              present: { percentage: presentPercentage, count: presentDays },
              absent: { percentage: absentPercentage, count: absentDays }
            }
          }
        },
        { new: true}
      );
    }
    return updateAttendance;
  } catch (error) {
    console.log(error,"error")
    throw new Error(error?.message);
  }
};



export const getTeachingStaffReportsController =  async (req,res) => {
    try {
    const userId = req?.user?._id
    let data ;
    let report = await  TeachingStaffReportModel.findOne({ user : userId}).populate([{ path: "institute"},{path:"branch"},{path:"batches",populate:{path:"batch"}},{ path: "courses",populate:{path:"course",populate:{path:"category"}}}])
    if(!report){
       report = await ReportProvider(req.user)
    }
    await updateClassProvider(req.user) 
    await updateTicketProvider(req.user) 
    await updateAttendanceProvider(req.user)
    
    let new_report = await  TeachingStaffReportModel.findOne({ user : userId}).populate([{ path: "user", select : "-password" },{ path: "institute"},{path:"branch"},{path:"batches",populate:{path:"batch"}},{ path: "courses",populate:{path:"course", populate: { path: "category"}}}])
    data = new_report
    
    res.status(200).json({ status: "success", message: "reports retrived successfully", data: data })
    } catch (error) {
      console.log(error,"error")
      res.status(500).json({ status: 'failed', message: error?.message})  
    }
}

export const filertReport=async(req,res)=>{
  try {
    const {userId,startDate,endDate} = req?.user?._id
    let data ;
    let report = await  TeachingStaffReportModel.findOne({ user : userId}).populate([{ path: "institute"},{path:"branch"},{path:"batches",populate:{path:"batch"}},{ path: "courses",populate:{path:"course",populate:{path:"category"}}}])
    if(!report){
       report = await ReportProvider(req.user)
    }
    await updateClassProvider(req.user) 
    await updateTicketProvider(req.user) 
    await updateAttendanceProvider(req.user)
    
    let new_report = await  TeachingStaffReportModel.findOne({ user : userId,createdAt: { $gte: startDate, $lt: endDate }}).populate([{ path: "user", select : "-password" },{ path: "institute"},{path:"branch"},{path:"batches",populate:{path:"batch"}},{ path: "courses",populate:{path:"course", populate: { path: "category"}}}])
    data = new_report
    
    res.status(200).json({ status: "success", message: "reports retrived successfully", data: data })
    } catch (error) {
      console.log(error,"error")
      res.status(500).json({ status: 'failed', message: error?.message})  
    }
}
