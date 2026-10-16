import * as InstituteAuthModels from "../../../../models/Institutes/Administration/Authorization/index.js";
import * as AuthHelpers from "../../../../services/authServices.js";
import * as Helpers from "../../../../utils/helpers.js";
import { InstituteAdmin } from "../../../../models/Administration/Authorization/index.js";
import {
  DefaultFilterQuerys,
  DefaultUpdateFields,
  InstituteAdminFields,
} from "../../../../utils/data.js";
import {
  InstitutePermissions,
  InstitutesRoles,
} from "../../../../models/Administration/Roles_And_Permissions/index.js";
import Branch from "../../../../models/Institutes/Branch/index.js";
import Institute from "../../../../models/Institutes/Institute/index.js";
import {
  getBranchDetailsWithUUID,
  getInstituteDetailswithUUID,
} from "../../common/index.js";
import Validations from "../../../../validations/index.js";
import { hashPassword } from "../../../../services/authServices.js";
import { trusted } from "mongoose";
import { updateSubscription } from "../../../../middlewares/subscription/index.js";
import Upload from "../../../../models/fileUpload/fileUpload.js";


const OtpSender = async (email, otp) => {
  try {
    const mail = await Helpers.sentOtpEmail(email, otp);
    return mail;
  } catch (error) {
    return error;
  }
};

const checkOtp = async (email,token) => {
  try {
    const otp = await InstituteAuthModels.InstituteOtps.findOne({ email,token,validated:false,is_delete:false });
    return otp;
  } catch (error) {
    return error;
  }
};

const checkToken = async (email) => {
  try {
    const token = await InstituteAuthModels.InstituteTokens.findOne({ email });
    return token ? token.token : null;
  } catch (error) {
    return error;
  }
};

const TokenProvider = async (email, admin) => {
  try {
    const otp = await checkOtp(email);
    const token = await checkToken(email);

    if (admin.is_two_auth_completed) {
      const role = await InstitutesRoles.findOne({ _id: admin.role });
      const permissions = await InstitutePermissions.find({ role: role.id });
      const branches = await Branch.findOne({ _id: admin.branch ,is_deleted:false,is_active:true});
      const institue = await Institute.findOne({ _id: admin.institute_id });

      if (token) {
        return {
          status: "success",
          message: "Login successfully",
          data: {
            token: token,
            userId: admin.uuid,
            user: admin,
            permissions,
            branches,
            institute: institue,
          },
        };
      } else {
        const UserToken = Helpers.generateInstituteToken(admin);
        const addToken = await InstituteAuthModels.InstituteTokens.create({
          token: UserToken,
          email: admin.email,
        });
        return {
          status: "success",
          message: "Logged in successfully",
          data: {
            userId: admin.uuid,
            token: UserToken,
            user: admin,
            permissions,
            branches,
            institute: institue,
          },
        };
      }
    } else {
      if (otp) {
        const sendOtp = await OtpSender(email, otp?.otp);
        return {
          status: "sucess",
          message: "Otp sent successfully",
          data: { token: otp?.token, otpVerify: true, email,otp: otp.otp },
        };
      } else if (!otp) {
        const { token, otp } = await Helpers.generateOtp();
        const addOtp = await InstituteAuthModels.InstituteOtps.create({
          token: token,
          otp: otp,
          email: email,
        });
        const sendOtp = await OtpSender(email, otp);
        return {
          status: "sucess",
          message: "Otp sent successfully",
          data: { token: token, otpVerify: true, email, otp },
        };
      }
    }
  } catch (error) {
    return error;
  }
};


export const InstituteAdminUserRegisterController = async (req, res) => {
  try {
  const value = await Validations.createInstituteUser(req.body)
  const { institute_id,branch} = value
  const institue = await getInstituteDetailswithUUID(institute_id)
  const branches = await getBranchDetailsWithUUID(branch)
  const role = await InstitutesRoles.findOne({_id:value.role})
   const password = await AuthHelpers.hashPassword(value.password); 
  // if(value.password===value.confirm_password){

  // } else{
  //   return res.status(400).json({
  //     status:"Failed",
  //     message:"password and confirm password must be same"
  //   })
  // }
   const user = await InstituteAdmin.create({...value,institute_id:institue._id,branch:branches._id,password,role:role._id})
   Upload.updateOne({file:value.image},{is_active:true})
  await updateSubscription("Admins",req.user.institute_id)
  res.status(200).json({status:"success",message:"user created successfully",data:user})
  } catch (error) {
    res.status(500).json({ status: "fail", message: error?.message });
  }
};

export const getInstituteAdminUserDetailsWithUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await InstituteAdmin.findOne({ uuid: userId })
      .populate("role")
      .populate("branch");
    res
      .status(200)
      .json({
        status: "success",
        message: "user details retrieved successfully",
        data: user,
      });
  } catch (error) {
    res.status(500).json({ status: "falied", message: error?.message });
  }
};

