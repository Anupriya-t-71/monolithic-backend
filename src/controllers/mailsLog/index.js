import {EmailLog} from "../../models/mailLogs/index.js";


export const logEmail = async (receiver, sender, subject, template, status, error, additionalInfo = {}) => {
    try {
        const emailLog = new EmailLog({
            receiver,
            sender,
            subject,
            template,
            status,
            error,
            additionalInfo
        });

        await emailLog.save();

        console.log('Email log saved successfully');
      

    } catch (error) {
        console.error('Failed to save email log', error);
      
    }
};

export const updateEmailStatus = async (logId, status) => {
    try {

        await EmailLog.findByIdAndUpdate(logId, { status }, { new: true });
        console.log('Email status updated successfully');
       

    } catch (error) {
        console.error('Failed to update email status', error);
      
    }
};






async function createEmailLog(data) {
  try {
    const { recipient, subject, body, sender_email, cc, bcc } = data;
    const newEmailLog = new EmailLog({
      recipient,
      subject,
      body,
      sender_email,
      cc,
      bcc,
    });
    await newEmailLog.save();
    res.status(201).json({ message: "Email log saved successfully" });
  } catch (error) {
    console.error("Error saving email log:", error);
    res.status(500).json({ error: error.message });
  }
}
