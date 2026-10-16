import { v4 as uuidv4 } from "uuid";
const generateUUID = async () => {
  const genUUID = uuidv4();
  return genUUID;
};
const predefined_features = [
  {
    id: 6,
    identity: "Categories",
    category: "admin",

    description: "Categories management",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 9,
    identity: "Branch Details",
    category: "admin",
    description: "Details of a branch",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 10,
    identity: "Course Notes",
    category: "teacher",
    description: "Notes related to courses",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 13,
    identity: "Branches",
    category: "admin",
    description: "Branches management",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 15,
    identity: "Students",
    category: "student",
    description: "Students management",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 22,
    identity: "Live Classes",
    category: "teacher",
    description: "Live classes management",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 24,
    identity: "Student Attendances",
    category: "student",
    description: "Student attendance management",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },

  {
    id: 26,
    identity: "Study Materials",
    category: "teacher",
    description: "Study materials management",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },

  {
    id: 30,
    identity: "non_teaching_staff_attendance_details",
    category: "admin",

    description: "Details of non-teaching staff attendance",
    category: "admin",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },

  {
    id: 27,
    identity: "TeachingStaff Details",
    category: "teacher",
    description: "Details of a teaching staff member",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 16,
    identity: "Non TeachingStaff Details",
    category: "admin",
    description: "Details of a non-teaching staff member",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 23,
    identity: "LiveClass Details",
    category: "teacher",
    description: "Details of a live class",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 44,
    identity: "TeachingStaff Attendance Details",
    category: "teacher",
    description: "Details of teaching staff attendance",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 32,
    identity: "staff_salaries",
    category: "admin",
    description: "Staff salaries management",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 35,
    identity: "Subscriptions",
    category: "admin",
    description: "Subscriptions management",
    permission: [
      {
        name: "read",
      },
      {
        name: "update",
      },
    ],
  },
  {
    id: 25,
    identity: "Student Attendances Details",
    category: "student",
    description: "Details of student attendance",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 36,
    identity: "Staff Salary Details",
    category: "admin",

    description: "Details of staff salaries",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 34,
    identity: "Student Notifications",
    category: "student",

    description: "Student notifications management",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 41,
    identity: "student_idcards",
    category: "student",

    description: "Student ID cards management",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 42,
    identity: "Staff IdCards",
    category: "admin",
    description: "Staff ID cards management",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 19,
    identity: "Batch Details",
    category: "teacher",
    description: "Details of a batch",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 49,
    identity: "Faq Categories",
    category: "admin",
    description: "Categories of FAQs",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 2,
    identity: "Groups",
    category: "admin",
    description: "Groups management",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 3,
    identity: "Group Details",
    category: "admin",
    description: "Details of a group",
    permission: [
      {
        name: "read",
      },
    ],
  },
  {
    id: 11,
    identity: "Course Modules",
    category: "teacher",
    description: "Modules of a course",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 12,
    identity: "TeachingStaffs",
    category: "teacher",
    description: "Teaching staff management",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 14,
    identity: "Non TeachingStaffs",
    category: "admin",
    description: "Non-teaching staff management",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 18,
    identity: "Batches",
    category: "teacher",
    description: "Batches management",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 43,
    identity: "TeachingStaff Attendances",
    category: "teacher",
    description: "Teaching staff attendance management",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 50,
    identity: "Help Faqs",
    category: "admin",
    description: "FAQs management",
    permission: [
      {
        name: "create",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
      {
        name: "read",
      },
    ],
  },
  {
    id: 46,
    identity: "Community",
    category: "admin",

    description: "Community management",
    permission: [
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 4,
    identity: "Users",
    category: "admin",
    description: "Users management",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 8,
    identity: "Course Details",
    category: "teacher",
    description: "Details of a course",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 21,
    identity: "OfflineClass Details",
    category: "student",
    description: "Details of an offline class",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 29,
    identity: "Student Fee Details",
    category: "student",

    description: "Details of student fees",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 33,
    identity: "Subscription Details",
    category: "admin",
    description: "Details of subscriptions",
    permission: [
      {
        name: "read",
      },
    ],
  },
  {
    id: 37,
    identity: "Staff Notifications",
    category: "admin",
    description: "Staff notifications management",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 1,
    identity: "dashboard",
    description: "Dashboard feature for overview",
    category: "admin",
    permission: [
      {
        name: "read",
      },
    ],
  },

  {
    id: 5,
    identity: "User Details",
    category: "admin",
    description: "Details of a user",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 7,
    identity: "Courses",
    category: "student",

    description: "Courses management",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 17,
    identity: "Student Details",
    category: "student",

    description: "Details of a student",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 28,
    identity: "NonTeachingStaff Attendances",
    category: "admin",
    description: "Non-teaching staff attendance management",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 40,
    identity: "Student Certificate Details",
    category: "student",

    description: "Details of student certificates",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 45,
    identity: "Faqs",
    category: "student",
    description: "Frequently asked questions",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 47,
    identity: "Student Tickets",
    category: "student",

    description: "Student support tickets management",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 20,
    identity: "Offline Classes",
    category: "student",

    description: "Offline classes management",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 31,
    identity: "Student Fees",
    category: "student",

    description: "Student fees management",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 38,
    identity: "All Notifications",
    category: "admin",
    description: "All notifications management",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 39,
    identity: "Student Certificates",
    category: "student",

    description: "Student certificates management",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },

  {
    id: 48,
    identity: "staff_tickets",
    category: "admin",
    description: "staff support tickets management",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
  {
    id: 51,
    identity: "Fees",
    category: "student",
    description: "Student Fees",
    permission: [
      {
        name: "create",
      },
      {
        name: "read",
      },
      {
        name: "update",
      },
      {
        name: "delete",
      },
    ],
  },
];
const test = async function (roles) {
  const features_seeding = [];

  for (const role of roles) {
    const uuid = await generateUUID();
    features_seeding.push({ ...role, uuid });
  }

  return features_seeding;
};

const features_seeding = await test(predefined_features);

export default features_seeding;
