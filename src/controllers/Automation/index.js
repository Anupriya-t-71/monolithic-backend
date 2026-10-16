
//class complete, course duration, 

import { trackingModel } from "../../models/Automation/Tracking/index.js"
import Batch from "../../models/Institutes/Batch/index.js"
import Course from '../../models/Institutes/Course/index.js'
import { generateUUID } from "../../utils/helpers.js"

const addCourse=async(batch)=>{
  const coursePromises = batch.map(async (batch) => {
        const id = batch._id; 
        const courses = await Course.find({ batches: { $in: [id] } }); 
        return courses; 
    });

    const allCourses = await Promise.all(coursePromises);
    return allCourses.flat(); 
}

const addbatch=async(id)=>{
    const data = await Batch.find({student:{$in:[id]}})
    return data
}


export const TrackCourseAndBatch=async(req,res)=>{
  try {
    const {studentId} =req.params
    // const {courseId} = req.params
    const track = await trackingModel.findOne({user:studentId})
    if(track){
      const batch = await addbatch(studentId)
      const course = await addCourse(batch)
      const updatetrack = await trackingModel.findOneAndUpdate({user:studentId},{course,batch})
      if(!updatetrack)
        throw new Error("not update")
      res.status(200).json({status:"done",updatetrack})
    }else{
      const course = await addCourse(studentId)
      const batch = await addbatch(studentId)
      const updatetracks = await trackingModel.create({
        uuid:generateUUID(),
        user:studentId,course,batch})
     if(!updatetracks)
        throw new Error("not create")
    res.status(200).json({status:"done",updatetracks})
    }
  } catch (error) {
    res.status(500).json({status:"error",Error:error.message})
    console.log(error,"tracking")
  }
}
