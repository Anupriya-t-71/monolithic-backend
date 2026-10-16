import {
  Non_TeachingStaff,
  Student,
  Teaching_Staff,
} from "../../../../models/Administration/Authorization/index.js";
import { InstitutesRoles } from "../../../../models/Administration/Roles_And_Permissions/index.js";
import { InstituteNon_TeachingStaff, InstituteOtps, InstituteStudent, InstituteTeaching_Staff, InstituteTokens, InstituteUser } from "../../../../models/Institutes/Administration/Authorization/index.js";
import Offline_Model from "../../../../models/Institutes/Class/Offline_Model.js";
import Online_Model from "../../../../models/Institutes/Class/Online_Model.js";
import Course from "../../../../models/Institutes/Course/index.js";
import {
  hashPassword,
  comparePassword,
} from "../../../../services/authServices.js";
// import {  generateRandomPassword } from '../../../../utils/helpers.js';

import { DefaultFilterQuerys, DefaultUpdateFields } from "../../../../utils/data.js";
import {
  FilterData,
  FilterQuery,
  generateIDCard,
  generateInstituteToken,
  generateNonTeachStaffId,
  generateOtp,
  generateRandomPassword,
  generateStudentId,
  generateTeachingStaffId,
  generateToken,
  saveIDCardImage,
  sendSuccessEmail,
  sendTemproaryPasswordEmail,
  sentOtpEmail,
} from "../../../../utils/helpers.js";
import updateProfileSchema from "../../../../validations/Institutes/Administration/Authorization/index.js";
import {
  getBatchDetailsWithUUID,
  getBranchDetailsWithUUID,
  getCourseDetailsWithUUID,
  getInstituteDetailswithUUID,
  getRoleDetailsWithName,
  getUserDetailsWithUUID,
} from "../../common/index.js";
import { logActivity } from "../../../../utils/ActivityLogs/index.js"
import Validations from "../../../../validations/index.js";
import { updateSubscription } from "../../../../middlewares/subscription/index.js";
import { createLogger } from "../../../ActivityLogs/index.js";
import mongoose from "mongoose";
import { InstituteTeachingStaffLog } from "../../../../models/Institutes/Activity Logs/index.js";
import staff_attedence from "../../../../models/Institutes/Attendance/Staff/index.js";
import { migrateCoursesForStudent } from "../../../../jobs/resetTwoAuthCompleted.js";
import { Sequence } from "../../../../models/common/common.js";
import { createStudentsIdCards, updateStudentIdCard } from "../../ID_Card/Student.js";
import { CheckUpdateData } from "../../../../utils/index.js";
import StudentIdCard from "../../../../models/Institutes/IdCard/Student_IdCard.js";
import StaffIdCard from "../../../../models/Institutes/IdCard/Staff_IdCard.js";
import { createStaffIdCards } from "../../ID_Card/Staff.js";
import StudentFee from "../../../../models/Institutes/Payment/Student_Fee_Model.js";
import { createStudentfeeNotification } from "../../Notification/student/index.js";
import { sendWelcomeEmail } from "../../../../utils/CentralizedeEmailHandler/centralizedEmailControler.js";
import { generatePassword } from "../../../../utils/generateRandomPassword.js";
import { WelcomeEmailTempate } from "../../../../utils/CentralizedeEmailHandler/templates/WelcomeString.js";
import sendEmail from "../../../../Notification/Mail.js";
import Batch from "../../../../models/Institutes/Batch/index.js"

import { sendWelcomeTeacherEmail } from "../../../../utils/CentralizedeEmailHandler/centralizedEmailControler.js";
import Branch from "../../../../models/Institutes/Branch/index.js";
import { addInitialAttendanceStudent } from "../../Attendance/Staff/index.js";
import Upload from "../../../../models/fileUpload/fileUpload.js";
//import {logActivity} from "../../../../utils/ActivityLogs/index.js"

const currentDate = new Date();

// Define options for date and time formatting
const options = {
  weekday: 'long', // Full name of the day of the week
  day: 'numeric', // Numeric day of the month
  year: 'numeric', // Full year
  hour: 'numeric', // Hour in 12-hour format
  minute: 'numeric', // Minute
  hour12: true, // Use 12-hour format
};


// Format the date according to the options
const formattedDate = new Intl.DateTimeFormat('en-US', options).format(currentDate);




export const getStudentDetailsWithId = async (req, res) => {
  try {
    const { instituteId, studentId } = req.params

    const institue = await getInstituteDetailswithUUID(instituteId)
    const student = await InstituteUser.findOne({ institute_id: institue._id, uuid: studentId })
      .populate({ path: 'userDetail', model: "Student_Login", populate: [{ path: "course" }] })

    res.status(200).json({ status: true, message: "student retrived successfully", data: student })
  } catch (error) {
    res.status(500).json({ stauts: "failed", message: error.message });
  }
};



export const updateStudentDetailsWithUUID = async (req, res) => {
  try {
    const { studentId } = req.params
    const user = FilterQuery(req.body, DefaultUpdateFields.institute_user_student)
    const student = FilterQuery(req.body, DefaultUpdateFields.student)

    const update_user_details = await InstituteUser.findOneAndUpdate({ uuid: studentId }, user, { new: true })
    const update_student_details = await InstituteStudent?.findByIdAndUpdate(update_user_details.userDetail, student)
    const changeIdCardDetails = CheckUpdateData(user, "student")
    const updated = await updateStudentIdCard(update_user_details?._id, changeIdCardDetails)
    console.log(updated, changeIdCardDetails)
    res.status(200).json({ status: 200, message: "student details updated succesfully", data: update_user_details })
  } catch (error) {
    console.log(error, "error")
    res.status(500).json({ status: "failed", message: error?.message })
  }
}

