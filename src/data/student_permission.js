import { v4 as uuidv4 } from "uuid";
const generateUUID = async () => {
    const genUUID = uuidv4();
    return genUUID;
};

const pre_defined_student_permission = [

    {

        "id": 75,
        "identity": "Students",
        "create_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "read_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
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
            "/student-management/students",
            "/student-management/students/add"
        ],
        "role": 3,
        "is_active": true,
        "is_delete": false

    },

    {

        "id": 76,
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
        "role": 3,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 77,
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
        "role": 3,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 78,
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
        "role": 3,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 79,
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
        "role": 3,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 80,
        "identity": "Student Attendances",
        "create_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "read_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_view_student_attendances"
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
        "role": 3,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 81,
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
        "role": 3,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 82,
        "identity": "Student Tickets",
        "create_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_create_student_tickets"
        },
        "read_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "inst_perm_student_ticket_view"
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
        "role": 3,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 83,
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
        "role": 3,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 84,
        "identity": "Student Notifications",
        "create_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "read_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "inst_perm_student_notification_view"
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
        "role": 3,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 85,
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
        "role": 3,
        "is_active": true,
        "is_delete": false

    },
    {
        "id": 86,
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
        "role": 3,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 87,
        "identity": "Study Materials",
        "create_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "read_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_read_institute_study_materials"
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
        "role": 3,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 88,
        "identity": "Course Notes",
        "create_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "read_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_read_institute_course_notes"
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
        "role": 3,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 89,
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
        "role": 3,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 90,
        "identity": "student_idcards",
        "create_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "read_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "inst_perm_student_id_cards_view"
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
        "role": 3,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 91,
        "identity": "Student Fees",
        "create_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "read_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "inst_perm_student_fees_refund_management_view"
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
        "role": 3,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 92,
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
        "role": 3,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 93,
        "identity": "Student Certificates",
        "create_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "read_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "inst_perm_student_certificates_view"
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
        "role": 3,
        "is_active": true,
        "is_delete": false

    },
    {

        "id": 94,
        "identity": "Student_details",
        "create_permission": {
            "permission": "$2a$12$wNgelLieILzlC2AyPBjxzODIrIFQPOqQisqyRt8tducEJTN9ETBJq",
            "code": null
        },
        "read_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_view_student_details"
        },
        "update_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_update_student_details"
        },
        "delete_permission": {
            "permission": "$2a$12$H9pZ8mcflz2hZz6tXJpzZeJbWUPwE.AxcUBiHZtA5v57AgD8gXMOu",
            "code": "can_delete_student_details"
        },
        "urls": [
            "/student-management/students/:id",
            "/student-management/students/:id/edit"
        ],
        "role": 3,
        "is_active": true,
        "is_delete": false

    },
]



const test = async function (roles) {
    const student_permission = [];

    for (const role of roles) {
        const uuid = await generateUUID();
        student_permission.push({ ...role, uuid });
    }

    return student_permission;
};

const student_permission = await test(pre_defined_student_permission);

export default student_permission;