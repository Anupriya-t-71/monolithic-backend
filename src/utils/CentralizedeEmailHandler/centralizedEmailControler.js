import { getInstituteDetailswithUUID } from '../../controllers/Institutes/common/index.js';
import { InstituteAdmin } from '../../models/Administration/Authorization/index.js';
import { InstituteUser } from '../../models/Institutes/Administration/Authorization/index.js';
import Batch from '../../models/Institutes/Batch/index.js';
import Course from '../../models/Institutes/Course/index.js';
import Institute from '../../models/Institutes/Institute/index.js';
import { hashPassword } from '../../services/authServices.js';
import { sendEmail } from './index.js'; 
import cron from 'node-cron';


export const sendWelcomeEmail = async (email, name, institute, password, resetLink, course, batch) => {
  try {
      await sendEmail(email, 'Welcome to E-FLOW', 'welcome_template', {
          name,
          email,
          institute,
          password,
          resetLink,
          course,
          batch
      });

      await InstituteUser.findOneAndUpdate({email}, {
          welcome_mail_sent: true,
          welcome_mail_sent_at: new Date(),
      }, {new: true});

      return { success: true, message: 'Welcome email sent and status updated.' };
  } catch (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error: 'Failed to send welcome email.' };
  }
};

const generateTemproaryPassword = () => {
  return Math.random().toString(36).slice(-12);
};


export const sendWelcomeTeacherEmail = async (email, name, institute, responsibilities, password, resetLink) => {
    await sendEmail(email, 'Welcome to project.emern eflow', 'welcome_template', {
        name,
        institute,
        responsibilities,
        password,
        resetLink
    });
};

export const sendBatchDetailEmail = async (studentDetails, instructorDetails, courseDetails, batchDetails) => {
    const studentTemplateData = {
        studentName: studentDetails.name,
        batchName: batchDetails.name,
        courseName: courseDetails.name,
        instructorName: instructorDetails.name,
        isStudent: true,
        isInstructor: false
    };

    const instructorTemplateData = {
        instructorName: instructorDetails.name,
        batchName: batchDetails.name,
        courseName: courseDetails.name,
        studentNames: studentDetails.map(student => student.name).join(','),
        isStudent: false,
        isInstructor: true
    };

    // Send email to student
    await sendEmail(studentDetails.email, 'Batch Details', 'batchDetail_template', studentTemplateData);

    // Send email to instructor
    await sendEmail(instructorDetails.email, 'Batch Details', 'batchDetail_template', instructorTemplateData);
};


export const sendClassAlertEmail = async (classDetails, instructorDetails, studentDetails) => {
    const studentTemplateData = {
        studentName: studentDetails.first_name + studentDetails?.last_name,
        className: classDetails.name,
        courseName: classDetails.courseName,
        instructorName: instructorDetails?.first_name + instructorDetails?.last_name ,
        startTime: classDetails.startTime,
        endTime: classDetails.endTime,
        isStudent: true,
        isInstructor: false
    };

    const instructorTemplateData = {
        teacherName: instructorDetails?.first_name + instructorDetails?.last_name,
        className: classDetails.name,
        courseName: classDetails.courseName,
        startTime: classDetails.startTime,
        endTime: classDetails.endTime,
        studentNames: studentDetails.map(student => student.first_name + student?.last_name).join(', '),
        isStudent: false,
        isInstructor: true
    };

    // Send email to student
    await sendEmail(studentDetails.email, 'New Class Alert', 'New_classAlert', studentTemplateData);

    // Send email to instructor
    await sendEmail(instructorDetails.email, 'New Class Alert', 'New_classAlert', instructorTemplateData);
};








export const sendPasswordResetEmail = async (user, resetLink) => {
    await sendEmail(user, 'Password Reset Request', 'PasswordReset_template', { resetLink });
};

export const sendCourseEnrollmentEmail = async (email, courseName,name) => {
    await sendEmail(email, 'Course Enrollment Confirmation', 'Course_Enrollment_template', { name: name, courseName });
};

export const sendAttendanceReminderEmail = async (user, className, classDate) => {
    await sendEmail(user.email, 'Attendance Reminder', 'Attendance_reminder_template', { userName: user.name, className, classDate });
};

export const sendAdminNotificationEmail = async (adminEmail, notificationMessage) => {
    await sendEmail(adminEmail, 'Admin Notification', 'Admin_Notification_Template', { notificationMessage });
};

export const sendHelpCenterResponseEmail = async (user, responseMessage) => {
    await sendEmail(user.email, 'Help Center Response', 'helpCenterResponse', { userName: user.name, responseMessage });
};
export const sendFeePaymentReminderEmail = async (user, courseName) => {
    await sendEmail(user.email, 'Fee Payment Reminder', 'FeePayment_remainder_template', { userName: user.name, courseName });
};

export const sendActivityUpdateEmail = async (user, activityMessage) => {
    await sendEmail(user.email, 'Activity Update', 'Activity_update_template', { userName: user.name, activityMessage });
};

export const sendSubscriptionRenewalEmail = async (user, courseName) => {
    await sendEmail(user.email, 'Subscription Renewal', 'Subscription_renewel_template', { userName: user.name, courseName });
};

export const sendTicketStatusUpdateEmail = async (user, ticketId, ticketStatus) => {
    await sendEmail(user.email, 'Ticket Status Update', 'TicketStatus_update_template', { userName: user.name, ticketId, ticketStatus });
};

export const getInstituteDetails = async (instituteId) => {
    try {
        const institute = await Institute.findById(instituteId);
        return institute;
    } catch (error) {
        console.error('Error fetching institute details:', error);
    }
};

export const resendWelcomeEmail = async (req, res) => {
    try {
        const users = await InstituteUser.find({ welcome_mail_sent: false });
        let sentCount = 0;

        const sendEmails = async (userList) => {
            for (const user of userList) {
                const { email, first_name, institute_id, _id } = user;
                const userData = await InstituteUser.findOne({ email: email })
                    .populate({ path: 'userDetail', select: 'batch_id course' });

                if (!userData || !userData.userDetail) {
                    console.log(`Skipping user ${email}, no userDetail found.`);
                    continue;
                }

                const institute = await getInstituteDetails(institute_id);
                const course = await Course.findById(userData.userDetail.course);
                const batch = await Batch.findById(userData.userDetail.batch_id);
                const temproaryPassword = generateTemproaryPassword();
                const hashedNewPassword = hashPassword(temproaryPassword);
                const emailSent = await sendWelcomeEmail(
                    email,
                    first_name,
                    institute?.institute_name ?? "institute",
                    hashedNewPassword,
                    `http://localhost:3002/api/institutes/auth/profile/temporary-reset?id=${_id}`,
                    course ? course.course_name : "Unknown Course",
                    batch ? batch.batch_name : "Unknown Batch"
                );

                if (emailSent) {
                    await InstituteUser.findByIdAndUpdate(_id, {
                        password: hashedNewPassword,
                        welcome_mail_sent: true,
                        welcome_mail_sent_at: new Date(),
                    },{new: true});
                    sentCount++;
                }
            }
        };

        await sendEmails(users);

        return res.json({ message: `${sentCount} welcome emails resent successfully for users!` });

    } catch (error) {
        console.error('Error resending welcome emails:', error);
        return res.status(500).json({ error: 'Failed to resend welcome emails' });
    }
};


cron.schedule('0 * * * * ', resendWelcomeEmail);