export const deleteStudentWithUUID = async (req, res) => {
  try {
    const { studentId } = req.params

    const student = await InstituteUser?.findOneAndUpdate({ uuid: studentId }, { is_delete: true }, { new: true })
    res.status(200).json({ status: "success", message: "student delted successfully", data: student })
  } catch (error) {
    res.status(500).json({ status: "failed", message: error?.message })
  }
}

export const getStudentActivityLogsWithId = async (req, res) => {
  try {
    const data = [{ titlte: "student login", description: "student logined in student portal", id: 1 }]
    res.status(200).json({ status: "success", message: "student Activits retrived successfully", data: data })
  } catch (error) {
    res.status(500).json({ status: "failed", message: error?.message })
  }
}

export const getStudentClassDetails = async (req, res) => {
  try {
    const { institue, branch, course } = req.query
    const online_class = await Online_Model.find({ branch: branch, institute: institue, course: course }).populate({ path: "batch" })
    const offline_class = await Offline_Model.find({ branch: branch, institute: institue, course: course }).populate({ path: "batch" })
    res.status(200).json({ status: "success", message: "class details retrived succesfully", data: { online_class, offline_class } })
  } catch (error) {
    res.status(500).json({ status: "failed", message: error?.message })
  }
}

export const getNonstaffDetailsWithId = async (req, res) => {
  try {
    const { instituteId, branchId } = req.params

    const institue = await getInstituteDetailswithUUID(instituteId)
    const branch = await getBranchDetailsWithUUID(branchId)
    const role = await getRoleDetailsWithName("Non Teaching Staff")
    const Nonteach = await InstituteUser.find({ institute_id: institue._id, branch_id: branch._id, role: role._id }).populate({ path: 'userDetail', model: 'non-teachingstaff_login' })

    res.status(200).json({ status: true, message: "Nonteach staff retrived successfully", data: Nonteach })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving Non Teaching Staff.',
      error: error.message,
    });
  }
}

export const getStaffDetailsWithFilter = async (req, res) => {
  try {
    const { instituteId, branchId } = req.params
    const { type } = req.query

    const role = {
      Teaching: "Teaching Staff",
      "Non Teaching": "Non Teaching Staff"
    }

    const institue_details = await getInstituteDetailswithUUID(instituteId)
    const branch_details = await getBranchDetailsWithUUID(branchId)
    const role_details = await getRoleDetailsWithName(role[type])

    const staff_details = await InstituteUser.find({ institute_id: institue_details?._id, branch_id: branch_details?._id, role: role_details?._id })
    res.status(200).json({ status: "sucess", message: "staff details retrived successfully", data: staff_details })
  } catch (error) {
    res.status(500).json({ status: "failed", message: error?.message })
  }
}


export const getteachstaffDetailsWithID = async (req, res) => {
  try {
    const { instituteId, branchId } = req.params;
    let { page = 1, perPage = 10 } = req.query;

    page = parseInt(page, 10);
    perPage = parseInt(perPage, 10);

    const filterArgs = FilterQuery(req.query, DefaultFilterQuerys.institute_user);
    const teachingStaffQuerys = FilterQuery(req.query, DefaultFilterQuerys.teaching_staff);

    const institute = await getInstituteDetailswithUUID(instituteId);
    const branch = await getBranchDetailsWithUUID(branchId);
    const role = await getRoleDetailsWithName("Teaching Staff");

    let teachingStaffIds = [];

    if (teachingStaffQuerys?.course) {

      const courseIds = Array.isArray(teachingStaffQuerys.course)
        ? teachingStaffQuerys.course.map(id => new mongoose.Types.ObjectId(id))
        : [new mongoose.Types.ObjectId(teachingStaffQuerys.course)];


      const teachingStaff = await InstituteTeaching_Staff.find({
        institute_id: institute._id,
        branch_id: branch._id,
        course: { $in: courseIds },
        is_active: true
      }).select('_id');

      teachingStaffIds = teachingStaff.map(staff => staff._id);
    }

    if (teachingStaffQuerys.course) {
      filterArgs.userDetail = { $in: teachingStaffIds }
    }


    const totalCount = await InstituteUser.countDocuments({
      ...filterArgs,
      institute_id: institute._id,
      branch_id: branch._id,
      role: role._id,
      is_delete: false
    });

    const users = await InstituteUser.find({
      ...filterArgs,
      institute_id: institute._id,
      branch_id: branch._id,
      role: role._id,
      is_delete: false
    })
      .populate({
        path: 'userDetail',
        model: 'teachingstaff_login'
      })
      .skip((page - 1) * perPage)
      .limit(perPage);


    const lastPage = Math.ceil(totalCount / perPage);

    for (let key in users) {
      const find_id = await StaffIdCard.findOne({ staff: users[key]._id })
      console.log(find_id, "id")
      if (!find_id) {
        const current_staff = users[key]
        const staff_id_card = {
          name: current_staff.full_name,
          institute: institute?._id,
          branch: branch?._id,
          email: current_staff.email,
          role: role?._id,
          staff_id: current_staff?.userDetail?.staffId,
          image: current_staff?.image,
          staff: current_staff?._id,
          address: {
            address_line_one: current_staff?.contact_info.address1,
            address_line_two: current_staff.contact_info?.address2,
            state: current_staff.contact_info?.state,
            city: current_staff.contact_info?.city,
            pin_code: current_staff.contact_info?.pincode
          },
          contact: current_staff.contact_info.phone_number
        }
        await createStaffIdCards(staff_id_card)
      }
    }



    res.status(200).json({
      status: true,
      message: 'Staff retrieved successfully',
      data: users,
      last_page: lastPage,
      count: totalCount
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      message: error.message
    });
  }
};

