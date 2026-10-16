import { v4 as uuidv4 } from "uuid";
const generateUUID = async () => {
    const genUUID = uuidv4();
    return genUUID;
};

const pre_defined_teacher_permission = [

    {

        "id": 52,
        "identity": "Batches",
        "create_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "read_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_view_batches"
        },
        "update_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "delete_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "urls": [],
        "role": 2,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 53,
        "identity": "Offline Classes",
        "create_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "read_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_view_offline_classes"
        },
        "update_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "delete_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "urls": [],
        "role": 2,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 54,
        "identity": "OfflineClass Details",
        "create_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "read_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_view_offline_class_details"
        },
        "update_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "delete_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "urls": [],
        "role": 2,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 55,
        "identity": "Live Classes",
        "create_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "read_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_view_live_classes"
        },
        "update_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "delete_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "urls": [],
        "role": 2,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 56,
        "identity": "LiveClass Details",
        "create_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "read_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_view_live_classes_details"
        },
        "update_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "delete_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "urls": [],
        "role": 2,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 57,
        "identity": "Student Attendances",
        "create_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_add_student_attendance"
        },
        "read_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_view_student_attendances"
        },
        "update_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_update_student_attendances"
        },
        "delete_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "urls": [],
        "role": 2,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 58,
        "identity": "Student Attendances Details",
        "create_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "read_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_view_student_attendance_details"
        },
        "update_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "delete_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "urls": [],
        "role": 2,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 59,
        "identity": "TeachingStaff Attendances",
        "create_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "read_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_view_teaching_staff_attendance"
        },
        "update_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "delete_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "urls": [],
        "role": 2,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 60,
        "identity": "TeachingStaff Attendance Details",
        "create_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "read_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_view_teaching_staff_attendance_details"
        },
        "update_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "delete_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "urls": [],
        "role": 2,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 61,
        "identity": "staff_tickets",
        "create_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_create_staff_tickets"
        },
        "read_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "inst_perm_staff_ticket_view"
        },
        "update_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "delete_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "urls": [],
        "role": 2,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 62,
        "identity": "Community",
        "create_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "read_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_read_institute_community"
        },
        "update_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "delete_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "urls": [],
        "role": 2,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 63,
        "identity": "Staff Notifications",
        "create_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "read_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_read_institute_staff_notifications"
        },
        "update_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_update_institute_staff_notifications"
        },
        "delete_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "urls": [],
        "role": 2,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 64,
        "identity": "Courses",
        "create_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "read_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_read_institute_course"
        },
        "update_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "delete_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "urls": [],
        "role": 2,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 65,
        "identity": "Course Details",
        "create_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "read_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_read_institute_course_details"
        },
        "update_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "delete_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "urls": [],
        "role": 2,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 66,
        "identity": "Study Materials",
        "create_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_create_institute_study_materials"
        },
        "read_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_read_institute_study_materials"
        },
        "update_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_update_institute_study_materials"
        },
        "delete_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_delete_institute_study_materials"
        },
        "urls": [],
        "role": 2,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 67,
        "identity": "Course Notes",
        "create_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_create_institute_course_notes"
        },
        "read_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_read_institute_course_notes"
        },
        "update_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_update_institute_course_notes"
        },
        "delete_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_delete_institute_course_notes"
        },
        "urls": [],
        "role": 2,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 68,
        "identity": "Course Modules",
        "create_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "read_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_read_institute_course_modules"
        },
        "update_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "delete_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "urls": [],
        "role": 2,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 69,
        "identity": "Staff IdCards",
        "create_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "read_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "inst_perm_staff_id_cards_view"
        },
        "update_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "delete_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "urls": [],
        "role": 2,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 70,
        "identity": "staff_salaries",
        "create_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "read_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "inst_perm_staff_salaries_view"
        },
        "update_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "delete_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "urls": [],
        "role": 2,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 71,
        "identity": "Staff Salary Details",
        "create_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "read_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "inst_perm_staff_salary_details_view"
        },
        "update_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "delete_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "urls": [],
        "role": 2,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 72,
        "identity": "TeachingStaffs",
        "create_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_create_institute_teaching_staffs"
        },
        "read_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_read_institute_teaching_staffs"
        },
        "update_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_update_institute_teching_staffs"
        },
        "delete_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": null
        },
        "urls": [
            "/staff-management/teaching-staffs",
            "/staff-management/teaching-staffs/add"
        ],
        "role": 2,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 73,
        "identity": "Batch Details",
        "create_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "read_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_view_batch_details"
        },
        "update_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "delete_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "urls": [
            "/batch-management/batches/:id"
        ],
        "role": 2,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 74,
        "identity": "TeachingStaff Details",
        "create_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_create_staff_details"
        },
        "read_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_view_staff_details"
        },
        "update_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_update_staff_details"
        },
        "delete_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_delete_staff_details"
        },
        "urls": [
            "/staff-management/teaching-staffs/:id",
            "/staff-management/teaching-staffs/:id/edit"
        ],
        "role": 2,
        "is_active": true,
        "is_delete": false

    },
]

const test = async function (roles) {
    const teacher_permission = [];

    for (const role of roles) {
        const uuid = await generateUUID();
        teacher_permission.push({ ...role, uuid });
    }

    return teacher_permission;
};

const teacher_permission = await test(pre_defined_teacher_permission);

export default teacher_permission;