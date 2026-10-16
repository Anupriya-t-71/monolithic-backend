import OnlineClass from "../../../../models/Institutes/Class/Online_Model.js";
import { createLogger } from "../../../ActivityLogs/index.js";
import moment from "moment";
import cron from "node-cron";



export const monitorOnlineClassTimings =  () => {

    cron.schedule("0 0 * * *", async () => {
     
    
    try {
        const classes = await OnlineClass.find({ is_active: true, is_deleted: false });

        classes.forEach(async (classData) => {
            const { start_date, end_date, start_time, end_time, duration, uuid } = classData;
            const startDateTime = moment(`${start_date} ${start_time}`, "YYYY-MM-DD HH:mm");
            const endDateTime = moment(`${end_date} ${end_time}`, "YYYY-MM-DD HH:mm");
            const actualDuration = moment.duration(endDateTime.diff(startDateTime)).asMinutes();

            if (actualDuration !== duration) {
                const log_data = {
                    user: null,
                    role: "system",
                    title: "Class Duration Mismatch",
                    model: "online class",
                    details: `Class ${uuid} has a duration mismatch. Expected: ${duration} minutes, Actual: ${actualDuration} minutes.`,
                    action: "monitor",
                    institute: classData.institute,
                    branch: classData.branch
                };
                await createLogger(log_data);
            }
        });
    } catch (error) {
        console.error("Error monitoring class timings:", error);
    }  
    
   
    });

    console.log("Running class timings monitor...");

};