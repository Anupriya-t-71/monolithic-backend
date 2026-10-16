import slugify from "slugify";
import Course from "../../../../models/Institutes/Course/index.js";
import { FilterQuery, generateUUID } from "../../../../utils/helpers.js";
import Category from "../../../../models/Institutes/Category/index.js";
import Validations from "../../../../validations/index.js";
import { getInstituteDetailswithUUID,getCategoryDetailsWithUUID, getBranchDetailsWithUUID, getCourseDetailsWithUUID } from "../../common/index.js";
import { DefaultFilterQuerys, DefaultUpdateFields } from "../../../../utils/data.js";
import Module_Model from "../../../../models/Institutes/Course/Module_Model.js";
import { InstituteTeaching_Staff, InstituteUser } from "../../../../models/Institutes/Administration/Authorization/index.js";
import { InstituteStudent } from "../../../../models/Institutes/Administration/Authorization/index.js";
import courseTempleate from "../../../../models/Institutes/Course/course_template.js";
import { updateSubscription } from "../../../../middlewares/subscription/index.js";
import { createLogger } from "../../../ActivityLogs/index.js";
import { cleanObjectId, formatChanges, getChanges } from "../../../../utils/db_helpers/index.js";
import cron from "node-cron"
import mongoose from "mongoose";
import OfflineClass from "../../../../models/Institutes/Class/Offline_Model.js";
import OnlineClass from "../../../../models/Institutes/Class/Online_Model.js";
import Upload from "../../../../models/fileUpload/fileUpload.js";

export const getStudentDetailsWithCourseId = async (req,res) => {
    try {
    const {instituteId,branchId,courseId} = req.params
    const insitute = await getInstituteDetailswithUUID(instituteId)
    const branch = await getBranchDetailsWithUUID(branchId)
    const course = await getCourseDetailsWithUUID(courseId)
    
    const students = await InstituteUser.find({institute_id:insitute._id,branch_id:branch?._id}).populate({path:"userDetail",model:"Student_Login",populate:{path:"course"}})
    .populate({path: "notes",strictPopulate:false}).populate({path: "study_materials",strictPopulate:false});
    const data = students.filter(user => user?.userDetail?.course?._id.toString() === course?._id.toString());
    res.status(200).json({status:true,message:"students retrived successfully",data:data}) 
    } catch (error) {
       res.status(500).json({status:"failed",message:error.message}) 
    }
}

export const addCourseTemplate = async (req,res) => {
    try {
    const {course,file} = req.body
    const add_course_template = new  courseTempleate({course:course,file:file}) 
    await add_course_template.save()
    const update_course = await Course.findByIdAndUpdate(course,{course_templates:add_course_template?._id}) 
    res.status(200).json({status:"sucess",message:"Course template added successfully",data:add_course_template})  
    } catch (error) {
      res.status(500).json({status:"failed",message:error?.message}) 
    }
}