export const getCoordinatorsDetailsWithID = async (req, res) => {
  try {
    const { instituteId, branchId } = req.params;
    let { page = 1, perPage = 10 } = req.query;
    page = parseInt(page, 10);
    perPage = parseInt(perPage, 10);

    const filterArgs = FilterQuery(req.query, DefaultFilterQuerys.institute_user);

    const institute = await getInstituteDetailswithUUID(instituteId);
    const branch = await getBranchDetailsWithUUID(branchId);

    const studentRole = await getRoleDetailsWithName("Student");
    const teachingStaffRole = await getRoleDetailsWithName("Teaching Staff");
    const nonTeachingStaffRole = await getRoleDetailsWithName("Non Teaching Staff");

    const excludedRoles = [studentRole._id, teachingStaffRole._id, nonTeachingStaffRole._id];

    const totalCount = await InstituteUser.countDocuments({
      ...filterArgs,
      institute_id: institute._id,
      branch_id: branch._id,
      role: { $nin: excludedRoles },
      is_delete: false
    });

    const users = await InstituteUser.find({
      ...filterArgs,
      institute_id: institute._id,
      branch_id: branch._id,
      role: { $nin: excludedRoles },
      is_delete: false
    })
      .populate('userDetail')
      .skip((page - 1) * perPage)
      .limit(perPage);

    const lastPage = Math.ceil(totalCount / perPage);

    res.status(200).json({
      status: true,
      message: 'Filtered users retrieved successfully',
      data: users,
      last_page: lastPage,
      count: totalCount
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: false,
      message: error.message
    });
  }
};



export const OtpSender = async (email, otp, token) => {
  try {
    const storeOtp = await InstituteOtps.create({ otp, token, validated: false, email });
    await storeOtp.save();
    await sentOtpEmail(email, otp);
    return storeOtp;
  } catch (error) {
    throw error;
  }
};

export const resendOtp = async (req, res) => {

  const { email } = req.body;
  try {
     const findOtp = await InstituteOtps.findOne({ email: email });
     if (findOtp) {
      const { otp, token } = findOtp;
      await sentOtpEmail(email, otp);
      return res.json({
        message: "otp Resent successfully",
        otp: otp,
        token: token,
      });
    } else {
      const { otp, token } = generateOtp;
      const storeOtp = new InstituteOtps({
        otp,
        token,
        validated: false,
        email,
      });
      await storeOtp.save();
      await sentOtpEmail(otp, email);
      return res.json({
        message: "OTP generated and sent successfully.",
        otp: otp,
        token: token,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const validateOTP = async (req, res) => {
  try {
    await Validations.insttituteotp(req.body)
   
    const { token, otp, email } = req.body;

    const OtpData = await InstituteOtps.findOne({email,token,validated:false,is_delete:false})
    
    // if (!OtpData) {
    //   return res.status(400).json({ status: "failed", message: "OTP expired, click resend" });
    // }
    // const expireTime = new Date(OtpData.createdAt).getTime() + 360000;

    if (!OtpData) return res.status(400).json({ status: "failed", message: "Invalid OTP" });

    let user = await InstituteUser.findOneAndUpdate(
      { email },
      { is_two_auth_completed: true, two_auth_completed_at: new Date() },
      { new: true }
    ).populate({ path:"institute_id"}).populate({ path: "branch_id"})
    .populate({ path : "userDetail",model:"teachingstaff_login"})

    if (!OtpData?.otp == otp) {
      return res.status(403).json({status:'failed',message:"otp doesn't match"})
    }

    if (!user.is_email_verified) {
      await Promise.all([
        InstituteUser.findOneAndUpdate({ email }, { is_email_verified: true }),
        InstituteOtps.findOneAndUpdate({ email }, { validated: true })
      ]);
    }

    if(!user.is_two_auth_completed){
      await InstituteUser.findOneAndUpdate({email},{is_two_auth_completed:true})
    }

    let tokenExists = await InstituteTokens.findOne({ email , is_delete: false});
    if (!tokenExists) {
      const generatedToken = generateInstituteToken(user);
      tokenExists = new InstituteTokens({ token: generatedToken, email });
      await tokenExists.save();
    }

    return res.status(200).json({
      status: "success",
      message: `OTP verified successfully. ${user.is_email_verified ? "Token exists." : "Email verified. Please Login Mail ID"}`,
      data: {
        userId: user.uuid,
        token: tokenExists.token,
        user
      },
    });
  }
 catch (error) {
    console.error("Error in validateOTP:", error);
    return res.status(500).json({ status: "failed", message: "Internal server error" });
  }
};



export const NonstaffLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await InstituteUser.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found with this credentials",
        data: null,
      });
    }

    // const loginatmp = BlockLogin.find(user => user.email == email)
    // if (loginatmp) {
    //   if (loginatmp.attempt >= 4) {
    //     return res.status(400).json({ status: "Failed", message: "try sometime later, your reach limit." })
    //   }
    // }


    const passwordCheck = await comparePassword(password, user.password);

    if (passwordCheck) {
      if (user.is_two_auth_completed) {
        const token = await InstituteTokens.findOne({ email: email, is_delete: false });

        if (token) {
          return res.status(200).json({
            status: "success",
            message: "Login Successfully",
            data: {
              token: token.token,
              user: user,
            },
          });
        } else {
          const generatedToken = generateInstituteToken(user);
          const updateToken = new InstituteTokens({
            token: generatedToken,
            email,
          });
          await updateToken.save();

          return res.status(200).json({
            status: "success",
            message: "Login Successfully",
            data: {
              token: generatedToken,
              user: user,
            },
          });
        }
      }
    } else {
      // if (loginatmp) {
      //   BlockLogin = BlockLogin.map((u) => u.email == email ? { ...u, attempt: loginatmp.attempt + 1 } : u)
      // } else {
      //   BlockLogin.push({ email, attempt: 1 })
      // }
      return res.status(400).json({
        status: "Failed",
        message: "Password Not Correct"
      })
    }


    const checkTokenExists = await InstituteTokens.findOne({ email, is_delete: false });

    if (checkTokenExists) {
      return res.status(200).json({ status: "success", message: "Login successful", data: { token: checkTokenExists.token, userId: user?.uuid } });
    } else {
      const type = "nonteaching";
      const idCard = await generateIDCard(user, type);
      await saveIDCardImage(user, idCard.qr_code);

      const { otp, token } = await generateOtp();
      await OtpSender(email, otp, token);
      await InstituteOtps.findOneAndUpdate({ email }, { otp, token });

      return res.status(200).json({
        status: "success",
        message: "OTP sent successfully",
        data: { token },
      });
    }
  }
  catch (error) {
    return res
      .status(500)
      .json({ status: "failed", message: error.message, data: null });
  }
};

