

const institutePermissionCodes = [
    {
      identity: 'dashboard',
      create: null,
      read: 'can_read_dashboard',
      update: null,
      delete: null,
      urls:[{name:"read",code:'/dashboard'}]
    },
    {
      identity: 'Branches',
      create: 'can_create_branches',
      read: 'can_read_branches',
      update: 'can_update_branches',
      delete: 'can_delete_branches',
      urls:[{name:"read",code:"/branch-management/branches"}]
    },
    {
      identity: 'Branch Details',
      create: 'can_create_branch_details',
      read: 'can_read_branch_details',
      update: 'can_update_branch_details',
      delete: 'can_delete_branch_details',
      urls : [{name:"read",code:'/branch-management/branches/:id'}]
    },
    {
      identity: 'Groups',
      create: 'can_create_institute_group',
      read: 'can_read_institute_group',
      update: 'can_update_institute_group',
      delete: 'can_delete_institute_group',
      urls : [{name:"read",code:"/user-management/groups"},{name:"create",code:"/user-management/groups/add"},{name:"update",code:"/user-management/groups/:id/edit"}]
    },
    {
      identity: 'Group Details',
      create: null,
      read: 'can_read_institute_group_details',
      update: null,
      delete: null,
      urls : [{name:"read",code:'/user-management/groups/:id'}]
    },
    {
      identity: 'Users',
      create: 'can_create_institute_user',
      read: 'can_read_institute_user',
      update: 'can_update_institute_user',
      delete: 'can_delete_institute_user',
      urls:[{name:"read",code:"/user-management/admin-users"}]
    },
    {
      identity: 'User Details',
      create: null,
      read: 'can_read_institute_user_details',
      update: 'can_update_institute_user_details',
      delete: null,
      urls : [{name:"read",code:"/user-management/admin-users/:id"}]
    },
    {
      identity: 'Categories',
      create: 'can_create_institute_category',
      read: 'can_read_institute_category',
      update: 'can_update_institute_category',
      delete: 'can_delete_institute_category',
      urls : [{name:"read",code:"/course-management/categories"}]
    },
    {
      identity: 'Courses',
      create: 'can_create_institute_course',
      read: 'can_read_institute_course',
      update: 'can_update_institute_course',
      delete: null,
      urls : [{name:"read",code:'/course-management/courses'},{name:"create",name:'/course-management/courses/add',}]
    },
    {
      identity: 'Course Details',
      create: null,
      read: 'can_read_institute_course_details',
      update: 'can_update_institute_course_details',
      delete: 'can_delete_institute_course_details',
      urls : [{name : "read",code:"/course-management/courses/:id"},{name:"update",code:"/course-management/courses/:id/edit"}]
    },
    {
      identity: 'Study Materials',
      create: 'can_create_institute_study_materials',
      read: 'can_read_institute_study_materials',
      update: 'can_update_institute_study_materials',
      delete: 'can_delete_institute_study_materials',
      urls: [{name:"read",code:"/content-management/study-materials"}]
    },
    {
      identity: 'Course Notes',
      create: 'can_create_institute_course_notes',
      read: 'can_read_institute_course_notes',
      update: 'can_update_institute_course_notes',
      delete: 'can_delete_institute_course_notes',
      urls : [{name:"read",code:"'/content-management/course-notes'"}]
    },
    {
      identity: 'Course Modules',
      create: 'can_create_institute_course_modules',
      read: 'can_read_institute_course_modules',
      update: 'can_update_institute_course_modules',
      delete: 'can_delete_institute_course_modules',
      urls : [{name:"read",code:"'/content-management/course-modules'"}]
    },
    {
      identity: 'TeachingStaffs',
      create: 'can_create_institute_teaching_staffs',
      read: 'can_read_institute_teaching_staffs',
      update: 'can_update_institute_teching_staffs',
      delete: null,
      urls : [{name:"create",code:"'/staff-management/teaching-staffs/add'"},{name:"read",code:"'/staff-management/teaching-staffs'"}]
    },
    {
      identity: 'TeachingStaff Details',
      create: 'can_create_staff_details',
      read: 'can_view_staff_details',
      update: 'can_update_staff_details',
      delete: 'can_delete_staff_details',
      urls : [{name:"read",code:"/staff-management/teaching-staffs/:id"},{name:"update",code:"/staff-management/teaching-staffs/:id/edit"}]
    },
    {
      identity: 'Non TeachingStaffs',
      create: 'can_create_non_teaching_staffs',
      read: 'can_view_non_teaching_staffs',
      update: 'can_update_non_teaching_staffs',
      delete: undefined,
      urls : [{name:"create",code:"/staff-management/non-teaching-staffs/add"},{name:"read",code:"/staff-management/non-teaching-staffs"}]
    },
    {
      identity: 'Non TeachingStaff Details',
      create: 'can_create_non_teaching_staff_details',
      read: 'can_view_non_teaching_staff_details',
      update: 'can_update_non_teaching_staff_details',
      delete: 'can_delete_non_teaching_staff_details',
      urls : [{name:"read",code:"/staff-management/non-teaching-staffs/:id"},{name:"update",code:"/staff-management/non-teaching-staffs/:id/edit"}]
    },
    {
      identity: 'Students',
      create: 'can_create_students',
      read: 'can_view_students',
      update: 'can_update_student_status',
      delete: undefined,
      urls : [{name:"create",code:"/student-management/students/add"},{name:"read",code:"/student-management/student"}]
    },
    {
      identity: 'Student Details',
      create: null,
      read: 'can_view_student_details',
      update: 'can_update_student_details',
      delete: 'can_delete_student_details',
      urls : [{name:"read",code:"/student-management/students/:id"},{name:"update",code:"/student-management/students/:id/edit"}]
    },
    {
      identity: 'Batches',
      create: 'can_create_batches',
      read: 'can_view_batches',
      update: 'can_update_batches',
      delete: 'can_delete_batches',
      urls : [{name:"read",code:"/batch-management/batches"},{name:"create",code:"/batch-management/batches/add"},{name:"update",code:"/batch-management/batches/:id/edit"}]
    },
    {
      identity: 'Batch Details',
      create: null,
      read: 'can_view_batch_details',
      update: null,
      delete: null,
      urls : [{name:"read",code:"/batch-management/batches/:id"}]
    },
    {
      identity: 'Offline Classes',
      create: 'can_create_offline_classes',
      read: 'can_view_offline_classes',
      update: 'can_update_offline_classes',
      delete: 'can_delete_offline_classes',
      urls : [{name:"read",code:"/class-management/offline-classes"}]
    },
    {
      identity: 'OfflineClass Details',
      create: null,
      read: 'can_view_offline_class_details',
      update: null,
      delete: null,
      urls : [{name:"read",code:"/class-management/offline-classes/:id"}]
    },
    {
      identity: 'Live Classes',
      create: 'can_create_live_classes',
      read: 'can_view_live_classes',
      update: 'can_update_live_classes',
      delete: 'can_delete_live_classes',
      urls : [{name:"read",name:"'/class-management/live-classes'"}]
    },
    {
      identity: 'LiveClass Details',
      create: null,
      read: 'can_view_live_classes_details',
      update: null,
      delete: null,
      urls : [{name:'read',code:"/class-management/live-classes/:id"}]
    },
    {
      identity: 'Student Attendances',
      create: null,
      read: 'can_view_student_attendances',
      update: 'can_update_student_attendances',
      delete: null,
      urls : [{name:"read",code:"/attendance-management/student-attendances"}]
    },
    {
      identity: 'Student Attendances Details',
      create: null,
      read: 'can_view_student_attendance_details',
      update: null,
      delete: null,
      urls : [{name:"read",code:"'/attendance-management/student-attendances/:id'"}]
    },
    {
      identity: 'TeachingStaff Attendances',
      create: null,
      read: 'can_view_teaching_staff_attendance',
      update: null,
      delete: null,
      urls : [{name:"read",code:"/attendance-management/teaching-staff-attendances"}]
    },
    {
      identity: 'TeachingStaff Attendance Details',
      create: "can_create_teaching_staff_attedence_details",
      read: 'can_view_teaching_staff_attendance_details',
      update: "can_update_teaching_staff_attedence_details",
      delete: 'can_delete_tecahingstaff_attedence_details',
      urls : [{name:"read",code:"/attendance-management/teaching-staff-attendances/:id"}]
    },
    {
      identity: 'NonTeachingStaff Attendances',
      create: "can_create_non_teaching_staff_attedence",
      read: 'inst_perm_non_teaching_staff_attendance_view',
      update: "inst_perm_non_teaching_staff_attendance_update",
      delete: 'can_delete_non_tecahingstaff_attedence',
      urls : [{name:"read",code:"/attendance-management/non-teaching-staff-attendances"}]
    },
    {
      identity: 'non_teaching_staff_attendance_details',
      create: "can_create_non_teaching_staff_attedence",
      read: 'can_view_non_teaching_staff_attendance',
      update: 'can_update_non_teaching_staff_attendance',
      delete: "can_delete_non_teaching_staff_attedence",
      urls : [{name:"read",code:"/attendance-management/non-teaching-staff-attendances"}]
    },
    {
      identity: 'Fees',
      create: 'inst_perm_student_fees_payment_management_create',
      read: 'inst_perm_student_fees_payment_management_view',
      update: 'inst_perm_student_fees_payment_management_update',
      delete: 'inst_perm_student_fees_payment_management_delete',
      urls : [{name:"read",code:'/payment-management/student-fees'}]
    },
    {
      identity: 'student_fee_details',
      create: "can_create_student_fee_details",
      read: 'inst_perm_student_fees_details_payment_management_view',
      update: "can_update_student_fee_details",
      delete: "can_delete_student_fee_details",
      urls : []
    },
    {
      identity: 'staff_salaries',
      create: 'inst_perm_staff_salaries_create',
      read: 'inst_perm_staff_salaries_view',
      update: 'inst_perm_staff_salaries_update',
      delete: 'inst_perm_staff_salaries_delete',
      urls : [{name:"read",code:"/payment-management/staff-salaries"}]
    },
    {
      identity: 'Staff Salary Details',
      create: "can_create_staff_salary_details",
      read: 'inst_perm_staff_salary_details_view',
      update: "can_udpate_staff_salary_details",
      delete: "can_delete_staff_salary_details",
      urls : []
    },
    {
      identity: 'Subscriptions',
      create: null,
      read: 'inst_perm_subscriptions_view',
      update: 'inst_perm_subscriptions_update',
      delete: null,
      urls : [{name:'read',code:"/payment-management/subscriptions"}]
    },
    {
      identity: 'Subscription Details',
      create: null,
      read: 'inst_perm_subscription_details_view',
      update: null,
      delete: null,
      urls : []
    },
    {
      identity: 'Student Fees',
      create: 'inst_perm_student_fees_refund_management_create',
      read: 'inst_perm_student_fees_refund_management_view',
      update: 'inst_perm_student_fees_refund_management_update',
      delete: 'inst_perm_student_fees_refund_management_delete',
      urls : [{name:"read",code:"/refund-management/student-fees"}]
    },
    {
      identity: 'Student Fee Details',
      create: "can_create_student_fee_details",
      read: 'inst_perm_student_fees_details_refund_management_view',
      update: "can_udpate_student_fee_details",
      delete: "can_delete_student_fee_details",
      urls:[]
    },
    {
      identity: 'Student Notifications',
      create: 'inst_perm_student_notification_create',
      read: 'inst_perm_student_notification_view',
      update: "can_udpate_student_notifications",
      delete: "can_delete_student_notifications",
      urls : [{name:"read",code:"/notification-management/student-notifications"}]
    },
    {
      identity: 'All Notifications',
      create: 'inst_perm_all_notification_create',
      read: 'inst_perm_all_notification_view',
      update: "can_update_all_notifications",
      delete: "can_delete_all_notifications",
      urls : [{name:"read",code:"/notification-management/all-notifications"}]
    },
    {
      identity: 'Student Certificates',
      create: 'inst_perm_student_certificates_create',
      read: 'inst_perm_student_certificates_view',
      update: 'inst_perm_student_certificates_update',
      delete: 'inst_perm_student_certificates_delete',
      urls : [{name:'read',code:"/certificate-management/student-certificates"}]
    },
    {
      identity: 'Student Certificate Details',
      create: "can_create_student_certificates_details",
      read: 'inst_perm_student_certificates_details_view',
      update: "can_update_student_certificate_details",
      delete: "can_delete_student_certificate_details",
      urls : []
    },
    {
      identity: 'Staff IdCards',
      create: "can_create_staff_idcards",
      read: 'inst_perm_staff_id_cards_view',
      update: 'inst_perm_staff_id_cards_update_status',
      delete: "can_delete_staff_id_cards",
      urls : [{name:"read",code:'/id-card-management/staff-id-cards'}]
    },
    {
      identity: 'Help Faqs',
      create: "can_create_help_faqs",
      read: 'inst_help_faqs_support_view',
      update: 'can_update_help_faqs',
      delete: "can_delete_help_faqs",
      urls : [{name:"read",code:"/help-center/help-faqs"}]
    },
    {
      identity: 'Faq Categories',
      create: 'can_create_institute_faq_categories',
      read: 'can_read_institute_faq_categoreis',
      update: 'can_update_institute_faq_categories',
      delete: 'can_delete_institute_faq_categories',
      urls : [{name:"read",code:"faq-management/faq-categories"}]
    },
    {
      identity: 'Faqs',
      create: 'can_create_institute_faqs',
      read: 'can_read_institute_faqs',
      update: 'can_update_institute_faqs',
      delete: 'can_delete_institute_faqs',
      urls : [{name:"read",code:"faq-management/faqs"}]
    },
    {
      identity: 'Community',
      create: "can_create_institute_community",
      read: 'can_read_institute_community',
      update: "can_update_institute_community",
      delete: 'can_delete_institute_community',
      urls : [{name:"read",code:"/community-management/communities"}]
    },
    {
      identity: 'Student IdCards',
      create: "can_create_students_idcards",
      read: 'can_read_institute_student_id_cards',
      update: 'can_update_institute_student_id_cards',
      delete: "can_delete_student_idcards",
      urls : []
    },
    {
      identity: 'Staff Notifications',
      create: "can_create_staff_notifications",
      read: 'can_read_institute_staff_notifications',
      update: 'can_update_institute_staff_notifications',
      delete: "can_delete_notifications",
      urls : [{name:"read",code:"/notification-management/staff-notifications"}]
    },
    {
      identity: 'Student Tickets',
      create: "can_create_student_tickets",
      read: 'inst_perm_student_ticket_view',
      update: 'inst_perm_student_ticket_resolve',
      delete: 'can_delete_student_tickets',
      urls : [{name:"read",code:"/ticket-management/student-tickets"}]
    },
    {
      identity: 'staff_tickets',
      create: "can_create_staff_tickets",
      read: 'inst_perm_staff_ticket_view',
      update: 'inst_perm_staff_ticket_resolve',
      delete: "can_delete_staff_tickets",
      urls : [{name:"read",code:'/ticket-management/staff-tickets'}]
    },
    {
      identity: 'student_idcards',
      create: "can_create_student_idcards",
      read: 'inst_perm_student_id_cards_view',
      update: 'inst_perm_student_id_cards_update_status',
      delete: "delete_student_idcards",
      urls : [{name:'read',code:'/id-card-management/student-id-cards'}]
    }
  ]

  export default institutePermissionCodes