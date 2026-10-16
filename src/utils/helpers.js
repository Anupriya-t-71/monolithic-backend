import { v4 as uuid, v4 } from "uuid"
import Otp from "otp-generator"
import nodemailer from "nodemailer"
import fs from "fs"
import path from 'path';

import dotenv from "dotenv"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import { PermissionChecker, VerifyToken } from "../middlewares/permission/index.js"
import qrcode from 'qrcode';
import { IdCard, InstituteNon_TeachingStaff, InstituteStudent, InstituteTeaching_Staff, InstituteUser } from "../models/Institutes/Administration/Authorization/index.js"
import { MockEmailData } from "./data.js"
import emailext from 'email-existence'

dotenv.config()

export const getId = async (model) => {
    const length = await model.countDocuments()
    return length + 1
}

export const getApplicationURL = () => {
    const PORT = process.env.PORT || 3001;
    const host = process.env.localhost ?? "localhost"
    const url = "http://" + host + ":" + PORT + "/"
    return url

}

export const generateUUID = async () => {
    const genUUID = v4()
    return genUUID
}

export const generateOtp = async () => {
    const otp = Otp.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false })
    const token = crypto.randomBytes(5).toString('hex')
    return { otp, token };
}

export const generateRandomSecretKey = () => {
    const secret_key = crypto.randomBytes(32).toString('hex')
    return secret_key
}

export const generateToken = (user) => {
    const token = jwt.sign({ email: user.email, role: user.role, uuid: user.uuid, user_type: "platform" }, process.env.secret_key, { expiresIn: "24h" }, { algorithm: 'RS256' })
    return token
}

export const generateInstituteToken = (user) => {
    const token = jwt.sign({ email: user.email, role: user.role, institute_id: user.institute_id, uuid: user.uuid, user_type: "institute" }, process.env.secret_key, { expiresIn: "24h" })
    return token
}

export const generateRandomPassword = (length = 12) => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialChars = "!@#$%^&*()_+[]{}|;:<>?";
    
    const allChars = uppercase + lowercase + numbers + specialChars;
  
    let password = "";
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];
  
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
  
    return password.split('').sort(() => 0.5 - Math.random()).join(''); // Shuffle password for randomness
  };
  

export const decodeToken = (token) => {
    try {
        const decode = jwt.verify(token, process.env.secret_key)
        return decode
    } catch (error) {
        if (error.message === "jwt expired") {
            return { status: "failed", message: error.message }
        }
        return { status: "failed", message: error.message, data: null }
    }

}

export const FilterQuery = (query, defaultQuery) => {
    const filteredQuery = {}

    Object.keys(defaultQuery).forEach(key => {
        if (query.hasOwnProperty(key)) {
            filteredQuery[key] = query[key]
        }
    })
    return filteredQuery
}

export const SplitArrayIds = ({ data, key }) => {
    if (Array.isArray(data)) {
        const Ids = data?.map((item) => item[key])
        return Ids
    } else {
        return "unsupport data format"
    }
}

export const filterPermissionsByActions = (permissions, actions) => {
    return permissions.filter(permission => actions.some(action => permission[action] === true))
}

// export const generateToken = (user) => {
//     const data = `${user.id}${process.env.secret_key}`;
//     const token = crypto.createHash('sha256').update(data).digest('hex');
//     return token;
// };

export const getEmailServiceProvider = (email) => {
    try {
    const domain = email.split("@")[1]
    if(domain.includes('gmail.com')){
       return "Gmail";
    }else if (domain.includes('outlook.com') || domain.includes('hotmail.com') || domain.includes('live.com')) {
        return 'Outlook';
    } else if (domain.includes('yahoo.com')) {
        return 'Yahoo';
    } else {
        return domain
    }
    } catch (error) {
        console.log("domain ",error)
    } 
}