export const getAllNonstaff = async (req, res) => {
  try {
    const nonstaff = await InstituteUser.find();
    res.status(200).json({ status: "success", data: nonstaff });
  } catch (error) {
    console.error("Error in getAllNonstaff:", error);
    res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};

export const searchNonstaff = async (req, res) => {
  try {
    const query = req.query.q;
    const nonstaff = await InstituteUser.find({
      "userDetail.username": { $regex: new RegExp(query, "i") },
    });
    res.status(200).json({ status: "success", data: nonstaff });
  } catch (error) {
    console.error("Error in searchNonstaff:", error);
    res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};

export const deleteNonstaffById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({
        status: false,
        message: 'ID parameter is missing'
      });
    }

    const user = await InstituteUser.findOne({ uuid: id });

    if (!user) {
      return res.status(404).send({
        status: false,
        message: 'User not found'
      });
    }

    const userDetailId = user.userDetail._id;

    const nonTeachingStaff = await InstituteNon_TeachingStaff.findOne({ _id: userDetailId });

    if (!nonTeachingStaff) {
      return res.status(404).send({
        status: false,
        message: 'Non-teaching staff not found'
      });
    }

    if (nonTeachingStaff.is_deleted) {
      return res.status(400).send({
        status: false,
        message: 'Non-teaching staff is already deleted'
      });
    }

    await InstituteUser.findOneAndUpdate({ uuid: id }, { is_delete: true });

    await InstituteNon_TeachingStaff.findOneAndUpdate({ _id: userDetailId }, { is_deleted: true });

    res.status(200).send({
      status: true,
      message: 'Non-teaching staff deleted successfully'
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: 'Something went wrong',
      error: error.message
    });
  }
};



export const updateNonstaff = async (req, res) => {
  try {
    const { id } = req.params;

    const value = FilterQuery(req.body, DefaultUpdateFields.non_teaching_staff);
    const value1 = FilterQuery(
      req.body,
      DefaultUpdateFields.non_teaching_staff1
    );

    const updatedNonstaff = await InstituteUser.findOneAndUpdate(
      { uuid: id },
      value,
      { new: true }
    );

    const updatedNonTeachingStaff =
      await InstituteNon_TeachingStaff.findByIdAndUpdate(
        value.userDetail,
        value1,
        { new: true }
      );

    res.status(200).json({
      status: "success",
      data: updatedNonstaff,
      updatedNonTeachingStaff,
    });
  } catch (error) {
    console.error("Error in updateNonstaff:", error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

export const getNonstaffById = async (req, res) => {
  try {
    const { nonstaffId } = req.params;
    const nonstaff = await InstituteUser.findOne({ uuid: nonstaffId }).populate({ path: 'userDetail', model: "non-teachingstaff_login" });

    if (!nonstaff) {
      return res.status(404).json({ status: "failed", message: "Non-staff not found" });
    }
    if (!nonstaff.userDetail) {
      return res.status(403).json({ status: "failed", message: "Access denied. User does not have Non Teaching Staff role." });
    }
    res.status(200).json({ status: "success", data: nonstaff });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "Something went wrong",
      message: error.message
    })
  }
};




export const StudentLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const role = await getRoleDetailsWithName("Student")
    const user = await InstituteUser.findOne({ email, role: role?._id })
      .populate({ path: "institute_id" }).populate({ path: "branch_id" })
      .populate({ path: "userDetail", model: "Student_Login" })

    // const loginatmp = BlockLogin.find(user => user.email == email)
    // if (loginatmp) {
    //   if (loginatmp.attempt >= 4) {
    //     return res.status(400).json({ status: "Failed", message: "try sometime later, your reach limit." })
    //   }
    // }

    if (!user) {
      return res.status(401).json({ status: "failed", message: "User not found with these credentials", data: null });
    }

    const passwordCheck = await comparePassword(password, user.password);

    if (passwordCheck) {

      if (user.is_two_auth_completed) {
        const token = await InstituteTokens.findOne({ email: email, is_delete: false });
        if (token) {
          const log_data = { role: user?.role, user: user?._id, model: "Instituteuserlist", action: "login", title: "Dashboard Login Successfully", details: `${user?.full_name}` + formattedDate }
          await createLogger(log_data)
          return res.status(200).json({
            status: "success", message: "Login Successfully", data: { token: token.token, user: user },profile:true
          });
        } else {
          const generatedToken = generateInstituteToken(user);
          const updateToken = new InstituteTokens({ token: generatedToken, email });
          await updateToken.save();

          const log_data = { role: user?.role, user: user?._id, model: "Instituteuserlist", action: "login", title: "Dashboard Login Successfully", details: `${user?.full_name}` + formattedDate }
          await createLogger(log_data)

          return res.status(200).json({
            status: "success", message: "Login Successfully", data: { token: generatedToken, user: user },profile:true
          });
        }
      }else{
          const findOtp = await InstituteOtps.findOne({ email: email });
          
          
          if (findOtp) {
            return res.status(200).json({ status: "success", message: "OTP sent successfully", data: { token: findOtp.token, step: "otp", email, otp: findOtp.otp },profile:false });
          }
          
          const { otp, token } = await generateOtp();
          // const store_new_otp = new InstituteOtps({ otp,token,role:role?._id,email})
          // await store_new_otp.save()
          await OtpSender(email, otp, token);
          
          return res.status(200).json({ status: "success", message: "OTP sent successfully", data: { token, step: "otp", email, otp } ,profile:false});
          
      }
    } else {
      // if (loginatmp) {
      //   BlockLogin = BlockLogin.map((u) => u.email == email ? { ...u, attempt: loginatmp.attempt + 1 } : u)
      // } else {
      //   BlockLogin.push({ email, attempt: 1 })
      // }
      return res.status(400).json({ status: "Failed", message: "Password not match" })
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", message: error.message, data: null });
  }
};


