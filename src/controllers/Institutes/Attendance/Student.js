import { Student } from "../../../models/Administration/Authorization/index.js";
import Attendance from "../../../models/Institutes/Attendance/common.js";
import Batch from "../../../models/Institutes/Batch/index.js";


export const searchStudentAttendanceController = async (req, res) => {
    try {
        const { keyword, instituteid, branchid } = req.params;

        const students = await Student.find({
            $and: [
                { institute_id: instituteid },
                { branch_id: branchid },
                { is_deleted: false },
                {
                    $or: [
                        { first_name: { $regex: keyword, $options: 'i' } },
                        { username: { $regex: keyword, $options: 'i' } },
                    ],
                },
            ],
        });

        if (!students || students.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No students found matching the provided keyword.',
            });
        }

        
        const studentIds = students.map(student => student._id);
    
        const results = await Attendance.find({
            institute_id: instituteid,
            branch_id: branchid,
            is_deleted: false,
            'studentAttendance.student': { $in: studentIds },
        }).populate('studentAttendance.student').select('-teachingstaffAttendance -nonteachingstaffAttendance');

        if (!results || results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No student attendance found for the provided criteria.',
            });
        }

        const count = results.length;

        res.json({ count, results });
    } catch (error) {
        console.error('Error in searching student attendance:', error);
        res.status(500).json({
            success: false,
            message: 'Error in searching student attendance.',
            error: error.message,
        });
    }
};



export const filterStudentAttendanceByBatchController = async (req, res) => {
    try {
        const { instituteid, branchid } = req.params; 
        const { batchName } = req.body;

       
        const batch = await Batch.findOne({ slug: batchName });

        if (!batch) {
            return res.status(404).json({
                success: false,
                message: 'Batch not found.',
            });
        }

       
        const batchId = batch._id;

        const students = await Student.find({
            institute_id: instituteid,
            branch_id: branchid,
            is_deleted: false,
            batch_id: batchId 
        });

        if (!students || students.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No students found in the provided batch.',
            });
        }

      
        const studentIds = students.map(student => student._id);

        const results = await Attendance.find({
            institute_id: instituteid,
            branch_id: branchid,
            is_deleted: false,
            'studentAttendance.student': { $in: studentIds },
        }).populate('studentAttendance.student').select('-teachingstaffAttendance -nonteachingstaffAttendance');

        if (!results || results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No student attendance found for the students in the provided batch.',
            });
        }

        const count = results.length;

        res.json({ count, results });

    } catch (error) {
        console.error('Error in searching student attendance by batch:', error);
        res.status(500).json({
            success: false,
            message: 'Error in searching student attendance by batch.',
            error: error.message,
        });
    }
};