export const createTransport = (emailService, email, password) => {
    let transport;

    if(emailService==="Gmail"){
       transport = nodemailer.createTransport({
        service : "gmail",
        secure:false,
        auth: {
            user : email,
            pass : password
        },
        tls: {
            rejectUnauthorized: false
          }
       });
    }else if(emailService === "outlook"){
        transport = nodemailer.createTransport({
            host : 'smtp.office365.com',
            port : 587,
            secure : true,
            auth : {
                user : email,
                pass : password
            }
        })
    }else{
        transport = nodemailer.createTransport({
            
            service : "gmail",
            secure:false,
            auth: {
                user : email ,
                pass : password
                
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    } 
    return transport
}

export const emailChecker=(email,mailOption)=>{
  emailext.check(email, (error, exists) => {
        if (error) {
            console.error("Verification failed:", error);
        } else {
            console.log("Email exists:", exists);
            if (!exists) {
            MockEmailData.push({
            id:1,
            from:process.env.sender_mail,
            to:email,
            subject:mailOption.subject,
            html:mailOption.html})
            }
        }
        });
}

export const sentOtpEmail=async(receiver,otp) => {
      fs.readFile("src/templates/Autentication/otp_template.html",'utf8',(error,data) => {
         if(error){
            console.log("Error:", error);
            
            return;
         }
         console.log(receiver,otp)
         const date = new Date().toLocaleDateString()
         const htm1 = data.replace('{{date}}',date)
         const html =htm1.replace('{{OTP}}',otp)

        const mailOptions = {
            from: process.env.sender_mail,
            to: receiver,
            subject: "OTP Verification",
            html: html
        }
        // emailChecker(receiver,mailOptions)
        const mailService = getEmailServiceProvider(receiver)
        const transport = createTransport(mailService, process.env.sender_mail, process.env.sender_password)

        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.error('Error sending OTP email:', error)
            }
            console.log('OTP email sent:', info.response);
        })
    })
}

export const sendTemproaryPasswordEmail = async(receiver,tempPassword) => {
    console.log(receiver,tempPassword)
    const mailOptions={
        from:process.env.sender_mail,
        to:receiver,
        subject:"Your Temporary Password",
        html:`<p>Your temporary password is: <strong>${tempPassword}</strong>. Please reset it after login.</p>`
    }
    const mailService = getEmailServiceProvider(receiver)
    const transport = createTransport(mailService,process.env.sender_mail,process.env.sender_password)

    transport.sendMail(mailOptions,(error,info)=>{
        if(error){
            return console.error('Error sending Reset Password email:', error)
        }
        console.log('Temproary Password sent your email:', info.response);
    })
}

export const sendSuccessEmail = async(receiver) => {
    fs.readFile("src/templates/mail_template.html", 'utf8', (error, data) => {
        if (error) {
            return;
        }
        const date = new Date().toLocaleDateString()
        const html = data.replace('{{date}}', date)

        const mailOptions = {
            from: process.env.sender_mail,
            to: receiver,
            subject: "DashBoard Created Successfully",
            html: html
        }
        const mailService = getEmailServiceProvider(receiver)
        const transport = createTransport(mailService, process.env.sender_mail, process.env.sender_password)

        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.error('Error sending success email:', error)
            }
            console.log('Success email sent:', info.response);
        })
    })
}

export const Convert_db_data_to_object = (data) => {
    return data.toObject()
}

export const Convert_db_data_to_json = (data) => {
    return data.toJSON()
}


export const FilterData = (data, fields) => {
    const filterObjectData = {}
    if (Array.isArray(fields)) {
        fields.forEach((field) => {
            if (data.hasOwnProperty(field)) {
                filterObjectData[field] = data[field]
            }
        })
        return filterObjectData
    } else if (Object.keys(data).length !== 0 && Object.keys(fields).length !== 0) {
        Object.keys(fields).forEach((field) => {
            if (data.hasOwnProperty(field)) {
                filterObjectData[field] = data[field]
            }
        })
        return filterObjectData
    } else {
        return filterObjectData
    }
}

const generateQRCodeBuffer = async (user) => {
    const { full_name, email, username, institute_id, branch_id, contact_info, roll_no, role, batch_id, type } = user;
    const qrCodeData = {
        name: full_name,
        email,
        username,
        institute_id,
        branch_id,
        role,
        batch_id,
        contact: contact_info.phone_number,
        address: `${contact_info.address1}, ${contact_info.address2}, ${contact_info.city}, ${contact_info.state}, ${contact_info.pincode}`,
        roll_no,
        type
    };
    const qrCodeString = JSON.stringify(qrCodeData);
    const qrCodeBuffer = await qrcode.toBuffer(qrCodeString);
    const qrCodeBase64 = qrCodeBuffer.toString('base64');
    return qrCodeBase64;
};


