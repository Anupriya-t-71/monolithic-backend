import { ClassSchedule } from "./ClassSchedule.js";
import {
  // migrateCoursesForStudent,
  resetTwoAuthCompletedInstituteAdmin,
  resetTwoAuthCompletedTeachingStaff,
} from "./resetTwoAuthCompleted.js";
import { ScheduleFileDelete } from "./ScheduleFileDelete.js";

const initializeCronJobs = () => {
  resetTwoAuthCompletedInstituteAdmin();
  resetTwoAuthCompletedTeachingStaff();
  ClassSchedule();
  ScheduleFileDelete();
  // migrateCoursesForStudent();
};

export default initializeCronJobs;