const calculateDuration = (duration) => {
  const durationValue = parseFloat(duration);
  const durationUnit = duration.replace(durationValue, '').trim().toLowerCase();

  let durationInYears, durationInMonths, durationInWeeks, durationInDays;

  switch (durationUnit) {
      case 'days':
          durationInDays = durationValue;
          durationInWeeks = durationInDays / 7;
          durationInMonths = durationInDays / 30;
          durationInYears = durationInDays / 365;
          break;

      case 'weeks':
          durationInWeeks = durationValue;
          durationInDays = durationInWeeks * 7;
          durationInMonths = durationInWeeks * 4.34524;
          durationInYears = durationInWeeks / 52;
          break;

      case 'months':
          durationInMonths = durationValue;
          durationInDays = durationInMonths * 30;
          durationInWeeks = durationInMonths * 4.34524;
          durationInYears = durationInMonths / 12;
          break;
      case 'years':
      default:
          durationInYears = durationValue;
          durationInMonths = durationInYears * 12;
          durationInWeeks = durationInYears * 52;
          durationInDays = durationInYears * 365;
          break;
  }

  return {
      years: durationInYears,
      months: durationInMonths,
      weeks: durationInWeeks,
      days: durationInDays
  };
};
export const createCourseController = async (req, res) => {
    try {
      const { instituteId, categoryId } = req.params;
      const { branch_ids ,duration} = req.body;
  
      if (!Array.isArray(branch_ids) || branch_ids.length === 0) {
        return res.status(400).send({
          status: false,
          message: 'Branch IDs must be provided as a non-empty array.',
        });
      }

      const institute = await getInstituteDetailswithUUID(instituteId);      
      const category = await getCategoryDetailsWithUUID(categoryId);
      const calculatedDuration = calculateDuration(duration);

      const coursePromises = branch_ids.map(async (branch_id) => {
        const branch = await getBranchDetailsWithUUID(branch_id);
  
        const value = Validations.CourseCreate({
          ...req.body,
          institute_id: institute._id,
          branch_id: branch._id,
        });
        //status upload
       await Upload.bulkWrite([
          {
            updateOne: {
              filter: { file: value.image },
              update: { $set: { is_active: true } }
            }
          },
          {
            updateOne: {
              filter: { file: value.thumbnail },
              update: { $set: { is_active: true } }
            }
          }
        ]);

  
        const newCourse = new Course({
          ...value,
          instituteId: institute._id,
          category: category._id,
          slug: slugify(value.course_name),
          branch_id: branch._id,
          duration,
            durationInYears: calculatedDuration.years,
            durationInMonths: calculatedDuration.months,
            durationInWeeks: calculatedDuration.weeks,
            durationInDays: calculatedDuration.days
        });
  
        await newCourse.save();
        
        const log = {
          role: req.user.role,
          user: req.user._id,
          model: "Course",
          action: "create",
          title: "New Course Created",
          details: `${newCourse?.course_name} course created`,
          institute: req.user.institute_id,
          branch: req.user.branch_id,
        };
        await createLogger(log);
        await Category.findByIdAndUpdate(category?._id,{$addToSet: { courses: newCourse?._id}})
        return newCourse; 
      });
  
      const createdCourses = await Promise.all(coursePromises);
  
      await updateSubscription("Courses", req.user.institute_id);
  
      res.status(200).send({
        status: true,
        message: 'Courses Created Successfully',
        data: createdCourses,
      });
    } catch (error) {
      console.log(error)
      res.status(500).send({ success: false,  message: error.message });
    }
  };
  


export const updateCourseController = async (req, res) => {
    try {
        const { instituteId,courseId,categoryId } = req.params;
        const insitute = await getInstituteDetailswithUUID(instituteId)
        const category = await getCategoryDetailsWithUUID(categoryId)
        
        if(insitute._id.toString()!==category.institute_id.toString()){
            throw new Error("institute not found")
        }

        const value  = FilterQuery(req.body,DefaultUpdateFields.course)

        const existingCourse = await Course.find({uuid:courseId})
  
        const updatedCourse = await Course.findOneAndUpdate({uuid:courseId}, {...value,category:category._id}, { new: true });
        const changes = getChanges(cleanObjectId(existingCourse),cleanObjectId(updatedCourse.toObject()))
        
        const log_data = {user:req?.user?._id,role:req.user?.role,model:"course",action:"update",title:"course udpated",details:formatChanges(changes),institute:req.user?.institute_id,branch:req?.user?.branch_id}
        await createLogger(log_data)
        res.status(200).send({
            status: true,
            message: 'Course updated successfully',
            updatedCourse
        });
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message
        });
    }
};


