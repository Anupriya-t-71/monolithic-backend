import nodemailer from 'nodemailer';
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async (toEmail,subject ) => {
  console.log("came into emailer");
  
  console.log(process.env.sender_email);
  console.log(process.env.sender_password);
  const cleanPassword = process.env.sender_password.replace(/\s+/g, '');
  console.log(cleanPassword);
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: process.env.sender_email,
        pass: cleanPassword,
        
      },
    });

    const mailOptions = {
      from: 'iamwekey@gmail.com',
      to: toEmail, 
      subject:subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #FF6F61; color: #fff; padding: 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">⚠️ Renewal Alert!</h1>
            </div>
            <div style="padding: 20px; color: #333;">
                <p style="font-size: 18px; line-height: 1.6;">
                    <strong>Dear Subscriber,</strong>
                </p>
                <p style="font-size: 16px; line-height: 1.6;">
                    This is a reminder that your subscription is about to expire on 
                </p>
                <p style="font-size: 16px; line-height: 1.6;">
                    Click the button below to renew now:
                </p>
                <div style="text-align: center; margin: 20px 0;">
                   
                </div>
                <p style="font-size: 14px; color: #777; line-height: 1.6;">
                    If you have already renewed, please disregard this message.
                </p>
            </div>
            <div style="background-color: #f7f7f7; color: #999; text-align: center; padding: 10px; font-size: 12px;">
                <p style="margin: 0;">Thank you for being a valued subscriber.</p>
                <p style="margin: 0;">If you have any questions, contact us at <a href="mailto:support@example.com" style="color: #FF6F61;">support@example.com</a>.</p>
            </div>
        </div>
    `
};
   

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

