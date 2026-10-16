import mongoose from "mongoose";
import student_attedence from "../../../../models/Institutes/Attendance/Student/index.js";
import OfflineClass from "../../../../models/Institutes/Class/Offline_Model.js";
import OnlineClass from "../../../../models/Institutes/Class/Online_Model.js";
import { DefaultFilterQuerys } from "../../../../utils/data.js";
import { FilterQuery } from "../../../../utils/helpers.js";
import { getInstituteDetailswithUUID,getBranchDetailsWithUUID, getUserDetailsWithUUID } from "../../common/index.js";
import moment from "moment";
import { ObjectId } from "mongodb";
import { InstituteUser } from "../../../../models/Institutes/Administration/Authorization/index.js";
import Batch from "../../../../models/Institutes/Batch/index.js";


export const addStudentAttedence = async (data) => {
    try {
     const {institute,branch,students,student_class,classModel} = data 
     const attedence = new student_attedence({institute:institute,branch:branch,students:students,classModel:classModel,student_class:student_class}) 
     await attedence.save()
     return {status:"success"}
    } catch (error) {
     return {status:"failed",message:error?.message}
    }
}

export const getStudentAttedanceDetails = async (req,res) => {
    try {
    const {institute_id,branch_id} = req.query
    const institute = await getInstituteDetailswithUUID(institute_id)
    const branch = await getBranchDetailsWithUUID(branch_id) 
    const querys = FilterQuery(req.query,DefaultFilterQuerys.student_attedence)

    let {page=1,perPage=10} = req.query
    
    const count = await student_attedence.countDocuments({institute:institute?._id,branch:branch?._id})
    const class_details = await student_attedence.find({institute:institute?._id,branch:branch?._id})
    .populate(
      {path:"student_class",
      populate:[
         {path:"batch",populate:{path:"student"}}
      ]
   }).populate({path:"students.student"})
    .skip((page-1)*perPage)
    .limit(perPage)
    .then((data)=>querys?.batch?data.filter((attede)=>attede?.student_class?.batch?._id.toString() ===querys?.batch.toString()):data)
    
    const totalPages = Math.ceil(count/perPage)
    res.status(200).json({status:"sucess",message:"attedence details retrieved successfully",data:class_details,count:count,last_page:totalPages})
    } catch (error) {
      res.status(500).json({status:"failed",message:error?.message})
    }
}

export const MarkStudentAttedence = async (req, res) => {
   try {
       const { attedence_id, student, attedence } = req.body;

       const document = await student_attedence.findOne({
           uuid: attedence_id,
           "students.student": student
       });

       if (!document) {
           return res.status(404).json({ status: "failed", message: "Document or student not found" });
       }

       const mark_attedence = await student_attedence.findOneAndUpdate(
           { uuid: attedence_id, "students.student": student },
           {
               $set: { "students.$.attedence": attedence }
           },
           { new: true }
       );

       res.status(200).json({ status: "success", message: "Attendance added successfully", data: mark_attedence });
   } catch (error) {
       console.error("Error updating attendance: ", error);
       res.status(500).json({ status: "failed", message: error.message });
   }
}

 export const getStudentAttedenceDetailsWithId = async (req,res) => {
    try {
    const {attedenceId} = req.params
    const attedence = await student_attedence.findOne({uuid:attedenceId})  
    .populate({path:"student_class",populate:[{path:"batch",strictPopulate:false,populate:{path:"student_attedence",strictPopulate:false}},{path:"course",strictPopulate:false},{path:"coordinators"},{path:"instructors"}]}).populate({path:"students.student",populate:{path: "userDetail"}})
    
    res.status(200).json({status:"success",message:"student details retrived successfully",data:attedence})
    } catch (error) {
      res.status(500).json({status:"failed",message:error?.message})  
      
    }
 }

 export const getStudentsAttedanceWithClassId = async ( req,res ) => {
    try{
    const {classId} = req.params
    const attendance = await student_attedence.findOne({ student_class : classId })
    .populate({path:"student_class"}).populate({path:"students",populate:{path:"student"}})
    res.status(200).json({ status: "success",message: "class attendance retrived sucessfully",data:attendance})
    }catch(error){
     res.status(200).json({ status: 'failed', message : error?.message})
    }
 }
 
export const updateStudentAttedenceWithClassId = async (req,res) => {
    try {
    const { classId } = req.params
    const data = req.body

    const new_attendance = await student_attedence.findOneAndUpdate({uuid:classId},data,{new:true}) 
    res.status(200).json({status:"success",message:"attendance marked successfully",data:new_attendance})  
    } catch (error) {
      res.status(500).json({ status : "success",message:error?.message})  
    }
}


// const formatAttendanceData = (student_attendance_data ,month) => {
//     const formattedAttendance = {};
//     let totalWorkingDays = 0;
//     let totalPresentDays = 0;
//     let totalAbsentDays = 0;

//     student_attendance_data.forEach(entry => {
//         const startDate = moment(entry.student_class.start_date);
//         const attendanceStatus = entry.students[0].attedence === 'absent' ? 'absent' : 'present';
//         if (startDate.isValid() && startDate.month() === month) {
//             const monthKey = startDate.format('MMMM');

//             if (!formattedAttendance["attendance"]) {
//                 formattedAttendance["attendance"] = [];
//             }

//             formattedAttendance["attendance"].push({
//                 date: startDate.format('YYYY-MM-DD'),
//                 status: attendanceStatus
//             });