export const generateIDCard = async (user) => {
    const qrCodeBuffer = await generateQRCodeBuffer(user);
    const idCard = new IdCard({
        name: user.full_name,
        email: user.email,
        username: user.username,
        institute_id: user.institute_id,
        branch_id: user.branch_id,
        role: user.role,
        contact: user.contact_info.phone_number,
        address: `${user.contact_info.address1}, ${user.contact_info.address2}, ${user.contact_info.city}, ${user.contact_info.state}, ${user.contact_info.pincode}`,
        qr_code: qrCodeBuffer,
        roll_no: user.roll_no,
        batch_id: user.batch_id,
        type: user.type
    });
    const savedIdCard = await idCard.save();
    return savedIdCard;
};


export const saveIDCardImage = async (user, idCardBuffer) => {
    try {
        // fs.writeFileSync(`id_card_${user.uuid}.png`, idCardBuffer);
    } catch (error) {
        console.error('Error saving ID card:', error);
        throw new Error("Failed to save ID card image.");
    }
};

export const getNextRollNo = async () => {
    try {

        const maxRollNoDoc = await InstituteUser.findOne({}, { roll_no: 1 }).sort({ roll_no: -1 });

        let nextRollNo = 1;

        if (maxRollNoDoc) {

            nextRollNo = maxRollNoDoc.roll_no + 1;
        }

        return nextRollNo;
    } catch (error) {
        throw error;
    }
};



// Function to generate roll numbers for teaching staff
export const getNextTeachingStaffRollNo = async () => {
    try {
        const prefix = 'TS'; // Prefix for teaching staff roll numbers

        const maxRollNoDoc = await InstituteTeaching_Staff.findOne({}, { roll_no: 1 }).sort({ roll_no: -1 });

        let nextRollNo = 1;

        if (maxRollNoDoc) {
            const numericPart = parseInt(maxRollNoDoc.roll_no.replace(prefix, ''), 10);
            nextRollNo = numericPart + 1;
        }

        return `${prefix}${String(nextRollNo).padStart(3, '0')}`; // Format the roll number
    } catch (error) {
        throw error;
    }
};


export const getNextNonTeachingStaffRollNo = async () => {
    try {
        const prefix = 'NTS';

        const maxRollNoDoc = await InstituteNon_TeachingStaff.findOne({}, { roll_no: 1 }).sort({ roll_no: -1 });

        let nextRollNo = 1;

        if (maxRollNoDoc) {
            const numericPart = parseInt(maxRollNoDoc.roll_no.replace(prefix, ''), 10);
            nextRollNo = numericPart + 1;
        }

        return `${prefix}${String(nextRollNo).padStart(3, '0')}`;
    } catch (error) {
        throw error;
    }
};


export const getNextStudentRollNo = async () => {
    try {
        const prefix = 'ST';

        const maxRollNoDoc = await InstituteStudent.findOne({}, { roll_no: 1 }).sort({ roll_no: -1 });

        let nextRollNo = 1;

        if (maxRollNoDoc && maxRollNoDoc.roll_no) {
            const numericPart = parseInt(maxRollNoDoc.roll_no.replace(prefix, ''), 10);
            nextRollNo = numericPart + 1;
        }

        return `${prefix}${String(nextRollNo).padStart(3, '0')}`;
    } catch (error) {
        throw error;
    }
};

// Generate Student ID
export const generateStudentId = async (instituteName, branchName, currentCount) => {
    const instituteCode = instituteName.slice(0, 3).toUpperCase();
    const branchCode = branchName.slice(0, 3).toUpperCase();
    const sequenceNumber = String(currentCount + 1).padStart(4, '0');
    return `${instituteCode}-${branchCode}-STDNT${sequenceNumber}`;
};