export const StudentLogout = async (req, res) => {
  const user = req.user
  try {
    await InstituteTokens.findOneAndUpdate({ email: user?.email }, { is_delete: true });
    const log_data = { role: req?.user?.role, user: user?._id, model: "Instituteuserlist", action: "logout", title: "Dashboard Logout Successfully", details: `${user?.full_name}` + formattedDate }
    await createLogger(log_data)
    res.status(200).send({ status: "Success", message: "User logout successful" })
  } catch (error) {
    res.status(500).send({ status: "failed", message: error.message })
  }
};

export const staffLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const role = await getRoleDetailsWithName("Teaching Staff")
    const user = await InstituteUser.findOne({ email: email, role: role?._id })
      .populate({ path: "institute_id" }).populate({ path: "branch_id" })
      .populate({ path: "userDetail", model: "teachingstaff_login" })

    if (!user) {

      return res.status(404).json({
        status: "failed",
        message: "User not found with this credentials",
        data: null,
      });

    }

    // const loginatmp = BlockLogin.find(user => user.email == email)
    // if (loginatmp) {
    //   if (loginatmp.attempt >= 4) {
    //     return res.status(400).json({ status: "Failed", message: "try sometime later, your reach limit." })
    //   }
    // }

    const passwordCheck = await comparePassword(password, user?.password);
    if (passwordCheck) {
      if (user.is_two_auth_completed) {
        const token = await InstituteTokens.findOne({ email: email, is_delete: false });
        if (token) {
          return res.status(200).json({
            status: "success",
            message: "Login Successfully",
            data: {
              token: token.token,
              user: user
            },
          });
        } else {
          const token = generateInstituteToken(user);
          const updateToken = new InstituteTokens({
            token: token,
            email,
          });
          await updateToken.save();
          return res.status(200).json({
            status: "success",
            message: "Login Successfully",
            data: {
              token: token,
              user: user
            }
          });
        }
      }
    } else {
      // if (loginatmp) {
      //   BlockLogin = BlockLogin.map((u) => u.email == email ? { ...u, attempt: loginatmp.attempt + 1 } : u)
      // } else {
      //   BlockLogin.push({ email, attempt: 1 })
      // }
      return res.status(400).json({
        status: "Failed",
        message: "The password you entered is incorrect",
      })

    }

    const checkTokenExists = await InstituteTokens.findOne({ email, is_delete: false });

    if (checkTokenExists) {

      return res.status(200).json({ status: "success", message: "Login successful", data: { token: checkTokenExists.token, user: user } });
    } else {
      const findOtp = await InstituteOtps.findOne({
        email: email,
      });
      if (findOtp) {
        return res.status(200).json({
          status: "success",
          message: "OTP sent successfully",
          data: { token: findOtp.token, step: "otp", email, otp: findOtp?.otp },
        });
      }
      // const idCard = await generateIDCard(user);
      // await saveIDCardImage(user, idCard.qr_code);

      const { otp, token } = await generateOtp();
      await OtpSender(email, otp, token);


      return res.status(200).json({
        status: "success",
        message: "OTP sent successfully",
        data: { token, step: "otp", email, otp },
      });
    }
  }
  catch (error) {
    return res.status(500).json({ status: "failed", message: error.message, data: null });
  }
};

