import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { MockEmailData } from "../utils/data.js"; // Ensure this is correctly imported
import { emailChecker } from "../utils/helpers.js"; // Ensure this is correctly imported

dotenv.config();

const sendEmail = async (mailOption) => {
  try {
    // Check if the email is valid
    // emailChecker(mailOption.to, mailOption);

    const transporter = nodemailer.createTransport({
      service: "Gmail", // You can use other services like "SendGrid" if needed
      auth: {
        user: process.env.sender_mail, // Sender email from .env file
        pass: process.env.sender_password, // Sender email password or app password
      },
    });

    // Send the email
    await transporter.sendMail(mailOption);
    console.log(`Email sent successfully to ${mailOption.to}`);
  } catch (error) {
    console.error("Error sending email:", error.message);
    // If email fails, store it in MockEmailData for later retries or logging
    MockEmailData.push(mailOption);
  }
};

export default sendEmail;
