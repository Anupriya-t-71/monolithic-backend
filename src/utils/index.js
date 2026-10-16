import fs from "fs"
import { getEmailServiceProvider,createTransport } from "./helpers.js";

export const getDaysInMonth = (month,year) => {
     return new Date(year,month,0).getDate()
}


   
const id_card_details_format = {
     student: {
       name: ["first_name", "last_name"],
       email: "email",
       image: "image",
       contact: "phone_number",
       address: {
         address_line_one: "address1",
         address_line_two: "address2",
         state: "state",
         city: "city",
         pin_code: "pincode",
       },
     },
};
   
export const CheckUpdateData = (data, user) => {
     function mapData(data, format) {
       const mappedData = {};
   
       for (let key in format) {
         if (typeof format[key] === "object" && !Array.isArray(format[key])) {
           mappedData[key] = mapData(data, format[key]);
         } else if (Array.isArray(format[key])) {
           mappedData[key] = format[key].map((field) => data[field] || data.contact_info?.[field]).join(" ");
         } else {
           mappedData[key] = data[format[key]] || data.contact_info?.[format[key]];
         }
       }
   
       return mappedData;
     }
   
     return mapData(data, id_card_details_format[user]);
};


export const sendWelcomeTemplate = async(receiver,user_data) => {
     fs.readFile("src/templates/institute/welcome_template.html","utf-8",(error,data) => {
        if(error){
          console.log(error,"error")
          return ;
        }
       
        const html = data.replace("{{name}}",user_data?.name)
                         .replace("{{email}}",user_data?.email)
                         .replace("{{password}}",user_data?.password)
        
        const mailOptions =  {
          from : process.env.sender_mail,
          to : receiver,
          subject : "Welcome to eflow – Let's Get Started!",
          html: html
        }
        console.log(receiver,user_data)
        const mailService = getEmailServiceProvider(receiver)
        const transport = createTransport(mailService,process.env.sender_mail,process.env.sender_password)
        
        transport.sendMail(mailOptions,(error,info)=>{
          if(error){
            return console.error('Error sending OTP email:', error)
          }
          console.log("Mail Response:", info.response)
        })
     })
}