import * as schedule from "node-schedule";
import * as SubscriptionModels from "../models/Administration/Subscription/index.js";
import fetch from "node-fetch";
import { InstitutesRoles } from "../models/Administration/Roles_And_Permissions/index.js";
import { InstituteAdmin } from "../models/Administration/Authorization/index.js";
import SubscriptionUpdateRequestModle from "../models/Automation/Subscription/index.js";
import { sendEmail } from "../models/Mails/Subscription_warningemail.js";
import { SubscriptionWarningEmail } from "../utils/helpers.js";
// dotenv.config()
import dotenv from "dotenv"

dotenv.config()
export const insertAndScheduleJobs = async (instituteId, subscriptionId) => {
  try {
    const institutesubscription =
      await SubscriptionModels.InstituteSubscription.find({
        instituteId: instituteId,
      });
    const expirationDate = institutesubscription[0].expirationDate;
    const localexpiration = expirationDate.toLocaleString();

    const year = expirationDate.getFullYear();
    const month = expirationDate.getMonth();
    const day = expirationDate.getDate();
    const hour = expirationDate.getHours();
    const minute = expirationDate.getMinutes();

    const warningday = expirationDate.getDate() - 10;
    // const warningdate = new Date(year, month, warningday, hour, minute);
    const warningdate = new Date(year, month, warningday, hour, minute);
    const jobdate = new Date(year, month, day, hour, minute);
    // const jobdate = new Date(2025, 1, 19, 17, 4);

    // const warningdate = new Date(2025, 1, 2, 0, 26);
    console.log("came into schedular");
    schedule.scheduleJob(warningdate, async () => {
      const institutesubscription =
        await SubscriptionModels.InstituteSubscription.findOne({
          instituteId: instituteId,
        });
      console.log("came into schedular for warning");

      const identity = await SubscriptionModels.SubscriptionPlans.find({
        _id: institutesubscription.subscriptionId,
      });
      const oldidentity = identity[0].identity;
      console.log(institutesubscription);

      const expirationDate = institutesubscription.expirationDate;
       const warningday = expirationDate.getDate() - 10;
       const warningyear =expirationDate.getFullYear()
      // const warningday = 23;
      console.log(expirationDate.toLocaleString(), warningday);
      //  const expirationday = expirationDate.getDate();
      //  const expirationday = expirationDate.getDate();

      const today = new Date();
      const expirationday = new Date(today);
      expirationday.setDate(today.getDate() - 10);
      console.log(expirationday + "10 days before date is");
const expirationyear = expirationday.getFullYear()
      console.log(
        expirationday.getDate() + "the exiirationa dn warning is " + warningday
      );

      if (expirationday.getDate() === warningday && expirationyear  === warningyear ) {
        console.log("came into ");

        const admin_role = await InstitutesRoles.findOne({ identity: "Admin" });
        const adminId = admin_role._id;

        const institute_adminfinder = await InstituteAdmin.find({
          institute_id: instituteId,
          role: admin_role._id,
        });

        //  institute_admin.email

        const subject = "Your Subscription Ends in 10 Days";
        const recipientEmail = institute_adminfinder[0].email;

        await SubscriptionWarningEmail(recipientEmail, subject);
      } // completed  the warning and expiration day
      console.log("Job triggered at:", new Date().toLocaleString());
    }); //completed the warning schedulat

    schedule.scheduleJob(jobdate, async () => {
      console.log("came into auto renewal");

      const institutesubscription =
        await SubscriptionModels.InstituteSubscription.find({
          instituteId: instituteId,
        });
      console.log(institutesubscription + "from auto renewal");

      const expirationDate = institutesubscription[0].expirationDate;
      const expirationday = expirationDate.getDate();
      const expirationyear =  expirationDate.getFullYear();
      const today = new Date();
      const todayDate = today.getDate();
      const todayyear = today.getFullYear();

      console.log(expirationday + "from auto renewal");
      console.log(expirationday,todayDate,expirationyear,todayyear + "from auto renewal");

      if (expirationday === todayDate && expirationyear === todayyear) {
        console.log("today date is same as expirationfrom auto renewal");
       
        if ( institutesubscription[0].autoRenew) {
          //
          process.env.PORT
          const BASE_URL = process.env.PORT 

          const requestUrl = `${BASE_URL}/api/subscription/institute/upgrade-subscription/${instituteId}/request`;

          // const requestUrl = `http://localhost:3002/api/subscription/institute/upgrade-subscription/${instituteId}/request`;
          console.log("came into renewal");

          try {
            const response = await fetch(requestUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: subscriptionId,
              }),
            });

            if (response.ok) {
              console.log(
                `Auto renewal triggered for Subscription ID: ${subscriptionId}`
              );
            } else {
              console.log(
                `Failed to trigger auto renewal for Subscription ID: ${subscriptionId}`
              );
            }
          } catch (error) {
            console.error("Error triggering auto renewal:", error);
          }
        }

        const subscriptionSchedularrecord =
          await SubscriptionModels.subscriptionSchedular.findOne({
            instituteId: instituteId,
          });
        if (subscriptionSchedularrecord) {
          const oldsusbcriptionid = subscriptionSchedularrecord.subscriptionId;
          const oldschedularEntry = { _id: oldsusbcriptionid };

          subscriptionSchedularrecord.subscriptionId = subscriptionId;
          subscriptionSchedularrecord.expirationDate = expirationDate;
          subscriptionSchedularrecord.is_scheduled = true;
          subscriptionSchedularrecord.schedular_history.push(oldschedularEntry);
          subscriptionSchedularrecord.save();
        } else {
          const scheduleData = {
            instituteId: instituteId,
            subscriptionId: subscriptionId,
            is_scheduled: true,
            expirationDate: expirationDate,
            is_warning_sent: true,
          };
          const subscriptionSchedular =
            await SubscriptionModels.subscriptionSchedular.create(scheduleData);
        }
      }
    }); //completed the job schedular
  } catch (error) {
    console.error("Error scheduling job:", error);
  }
};

//  insertAndScheduleJobs ("67a0b5b6a0af9570a36c485f", "67a0af2c30e409937423f807")
