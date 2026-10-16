import slugify from "slugify";
import OfflineClass from "../../../../models/Institutes/Class/Offline_Model.js"
import Validations from "../../../../validations/index.js";
import { getBranchDetailsWithUUID, getCourseDetailsWithUUID, getInstituteDetailswithUUID } from "../../common/index.js";
import { FilterQuery, generateUUID } from "../../../../utils/helpers.js";
import {DefaultFilterQuerys, DefaultUpdateFields} from "../../../../utils/data.js"
import moment from "moment";
import { addStudentAttedence } from "../../Attendance/Student/index.js";
import { updateSubscription } from "../../../../middlewares/subscription/index.js";
import { createLogger } from "../../../ActivityLogs/index.js";
import { cleanObjectId, formatChanges, getChanges } from "../../../../utils/db_helpers/index.js";
import {InstituteUser} from "../../../../models/Institutes/Administration/Authorization/index.js";
import {sendClassAlertEmail} from "../../../../utils/CentralizedeEmailHandler/centralizedEmailControler.js"
import { ClassScheduleModel } from "../../../../models/Institutes/Class/ClassSchedule.js";
import Batch from "../../../../models/Institutes/Batch/index.js";
import mongoose from "mongoose";

export const createofflineclassController = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const value = Validations.CreateOfflineClass(req.body);
        const { class_name, institute, branch, start_date, start_time, end_time, batch ,course} = value;

        const find_institute = await getInstituteDetailswithUUID(institute);
        const find_branch = await getBranchDetailsWithUUID(branch)
        const find_course = await getCourseDetailsWithUUID(course)

        value.branch = find_branch._id
        value.course = find_course._id

        const existingClass = await OfflineClass.findOne(
            { slug: slugify(class_name), institute: find_institute?._id, branch:find_branch?._id, is_deleted: false },
            null,
            { session }
        );

        if (existingClass) {
            throw new Error("Class name already exists");
        }

        const startDateTime = moment(`${start_date} ${start_time}`, "YYYY-MM-DD HH:mm");
        const endDateTime = moment(`${start_date} ${end_time}`, "YYYY-MM-DD HH:mm");

        if (endDateTime.isBefore(startDateTime)) {
            throw new Error("End time cannot be before start time");
        }

        const duration = moment.duration(endDateTime.diff(startDateTime)).asMinutes();

        const newOfflineClass = await OfflineClass.create(
            [{ ...value, institute: find_institute?._id, slug: slugify(class_name), duration }],
            { session }
        );

        const uuid = await generateUUID();

        await ClassScheduleModel.create(
            [
                {
                    offlineclassId: newOfflineClass[0]._id,
                    uuid,
                    classDate: start_date,
                    classTime: start_time,
                    className: class_name,
                    batch,
                },
            ],
            { session }
        );

        await updateSubscription("Class", req.user.institute_id, { session });

        const offline_class = await OfflineClass.findById(newOfflineClass[0]?._id)
            .populate({ path: "batch", populate: { path: "student" } })
            .session(session);

        const studentIds = offline_class?.toJSON()?.batch?.student?.map((i) => i?._id);
        const students = studentIds?.map((i, index) => ({ student: i, id: index + 1 }));

        const data = {
            institute: newOfflineClass[0]?.institute,
            branch: newOfflineClass[0]?.branch,
            classModel: "offlineclass",
            student_class: newOfflineClass[0]?._id,
            students,
        };
        await addStudentAttedence(data, { session });

        const log_data = {
            user: req?.user?._id,
            role: req?.user?.role,
            title: "Offline class created",
            model: "offline class",
            details: `${offline_class.class_name} - offline class created`,
            institute: req?.user?.institute_id,
            branch: req?.user?.branch_id,
            action: "create",
        };
        await createLogger(log_data, { session });

        await Batch.findByIdAndUpdate(
            offline_class?.batch?._id,
            { $push: { classes: newOfflineClass[0]?._id } },
            { new: true, upsert: true, session }
        );

        const instructorDetails = await InstituteUser.findById(req.user._id).session(session);
        const studentDetails = await InstituteUser.find({ _id: { $in: studentIds } }).session(session);

        const classDetails = {
            name: class_name,
            courseName: offline_class.course_name,
            startTime: start_time,
            endTime: end_time,
        };
       console.log(studentDetails,"studentDetails")
        // await sendClassAlertEmail(classDetails, instructorDetails, studentDetails);

        await session.commitTransaction();
        session.endSession();

        res.status(200).send({
            status: "success",
            message: "New Offline Class Created Successfully",
            data: newOfflineClass[0],
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
};


export const updateofflineclassController = async (req, res) => {
    try {
        const { offlineclassid } = req.params;
        const value = FilterQuery(req.body, DefaultUpdateFields.offline_class);
        const { class_name, start_date,start_time, end_time } = value;

        const currentDate = moment().startOf('day');
        const startDate = moment(start_date).startOf('day');

        if (startDate.isBefore(currentDate)) {
            throw new Error('Start date cannot be in the past');
        }
        
      // Validate class timings and duration
      const startDateTime = moment(`${start_date} ${start_time}`, "YYYY-MM-DD HH:mm");
      const endDateTime = moment(`${start_date} ${end_time}`, "YYYY-MM-DD HH:mm");

      if (endDateTime.isBefore(startDateTime)) {
          throw new Error("End time cannot be before start time");
      }
    
      const duration = moment.duration(endDateTime.diff(startDateTime)).asMinutes();

      const existingClass = await OfflineClass.findOne({ uuid: offlineclassid });
      const updatedOfflineClass = await OfflineClass.findOneAndUpdate(
          { uuid: offlineclassid },
          { ...value, slug: slugify(class_name), duration },
          { new: true }
      );
      await updatedOfflineClass.save();
      await ClassScheduleModel.findOneAndUpdate({offlineclassId:existingClass?._id},{classTime:start_time,classDate:start_date,className:class_name})
      const changes = getChanges(cleanObjectId(existingClass.toObject()), cleanObjectId(updatedOfflineClass.toObject()));
      const log_data = { user: req?.user?._id, role: req?.user?.role, title: "offline class updated", model: "offline class", details: formatChanges(changes), action: "update", institute: req.user.institute_id, branch: req.user.branch_id };
      await createLogger(log_data);

      res.status(200).send({
          status: "success",
          message: 'Offline class updated successfully',
          data: updatedOfflineClass
      });
  } catch (error) {
      res.status(500).send({
          status: "failed",
            message: error.message
        });
    }
};

export const deleteofflineclassController = async (req, res) => {
    try {
        const { offlineclassid } = req.params;
        const data = await OfflineClass.findOneAndUpdate({uuid:offlineclassid}, { is_deleted: true });
        const log_data = {user: req?.user?._id ,role: req.user?.role,type:"institute",action:"delete",title:"offline class deleted",details:`${data.class_name} - deleted successfully`,model:"offline class",institute:req?.user?.institute_id,branch:req?.user?.branch_id}
        await createLogger(log_data)
        res.status(200).send({
            success: true,
            message: 'offline class deleted successfully'
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};


export const getAllOfflineClassesController = async (req, res) => {
    try {

        let filterArgs = FilterQuery(req?.query,DefaultFilterQuerys.offline_class)

        let {page=1,perPage=10} = req.query
        console.log(filterArgs,req.query)
        const institute = await getInstituteDetailswithUUID(filterArgs?.institute)
        const branch = await getBranchDetailsWithUUID(filterArgs?.branch)

        if (filterArgs?.start_date && filterArgs?.end_date) {
            const startDate = moment(filterArgs?.start_date).startOf('day');
            const endDate = moment(filterArgs?.end_date).endOf('day');
            filterArgs.start_date = { $gte: startDate.toDate(), $lte: endDate.toDate() };
        }
        
        const count = await OfflineClass.countDocuments({...filterArgs,institute:institute?._id,branch:branch?._id,is_deleted:false})
        const offlineClasses = await OfflineClass.find({...filterArgs,institute:institute?._id,branch:branch?._id,is_deleted:false}).populate('branch')
        .populate({
            path : "batch",
            populate:[
                {path:"student",populate:{path:"userDetail"}},{path:"course"},{path: 'instructor'}
            ]
        }).populate("instructors")
        .populate("coordinators")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({createdAt: -1});
        
        const totalPages = Math.ceil(count/perPage)
        const hasNextPage = page < totalPages
        const hasPreviousPage = page > totalPages

        res.status(200).json({
            status: "success",
            message : "Offline class retrived successfully",
            count,
            last_page:totalPages,
            data:offlineClasses, 
            hasNextPage,
            hasPreviousPage
        });

    } catch (error) {
        console.log(error,"all")
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving offline classes.',
            error: error.message,
        });
    }
};

export const getOfflineClassWithUUID = async (req,res) => {
    try {
    const {offlineClassId} = req.params
    const offline_class = await OfflineClass.findOne({uuid:offlineClassId}) 
    .populate({
        path : "batch",
        populate : [{path:"student"},{path:"course"}]
    }).populate("instructors")
    .populate("coordinators")
    res.status(200).json({status:"success",message:"Offline class retrived successfully",data:offline_class})   
    } catch (error) {
      res.status(500).json({status:"failed",message:error?.message}) 
    }
}
