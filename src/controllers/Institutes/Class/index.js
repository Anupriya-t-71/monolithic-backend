import mongoose from "mongoose";
import OfflineClass from "../../../models/Institutes/Class/Offline_Model.js";
import OnlineClass from "../../../models/Institutes/Class/Online_Model.js";
import { FilterQuery } from "../../../utils/helpers.js";
import { DefaultFilterQuerys, DefaultUpdateFields } from "../../../utils/data.js";
import { InstituteUser } from "../../../models/Institutes/Administration/Authorization/index.js";
import Batch from "../../../models/Institutes/Batch/index.js";

const classModelMap = {
  online: OnlineClass,
  offline: OfflineClass,
};

const dateFilter = (type, date) => {
  const today = new Date();
  const currentYear = today.getFullYear(); // Get the current year dynamically
  // Start and end of today
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const obj = {
    'upcoming': { "$gte": startOfToday.toISOString() }, 
    'completed': { '$lt': date },
    'live': { 
      '$gte': startOfToday.toISOString(),
      '$lte': endOfToday.toISOString() 
    },
    'history': { 
      // '$gte': startDate.toISOString(),
      // '$lte': endDate.toISOString()
      '$lte': endOfToday.toISOString() 
    }
  };

  return obj[type];
};



export const getClassDetailsWithCourse = async (req, res) => {
  const { userType, course, batch, month, year } = req.query;
  let { courseId } = req.params;

  const tokendata = req.data;

  try {
    let { page = 1, perPage = 10 } = req.query;
    let FilterArgs = FilterQuery(req.query, DefaultFilterQuerys.class);

    const userDetail = await InstituteUser.findOne({ uuid: tokendata.uuid });
    if (!userDetail) {
      throw new Error("User not found");
    }
    
    const user_id = userDetail._id;

    const batchDetails = await Batch.find({ student: user_id });

    const courseIds = [...new Set(batchDetails.map((item) => item.course.toString()))];

    if ( courseId !== "instructor" && !courseId && courseIds.length > 0) {
      courseId = courseIds[0];
    }

    if ( courseId !== "instructor"){
      if (courseId && mongoose.Types.ObjectId.isValid(courseId)) {
        courseId = new mongoose.Types.ObjectId(courseId);
      } else {
        throw new Error("Invalid course ID");
      }
    }

    // Validate userType
    const ClassModel = classModelMap[userType];
    if (!ClassModel) {
      throw new Error("Invalid user type");
    }

    // Handle classType filtering
    if (FilterArgs?.classType) {
      const currentDate = new Date();
      FilterArgs.start_date = dateFilter(FilterArgs.classType, currentDate.toISOString());
      delete FilterArgs.classType;
    }

    let matchuser ;

    if (courseId  === "instructor") {
      matchuser = {$match: { ...FilterArgs, instructors: userDetail?._id }}
    }else{
      matchuser = {$match: { ...FilterArgs, course: courseId }}
    }

    // Define aggregation pipeline
    const pipeline = [
        matchuser,
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "courseDetails",
        },
      },
      {
        $lookup: {
          from: "batches",
          localField: "batch",
          foreignField: "_id",
          as: "batchDetails",
        },
      },
      {
        $unwind: { path: "$courseDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $unwind: { path: "$batchDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $match: {
          ...(course ? { "courseDetails.course_name": { $regex: course, $options: "i" } } : {}),
          ...(batch ? { "batchDetails.batch_name": { $regex: batch, $options: "i" } } : {}),
        },
      },
    ];

    // Dynamic Year & Month Filtering
    const matchConditions = { $expr: { $and: [] } };

    if (year) {
      matchConditions.$expr.$and.push({
        $eq: [{ $year: { $toDate: "$start_date" } }, parseInt(year)], // Convert to Date
      });
    }

    if (month) {
      matchConditions.$expr.$and.push({
        $eq: [{ $month: { $toDate: "$start_date" } }, parseInt(month)], // Convert to Date
      });
    }

    if (matchConditions.$expr.$and.length > 0) {
      pipeline.push({ $match: matchConditions });
    }

    // Count total filtered documents (before pagination)
    const countPipeline = [...pipeline, { $count: "totalCount" }];
    const countResult = await ClassModel.aggregate(countPipeline);
    const countClasses = countResult.length ? countResult[0].totalCount : 0;

    // Apply Pagination (Skip & Limit)
    pipeline.push(
      { $skip: (page - 1) * perPage },
      { $limit: perPage }
    );


    // Fetch class details
    const classDetails = await ClassModel.aggregate(pipeline);

    if (!classDetails.length) {
      return res.status(404).json({ status: "failed", message: "No classes found for the given filters" });
    }

    const last_page = Math.ceil(countClasses / perPage);

    res.status(200).json({
      status: "success",
      message: "Classes retrieved successfully",
      data: classDetails,
      count: countClasses,
      last_page: last_page,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: "failed", message: error.message });
  }
};


