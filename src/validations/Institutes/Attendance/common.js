import Joi from "joi";

const studentAttendanceSchema = Joi.object({
    student: Joi.string().required(),
    is_present: Joi.boolean().default(false)
});

const teachingStaffAttendanceSchema = Joi.object({
    teachingstaff: Joi.string().required(),
    is_present: Joi.boolean().default(false)
});

const nonTeachingStaffAttendanceSchema = Joi.object({
    nonteachingstaff: Joi.string().required(),
    is_present: Joi.boolean().default(false)
});

const attendanceValidationSchema = Joi.object({
    attendance_id: Joi.string().required(),
    institute_id: Joi.string().required(),
    branch_id: Joi.string().required(),
    date: Joi.string().required(),
    studentAttendance: Joi.array().items(studentAttendanceSchema),
    teachingstaffAttendance: Joi.array().items(teachingStaffAttendanceSchema),
    nonteachingstaffAttendance: Joi.array().items(nonTeachingStaffAttendanceSchema),
    is_deleted: Joi.boolean().default(false)
}).options({ abortEarly: false });

export default attendanceValidationSchema;
