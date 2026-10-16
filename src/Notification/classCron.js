import cron from 'node-cron';
// import { sendNotification } from './notificationService'; // Your custom notification logic
// import { OnlineClass } from '../models/Institutes/Class/Online_Model';

// Watch for changes in the collection
// OnlineClass.watch([{ $match: { operationType: { $in: ['insert', 'update'] } } }])
//   .on('change', (change) => {
//     const newOnlineClass = change.fullDocument;
//     const newOnlineClass = {
//       _id: { $oid: "6784a8cae72330e7f4c25eeb" },
//       institute: { $oid: "6628bf31f13375f7c3aca3ad" },
//       branch: { $oid: "662fa4648a3c39fb1f34b8f2" },
//       batch: { $oid: "665411a94258c89bda457341" },
//       course: { $oid: "662a103292a1fe9a8d414d83" },
//       class_name: "New class begin in new year of 2025",
//       slug: "new-class-begin-in-new-year-of-2025",
//       start_date: "2025-01-13",
//       start_time: "Mon, 13 Jan 2025 05:00:00 GMT",
//       end_time: "2025-01-13T13:00:00.000Z",
//       instructors: [{ $oid: "667d10cc84bbb5a77b89d3e8" }],
//       coordinators: [],
//       video_url: "www.google.com",
//       is_active: true,
//       is_deleted: false,
//       study_materials: [],
//       notes: [],
//       videos: [],
//       createdAt: "2025-01-13T05:46:50.849+00:00",
//       updatedAt: "2025-01-13T05:46:50.849+00:00",
//       uuid: "6627bf2b-fa57-4e76-bb19-832b0f976d5c",
//       id: { $numberInt: "32" },
//       __v: { $numberInt: "0" }
//     };    

//     if (newOnlineClass.start_time) {
//       const startTime = new Date(newOnlineClass.start_time);
//       const notificationTime = new Date(startTime.getTime() - 10 * 60 * 1000); // 10 minutes before start_time

//       console.log(`New class added. Notification scheduled for: ${notificationTime}`);

//       // Schedule the notification
//       scheduleNotification(notificationTime, newOnlineClass);
//     }
//   })
//   .on('error', (err) => {
//     console.error('Error watching collection:', err);
//   });

export const checkDetails = (req,res) => {
  const newOnlineClass = {
    _id: { $oid: "6784a8cae72330e7f4c25eeb" },
    institute: { $oid: "6628bf31f13375f7c3aca3ad" },
    branch: { $oid: "662fa4648a3c39fb1f34b8f2" },
    batch: { $oid: "665411a94258c89bda457341" },
    course: { $oid: "662a103292a1fe9a8d414d83" },
    class_name: "New class begin in new year of 2025",
    slug: "new-class-begin-in-new-year-of-2025",
    start_date: "2025-01-13",
    start_time: "Mon, 13 Jan 2025 05:00:00 GMT",
    end_time: "2025-01-13T13:00:00.000Z",
    instructors: [{ $oid: "667d10cc84bbb5a77b89d3e8" }],
    coordinators: [],
    video_url: "www.google.com",
    is_active: true,
    is_deleted: false,
    study_materials: [],
    notes: [],
    videos: [],
    createdAt: "2025-01-13T05:46:50.849+00:00",
    updatedAt: "2025-01-13T05:46:50.849+00:00",
    uuid: "6627bf2b-fa57-4e76-bb19-832b0f976d5c",
    id: { $numberInt: "32" },
    __v: { $numberInt: "0" }
  };    
  
  if (newOnlineClass.start_time) {
    const startTime = new Date(newOnlineClass.start_time);
    const notificationTime = new Date(startTime.getTime() - 10 * 60 * 1000); // 10 minutes before start_time
    console.log(startTime);
    console.log(`New class added. Notification scheduled for: ${notificationTime}`);
  
    // Schedule the notification
    scheduleNotification(notificationTime, newOnlineClass);
  }

function scheduleNotification(notificationTime, classDetails) {
  const now = new Date();

  // Ensure the time is in the future
  if (notificationTime > now) {
    const cronTime = `${notificationTime.getUTCMinutes()} ${notificationTime.getUTCHours()} ${notificationTime.getUTCDate()} ${notificationTime.getUTCMonth() + 1} *`;
    console.log(cronTime);
    // sendNotification(classDetails);
    
    // cron.schedule(cronTime, () => {
    //   console.log(`Sending notification for class: ${classDetails.class_name}`);
    //   sendNotification(classDetails);
    // });
  } else {
    console.log('Notification time is in the past. Skipping.');
  }
}
}

