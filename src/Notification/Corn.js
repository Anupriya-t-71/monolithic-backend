import { schedule } from 'node-cron';
import fetch from 'node-fetch';
import { InstituteSubscription } from '../models/Administration/Subscription/index.js';
import dotenv from "dotenv"
dotenv.config()

import institutes from '../models/Institutes/Institute/index.js'
import sendEmail from "../Notification/Mail.js"
import OnlineClass from '../models/Institutes/Class/Online_Model.js';
import Batch from '../models/Institutes/Batch/index.js';
import NotificationModel from '../models/Institutes/Notification/notificationSubscription.js';
import sendNotifications from '../config/webpush.js';
import Student_Fee_Model from '../models/Institutes/Payment/Student_Fee_Model.js';
import { InstituteStudent } from '../models/Institutes/Administration/Authorization/index.js';
import NotificationWaitingModel from '../models/WaitingNotification/index.js';

export function CornSchedule(){
schedule('0 0 * * 1-7', async() => {
  // Example: 0 9 * * 1-5 runs at 9:00 AM, Monday to Friday.
  console.log('Task is running every minute:', new Date());
   try {
    const nowDate = new Date();
    const docs = await InstituteSubscription.find({ endDate: { $lte: nowDate } });

    docs.forEach(async (doc) => {
      try {
        const institute = await institutes.findOne({ _id: doc.instituteId });
        if (!institute) {
          console.log( doc.instituteId);
          return;
        }

        const mailOption = {
          from: process.env.sender_mail,
          to: process.env.reciver_mail,
          subject: "Subscription Expired",
          html: `<h1>Subscription Expired</h1><p>Expiration Date: ${doc.endDate}</p><p>Please recharge or enable auto-renewal.</p>`,
        };

      
        await sendEmail(mailOption);

      } catch (error) {
        console.log("Error processing subscription for institute:", error);
      }
    });

    //payment
    const payment = await Student_Fee_Model.find({duepaymentdate:{$lte:nowDate}})
    for(let data in payment){
      let student = await InstituteStudent.find({_id:data.student})
      console.log(student)

       const mailOption = {
          from: process.env.sender_mail,
          to: process.env.reciver_mail,
          subject: "payment due date Reminder",
          html: `<h1>your payment due date reached</h1><p>your due date ${data.duepaymentdate}</p><p>please clear your due ammount</p>`,
        };
       
        await sendEmail(mailOption)

    }
  } catch (error) {
    console.log("Interval error in subscription check:", error);
  }
});

//class timeing
schedule('5 * * * *',async ()=>{
  try {
    const now = new Date()
    const onlineClass = await OnlineClass.find({start_time:{$lte:now.getTime() + 10}})
    for(let data in onlineClass){
       const student = await Batch.find({classes:data._id})
       
       const mailOption = {
          from: process.env.sender_mail,
          to: process.env.reciver_mail,
          subject: "Next Class started",
          html: `<h1>Class Start Soon</h1><p>Ready to attend the class for ${data.class_name}</p><p>join us</p>`,
        };

        await sendEmail(mailOption)
       
       const subscription = await NotificationModel.findOne({user:student._id})
         if (subscription) {
                 const payload = JSON.stringify({
                 title: data.title,
                 body: data.body,
                //  icon: getApplicationURL + institute?.image,
                 data: {
                   url: "http://localhost:3003/student/notifications",
                 },
               });
               // console.log(payload)
               await sendNotifications(payload, subscription);
               }
    }

  } catch (error) {
    console.log(error,"schedule")
  }
})
}

export function CornSchedulemini(){
schedule('* * * * *',async ()=>{
  try {
    console.log("schedule")
  const waitlist = await NotificationWaitingModel.find({})
  waitlist.map(async data =>{
   const send = await sendNotifications(data.payload,data.userId,"resend")
   if(send){
    NotificationWaitingModel.findByIdAndDelete({userId:data.userId})
   }
  })
  } catch (error) {
    console.log(error,"schedule error")
  }
  
})
}


// const notificationJobs = {
//   userId : 1,
//   pending_jobs:[{id:1,title:'test',status:""}],
//   completed_jobs:[{notificaiton:id,status}],
// }


// const fetchUpcomingDeadlines = async () => {
//   try {
    
//     const response = await fetch('eflow_API_ENDPOINT/upcoming-deadlines');
//     const data = await response.json();
    
//   } catch (error) {
//     console.error('Error fetching upcoming deadlines:', error);
//   }
// };


// const setupUpcomingDeadlinesCronJob = () => {
  
//   const schedule = '1 * * * *';

  
//   cron.schedule(schedule, fetchUpcomingDeadlines);
// };


// export {setupUpcomingDeadlinesCronJob ,fetchUpcomingDeadlines};