export const updateInstituteUserDetailsWithUUID = async (req, res) => {
  try {
    const { userId } = req.params;
    const value = Helpers.FilterQuery(req.body, DefaultUpdateFields.adminUser);

    const updateUser = await InstituteAdmin.findOneAndUpdate(
      { uuid: userId },
      { ...value },
      { new: true }
    );
    res
      .status(200)
      .json({
        status: "success",
        message: "user udpated successfully",
        data: updateUser,
      });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error?.message });
  }
};

export const deleteInstituteUserWithUUID = async (req, res) => {
  try {
    const { userId } = req.params;
    const deleteUser = await InstituteAdmin.findOneAndUpdate(
      { uuid: userId },
      { is_delete: true }
    );
    res
      .status(200)
      .json({
        status: "success",
        message: "user deleted successfully",
        data: deleteUser,
      });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error?.message });
  }
};

export const getInstituteUserListWithBranch = async (req, res) => {
  try {
    const { institute_id, branch_id } = req.query;

    const institute = await getInstituteDetailswithUUID(institute_id);

    const branch = await getBranchDetailsWithUUID(branch_id);
    const querys = Helpers.FilterQuery(req.query, DefaultFilterQuerys.user);
    let { page = 1, perPage = 10 } = req.query;
    parseInt(page);
    parseInt(perPage);
    const count = await InstituteAdmin.countDocuments({
      ...querys,
      institute_id: institute._id,
      branch: branch?._id,
      is_delete: false,
    });
    const users = await InstituteAdmin.find({
      ...querys,
      institute_id: institute._id,
      branch: branch?._id,
      is_delete: false,
    })
      .populate("role")
      .skip((page - 1) * perPage)
      .limit(perPage);
    const totalPages = Math.ceil(count / perPage);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    res
      .status(200)
      .json({
        status: "true",
        message: "users retrieved successfully",
        data: users,
        count: count,
        currentPage: page,
        last_page: totalPages,
        hasNextPage,
        hasPreviousPage,
      });
  } catch (error) {
    res.status(500).json({ status: "false", message: error?.message });
  }
};

export const InstituteAdminLoginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await InstituteAdmin.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        status: "failed",
        message: "user not found with this credentials",
      });
    }
    const decodedPassword = await AuthHelpers.comparePassword(
      password,
      admin.password
    );
    if (decodedPassword) {
      const token = await TokenProvider(email, admin);
      res.status(200).json(token);
    } else {
      return res
        .status(500)
        .json({ status: "failed", message: "Password doesn't match" });
    }
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

export const OtpValidator = async (req, res) => {
  
  const currentTime = Date.now();

  try {
    const { token, email, otp } = Validations.insttituteotp(req.body);
    const adminOtp = await checkOtp(email,token);
    const expireTime = new Date(adminOtp.createdAt).getTime() + 360000;

    if (expireTime <= currentTime) {
      await InstituteAuthModels.InstituteOtps.findByIdAndDelete(adminOtp._id)
      return res.status(500).json({ status: "failed", message: "otp expired" });
    }
 
    if (token === adminOtp?.token && otp === adminOtp?.otp) {
      const admin = await InstituteAdmin.findOne({ email });
      admin.is_two_auth_completed = true;
      admin.two_auth_completed_at = new Date();
      admin.save();
      const updateOtpDetails =
        await InstituteAuthModels.InstituteOtps.findOneAndUpdate(
          { email },
          { validated: true }
        );
      const findToken = await InstituteAuthModels.InstituteTokens.findOne({
        email,
      });

      if (findToken) {

      const role = await InstitutesRoles.findOne({ _id: admin.role });
      const permissions = await InstitutePermissions.find({ role: role.id });
      const branches = await Branch.find({ institute_id: admin.institute_id });
      const institue = await Institute.findOne({ _id: admin.institute_id }).select("uuid _id");

        return res.status(200).json({
          status: "success",
          message: "otp verification successfully",
          data: {
            token: findToken.token,
            userId: admin.uuid,
            user: admin,
            permissions,
            branches,
            institute: institue,
          },
        });
      }

      const UserToken = Helpers.generateInstituteToken(admin);
      const updateToken = await InstituteAuthModels.InstituteTokens.create({
        token: UserToken,
        email: email,
      });
      const role = await InstitutesRoles.findOne({ _id: admin.role });
      const permissions = await InstitutePermissions.find({ role: role.id });
      const branches = await Branch.find({
        institute_id: admin.institute_id,
        is_active: true,
        is_deleted: false,
      });
      const institue = await Institute.findOne({ _id: admin.institute_id });

      res.status(200).json({
        status: "success",
        message: "Otp verification successfully",
        data: {
          token: UserToken,
          userId: admin.uuid,
          user: admin,
          permissions,
          branches,
          institute: institue,
        },
      });
    } else {
      res.status(500).json({ status: "failed", message: "otp verification failed" });
    }
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ status: "failed", message: error.message, data: null });
  }
};