export const getAllStaff = async (req, res) => {
  try {
    const staff = await InstituteTeaching_Staff.find();
    res.status(200).json({ status: "success", message: "staff retrived", data: staff });
  } catch (error) {
    console.error("Error in getAllStaff:", error);
    res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};

export const staffLogout = async (req, res) => {
  const email = req.user.email
  try {
    await InstituteTokens.findOneAndUpdate({ email }, { is_delete: true });
    res.status(200).send({ status: "Success", message: "Staff Logout Successful" })
  } catch (error) {
    res.status(500).send({
      status: "Failed",
      message: "Something went wrong",
      error: error.message
    })
  }
};

export const getAllActiveStaff = async (req, res) => {
  try {
    const staff = await InstituteTeaching_Staff.find({ is_active: true });
    res.status(200).json({ status: "success", data: staff });
  } catch (error) {
    console.error("Error in getAllActiveStaff:", error);
    res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};

export const searchStaff = async (req, res) => {
  try {
    const query = req.query.q;
    const staff = await InstituteTeaching_Staff.find({
      $text: { $search: query },
    });
    res.status(200).json({ status: "success", data: staff });
  } catch (error) {
    console.error("Error in searchStaff:", error);
    res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};

export const deleteStaffById = async (req, res) => {
  try {
    const { id } = req.params;
    await InstituteUser.findOneAndUpdate({ uuid: id }, { is_delete: true });
    res.status(200).json({
      status: "success",
      message: "Teaching Staff deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteStaffById:", error);
    res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};


export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const value = FilterQuery(req.body, DefaultUpdateFields.teaching_staff);
    const value1 = FilterQuery(req.body, DefaultUpdateFields.teaching_staff1);
    console.log(value, value1)
    const updatedstaff = await InstituteUser.findOneAndUpdate(
      { uuid: id },
      value,
      { new: true }
    );

    console.log(value.userDetail)
    const updatedTeachingStaff = await InstituteTeaching_Staff.findByIdAndUpdate(value.userDetail, { designation: value1?.designation, $set: { course: value1?.course } },
      { new: true }
    );

    res.status(200).json({ status: "success", data: updatedstaff, updatedTeachingStaff });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

export const getStaffById = async (req, res) => {
  try {
    const { staffId  } = req.params;
    // const staff = await InstituteUser.findOne({uuid:staffId}).populate({path:'userDetail',populate:{path:"course",populate:{path:"category"}}, model : "teachingstaff_login",match: { role: "6613946752e4291f77489fbf" }});

    const staff = await InstituteUser.findOne({uuid:staffId}).populate({path:'userDetail',populate:{path:"course",populate:{path:"category"}}});
    const attendance = await staff_attedence.find({staff:staff?._id})

    res.status(200).json({ status: "success", data: { staff, attendance } });

  } catch (error) {
    console.error("Error in getstaffById:", error);
    res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};

export const staffChangePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { email } = req.user

    const user = await InstituteUser.findOne({ email });

    if (!user) {
      return res.status(404).json({ status: "failed", message: "User not found with this email" });
    }
    // Compare old password with the stored password
    const isPasswordMatch = await comparePassword(oldPassword, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ status: "failed", message: "Old password is incorrect" });
    }

    const hashedNewPassword = await hashPassword(newPassword);

    await InstituteUser.findOneAndUpdate({ email }, { password: hashedNewPassword });

    return res.status(200).json({ status: "success", message: "Password changed successfully" });
  } catch (error) {
    console.error("Error in staffChangePassword:", error);
    return res.status(500).json({ status: "failed", message: "Internal server error" });
  }
};

export const staffStatusChange = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    // Find the staff member by ID
    const staff = await InstituteTeaching_Staff.findById(id);

    if (!staff) {
      return res.status(404).json({
        status: "failed",
        message: "Staff member not found with this ID",
      });
    }

    staff.isActive = isActive;
    await staff.save();

    return res.status(200).json({
      status: "success",
      message: "Staff status updated successfully",
    });
  } catch (error) {
    console.error("Error in staffStatusChange:", error);
    return res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};

export const InstituteregisterStaff = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
        email,
        first_name,
        last_name,
        institute_id,
        full_name,
        branch_id,
        course,
        dob,
        gender,
        qualification,
        contact_info,
        designation,
        image,
        bank_account_number,
        bank_branch,
        bank_name,
        bank_IFSC
    } = req.body;

    const existingUser = await InstituteUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: "failed", message: "Email already exists" });
    }

    Upload.updateOne({file:image},{$set:{is_active:true}})
    const temporaryPassword = generateRandomPassword();
    const hashedPassword = await hashPassword(temporaryPassword);

    const institute = await getInstituteDetailswithUUID(institute_id);
    const branch = await getBranchDetailsWithUUID(branch_id);
    const role = await getRoleDetailsWithName("Teaching Staff");
    const courseDetails = await getCourseDetailsWithUUID(course);

    const sequence = await Sequence.findOneAndUpdate(
      { _id: "StaffIDCardSequences" },
      { $inc: { seq: 1 } },
      { upsert: true, new: true }
    );

    const staffId = await generateTeachingStaffId(
      institute?.institute_name,
      branch?.branch_identity,
      sequence?.seq
    );

    const instituteUser = new InstituteUser({
      first_name,
      last_name,
      email,
      full_name,
      institute_id: institute._id,
      branch_id: branch._id,
      password: hashedPassword,
      dob,
      gender,
      qualification,
      contact_info,
      role: role._id,
      image,
      type: "teaching",
      userModel: "teachingstaff_login",
      course: courseDetails._id,
      staffId,
    });

    await instituteUser.save({ session });

    const teachingStaff = new InstituteTeaching_Staff({
      institute_id: institute._id,
      branch_id: branch._id,
      course: [courseDetails._id],
      username: full_name,
      email,
      staffId,
      role: role._id,
      designation,
      type: "teaching",
      bank_details:{
        account_number: bank_account_number,
        branch: bank_branch,
        bank_name: bank_name,
        IFSC: bank_IFSC
      }
    });

    await teachingStaff.save({ session });

    await updateSubscription("Teachers", req.user.institute_id, session);

    await InstituteUser.findByIdAndUpdate(
      instituteUser._id,
      { userDetail: teachingStaff._id },
      { new: true, session }
    );

    const staffIdCard = {
      // name: `${first_name} ${last_name}`,
      name:full_name,
      institute: institute._id,
      branch: branch._id,
      email,
      role: role._id,
      staff: instituteUser?._id,
      image: instituteUser.image,
      student: instituteUser._id,
      address: {
        address_line_one: contact_info?.address1,
        address_line_two: contact_info?.address2,
        state: contact_info?.state,
        city: contact_info?.city,
        pin_code: contact_info?.pincode,
      },
      contact: contact_info?.phone_number,
    };

    await createStaffIdCards(staffIdCard, session);

    const attendanceData = {
      staff: instituteUser._id,
      date: new Date().toLocaleDateString(),
      status: "absent",
      institute: institute._id,
      branch: branch._id,
    };

    await addInitialAttendanceStudent(attendanceData, session);

    const resetLink = `http://localhost:3002/api/institutes/auth/profile/temporary-reset?id=${instituteUser._id}`;
    await sendWelcomeEmail(email, first_name, institute.institute_name, temporaryPassword, resetLink);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: "success",
      message: "Registered successfully",
      user: instituteUser,
      teachingStaff,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ status: "failed", message: error.message });
  }
};