// Generate Teaching Staff ID
export const generateTeachingStaffId = async (instituteName, branchName, currentCount) => {
    const instituteCode = instituteName.slice(0, 3).toUpperCase();
    const branchCode = branchName.slice(0, 3).toUpperCase();
    const sequenceNumber = String(currentCount + 1).padStart(4, '0');
    return `${instituteCode}-${branchCode}-SF${sequenceNumber}`;
};

// Generate Non-Teaching Staff ID
export const generateNonTeachStaffId = async () => {
    try {
        const prefix = 'NTS'; // Prefix for non-teaching staff IDs

        const maxIdDoc = await InstituteNon_TeachingStaff.findOne({}, { id: 1 }).sort({ id: -1 });

        let nextId = 1;

        if (maxIdDoc && maxIdDoc.id) {
            const idStr = String(maxIdDoc.id);
            const numericPart = parseInt(idStr.replace(prefix, ''), 10);
            nextId = numericPart + 1;
        }

        return `${prefix}${String(nextId).padStart(3, '0')}`; // Format the ID
    } catch (error) {
        throw error;
    }
};

export const InstituteRoleToMainModel = {
    "Student": "Student_Login",
    "Teaching Staff": "teachingstaff_login",
    "Non Teaching Staff": "non-teachingstaff_login"
}



export const SubscriptionWarningEmail = async (receiver, subscription_name) => {
    fs.readFile("src/templates/institute/subscription_warning.html", 'utf8', (error, data) => {
        if (error) {
            return;
        }
        const html = data.replace('{{NAME}}', subscription_name)

        const mailOptions = {
            from: process.env.sender_email,
            to: receiver,
            subject: "Subscription Expiration Warning",
            html: html
        }
        const mailService = getEmailServiceProvider(receiver)
        const transport = createTransport(mailService, process.env.sender_email, process.env.sender_password)

        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.error('Error sending warning email:', error)
            }
            console.log('OTP email sent:', info.response);
        })
    })
}




//receiveremail id and subscription_name
export const SubscriptionRejectionEmail = async (receiver, subscription_name, reason) => {
    fs.readFile("src/templates/institute/subscription_rejected.html", 'utf8', (error, data) => {
        if (error) {
            return;
        }
        const html = data.replace('{{NAME}}', subscription_name).replace('{{REASON}}', reason);

        const mailOptions = {
            from: process.env.sender_email,
            to: receiver,
            subject: "Subscription Rejected",
            html: html
        }
        const mailService = getEmailServiceProvider(receiver)
        const transport = createTransport(mailService, process.env.sender_email, process.env.sender_password)

        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.error('Error sending rejected email:', error)
            }
            console.log('OTP email sent:', info.response);
        })
    })
}


//subscription features
export const SubscriptionActivationEmail = async (receiver, subscription_name, expirydate, startdate, transactionid) => {

    fs.readFile("src/templates/institute/subscription_activation.html", 'utf8', (error, data) => {
        if (error) {
            return;
        }
        const html = data.replace('{{startDate}}', startdate).replace('{{expiryDate}}', expirydate).replace('{{transactionId}}', transactionid).replace('{{planName}}', subscription_name);

        const mailOptions = {
            from: process.env.sender_email,
            to: receiver,
            subject: "Subscription Activated ",
            html: html
        }
        const mailService = getEmailServiceProvider(receiver)
        const transport = createTransport(mailService, process.env.sender_email, process.env.sender_password)
        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.error('Error sending activation email:', error)
            }
            console.log('OTP email sent:', info.response);
        })
    })
}

//subscription cancel email

export const SubscriptionCancelEmail = async (receiver, subscription_name) => {
    console.log("came befroe email sender");

    fs.readFile("src/templates/institute/subscription_cancel.html", 'utf8', (error, data) => {

        if (error) {
            return;
        }
        console.log("came into email sender");

        const html = data.replace('{{planName}}', subscription_name).replace('{{NAME}}', subscription_name);
        const mailOptions = {
            from: process.env.sender_email,
            to: receiver,
            subject: "Subscription Cancelled",
            html: html
        }
        const mailService = getEmailServiceProvider(receiver)
        const transport = createTransport(mailService, process.env.sender_email, process.env.sender_password)

        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.error('Error sending cancel email:', error)
            }
            console.log('OTP email sent:', info.response);
        })
    })
}