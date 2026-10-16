import cron from "node-cron";
import nodemailer from "nodemailer";
import OneSignal from "onesignal-node";

// Store reference to the scheduled job
let scheduledCronJob = null;
let lastScheduledTime = null;


export const transporter = nodemailer.createTransport({
  service: 'gmail',  
  auth: {
    user: process.env.sender_mail, 
    pass: process.env.sender_password,  
  },
});


const client = new OneSignal.Client({
  userAuthKey: process.env.ONESIGNAL_USER_AUTH_KEY,
  app: { appAuthKey: process.env.ONESIGNAL_APP_AUTH_KEY, appId: process.env.ONESIGNAL_APP_ID }
});

export async function sendNotification(classDetails) {
  console.log(` Sending notification for: ${classDetails.class_name}`);

  const { type, recipient } = classDetails;

  try {
    if (type === "email") {
      await sendEmailNotification(recipient, classDetails);
    } else if (type === "sms") {
      console.log("SMS is no longer supported. Please provide an alternative service.");
    } else if (type === "push") {
      await sendPushNotification(recipient, classDetails);
    } else {
      console.log("Invalid notification type.");
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}

// 1️⃣ Send Email Notification (Using Nodemailer)
async function sendEmailNotification(email, classDetails) {
  const mailOptions = {
    from: process.env.sender_mail,  // Your email address
    to: email,
    subject: `Reminder: ${classDetails.class_name}`,
    text: `Your class "${classDetails.class_name}" is starting soon!`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(` Email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}


async function sendPushNotification(deviceToken, classDetails) {
  const notification = {
    contents: { en: `Your class "${classDetails.class_name}" starts soon!` },
    include_player_ids: [deviceToken],
  };

  try {
    const response = await client.createNotification(notification);
    console.log(` Push notification sent to ${deviceToken}`);
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
}

export const checkDetails = () => {
  console.log(" checkDetails() function is running...");
  const newOnlineClass = {
    _id: "6784a8cae72330e7f4c25eeb",
    class_name: "New class begin in new year of 2025",
    start_time: "Thu, 13 Feb 2025 05:00:00 GMT", 
    is_active: true,
  };

  if (newOnlineClass.start_time) {
    const startTime = new Date(newOnlineClass.start_time);
    const notificationTime = new Date(startTime.getTime() - 10 * 60 * 1000); 

    console.log(`Class Scheduled on: ${startTime}`);
    console.log(`Notification Scheduled for: ${notificationTime}`);

    
    updateScheduledNotification(notificationTime, newOnlineClass);
  }
};

function updateScheduledNotification(notificationTime, classDetails) {
  const now = new Date();

  if (notificationTime > now) {
    const cronTime = `${notificationTime.getUTCMinutes()} ${notificationTime.getUTCHours()} ${notificationTime.getUTCDate()} ${notificationTime.getUTCMonth() + 1} *`;

    console.log(` New Cron Expression: ${cronTime}`);

    
    if (scheduledCronJob && lastScheduledTime !== cronTime) {
      console.log(` Updating Cron Job for ${classDetails.class_name}`);
      scheduledCronJob.stop(); 
      scheduledCronJob = null; 
    }

    if (!scheduledCronJob) {
      scheduledCronJob = cron.schedule(cronTime, () => {
        console.log(`Sending notification for class: ${classDetails.class_name} at ${new Date()}`);
        sendNotification(classDetails);
      });

      lastScheduledTime = cronTime; 
      console.log(`New Cron Job Scheduled: ${cronTime}`);
    }
  } else {
    console.log(" Notification time is in the past. Skipping.");
  }
}


checkDetails();