export const InstituteregisterNonStaff = async (req, res) => {

  const { email, full_name, password, institute_id, branch_id, username, dob, gender, qualification, contact_info, designation, role, type } = req.body;
  const { state, city, pincode, address1, address2, phone_number } = req.body?.contact_info;

  // if (!first_name || !last_name || !full_name || !email || !password || !institute_id || !branch_id || !username || !dob || !gender || !qualification || !contact_info || !role) {
  //   return res.status(400).json({ status: "failed", message: "All required fields must be filled" });
  // }

  const temproaryPassword = generateRandomPassword();
  const hashedPassword = await hashPassword(temproaryPassword);
  const institute = await getInstituteDetailswithUUID(institute_id);
  const branch = await getBranchDetailsWithUUID(branch_id);
  const NonStaff_role = await getRoleDetailsWithName("Non Teaching Staff");
  const NonstaffId = await generateNonTeachStaffId();

  try {

    const staff = new InstituteUser
      ({
        email,
        full_name,
        institute_id: institute._id,
        branch_id: branch._id,
        password: hashedPassword,
        dob,
        gender,
        qualification,
        contact_info,
        role: NonStaff_role._id,
        type: 'nonteaching',
        NonstaffId
      });
    await staff.save();
    const teaching = new InstituteNon_TeachingStaff({
      branch_id: branch._id,
      designation,
      institute_id: institute._id,
      full_name,
      NonstaffId,
      email,
      type: 'nonteaching',
      role: NonStaff_role._id
    });

    await teaching.save();
    await updateSubscription("Staffs", req.user.institute_id)
    const updateRelation = await InstituteUser.findByIdAndUpdate(staff._id, { userDetail: teaching._id }, { new: true })
    const _id = updateRelation._id

    const resetLink = `http://localhost:3002/api/institutes/auth/profile/temporary-reset?id=${user._id}`;
    await sendWelcomeEmail(email, first_name, institute.institute_name, temproaryPassword, resetLink)

    await logActivity('InstituteTeachingStaffLog', 'Create', 'Login', _id, new Date());
    res.status(200).json({
      status: "success",
      message: "Registered successfully",
      teaching,
    });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

export const InstituteregisterStudent = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const { image, first_name, last_name, full_name, email, institute_id, branch_id, batch_id, course, dob, gender, qualification, contact_info, studentId, role } = req.body;
  const { state, city, pincode, address1, address2, phone_number, alternate_phone_number } = req.body.contact_info;

  try {
    const temproaryPassword = generateRandomPassword();
    const hashedPassword = await hashPassword(temproaryPassword);
    
    const institue = await getInstituteDetailswithUUID(institute_id);
    const branch = await getBranchDetailsWithUUID(branch_id);
    const Student_role = await getRoleDetailsWithName("Student");
    const courseDetails = await getCourseDetailsWithUUID(course);

    // const Batch_Details = await getBatchDetailsWithUUID(batch_id)

    if (!courseDetails || isNaN(courseDetails.current_price)) {
      throw new Error("Invalid course details or course price");
    }

    const current_sequence = await Sequence.findOneAndUpdate({ _id: "StudentIdCardSequence" }, { $inc: { seq: 1 } }, { upsert: true, new: true, session })
    const studentId = await generateStudentId(institue?.institute_name, branch?.branch_identity, current_sequence?.seq);
    Upload.updateOne({file:image},{$set:{is_active:true}})
    const user = new InstituteUser({

      image: image,
      email,
      first_name,
      last_name,
      password: hashedPassword,
      phone_number, 
      institute_id:institue._id, 
      branch_id:branch._id, 
      role: Student_role._id, 
      userModel : "Student_Login" ,
      full_name: `${first_name} ${last_name}`, 
      // roll_id: batch_id,
      dob,
      gender,
      qualification,
      contact_info,
      batch_id,
      studentId
    });
    await user.save({ session });

      const gst = courseDetails.current_price * 0.05
      const other_taxes = courseDetails.current_price * 0.02;
      const total_fee_with_taxes = courseDetails.current_price + gst + other_taxes;
      
    
      
      const newStudentfee = new StudentFee({
        institute_id: institue._id,
        branch_id: branch._id,
        course_name: courseDetails.course_name,
        course_id: courseDetails._id, 
        course_price: courseDetails.current_price, 
        // batch_id: Batch_Details?._id,
        student: user._id,
        total_fee: total_fee_with_taxes,
        paid_amount: 0,
        balance: total_fee_with_taxes,
        payment_date: new Date().toISOString(),
        payment_method: 'offline',
        duepaymentdate: new Date().toISOString(),
        gst: gst,
        other_taxes: other_taxes
    });

      await newStudentfee.save();


    // Create a notification for the initial fee setup

    await createStudentfeeNotification({
      title: "Fee Setup",
      body: `The total payment amount for your course fee.${total_fee_with_taxes}.`,
      type: "fee_setup",
      institute: institue._id,
      branch: branch._id,
      course: courseDetails._id,
      batch: null,
      student: user._id,
      link: `/student/fees/${newStudentfee._id}`
    });



    const teach = new InstituteStudent({
      // batch_id:Batch_Details?._id,
      branch_id: branch._id,
      course: [courseDetails._id],
      institute_id: institue._id,
      email,
      qualification,
      studentId,
      fullname: `${first_name}.${last_name}`,
      role: Student_role._id,
      ongoing_courses: [courseDetails._id],
      completed_courses: []
    });
    await teach.save({ session });

    user.userDetail = teach._id;
    await user.save({ session });

    console.log(teach, "teach")

    await updateSubscription("Students", req.user.institute_id)

    const student_details = await InstituteUser.findByIdAndUpdate(user._id, { userDetail: teach._id }, { new: true })

    const student_id_card = {
      name: first_name + last_name,
      institute: institue?._id,
      branch: branch?._id,
      email: email,
      role: Student_role?._id,
      student_id: studentId,
      image: student_details?.image,
      student: student_details?._id,
      address: {
        address_line_one: contact_info?.address1,
        address_line_two: contact_info?.address2,
        state: contact_info?.state,
        city: contact_info?.city,
        pin_code: contact_info?.pincode
      },
      contact: phone_number
    }
    await createStudentsIdCards(student_id_card)
    await migrateCoursesForStudent(studentId);
    const resetLink = `http://localhost:3002/api/institutes/auth/profile/temporary-reset?id=${user._id}`;
    await sendWelcomeEmail(email, first_name, institue.institute_name, temproaryPassword, resetLink, courseDetails.course_name)
    const html = WelcomeEmailTempate(email,temproaryPassword,first_name,courseDetails)

    const mailOptions = {
        from: process.env.sender_mail,
        to:email,
        subject:"Welcome to eflow",
        html
    };

    sendEmail(mailOptions)


    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: "success",
      message: " student Registered successfully",

    });

  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ status: "failed", message: error.message, data: null });
  }
};