export const getCourseWithId = async (req, res) => {
    try {
        const {instituteId,categoryId,courseId} = req.params
        const institute = await getInstituteDetailswithUUID(instituteId)
        const category = await getCategoryDetailsWithUUID(categoryId)

        if(institute._id.toString()!==category.institute_id.toString()){
          throw new Error("course not found")
        }
        
        const course = await Course.findOne({uuid:courseId})
        .populate("category").populate("coursemodules").populate("notes").populate({path:"studymaterials"})
        res.status(200).send({
            status: true,
            message: 'Course status retrived successfully',
            data:course
        })
    
    } catch (error) {
        console.log(error,"error")
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

export const getCourseDetailsWithBranchId = async (req,res) => {
    try {
    const {instituteId,branchId} = req.params
    const institue = await getInstituteDetailswithUUID(instituteId)
    const branch = await getBranchDetailsWithUUID(branchId)
    const filterArgs = FilterQuery(req.query,DefaultFilterQuerys.course)
    let {page=1,perPage=10} = req.query

    if(filterArgs?.course_name){
        const regex = new RegExp(filterArgs?.course_name,"i")
        filterArgs.course_name = {$regex:regex}
    }

    const count = await Course.countDocuments({...filterArgs,branch_id:branch._id,is_deleted:false})
    const course = await Course.find({...filterArgs,branch_id:branch._id,is_deleted:false})
    .populate({ path: "category", options: { strictPopulate: false } }).skip((page-1)*perPage).limit(perPage)
    const last_page = Math.ceil(count/perPage)

    res.status(200).json({status:true,message:"course retriveed successfully",data:course,count,last_page})
    } catch (error) {
      res.status(500).json({status:'false',message:error.message})  
    }
}

export const getTeachingStaffCourseWithToken = async (req,res) => {
    try {
    const user = req.user
    const courses = await InstituteTeaching_Staff.findById(user?.userDetail).populate([{path:"course", populate: {path: "coursemodules", model: "course_modules"}}])
    res.status(200).json({ status: "success", message: "course details retrived successfully", data: courses?.course})   
    } catch (error) {
      res.status(500).json({ status: "failed", message : error?.message})   
    }
}

export const getStudentCourseWithToken = async (req,res) => {
    try {
    const user = req.user
    const courses = await InstituteStudent.findById(user?.userDetail).populate({path:"course"})
    
    res.status(200).json({ status: "success", message: "course details retrived successfully", data: courses?.course})   
    } catch (error) {
      res.status(500).json({ status: "failed", message : error?.message})   
    }
}

export const deleteCourseController = async (req, res) => {
    try {
        const { instituteId,categoryId,courseId } = req.params;

        const institue = await getInstituteDetailswithUUID(instituteId)
        const category = await getCategoryDetailsWithUUID(categoryId)

        if(institue._id.toString()!==category.institute_id.toString()){
          throw new Error("course not found")
        }

        await Course.findOneAndUpdate({uuid:courseId,category:category._id}, { is_deleted: true });
        const log = {user:req?.user?._id,action:"delete",model:"course",title:"course deleted",details:"course deleted",role:req.user.role,institute:req.user?.institute_id,branch:req.user?.branch_id}
        await createLogger(log)
        res.status(200).send({
            success: true,
            message: 'Course deleted successfully'
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};


export const getAllCourseController = async (req, res) => {
    try {
        const {instituteId,categoryId} = req.params
        
        const category = await getCategoryDetailsWithUUID(categoryId)
        const institue = await getInstituteDetailswithUUID(instituteId)
        
        if(category.institute_id.toString() !== institue._id.toString()){
            throw new Error("course not found")
        }

        let filterArgs = FilterQuery(req.query,DefaultFilterQuerys.course)
        let {page=1,perPage=10} = req.query
        
        const count = await Course.countDocuments({...filterArgs,category:category._id})
        const data = await Course.find({...filterArgs,category:category._id})
                        .populate('coursemodules')
                        .populate('notes')
                        .populate('study_materials')
                        .skip((page-1)*perPage)
                        .limit(perPage)
            
        const last_page = Math.ceil(count/perPage)
        res.status(200).json({
            success: true,
            count,
            data,
            last_page
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving data.',
            error: error.message,
        });
    }
}


export const getCourseDetailsWithCourseId = async (req, res) => {
    try {
    const {courseId,instituteId,branchId} = req.params   
    const course = await Course.findById(courseId)
    .populate({ path: "notes", match: { is_delete : false }}).populate({path:"studymaterials",model:"study_materials",match:{is_delete:false}})
    .populate({path:"coursemodules",strictPopulate: false }).populate({path:"studymaterials",model:"study_materials",match:{is_delete:false}}).populate({path:"batches",model:"batch",populate:{path:"classes",model:"onlineclass",populate:[{path:"coordinators"}],populate:[{path:"notes"}],populate:[{path:"study_materials"}],populate:[{path:"instructors"}]}})
    res.status(200).json({ status:"success",message:"course details retrived successfully",data:course}) 
    } catch (error) {
      res.status(500).json({
        status: 'failed',
        message: error?.message,
      });
    }
  };





export const getClassDetailsForCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        
        const course = await Course.findById(courseId)
            .populate({
                path: "batches",
                model: "batch",
                populate: {
                    path: "classes",
                    model: "onlineclass",
                    populate: [{ path: "instructors" }, { path: "coordinators" }],
                },
            });

        
        const classes = course.batches.reduce((acc, batch) => {
            acc.push(...batch.classes);
            return acc;
        }, []);

        res.status(200).json({
            status: "success",
            message: "Class details retrieved successfully",
            data: classes,
        });
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: error.message,
        });
    }
};


export const ongoingCourse = async (req, res) => {
    try {
      const { studentId, course, batch, start_date, end_date } = req.body;
  
      const student = await InstituteStudent.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
  
      const newCourse = {
        id: new mongoose.Types.ObjectId().toString(),
        course,
        batch,
        start_date,
        end_date,
      };
  
      student.ongoing_courses.push(newCourse);
      await student.save();
  
      res.status(200).json({ message: "Ongoing course added successfully", student });
    } catch (error) {
      res.status(500).json({ message: "Error adding ongoing course", error: error.message });
    }
  };
  
 
 export const updateCompletedCourses = async () => {
    try {
      const now = new Date();

      const students = await InstituteStudent.find({ "ongoing_courses.end_date": { $lt: now } });
  
      const updatePromises = students.map(async (student) => {
        let updatedOngoing = [];
        let completedCourses = [...student.completed_courses];
  
        for (const course of student.ongoing_courses) {
          let courseCompleted = false;
  
    
          if (course.end_date < now) {
            courseCompleted = true;
          } else {
            const onlineClassesPromise = OnlineClass.find({ course: course.course, batch: course.batch, end_date: { $lt: now } });
            const offlineClassesPromise = OfflineClass.find({ course: course.course, batch: course.batch, end_date: { $lt: now } });

            const [onlineClasses, offlineClasses] = await Promise.all([onlineClassesPromise, offlineClassesPromise]);
  
            const allClasses = [...onlineClasses, ...offlineClasses];
            if (allClasses.every(cls => cls.end_date < now)) {
              courseCompleted = true;
            }
          }
  
          if (courseCompleted) {
            completedCourses.push({
              id: course.id,
              course: course.course,
              batch: course.batch,
              start_date: course.start_date,
              end_date: course.end_date,
            });
          } else {
            updatedOngoing.push(course);
          }
        }
  
        return InstituteStudent.findByIdAndUpdate(student._id, {
          ongoing_courses: updatedOngoing,
          completed_courses: completedCourses,
        });
      });
      await Promise.all(updatePromises);
  
      console.log("Course completion update successful!");
    } catch (error) {
      console.error("Error updating completed courses:", error.message);
    }
  };
  
  cron.schedule("0 0 * * *", updateCompletedCourses);