export const GetInstituteAdminController = async (req, res) => {
  const { email } = req.user
  try {
    const admin = await InstituteAdmin.findOne({ email }).populate({path:"role"}).populate({path:"institute_id",select:"uuid _id"}).populate({path:"branch",select:"uuid _id"})
    const adminObject = Helpers.Convert_db_data_to_object(admin);
    const data = Helpers.FilterData(adminObject, InstituteAdminFields);
    res.status(200).json({
      status: "success",
      message: "admin details retrieved successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

export const InstituteAdminLogoutController = async (req, res) => {
  const { email } = req.body;

  try {
    await InstituteAuthModels.InstituteTokens.deleteOne({ email });
    await InstituteAdmin.findOneAndUpdate(
      { email },
      { is_two_auth_completed: false }
    );
    await InstituteAuthModels.InstituteOtps.deleteMany({ email });
    res.status(200).json({
      status: "success",
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

export const ChangePassword = async (req,res) => {
   try {
    const value = Validations.ChangePassword(req.body)
    const { current_password, confirm_password, new_password } = value 
    const { email } = req.user

    const user = await InstituteAdmin.findOne({ email })

    if(!user){
      return res.status(500).json({ status: 'failed', message : "user not found"})
    }

    const isMatch = await AuthHelpers.comparePassword(current_password,user?.password)

    if(!isMatch){
      return res.status(500).json({ status: "failed", message: "old password is wrong"})
    }
    const hashedNewPassword = await AuthHelpers.hashPassword(new_password)
    const hashedConfirmPassword = await AuthHelpers.hashPassword(confirm_password)
    

    user.password = hashedNewPassword
    user.save()
    res.status(200).json({ status: 'success', message : "password changed successfully", data: null})

   } catch (error) {
     res.status(500).json({ status: "failed", message : error?.message })
   }
}

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const forget = await InstituteAdmin.findOne({email: email });
    if (!forget) {
      throw new Error("User not found with this email");
    }
    const opts = await InstituteAuthModels.InstituteOtps.findOne({email:forget?.email,validated:false})
    if (opts){
       return res.status(200).json({ status: "success",  message: "OTP already sended",  data: { token : opts?.token } });
    }
    const { otp, token } = await Helpers.generateOtp();
    await OtpSender(email, otp, token);
    const storeOtp = new InstituteAuthModels.InstituteOtps({
      email:email,
      otp,
      token,
    });
    await storeOtp.save();

    return res.status(200).json({
      status: "Success ",
      message: "OTP Sent successfully",
      token,
      otp,
      email,
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(500).json({ status: "failed", message: error.message });
  }
};

export const validateOtp = async (req, res) => {
  try {
    const { email, otp, token } = req.body;

    if (!email || !otp || !token) {
      throw new Error("Email, OTP, and token are required");
    }

    const otpRecord = await InstituteAuthModels.InstituteOtps.findOne({
      email: email,
      otp: otp,
      token: token,
    });

    if (!otpRecord) {
      throw new Error("Invalid OTP or token");
    }

    if (otpRecord.validated) {
      throw new Error("OTP has already been used");
    }

    await InstituteAuthModels.InstituteOtps.updateOne(
      { email: email, otp: otp, token: token },
      { validated: true }
    );

    return res.status(200).json({
      status: "success",
      message: "OTP validated successfully",
    });
  } catch (error) {
    console.error("Error in validateOtp:", error);
    return res.status(500).json({ status: "failed", message: error.message });
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

    const user = await InstituteAdmin.findOne({ email: email });
    if (!user) {
      throw new Error("User not found");
    }

    const hashedPassword = await AuthHelpers.hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error in updatePassword:", error);
    return res.status(500).json({ status: "failed", message: error.message });
  }
};



// export const validateOtpAndResetPassword=async(req,res)=>{
//   try{
//    //const {email,otp,newPassword,token}=req.body;
//     const value = Validations.ResetPasswordValidations(req.body)
//     const {token,otp,email} = value

//     const isValidOtp=await InstituteAuthModels.InstituteOtps.findOne({email, otp, token})
//     if(!isValidOtp){
//       if(!token){
//            throw new error("The token is missing or invalid. Please provide a valid token." );
//           }
//           throw new error("The provided OTP is invalid. Please make sure you entered the correct OTP and try again")
//         }
//       const isOldPasswordValid = await comparePassword(oldPassword, user.password);
//            if (!isOldPasswordValid) {
//             throw new error( "Old password is incorrect" );
//   }

//         const hashedPassword = await hashPassword(newPassword);
//         await InstituteAuthModels.InstituteUser.findOneAndUpdate({ email }, { password: hashedPassword });

//         return res.status(200).json({ status: "success", message: "Password reset successfully" });
//       } catch (error) {
//         console.error("Error in resetPassword:", error);
//         return res.status(500).json({ status: "failed", message: error.message});
//       }

//     };

export const validateOtpAndResetPassword = async (req, res) => {
  try {
    const value = Validations.ResetPasswordValidations(req.body);
    const otpRecord = await InstituteAuthModels.InstituteOtps.findOne({
      email: value.email,
      otp: value.otp,
      token: value.token,
    });
    if (!otpRecord) {
      throw new Error("Invalid Otp Or Token");
    }
    const user = await InstituteAdmin.findOne({ email: value.email });
    if (!user) {
      throw new Error("User not found");
    }
    const password = await hashPassword(value.confirm_password);
    user.password = password;
    user.save();
    await InstituteAuthModels.InstituteOtps.findOneAndUpdate(
      { email: value.email },
      { validated: true }
    );
    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword", error);
    return res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

// const TokenProvider = async ( email,admin ) => {
//     try {
//         const otp = await checkOtp(email)
//         const token = await  checkToken(email)
//         if(otp || token ){
//           const role = await InstitutesRoles.findOne({_id:admin.role})
//           const permissions = await InstitutePermissions.find({role:role.id})
//           const branches = await Branch.find({institute_id:admin.institute_id})
//           const institue = await Institute.findOne({_id:admin.institute_id})
//           if(token){
//             return{
//              status:"success",
//              message:"Login successfully",
//              data:{
//                 token:token,
//                 userId: admin.uuid,
//                 user:admin,
//                 permissions,branches,institue
//              }
//             }
//           }else{
//             const UserToken =  Helpers.generateInstituteToken(admin)
//             const addToken = await InstituteAuthModels.InstituteTokens.create({token:token,email:admin.email})
//             return{
//                 status:"success",
//                 message:"Loged in successfully",
//                 data:{
//                     userId:admin.uuid,
//                     token:UserToken
//                 }
//             }
//           }
//         }else{
//           const { token,otp} = await Helpers.generateOtp()
//           const addOtp = await InstituteAuthModels.InstituteOtps.create({token:token,otp:otp,email:email})
//           const sendOtp = await OtpSender(email,otp)
//           return {
//             status:"sucess",
//             message:"Otp sent successfully",
//             data:{token:token}
//           }
//         }

//     } catch (error) {
//       return error
//     }
// }

// export const InstituteAdminLoginController = async (req,res) => {
//     const {email,password} = req.body
//     try {
//         const admin = await InstituteAdmin.findOne({email})

//         if(!admin){
//           return res.status(404).json({status:"failed",message:"user not found with this credentials"})
//         }
//         const decodedPassword = await AuthHelpers.comparePassword(password,admin.password)
//         if(decodedPassword){
//          const token = await  TokenProvider(email,admin)
//          res.status(200).json(token)
//         }else{
//           return res.status(500).json({status:"failed",message:"Password dosen't match"})
//         }
//     } catch (error) {
//        res.status(500).json({status:"failed",message:error.message})
//     }
// }

// export const OtpValidator = async (req,res) => {

//     const {token,email,otp} = req.body
//     try {
//      const adminOtp = await checkOtp(email)

//      if(token===adminOtp.token&&otp===adminOtp.otp){
//        const admin = await InstituteAdmin.findOne({email})
//        const updateOtpDetails = await InstituteAuthModels.InstituteOtps.findOneAndUpdate({email},{validated:true})
//        const findToken = await InstituteAuthModels.InstituteTokens.findOne({email})

//        if(findToken){
//         return res.status(200).json({status:"success",message:"otp verfication successfully",data:{token:findToken.token,userId:admin.uuid}})
//        }
//        const UserToken = Helpers.generateInstituteToken(admin)
//        const updateToken = await InstituteAuthModels.InstituteTokens.create({token:UserToken,email:email})
//        res.status(200).json({status:"success",message:"Otp verification successfully",data:{token:UserToken,userId:admin.uuid}})
//      }else{
//         res.status(500).json({status:"failed",message:"otp verification failed"})
//      }
//     } catch (error) {
//       res.status(500).json({status:"failed",message:error.message,data:null})
//     }
// }

// export const GetInstituteAdminController = async (req,res) => {
//   try {
//    const admin = await InstituteAdmin.findOne({email:"project.emern@gmail.com"})
//    const adminObject = Helpers.Convert_db_data_to_object(admin)
//    const data  = Helpers.FilterData(adminObject,InstituteAdminFields)
//    res.status(200).json({status:"success",message:"admin details retrived successfully",data})
//   } catch (error) {
//     res.status(500).json({status:"failed",message:error.message})
//   }

//   };