const user_model_details = {
  "Teaching Staff": "teachingstaff_login",
  "Non Teaching Staff": "non-teachingstaff_login",
  "Student": 'Student_Login'
}

export const getProfile = async (req, res) => {
  try {
    const { email } = req.user
    const role = await InstitutesRoles.findById(req?.user?.role)
    const user = await InstituteUser.findOne({ email: email })
      .populate([{ path: "userDetail", model: user_model_details[role?.identity],  populate: [
      { path: 'course', model: 'courses' },
      { path: 'institute_id', model: 'institutes' },
    ], }]).exec()

    if (!user) {
      throw new Error("User not found")
    }

    const userProfile = {
      contact_info: user.contact_info,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      full_name: user?.full_name,
      institute_id: user.institute_id,
      branch_id: user.branch_id,
      dob: user.dob,
      gender: user.gender,
      qualification: user.qualification,
      roll_no: user.roll_no,
      userDetail: user?.userDetail,
      image: user?.image
    };

    return res.status(200).json({ status: "success", data: userProfile });
  } catch (error) {
    console.error("Error in getProfile:", error);
    return res
      .status(500)
      .json({ status: "failed", message: error?.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const value = updateProfileSchema.InstituteUserValidation(req.body)

    const { email } = req.user
    const updatedUser = await InstituteUser.findOneAndUpdate(
      { email },
      value,
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ status: "failed", message: "User not found" });
    }

    return res.status(200).json({ status: "success", data: updatedUser });

  } catch (error) {
    console.error("Error in updateProfile:", error);
    return res
      .status(500)
      .json({ status: "failed", message: error?.message });
  }
};

export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await InstituteUser.find();
    res.status(200).json({ status: "success", data: profiles });
    const log_data = { role: req?.user?.role, user: user?._id, model: "Instituteuserlist", action: "Progile", title: "Profile Updated Successfully", details: `${profiles?.full_name}` + formattedDate }
    await createLogger(log_data)
  } catch (error) {
    console.error("Error in getAllProfiles:", error);
    res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};



export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await InstituteUser.findOne({ email });

    if (!user) {
      return res.status(404).json({ status: "failed", message: "User not found with this email" })
    }


    const opts = await InstituteOtps.findOne({email,validated:false})
    if (opts){
      return res.status(200).json({ status: "success",  message: "OTP already sended",  data: { token : opts?.token, otp: opts.otp } });
    }

    const { otp, token } = await generateOtp();
    const storedOtp = await OtpSender(email, otp, token);
    const log_data = {
      role: user?.role,
      user: user._id,
      model: "InstituteUser",
      action: "Forgot Password",
      title: "Password Reset Request",
      details: `Password reset requested for user with email ${email} ${formattedDate}`,
    };
    await createLogger(log_data)
    return res.status(200).json({ status: "success",  message: "OTP sent successfully",  data: { token : storedOtp?.token,otp:storedOtp?.otp } });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(500).json({ status: "failed", message: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, new_password, confirm_password } = Validations.InstituteResetPassword(req.body)

    

    const hashedPassword = await hashPassword(confirm_password);
    
    const user = await InstituteUser.findOneAndUpdate(
      { email },
    { password: hashedPassword },{new:true}
    );
    const isUser = await InstituteUser.findOne({ email: 'project.emern@gmail.com'})
    console.log(user,"user",isUser,email)
    // if (!user) {
    //   return res.status(404).json({ status: "failed", message: "User not found" });
    // }

    const logData = {
      role: user?.role,
      user: user._id,
      model: "InstituteUser",
      action: "Password Reset",
      title: "Password Reset Successfully",
      details: `Password reset successfully for user with email ${email}`,
    };

    await createLogger(logData);

    return res.status(200).json({ status: "success", message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json({ status: "failed", message: error?.message || "Internal server error" });
  }
};

export const temporaryPasswordReset = async (req,res)=>{
  try {
    const { id } = req.query;
    console.log(req.query)
    console.log(id)
    const { new_password, confirm_password } = req.body;
    const user = await InstituteUser.findById(id);
    if(!user){
      return res.status(404).json({status:"failed", message:"User not found"})
    }
    if(new_password !== confirm_password){
      return res.status(400).json({status:"failed", message:"Password not match"})
    }
    const hashedPassword = await hashPassword(confirm_password);
    await InstituteUser.findByIdAndUpdate(id, {$set : {password: hashedPassword, first_time_login: false}}, {new: true});
    return res.status(200).json({status:"success", message:"Password reset successfully"});
  } catch (error) {
    return res.status(500).json({status:"failed", message:error.message})
  }
}

export const StudentChangePassword=async(req,res)=>{
 try {
    const {  oldPassword, newPassword } = req.body;
    const { email } = req.user

    const user = await InstituteUser.findOne({ email });

    if (!user) {
      return res.status(404).json({ status: "failed", message: "User not found with this email" });
    }

    const isPasswordMatch = await comparePassword(oldPassword, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ status: "failed", message: "Old password is incorrect" });
    }

    const hashedNewPassword = await hashPassword(newPassword);

    await InstituteUser.findOneAndUpdate({ email },  { password: hashedNewPassword });

    return res.status(200).json({ status: "success", message: "Password changed successfully" });
  } catch (error) {
    console.error("Error in student change Password:", error);
    return res.status(500).json({ status: "failed", message: "Internal server error" });
  }
}
