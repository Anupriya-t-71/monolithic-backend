
import Course from "../../../models/Institutes/Course/index.js"

export const CourseBasedView =async(req,res)=>{
 try {
    const {courseId,instituteId} = req.params;

    const data = await Course.findOne({_id:courseId,institute_id:instituteId})
    .populate([
        { path: 'branch_id', select: 'branch_identity' },
        { 
            path: 'batches', 
            populate: [
                // { path: 'student',
                //   select:'-password -username -is_two_auth_completed -is_email_verified'
                // },
                { 
                    path: 'classes', 
                    // populate:[
                    //    {path:'instructors',select:'-password -username -is_two_auth_completed -is_email_verified'},{path:'coordinators'}
                    // ],
                    select:'instructors coordinators'
                }
            ],
            select:'-createdAt -updatedAt -uuid -__v -is_deleted -institute_id -branch_id -course'
        },
        { path: 'category', select: 'category_name' },
        { path: 'coursemodules' },
        { path: 'notes' },
        { path: 'studymaterials' },
        { path: 'course_templates' },
        { path: 'institute_id', select: 'institute_name _id image' },
    ])
    .lean()

    if(!data) {
        return res.status(404).json({status:'failed',message:"course not founded"})
    }

    let studentCount; let classesCount; let array=[];
     data.batches.forEach(batch => {
          studentCount = batch.student ? batch.student.length : 0; 
          classesCount = batch.classes ? batch.classes.length : 0;
            batch.classes.forEach(cls => {
                 if (!array.includes(cls.instructors)) {
                    array.push(cls.instructors)
                 }
            });
        });

    let instructorCount = array.length


   res.status(200).json({status:"success",message:"course data fetched",data,studentCount,instructorCount,classesCount})

 } catch (error) {
    console.log("course based view error: ",error)
    res.status(500).json({status:"failed",message:"internal server error"})
 }
}