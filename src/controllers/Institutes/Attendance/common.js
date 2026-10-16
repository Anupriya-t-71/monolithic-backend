import student_attedence from "../../../models/Institutes/Attendance/Student/index.js"
import Attendance from "../../../models/Institutes/Attendance/common.js"
import OfflineClass from "../../../models/Institutes/Class/Offline_Model.js"
import OnlineClass from "../../../models/Institutes/Class/Online_Model.js"
import {getInstituteDetailswithUUID,getBranchDetailsWithUUID} from "../common/index.js"


export const createAttendanceController = async (req, res) => {
    try {
        const { institute_id, branch_id, user, date,staff_type } = req.body;
        const institue = await getInstituteDetailswithUUID(institute_id)
        const branch = await getBranchDetailsWithUUID(branch_id)
        if (!date) {
            return res.status(400).send({
                success: false,
                message: 'Please Provide Date',
            });
        }

        const newAttendance = new Attendance({
            institute_id:institue._id, 
            branch_id:branch._id, 
            user,
            date,
            staff_type
        });

        await newAttendance.save();
        const populatedAttendance = await Attendance.find(newAttendance).populate('user')

        res.status(200).send({
            success: true,
            message: 'New Attendance Created Successfully',
            data: populatedAttendance
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

export const updateAttendanceController = async (req, res) => {
    try {
        const { id } = req.params;
        const { institute_id, branch_id, studentAttendance, teachingstaffAttendance, nonteachingstaffAttendance, date } = req.body;

        if (!id) {
            return res.status(400).send({
                success: false,
                message: 'Attendance ID is required',
            });
        }

        if (!date || !institute_id || !branch_id || (!studentAttendance && !teachingstaffAttendance && !nonteachingstaffAttendance)) {
            return res.status(400).send({
                success: false,
                message: 'Please provide institute_id, branch_id, date, and at least one attendance record',
            });
        }

        const checkDuplicateAttendance = async (attendanceRecords, fieldName) => {
            for (const attendanceRecord of attendanceRecords) {
                const field = attendanceRecord[fieldName];
                const existingAttendance = await Attendance.findOne({
                    institute_id,
                    branch_id,
                    [`${fieldName}Attendance.${fieldName}`]: field,
                    date,
                });

                if (existingAttendance) {
                    return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} ${field} in the given institute, branch, and date already exists`;
                }
            }
        };

        if (studentAttendance) {
            const errorMessage = await checkDuplicateAttendance(studentAttendance, 'student');
            if 
            (errorMessage) {
                return res.status(400).send({ success: false, message: errorMessage });
            }
        }

        if (teachingstaffAttendance) {
            const errorMessage = await checkDuplicateAttendance(teachingstaffAttendance, 'teachingstaff');
            if (errorMessage) {
                return res.status(400).send({ success: false, message: errorMessage });
            }
        }

        if (nonteachingstaffAttendance) {
            const errorMessage = await checkDuplicateAttendance(nonteachingstaffAttendance, 'nonteachingstaff');
            if (errorMessage) {
                return res.status(400).send({ success: false, message: errorMessage });
            }
        }

        const updatedAttendance = await Attendance.findByIdAndUpdate(id, {
            institute_id,
            branch_id,
            studentAttendance,
            teachingstaffAttendance,
            nonteachingstaffAttendance,
            date,
        }, { new: true });

        if (!updatedAttendance) {
            return res.status(404).send({
                success: false,
                message: 'Attendance not found',
            });
        }

        res.status(200).send({
            success: true,
            message: 'Attendance updated successfully',
            updatedAttendance,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

export const updateIsPresentFieldController = async (req, res) => {
    try {
        const { id, category, itemid } = req.params;
        const { is_present } = req.body;

        if (!id || !category || !itemid) {
            return res.status(400).json({
                success: false,
                message: 'Attendance ID, category, and item ID are required',
            });
        }

        if (is_present === undefined) {
            return res.status(400).json({
                success: false,
                message: 'is_present field is required',
            });
        }

        let updateField;
        switch (category) {
            case 'student':
                updateField = 'studentAttendance';
                break;
            case 'teachingstaff':
                updateField = 'teachingstaffAttendance';
                break;
            case 'nonteachingstaff':
                updateField = 'nonteachingstaffAttendance';
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid category. Category must be either student, teachingstaff, or nonteachingstaff',
                });
        }

        let filter = { _id: id };
        filter[`${updateField}._id`] = itemid;

        const update = { $set: { [`${updateField}.$.is_present`]: is_present } };
        const options = { new: true };

        const updatedAttendance = await Attendance.findOneAndUpdate(filter, update, options);
        if (!updatedAttendance) {
            return res.status(404).json({
                success: false,
                message: 'Attendance not found',
            });
        }
        res.status(200).json({
            success: true,
            message: `is_present field updated successfully for ${category}`,
            updatedAttendance,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: error.message,
        });
    }
};

export const deleteAttendanceController = async (req, res) => {
    try {
        const { id } = req.params;

        const attendance = await Attendance.findByIdAndUpdate(id, { is_deleted: true });

        if (!attendance) {
            return res.status(404).send({
                success: false,
                message: 'Attendance not found',
            });
        }

        res.status(200).send({
            success: true,
            message: 'Attendance deleted successfully',
            attendance,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

export const getAttendanceController = async (req, res) => {
    try {
        const { _id, bid } = req.query;
        let query = { is_deleted: false };

        if (_id) {
            if (bid) {
                query.institute_id = _id;
                query.branch_id = bid;
            } else {
                query.institute_id = _id;
            }
        }

        if (req.params._id) {
            const attendance = await Attendance.findById(req.params._id, { is_deleted: false })
            .populate('institute_id')
            .populate('branch_id')
            .populate('user')


            if (!attendance) {
                return res.status(404).send({
                    success: false,
                    message: 'Attendance not found',
                });
            }

            return res.status(200).send({
                success: true,
                attendance,
            });
        }

        const attendance = await Attendance.find(query)
        .populate('institute_id')
        .populate('branch_id')
        .populate('user')


        if (!attendance || attendance.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No attendance records found for the provided parameters'
            });
        }

        res.status(200).send({
            success: true,
            message: 'Attendance records retrieved successfully',
            data:attendance
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

export const getAllAttendanceController = async (req, res) => {
    try {
        const attendance = await Attendance.find({ is_deleted: false })
            .populate('institute_id')
            .populate('branch_id')
            .populate('user')

        if (!attendance || attendance.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No attendance records found',
            });
        }

        res.status(200).send({
            success: true,
            message: 'Attendance records retrieved successfully',
            data:attendance,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message,
        });
    }
};


export const getAttendanceByIdController = async (req, res) => {
    try {
        const { _id } = req.params;

        if (!_id) {
            return res.status(400).send({
                success: false,
                message: 'Attendance ID is required',
            });
        }

        const attendance = await Attendance.findById(_id, { is_deleted: false })
            .populate('institute_id')
            .populate('branch_id')
            .populate('user')

        if (!attendance) {
            return res.status(404).send({
                success: false,
                message: 'Attendance not found',
            });
        }

        res.status(200).send({
            success: true,
            message: 'Attendance record retrieved successfully',
            data : attendance,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message,
        });
    }
};