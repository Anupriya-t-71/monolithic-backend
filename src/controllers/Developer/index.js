import jwt from 'jsonwebtoken';
import { generateOtp, generateToken, sentOtpEmail } from "../../utils/helpers.js";
import bcrypt from 'bcryptjs'
import { User } from '../../models/Developers/index.js';
import crypto from 'crypto';
import { createLogger } from '../ActivityLogs/index.js';
import { Otps, Tokens, UserModel } from '../../models/Administration/Authorization/index.js';
import Validations from '../../validations/index.js';
import { comparePassword, hashPassword } from '../../services/authServices.js';
import { OtpSender } from '../Administration/Authorization/index.js';
import { PlatformPermissions } from '../../models/Administration/Roles_And_Permissions/index.js';


export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check for required fields
    if (!name || !email || !password) {
      return res.status(400).json({ status: "failed", message: "Missing required fields" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: "failed", message: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP



    const user = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      isVerified: false,
    });

    const sentOtp = sentOtpEmail(email, otp);

    await user.save();




    return res.redirect('/developer/verify');

    // res.status(201).json({ status: "success", message: "User registered. OTP sent to email." })
  } catch (error) {
    console.error("Error in registerController:", error);
    res.status(500).json({ status: "failed", message: "Internal Server Error" });
  }
};


export const verifyUser = async (req, res) => {
  try {
    const value = Validations.OtpValidation(req.body);

    const getOtpDetails = await Otps.findOne({ email: value.email, token: value.token, otp: value.otp });

    if (!getOtpDetails) {
      throw new Error("Invalid OTP, token, or OTP expired");
    }

    const user = await UserModel.findOne({ email: value.email });
    const checkTokenExists = await Tokens.findOne({ email: value.email });

    if (getOtpDetails.validated && checkTokenExists) {
      const permissions = await PlatformPermissions.find({ platform_role: user?.role });
      return res.status(200).json({
        status: "success",
        message: "OTP already validated",
        data: { token: checkTokenExists.token, userId: user?.uuid, user, permissions },
      });
    }

    await UserModel.updateOne({ email: value.email }, { is_email_verified: true, is_two_auth_completed: true });
    await Otps.updateOne({ email: value.email }, { validated: true });

    if (checkTokenExists) {
      const permissions = await PlatformPermissions.find({ platform_role: user?.role });
      return res.status(200).json({
        status: "success",
        message: "OTP validated successfully",
        data: { token: checkTokenExists.token, userId: user?.uuid, user, permissions },
      });
    }

    const generatedToken = generateToken(user);
    const permissions = await PlatformPermissions.find({ platform_role: user?.role });

    await Tokens.create({ token: generatedToken, email: value.email });

    res.status(200).json({
      status: "success",
      message: "OTP verified successfully",
      data: { token: generatedToken, userId: user.uuid, user, permissions },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: error.message, data: null });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ status: "failed", message: "Email is required", data: null });
    }

    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ status: "failed", message: "User not found", data: null });
    }

    await Otps.deleteOne({ email });

    const { otp, token } = await generateOtp();

    await Otps.create({
      email,
      otp,
      token
    });

    await OtpSender(email, otp, token);

    res.status(200).json({
      status: "success",
      message: "New OTP sent successfully",
      data: { email, token },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: error.message, data: null });
  }
};




export const loginUser = async (req, res) => {
  try {
    const value = Validations.platformLogin(req.body);
    const user = await UserModel.findOne({ email: value.email });

    if (!user) {
      throw new Error("User not found with this email");
    }

    const isPasswordValid = await comparePassword(value.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const existingOtp = await Otps.findOne({ email: value.email });
    const userToken = await Tokens.findOne({ email: value.email });
    const permissions = await PlatformPermissions.find({ platform_role: user.role });

    if (existingOtp && existingOtp.validated) {
      if (!userToken) {
        const generatedToken = generateToken(user);
        await Tokens.create({ token: generatedToken, email: value.email });
    
        return res.status(200).json({
          status: "success",
          message: "Login successful",
          data: { token: generatedToken, userId: user.uuid, email: value.email, user, permissions },
        });
      }
    
      return res.status(200).json({
        status: "success",
        message: "Login successful",
        data: { token: userToken.token, userId: user.uuid, email: value.email, user, permissions },
      });
    }
    

    const { otp, token } = await generateOtp();
    await OtpSender(value.email, otp, token);
    await Otps.updateOne(
      { email: value.email },
      { otp, token, validated: false },
      { upsert: true }
    );

    res.status(200).json({
      status: "success",
      message: "OTP sent successfully",
      data: { token, otp_status: true, email: value.email },
    });
  } catch (error) {
    console.error("Login Error:", error.message, error.stack);
    res.status(500).json({ status: "failed", message: error.message, data: null });
  }
};




export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new Error("email is required");
    }
    const user = await UserModel.findOne({ email: email });
    
    if (!user) {
      throw new Error("User not found");
    }

    const { token, otp } = await generateOtp();

    await OtpSender(email, otp, token);

    const storeOtp = new Otps({ type: "reset", email, otp, token });
    await storeOtp.save();
 
    res.status(200).json({
      status: "success",
      message: "OTP sent for password reset",
      data: {token: token, email: email, otp:otp}
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const value = Validations.ResetPasswordValidations(req.body);
    const { email, otp, token, newPassword} = req.body; 
    

    const otpRecord = await Otps.findOne({
      email: value.email,
      otp: value.otp,
      token: value.token,
      type: "reset",
    });



    if (!otpRecord) {
      throw new Error("Invalid OTP or token");
    }

    const user = await UserModel.findOne({ email: value.email });
    if (!user) {
      throw new Error("User not found");
    }

    const password = await hashPassword(value.confirm_password);
    user.password = password;
    user.save();

    await Otps.findOneAndUpdate({ email: value.email},{ validated: true });

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



export const logoutUser = async (req, res) => {
  const { email } = req.body;
  console.log("email", email)
  try {
    await Tokens.findOneAndDelete({email: email});
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


export const getProfile = async (req, res) => {
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

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    return res.status(200).json(users)
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send('Error fetching users');
  }
}

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?._id;
    console.log("User", userId)
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required." });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      { _id: userId },
      { first_name : name, email: email  },
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      message: "Profile updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({ error: "An error occurred while updating the profile." });
  }
};
