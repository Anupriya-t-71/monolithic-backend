import Attendance from "../../../../models/Institutes/Attendance/Student/index.js";
import Batch from "../../../../models/Institutes/Batch/index.js"

import { StudentTicket } from "../../../../models/Institutes/Ticket/Ticket.js"
import StudentReportModel from "../../../../models/Institutes/Reports/users/Student.js"
import { InstituteStudent } from "../../../../models/Institutes/Administration/Authorization/index.js"
import OnlineClass from "../../../../models/Institutes/Class/Online_Model.js"
import OfflineClass from "../../../../models/Institutes/Class/Offline_Model.js"
import student_attedence from "../../../../models/Institutes/Attendance/Student/index.js"
import { getInstituteDetailswithUUID, getBranchDetailsWithUUID } from "../../../Institutes/common/index.js";

import PDFDocument from 'pdfkit'
import fs from 'fs'

//
export const getStudentReports = async (req, res) => {
  try {
      const { studentId, year, month } = req.params;
      const { instituteId, branchId } = req.query;

      const institute = await getInstituteDetailswithUUID(instituteId);
      const branch = await getBranchDetailsWithUUID(branchId);

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
          user: studentId,
          institute_id: institute._id,
          branch_id: branch._id,
          date: dateFilter
      });

      const Onlineclass = await OnlineClass.find({
          students: studentId,
          institute: institute._id,
          branch: branch._id,
          start_date: dateFilter
      });
      
      const Offlineclass = await OfflineClass.find({
        students: studentId,
        institute: institute._id,
        branch: branch._id,
        start_date: dateFilter
    });


      const tickets = await StudentTicket.find({
          user: studentId,
          institute: institute._id,
          branch: branch._id,
          date: dateFilter
      });

      const batches = await Batch.find({
          student: studentId,
          institute_id: institute._id,
          branch_id: branch._id,
          start_date: dateFilter
      });

      res.status(200).json({
          success: true,
          attendance,
          Onlineclass,
          Offlineclass,
          tickets,
          batches,
          message: 'Student reports retrieved successfully'
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
    const user_details = await InstituteStudent.findById(user?.userDetail)
    const batch_details = await Batch.findOne({ course: user_details?.course})
    const create_new_report = StudentReportModel.create({
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
    const user_details = await InstituteStudent.findById(user?.userDetail);
    if (!user_details) {
      throw new Error('User details not found');
    }
    
    const currentDate = new Date().toISOString()

    const [onlineClassCount] = await OnlineClass.aggregate([
      {
        $lookup: {
          from: 'batches',
          localField: 'batch',
          foreignField: '_id',
          as: 'batchDetails'
        }
      },
      { $unwind: '$batchDetails' },
      {
        $match: {
          'batchDetails.student': user?._id,
          course: user_details?.course
        }
      },
      {
        $facet: {
          totalCount: [{ $count: 'totalCount' }],
          pendingCount: [{ $match: { start_date: { "$gt": currentDate } } }, { $count: 'pendingCount' }],
          completedCount: [{ $match: { start_date: { "$lt": currentDate } } }, { $count: 'completedCount' }]
        }
      }
    ]);
    
    const online_class = onlineClassCount?.totalCount[0]?.totalCount || 0;
    const pending_online_class = onlineClassCount?.pendingCount[0]?.pendingCount || 0;
    const completed_online_class = onlineClassCount?.completedCount[0]?.completedCount || 0;
    

    const [offlineClassCount] = await OfflineClass.aggregate([
      {
        $lookup: {
          from: 'batches',
          localField: 'batch',
          foreignField: '_id',
          as: 'batchDetails'
        }
      },
      { $unwind: '$batchDetails' },
      {
        $match: {
          'batchDetails.student': user?._id,
          course: user_details?.course
        }
      },
      {
        $facet: {
          totalCount: [{ $count: 'totalCount' }],
          pendingCount: [{ $match: { start_date: { "$gt": currentDate } } }, { $count: 'pendingCount' }],
          completedCount: [{ $match: { start_date: { "$lt": currentDate } } }, { $count: 'completedCount' }]
        }
      }
    ]);
    
    const offline_class = offlineClassCount?.totalCount[0]?.totalCount || 0;
    const pending_offline_class = offlineClassCount?.pendingCount[0]?.pendingCount || 0;
    const completed_offline_class = offlineClassCount?.completedCount[0]?.completedCount || 0;
    
    
    const update_class = await StudentReportModel.findOneAndUpdate(
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
  const tickets = await StudentTicket.countDocuments({ user: user?._id})
  const open_tickets = await StudentTicket.countDocuments({ user: user?._id , status: "opened"})
  const closed_tickets = await StudentTicket.countDocuments({ user: user?._id, status:"closed"})
  const update_class = await StudentReportModel.findOneAndUpdate({ user: user?._id},{
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
    // customized input start date and end date
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const month = now.getMonth();
    const year = now.getFullYear();


    const attendanceRecords = await student_attedence.find({
      "students.student": user?._id,
       createdAt: { $gte: startOfMonth, $lt: endOfMonth },
      // is_active: true,
      // is_delete: false
    });

    const totalDays = attendanceRecords.length;

    const presentDays = attendanceRecords.reduce((count, record) => {
      const studentAttendance = record.students.find(studen => studen.student.equals(user?._id));
      return studentAttendance && studentAttendance.attedence === 'present' ? count + 1 : count;
    }, 0);

    const absentDays = attendanceRecords.reduce((count, record) => {
      const studentAttendance = record.students.find(studen => studen.student.equals(user?._id));
      return studentAttendance && studentAttendance.attedence === 'absent' ? count + 1 : count;
    }, 0);

    const totalWorkingDays = 26;
    const totalPercentage = Math.floor((totalDays / totalWorkingDays) * 100);
    const presentPercentage = Math.floor((presentDays / totalWorkingDays) * 100);
    const absentPercentage = Math.floor((absentDays / totalWorkingDays) * 100);

    const updateAttendance = await StudentReportModel.findOneAndUpdate(
      { 
        user: user?._id, 
        'attendance.month': month, 
        'attendance.year': year 
    },
    {
        $set: {
            'attendance.$[elem].date': now,
            'attendance.$[elem].total.percentage': totalPercentage,
            'attendance.$[elem].total.count': totalDays,
            'attendance.$[elem].present.percentage': presentPercentage,
            'attendance.$[elem].present.count': presentDays,
            'attendance.$[elem].absent.percentage': absentPercentage,
            'attendance.$[elem].absent.count': absentDays
        }
    },
    {
        new: true,
        arrayFilters: [{ "elem.month": month, "elem.year": year }]
    }
    );

    if (!updateAttendance) {
      await StudentReportModel.findOneAndUpdate(
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
        { new: true }
      );
    }

    return updateAttendance;
  } catch (error) {
    console.error("Error updating attendance:", error.message);
    throw new Error(error?.message);
  }
};




export const getStudentStaffReportsController =  async (req,res) => {
    try {
    const userId = req?.user?._id
    let data ;
    let report = await  StudentReportModel.findOne({ user : userId}).populate([{ path: "institute"},{path:"branch"},{path:"batches",populate:{path:"batch"}},{ path: "courses",populate:{path:"course",populate:{path:"category"}}}])
    if(!report){
       report = await ReportProvider(req.user)
    }
    await updateClassProvider(req.user)
    await updateTicketProvider(req.user) 
    await updateAttendanceProvider(req.user)
    let new_report = await  StudentReportModel.findOne({ user : userId}).populate([{ path: "user", select : "-password" },{ path: "institute"},{path:"branch"},{path:"batches",populate:{path:"batch",populate:{path:"classes"}}},{ path: "courses",populate:{path:"course", populate: { path: "category"}}}])
    data = new_report

    // await generatePDF(data)
    
    res.status(200).json({ status: "success", message: "reports retrived successfully", data: data })
    } catch (error) {
      res.status(500).json({ status: 'failed', message: error?.message})  
    }
}

export const getAdvanceFilter=async(req,res)=>{
  try {
    const {userId,startDate,endDate} = req?.user?._id
    let data ;
    let report = await  StudentReportModel.findOne({userId:userId}).populate([{ path: "institute"},{path:"branch"},{path:"batches",populate:{path:"batch"}},{ path: "courses",populate:{path:"course",populate:{path:"category"}}}])
    if(!report){
       report = await ReportProvider(req.user)
    }
    await updateClassProvider(req.user)
    await updateTicketProvider(req.user) 
    await updateAttendanceProvider(req.user)
    let new_report = await  StudentReportModel.findOne({userId:userId,createdAt: { $gte: startDate, $lt: endDate }}).populate([{ path: "user", select : "-password" },{ path: "institute"},{path:"branch"},{path:"batches",populate:{path:"batch",populate:{path:"classes"}}},{ path: "courses",populate:{path:"course", populate: { path: "category"}}}])
    data = new_report

    // await generatePDF(data)
    
    res.status(200).json({ status: "success", message: "reports retrived successfully", data: data })
    } catch (error) {
      res.status(500).json({ status: 'failed', message: error?.message})  
    }
}