export const getClassDetailsWithId = async (req,res) => {
  try {
  const {classId} = req.params
  const {classType} = req.query 
  
  const classModel = classModelMap[classType]

  if(!classModel){
     throw new Error("Invalid user type")
  } 
  const class_details = await classModel.findOne({uuid:classId})
  .populate("course").populate({path:"batch",populate:{path:"student"}})
  .populate("coordinators").populate("instructors")

  res.status(200).json({ stauts:"failed",message: "class details retrived successfully",data:class_details})
  } catch (error) {
    res.status(500).json({ status:"failed",message:error?.message})  
  }
}

export const getClassDetailsWithTeachingStaffId = async (req,res) => {
  try {
  const { staffId } = req.params
  let { page=1, perPage=10 } = req.query

  const online_class = await OnlineClass.find({ instructors : { $in: staffId }}).populate({ path: "batch"})
  const offline_class = await OfflineClass.find({ instructors : { $in: staffId }}).populate({ path: "batch"})

  const data = [...online_class,...offline_class]

  const start= (page-1) * perPage
  const end = perPage + start

  const pagination_data =  data?.slice(start,end)
  const last_page = Math.ceil(data.length/perPage)
  console.log(last_page,start,end)
  res.status(200).json({ status: "failed", message : "class details retrived successfully", data: { classes: pagination_data,last_page,count:data.length}})
  } catch (error) {
    res.status(500).json({ status: 'failed', message : error?.message })
  }
}

export const updateClassDetailsWithUUID = async (req,res) => {
  try {
  const {classId} = req.params
  let data = FilterQuery(req.body,DefaultUpdateFields.class)

  const classModel = await classModelMap[data?.type]

  if(data?.study_materials){
    data = {$push:{study_materials:data?.study_materials}}
  }else if(data?.notes){
    data = {$push:{notes:data?.notes}}
  }else if(data?.videos){
    data = {$push:{videos:data?.videos}}
  }
  
  const class_details = await classModel.findOneAndUpdate({uuid:classId},data,{new:true})
  res.status(200).json({ status:"sucess",message:"class updated successfully",data:class_details})
  } catch (error) {
    res.status(500).json({ status:"failed",message:error?.message})
  }
}


export const getClassTimeWithId = async (req, res) => {
  try {
    const { classId } = req.params;
    const { classType } = req.query;

    const classModel = classModelMap[classType];

    if (!classModel) {
      throw new Error("Invalid class type");
    }

    const class_details = await classModel.findOne({ _id: classId });

    if (!class_details) {
      return res.status(404).json({ status: "failed", message: "Class not found" });
    }

    const { start_time, video_url, class_name, start_date, end_time } = class_details;

    if (!start_time) {
      return res.status(400).json({ status: "failed", message: "Class start time is missing" });
    }

    const classStartTime = new Date(start_time);
    const classEndTime = new Date(end_time);
    const currentTime = new Date();

    console.log(classStartTime, classEndTime);

    // Get today's midnight time
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get tomorrow's midnight time
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    let classStatus;

    if (classStartTime >= today && classStartTime < tomorrow) {
      classStatus = "Class starts today";
    } else if (classStartTime >= tomorrow && classStartTime < new Date(tomorrow.getTime() + 86400000)) {
      classStatus = "Class starts tomorrow";
    } else if (classStartTime < today) {
      classStatus = "Class has already started";
    } else {
      classStatus = "Class starts in the future";
    }

    // Find the difference in total seconds
    let timeStartDifference = Math.floor((classStartTime - currentTime) / 1000);
    let timeEndDifference = Math.floor((classEndTime - currentTime) / 1000);

    if (classStartTime >= today) {
      // Convert seconds to hours, minutes, and seconds
      const sthours = Math.floor(timeStartDifference / 3600);
      timeStartDifference %= 3600;
      const stminutes = Math.floor(timeStartDifference / 60);
      const stseconds = timeStartDifference % 60;

      const hours = Math.floor(timeEndDifference / 3600);
      timeEndDifference %= 3600;
      const minutes = Math.floor(timeEndDifference / 60);
      const seconds = timeEndDifference % 60;

      const dateendtimedata = `Class ends in ${hours} hours ${minutes} minutes ${seconds} seconds`;

      const datesttimedata = `Class starts in ${sthours} hours ${stminutes} minutes ${stseconds} seconds`;
      return res.status(200).json({
        status: "success",
        message: "Class details retrieved successfully",
        data: {
          class_name,
          start_date,
          classStatus,
          startingTime: datesttimedata,
          endingTime:dateendtimedata,
          cls_link: video_url || "not provided",
        },
      });
    }
    else {
      return res.status(400).json({
        status: "failed",
        message: classStatus,
        data: {
          class_name,
          start_date,
          classStatus,
          remainingTime: timeStartDifference,
          cls_link: video_url || "not provided",
        },
      });
    }
  } catch (error) {
    res.status(500).json({ status: "failed", message: error?.message });
  }
};

export const getStudentClassWithId = async(req,res)=>{
  try {
    const {studentId} = req.params

    let classes = []

    const batchs = await Batch.find({student:{$in:studentId}}).populate({path:"classes",populate:{path:"course",select:"course_name duration overview description class_type"}}).select("classes")

    batchs.forEach((batch)=>{
      classes.push(batch.classes)
    })

    const data = classes.flat()

    res.status(200).json({status:"success",message:"classess fetched",data})

  } catch (error) {
    res.status(500).json({status:"failed",message:error.message})
  }
}