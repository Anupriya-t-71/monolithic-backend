import nodemailer from 'nodemailer';
import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { logEmail } from '../../controllers/mailsLog/index.js';
import { emailChecker } from '../helpers.js';

// Workaround to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.sender_mail ,
        pass: process.env.sender_password
    }
});


// Function to read HTML template and replace placeholders with dynamic data

  const getTemplate = (templateName,data)=>{
    const filepath = path.join(__dirname,'templates',`${templateName}.html`); 
    const source = fs.readFileSync(filepath,'utf-8').toString();
    const template = handlebars.compile(source);
   
     return template(data)
     
  }


export const sendEmail =  async(to, subject, templateName, data) => {

    const html = getTemplate(templateName,data);
   
    console.log(`${to}`)
    const mailOptions = {
        from: process.env.sender_mail,
        to,
        subject,
        html
    };

    // emailChecker(to,mailOptions)
  
   try{
     emailChecker(to,mailOptions)
     await transporter.sendMail(mailOptions);
     console.log("Email sent successfully");
     await logEmail(to, process.env.sender_mail, subject, templateName, 'sent', "null" , data);
     
   }catch(error){
     console.log("Error while sending email",error);
     await logEmail(to, process.env.sender_mail, subject, templateName, 'failed', { error: error.message}, data );
     
   }
};