//             totalWorkingDays++;

//             if (attendanceStatus === 'present') {
//                 totalPresentDays++;
//             } else {
//                 totalAbsentDays++;
//             }
//         }
//     });

//     return{
//         totalWorkingDays,
//         totalAbsentDays,
//         totalPresentDays,
//         formattedAttendance
//     }
// }

// export const getStudentAttendanceDetailsWithStudentId = async (req,res) => {
//     try{
//     const { studentId } = req.params 
//     const {instituteId,month} = req.query
//     const institute_details = await getInstituteDetailswithUUID(instituteId)    
//     const attendance_details = await student_attedence?.find({institute:institute_details?._id,'students.student':studentId})
//     .populate({path:'student_class'})
//     const data = formatAttendanceData(attendance_details,JSON.parse(month))

//     const onlineClassCount = await OnlineClass.countDocuments({ institute: institute_details?._id });
//     const offlineClassCount = await OfflineClass.countDocuments({ institute: institute_details?._id });


//     res.status(200).json({status:"success",message:"student attendance data retrieved successfully!",data:{...data, onlineClassCount,offlineClassCount}})
//     }catch(error){
//      res.status(500).json({ stauts:"failed",message:error?.message})
//     }
// }



const formatAttendanceData = (student_attendance_data, month) => {
    const formattedAttendance = {};
    let totalWorkingDays = 0;
    let totalPresentDays = 0;
    let totalAbsentDays = 0;
//    console.log(student_attendance_data)
    student_attendance_data.forEach(entry => {
        const startDate = moment(entry?.student_class?.start_date ?? null );

        const attendanceStatus = entry.students[0].attedence === 'absent' ? 'absent' : 'present';
        if (startDate.isValid() && startDate.month() === month) {
            const monthKey = startDate.format('MMMM');

            if (!formattedAttendance["attendance"]) {
                formattedAttendance["attendance"] = [];
            }

            formattedAttendance["attendance"].push({
                date: startDate.format('YYYY-MM-DD'),
                status: attendanceStatus
            });

            totalWorkingDays++;

            if (attendanceStatus === 'present') {
                totalPresentDays++;
            } else {
                totalAbsentDays++;
            }
        }
    });

    return {
        totalWorkingDays,
        totalAbsentDays,
        totalPresentDays,
        formattedAttendance
    };
};

export const getStudentAttendanceDetailsWithStudentId = async (req, res) => {
    try {
        const { studentId } = req.user;
        const { instituteId, month, user, userId ,year} = req.query;

        const startDate = new Date(year,parseInt(month),1).toISOString().split('T')[0]
        const endDate = new Date(year,parseInt(month) + 1,1).toISOString().split('T')[0]

        const institute_details = await getInstituteDetailswithUUID(instituteId);
        const user_details = await InstituteUser.findOne({ uuid: userId })
        
        const attendances = await student_attedence.find({
            institute: institute_details?._id,
            'students.student': user_details?._id
        }).populate({ path: 'student_class' }).populate({path:'classModel'});
        

        const attendance_details = attendances.filter(item => item.student_class.start_date > startDate && item.student_class.start_date <= endDate )
        // console.log("dats  fetched",datas)

        const data = formatAttendanceData(attendance_details, parseInt(month));

        const onlineClasses = await OnlineClass.aggregate([
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
                    'batchDetails.student': req.user._id
                }
            },
            {
                $match:{
                    'start_date':{$gt:startDate,$lte:endDate}
                }
            },
        ]);

        const OfflineClasss = await OfflineClass.aggregate([
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
                    'batchDetails.student': req.user._id
                }
            },
            {
                $match:{
                    'start_date':{$gt:startDate,$lte:endDate}
                }
            },
        ]);
        
        const attendedClassCount = attendance_details.filter(entry => 
            entry.students.some(student => student?.student?.toString()  === req.user._id.toString() && student.attedence === 'present')
        ).length 
        
        const totalWorkingDays = attendance_details.length;

        const totalPresentDays = attendance_details.filter(entry =>
            entry.students.some(student => student.student.toString() === req.user._id.toString() && student.attedence === 'present')
        ).length;

        const totalAbsentDays = attendance_details.filter(entry =>
            entry.students.some(student => student.student.toString() === req.user._id.toString() && student.attedence === 'absent')
        ).length;


        res.status(200).json({
            status: "success",
            message: "Student attendance data retrieved successfully!",
            data: {
                ...data,
                onlineClassCount: onlineClasses.length,
                offlineClassCount: OfflineClasss.length,
                attendedClassCount,
                totalWorkingDays,
                totalPresentDays,
                totalAbsentDays
            }
        });
    } catch (error) {
        console.log(error, "error")
        res.status(500).json({ status: "failed", message: error?.message });
    }
};

export const GetStudentDailyAttandanceDetails= async (req,res) => {
    try {
        const {date} = req.query
        const user = req.user

        const batch = await Batch.find({student:{$in:user?._id}}).populate("classes")

        const classes = []
        batch.forEach((item)=>{
           item.classes.forEach((data)=>{
             if (data.start_date.split('T')[0] == date) {
                classes.push(data)
             }
           })
        })

        res.status(200).json({status:"success",message:"daily classes details fetched",data:classes})
    } catch (error) {
        res.status(500).json({status:"failed",message:error?.message})
    }
}