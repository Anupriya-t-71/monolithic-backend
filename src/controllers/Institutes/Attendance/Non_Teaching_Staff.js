import Attendance from "../../../models/Institutes/Attendance/common.js";
import { Non_TeachingStaff } from "../../../models/Administration/Authorization/index.js";

export const searchNonTeachingStaffAttendanceController = async (req, res) => {
    try {
        const { keyword, instituteid, branchid } = req.params;

        const staffs = await Non_TeachingStaff.find({
            $and: [
                { institute_id: instituteid },
                { branch_id: branchid },
                { is_deleted: false },
                {
                    $or: [
                        { full_name: { $regex: keyword, $options: 'i' } },
                        { username: { $regex: keyword, $options: 'i' } },
                    ],
                },
            ],
        });

        if (!staffs || staffs.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No Non-Teaching Staff found matching the provided keyword.',
            });
        }

        const staffIds = staffs.map(staff => staff._id);

        const results = await Attendance.find({
            institute_id: instituteid,
            branch_id: branchid,
            is_deleted: false,
            'nonteachingstaffAttendance.nonteachingstaff': { $in: staffIds },
        }).populate('nonteachingstaffAttendance.nonteachingstaff').select('-studentAttendance -teachingstaffAttendance');

        if (!results || results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No staff attendance found for the provided criteria.',
            });
        }

        const count = results.length;

        res.json({ count, results });
    } catch (error) {
        console.error('Error in searching staff attendance:', error);
        res.status(500).json({
            success: false,
            message: 'Error in searching staff attendance.',
            error: error.message,
        });
    }
};



export const NonTeachingStaffIsActiveFilterController = async (req, res) => {
    try {
        const { instituteid, branchid } = req.params;
        const { isActive } = req.body

        if (typeof isActive !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'Invalid isActive parameter. It should be a boolean value.',
            });
        }

        const filterArgs = {
            institute_id: instituteid,
            branch_id: branchid,
            is_deleted: false,
            isActive: isActive,
        };

        const nonteachingStaff = await Non_TeachingStaff.find(filterArgs);
        const nonteachingStaffIds = nonteachingStaff.map(staff => staff._id);

        const attendanceFilter = {
            institute_id: instituteid,
            branch_id: branchid,
            is_deleted: false,
            'nonteachingstaffAttendance.nonteachingstaff': { $in: nonteachingStaffIds },
        };

        const attendanceResults = await Attendance.find(attendanceFilter)
            .populate('nonteachingstaffAttendance.nonteachingstaff')
            .select('-studentAttendance -teachingstaffAttendance');

        const count = attendanceResults.length;

        res.status(200).json({
            success: true,
            count,
            attendanceResults,
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while filtering Attendance by isActive TeachingStaff.',
            error: error.message,
        });
    }
};
