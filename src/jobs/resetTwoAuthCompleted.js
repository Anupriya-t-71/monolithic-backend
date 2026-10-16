import cron from "node-cron";
import { InstituteAdmin, UserModel } from "../models/Administration/Authorization/index.js";
import { InstituteUser } from "../models/Institutes/Administration/Authorization/index.js";
export const resetTwoAuthCompletedInstituteAdmin = () => {
  cron.schedule("0 * * * * ", async () => {
    const ScheduledTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
    try {
      const data = await InstituteAdmin.updateMany(
        {
          is_two_auth_completed: true,
          two_auth_completed_at: { $lte: ScheduledTime },
        },
        {
          is_two_auth_completed: false,
          $unset: { two_auth_completed_at: 1 },
        }
      );
    } catch (error) {
      console.error("Error updating is_two_auth_completed field:", error);
    }
  });
};

export const resetTwoAuthCompletedTeachingStaff = () => {
  cron.schedule("0 * * * * ", async () => {
    const ScheduledTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
    try {
      const data = await InstituteUser.updateMany(
        {
          is_two_auth_completed: true,
          two_auth_completed_at: { $lte: ScheduledTime },
        },
        {
          is_two_auth_completed: false,
          $unset: { two_auth_completed_at: 1 },
        }
      );

      const datas = await UserModel.updateMany(
        {
          is_two_auth_completed: true,
          two_auth_completed_at: { $lte: ScheduledTime },
        },
        {
          is_two_auth_completed: false,
          $unset: { two_auth_completed_at: 1 },
        }
      );
    } catch (error) {
      console.error("Error updating is_two_auth_completed field:", error);
    }
  });
};



export const migrateCoursesForStudent = async (studentId) => {
  try {
    const student = await InstituteStudent.findOne({ studentId });

    if (!student) {
      throw new Error('Student not found');
    }

    const now = new Date();

    // Separate ongoing and completed courses
    const ongoing_courses = [];
    const completed_courses = [];

    student.ongoing_courses.forEach(course => {
      if (course.end_date < now) {
        completed_courses.push(course);
      } else {
        ongoing_courses.push(course);
      }
    });

    // Update the student's courses
    if (ongoing_courses.length > 0 || completed_courses.length > 0) {
      await InstituteStudent.updateOne(
        { studentId },
        {
          $set: { ongoing_courses },
          $push: { completed_courses: { $each: completed_courses } }
        }
      );
    }

  } catch (error) {
    console.error('Error during course migration:', error);
  }
};