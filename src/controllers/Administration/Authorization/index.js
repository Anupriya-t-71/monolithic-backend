import {
  UserModel,
  Otps,
  Tokens,
} from "../../../models/Administration/Authorization/index.js";
import {
  generateUUID,
  generateOtp,
  getId,
  sentOtpEmail,
  generateToken,
  sendSuccessEmail,
} from "../../../utils/helpers.js";
import {
  comparePassword,
  hashPassword,
} from "../../../services/authServices.js";
import { PlatformPermissions } from "../../../models/Administration/Roles_And_Permissions/index.js";
import Validations from "../../../validations/index.js";

import { InstituteUser } from "../../../models/Institutes/Administration/Authorization/index.js";

import sendEmail from "../../../Notification/Mail.js";

import nodemailer from "nodemailer";

import multer from "multer";

var BlockLogin = [];
var BlockOtp = [];
setTimeout(() => {
  BlockLogin = [];
  BlockOtp = [];
}, 600000);

export const OtpSender = async (email, otp, token) => {
  try {
    const sentOtp = await sentOtpEmail(email, otp);
    return sentOtp;
  } catch (error) {
    throw error;
  }
};

export const resendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const block = BlockOtp.includes(email);
    if (block) {
      return res.json({
        message: "OTP sended on mail check it,try again after 10min.",
      });
    }

    const findOtp = await Otps.findOne({ email: email, is_delete: false });

    if (findOtp && findOtp.attempt == 4) {
      BlockOtp.push(email);
      Otps.findOneAndUpdate({ email }, { is_delete: true });
      return res.json({
        message: "achived more attempt,try again after 10min.",
      });
    }

    if (findOtp) {
      const { otp, token } = await generateOtp();
      await Otps.findOneAndDelete({ email });
      const storeOtp = new Otps({
        otp,
        token,
        validated: false,
        email,
        attempt: findOtp.attempt + 1,
      });
      await storeOtp.save();
      await sentOtpEmail(email, otp);
      return res.json({
        message: "OTP generated and sent successfully.",
        otp: otp,
        token: token,
        email
      });
    } else {
      const { otp, token } = await generateOtp();
      const storeOtp = new Otps({
        otp,
        token,
        validated: false,
        email,
        attempt: findOtp?.attempt + 1 || 1,
      });
      await storeOtp.save();
      await sentOtpEmail(email, otp);
      return res.json({
        message: "OTP generated and sent successfully.",
        otp: otp,
        token: token,
        email:email
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const {
      email,
      first_name,
      last_name,
      password,
      phone_number,
      role,
      institute_id,
    } = req.body;

    const hashedPassword = await hashPassword(password);
    const user = new UserModel({
      email,
      first_name,
      last_name,
      password: hashedPassword,
      phone_number,
      role,
    });
    await user.save();
    const { otp, token } = await generateOtp();

    const data = await OtpSender(email, otp, token);

    res.status(200).json({
      status: "success",
      message: "OTP sent successfully",
      data: {
        token,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "failed", message: error?.message, data: null });
  }
};

export const validateOTP = async (req, res) => {
  try {
    const nowDate = new Date();
    const value = Validations.OtpValidation(req.body);

    const getOtpDetails = await Otps.findOne({
      email: value.email,
      token: value.token,
      otp: value.otp,
    });

    if (!getOtpDetails) {
      throw new Error("Invalid OTP or token or OTP expired");
    }

    if (nowDate >= getOtpDetails.createdAt) {
      await Otps.findOneAndDelete({ email: getOtpDetails.email });
      throw new Error("Invalid OTP or token or OTP expired");
    }

    const checkTokenExists = await Tokens.findOne({ email: value.email });

    if (getOtpDetails.validated && checkTokenExists) {
      const user = await UserModel.findOne({ email: value.email });
      const permissions = await PlatformPermissions.find({
        platform_role: user?.role,
      });
      return res
        .status(200)
        .json({
          status: "success",
          message: "otp validated successfully",
          data: {
            token: checkTokenExists.token,
            userId: user?.uuid,
            user: user,
            permissions: permissions,
          },
        });
    }
    if (getOtpDetails) {
      const user = await UserModel.findOneAndUpdate(
        { email: value.email },
        { is_email_verified: true, is_two_auth_completed: true }
      );
      const updateOtp = await Otps.findOneAndUpdate(
        { email: value.email },
        { validated: true }
      );

      if (checkTokenExists) {
        const user = await UserModel.findOne({ email: value.email });
        const permissions = await PlatformPermissions.find({
          platform_role: user?.role,
        });
        return res
          .status(200)
          .json({
            status: "success",
            message: "otp validated successfully",
            data: {
              token: checkTokenExists.token,
              userId: user?.uuid,
              user: user,
              permissions: permissions,
            },
          });
      } else {
        const generatedToken = generateToken(user);
        const permissions = await PlatformPermissions.find({
          platform_role: user?.role,
        });

        const updateToken = new Tokens({
          token: generatedToken,
          email: value?.email,
        });

        await updateToken.save();

        res
          .status(200)
          .json({
            status: "success",
            message: "OTP verified successfully",
            data: {
              userId: user.uuid,
              token: generatedToken,
              user: user,
              permissions: permissions,
            },
          });
      }
    } else {
      throw new Error("OTP doesn't match");
    }
  } catch (error) {
    console.log(error, "error");
    res
      .status(500)
      .json({ status: "failed", message: error.message, data: null });
  }
};

export const Login = async (req, res) => {
  try {
    const value = Validations.platformLogin(req.body);

    // const loginatmp = BlockLogin.find(user => user.email == value.email)
    // if(loginatmp){
    //   if(loginatmp.attempt >= 4){
    //    return res.status(400).json({status:"Failed",message:"try sometime later, your reach limit."})
    //   }
    // }

    const user = await UserModel.findOne({ email: value.email });

    if (!user) {
      throw new Error("User not found with this credentials");
    }

    const passwordCheck = await comparePassword(value.password, user?.password);

    if (passwordCheck) {
      if (user?.is_two_auth_completed) {
        const userToken = await Tokens.findOne({ email: value.email });
        const permissions = await PlatformPermissions.find({
          platform_role: user.role,
        });

        if (userToken) {
          return res.status(200).json({
            status: "success",
            message: "login successfully",
            data: {
              token: userToken.token,
              userId: user?.uuid,
              permissions: permissions,
              user: user,
            },
          });
        } else {
          const generatedToken = generateToken(user);
          const updateToken = new Tokens({
            token: generatedToken,
            email: user.email,
          });
          await updateToken.save();

          return res
            .status(200)
            .json({
              status: "success",
              message: "Login Successfully",
              data: {
                token: generatedToken,
                user: user,
                permissions,
                userId: user?.uuid,
              },
            });
        }
      } else {
        const { otp, token } = await generateOtp();
        await Otps.create({ otp, token, email: user?.email });
        await OtpSender(user?.email, otp);
        return res.status(200).json({
          status: "success",
          message: "OTP sent successfully",
          data: { token: token, otp_status: true, email: user?.email, otp },
        });
      }
    } else {
      // if (loginatmp) {
      //   BlockLogin = BlockLogin.map((u) =>
      //     u.email == value.email ? { ...u, attempt: loginatmp.attempt + 1 } : u
      //   );
      // } else {
      //   BlockLogin.push({ email: value.email, attempt: 1 });
      // }
      throw new Error("password doesn't match");
    }

    // if (passwordCheck) {
    //   const checkOtpExists = await Otps.findOne({ email: value.email });

    //   if (checkOtpExists && checkOtpExists.validated) {
    //     const userToken = await Tokens.findOne({ email: value.email });
    //     const permissions = await PlatformPermissions.find({
    //       platform_role: user.role,
    //     });

    //     return res.status(200).json({
    //       status: "success",
    //       message: "login successfully",
    //       data: {
    //         token: userToken.token,
    //         userId: user?.uuid,
    //         permissions: permissions,
    //         user : user
    //       },
    //     });
    //   } else if (checkOtpExists && !checkOtpExists.validated) {
    // return res.status(200).json({
    //   status: "success",
    //   message: "OTP sent successfully",
    //   data: { token: checkOtpExists?.token, otp_status: true, email: value.email },
    // });
    //   } else {
    //     const { otp, token } = await generateOtp();

    //     const Token = await OtpSender(value.email, otp, token);
    //     res.status(200).json({
    //       status: "success",
    //       message: "OTP sent successfully",
    //       data: {
    //         token,
    //         otp_status : true,
    //         email : value.email
    //       },
    //     });
    //   }
    // } else {
    //   if(loginatmp){
    //    BlockLogin = BlockLogin.map((u)=>u.email == email?{...u,attempt: loginatmp.attempt +1}:u)
    //   }else{
    //    BlockLogin.push( {email, attempt:1})
    //   }
    //   throw new Error("password doesn't match");
    // }
  } catch (error) {
    console.log(error, "error");
    res
      .status(500)
      .json({ status: "failed", message: error.message, data: null });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const user = req.user;
    const userDetails = await UserModel.findOne({ email: user.email }).select(
      "-password -_id -is_two_auth_completed -is_email_verified"
    );
    res.status(200).json({
      status: "success",
      message: "user details retrieved successfully",
      data: userDetails,
    });
  } catch (error) {
    res.status(500).json({ status: "false", message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new Error("Email is required");
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    const existingOtp = await Otps.findOne({
      email,
      type: "reset",
      validated: false,
      createdAt: { $gt: new Date(Date.now() - 10 * 60 * 1000) },
    });

    if (existingOtp) {
      return res.status(200).json({
        status: "success",
        message: "An OTP has already been sent. Please check your email.",
      });
    }

    const { token, otp } = await generateOtp();
    await OtpSender(email, otp, token);

    const storeOtp = new Otps({
      type: "reset",
      email,
      otp,
      token,
      validated: false,
    });
    await storeOtp.save();

    res.status(200).json({
      status: "success",
      message: "OTP sent for password reset",
      data: { token, otp },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const validateOtpAndResetPassword = async (req, res) => {
  try {
    const { email, otp, token } = req.body;

    if (!email || !otp || !token) {
      throw new Error("Email, OTP, and token are required");
    }

    const otpRecord = await Otps.findOne({ email, otp, token});
    if (!otpRecord || otpRecord.validated) {
      throw new Error("Invalid or already used OTP");
    }

    // if (new Date() - otpRecord.createdAt > 10 * 60 * 1000) {
    //   throw new Error("OTP has expired. Please request a new one.");
    // }

    otpRecord.validated = true;
    await otpRecord.save();

    res
      .status(200)
      .json({ status: "success", message: "OTP validated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      throw new Error("Email, new password, and confirm password are required");
    }

    if (newPassword !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    res
      .status(200)
      .json({ status: "success", message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendingMailToAll = async (req, res) => {
  try {
    const studentsAndTeacher = await InstituteUser.find({}, "email");
    console.log(studentsAndTeacher);
    if (studentsAndTeacher.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }

    const emails = studentsAndTeacher
      .map((studentsAndTeacher) => studentsAndTeacher.email)
      .join(",");

    // Email Content
    const mailOptions = {
      from: "your-email@gmail.com",
      to: emails,
      subject: req.body.subject || "Important Notice",
      html:
        req.body.message ||
        "<p>Hello Students,</p><p>This is a notification.</p>",
    };
    sendEmail(mailOptions);

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.sender_mail,
        pass: process.env.sender_password,
      },
    });

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email send error:", error);
        return res.status(500).json({ error: "Failed to send email" });
      }
      res.status(200).json({ message: "Emails sent successfully", info });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  const { email } = req.body;
  try {
    await Tokens.findOneAndUpdate({ email }, { is_deleted: true });
    res.status(200).send({
      status: "Success",
      message: "User logout successful",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Function to calculate total file size
const calculateTotalSize = (files) => {
  if (!files || files.length === 0) return 0;
  return files.reduce((totalSize, file) => totalSize + file.size, 0);
};

// File Upload Handler
export const uploadFiles = (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const totalSize = calculateTotalSize(files);
    return res.json({ totalSize, message: "Files uploaded successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error processing files", error });
  }
};

export const updateUserDetails = async (req, res) => {
  try {
    const user = req.user;
    const { email, first_name, last_name, phone_number,username,fullname,image} = req.body;
    if (!email || !first_name || !last_name || !phone_number) {
      return res.status(400).json({ message: "All values are required" });
    }
    const updatedDetails = await UserModel.findOneAndUpdate(
      { email: user.email },
      { first_name, last_name, phone_number,username,fullname,image},
      { new: true }
    );

    if (!updatedDetails) {
      return res
        .status(404)
        .json({ status: "failed", message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      message: "User details updated successfully",
      data: updatedDetails,
    });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

// Exporting multer middleware for use in routes
export const uploadMiddleware = upload.array("files");
