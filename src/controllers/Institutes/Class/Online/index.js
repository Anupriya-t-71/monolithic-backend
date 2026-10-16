import slugify from "slugify";
import Onlineclass from "../../../../models/Institutes/Class/Online_Model.js"
import Validations from "../../../../validations/index.js";
import { FilterQuery } from "../../../../utils/helpers.js";
import { DefaultFilterQuerys, DefaultUpdateFields } from "../../../../utils/data.js";
import { getBranchDetailsWithUUID, getCourseDetailsWithUUID, getInstituteDetailswithUUID } from "../../common/index.js";
import moment from "moment";
import { addStudentAttedence } from "../../Attendance/Student/index.js";
import { updateSubscription } from "../../../../middlewares/subscription/index.js";
import { createLogger } from "../../../ActivityLogs/index.js";
import { cleanObjectId, formatChanges, getChanges } from "../../../../utils/db_helpers/index.js";
import Batch from "../../../../models/Institutes/Batch/index.js"
import {InstituteUser} from "../../../../models/Institutes/Administration/Authorization/index.js"
import {sendClassAlertEmail} from "../../../../utils/CentralizedeEmailHandler/centralizedEmailControler.js"
import { ClassScheduleModel } from "../../../../models/Institutes/Class/ClassSchedule.js";
import mongoose from "mongoose";

export const createOnlineclassController = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const value = Validations.CreateOnlineClass(req.body);
        const { class_name, institute, batch, branch, start_date, start_time, end_time } = value;

        const find_institute = await getInstituteDetailswithUUID(institute);
        const find_branch = await getBranchDetailsWithUUID(branch)
        const find_course = await getCourseDetailsWithUUID(value?.course)

        value.course = find_course?._id

        const existingclass = await Onlineclass.findOne(
            { slug: slugify(class_name), institute: find_institute?._id, branch: find_branch?._id, is_deleted: false },
            null,
            { session }
        );

        if (existingclass) {
            throw new Error("Class name already exists");
        }

        const startDateTime = moment(`${start_date} ${start_time}`, "YYYY-MM-DD HH:mm");
        const endDateTime = moment(`${start_date} ${end_time}`, "YYYY-MM-DD HH:mm");

        if (endDateTime.isBefore(startDateTime)) {
            throw new Error("End time cannot be before start time");
        }

        const duration = moment.duration(endDateTime.diff(startDateTime)).asMinutes();

        const newOnlineclass = await Onlineclass.create(
            [
                {
                    ...value,
                    branch:find_branch?._id,
                    institute: find_institute?._id,
                    slug: slugify(class_name),
                    duration,
                },
            ],
            { session }
        );

        await ClassScheduleModel.create(
            [
                {
                    onlineclassId: newOnlineclass[0]._id,
                    classDate: start_date,
                    classTime: start_time,
                    className: class_name,
                    batch,
                },
            ],
            { session }
        );

        await updateSubscription("Class", req.user.institute_id);

        const online_class = await Onlineclass.findById(newOnlineclass[0]._id)
            .populate({ path: "batch", populate: { path: "student" } })
            .session(session);

        const studentIds = online_class?.toJSON()?.batch?.student?.map((i) => i?._id);
        const students = studentIds?.map((i, index) => ({ student: i, id: index + 1 }));
        const data = {
            institute: newOnlineclass[0]?.institute,
            branch: newOnlineclass[0].branch,
            classModel: "onlineclass",
            student_class: newOnlineclass[0]?._id,
            students: students,
        };
        await addStudentAttedence(data);

        const log_data = {
            user: req?.user?._id,
            role: req?.user?.role,
            title: "online class created",
            model: "online class",
            details: `${online_class.class_name} - online class created`,
            institute: req?.user?.institute_id,
            branch: req?.user?.branch_id,
            action: "create",
        };
        await createLogger(log_data);

        await Batch.findByIdAndUpdate(
            online_class?.batch?._id,
            { $push: { classes: newOnlineclass[0]?._id } },
            { new: true, upsert: true, session }
        );

        await session.commitTransaction();
        session.endSession();

        res.status(200).send({
            success: true,
            message: "New Onlineclass Created Successfully",
            data: newOnlineclass[0],
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


export const updateOnlineclassController = async (req, res) => {
    try {
        const { onlineclassId } = req.params;
        const value = FilterQuery(req.body,DefaultUpdateFields.online_class)
        const {class_name,start_date, start_time, end_time } = value

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

            const existingClass = await Onlineclass.findOne({ uuid: onlineclassId });
            const updatedOnlineclass = await Onlineclass.findOneAndUpdate({ uuid: onlineclassId }, { ...value, slug: slugify(class_name), duration }, { new: true });
            await updatedOnlineclass.save();
            await ClassScheduleModel.findOneAndUpdate({onlineclassId:existingClass?._id},{classTime:start_time,classDate:start_date,className:class_name})
            const changes = getChanges(cleanObjectId(existingClass.toObject()), cleanObjectId(updatedOnlineclass.toObject()));
            const log_data = { user: req?.user?._id, role: req?.user?.role, title: "online class updated", model: "online class", details: formatChanges(changes), action: "update", institute: req.user.institute_id, branch: req.user.branch_id };
            await createLogger(log_data);
            res.status(200).send({
                success: true,
                message: 'Online class updated successfully',
                data: updatedOnlineclass
            });
        } catch (error) {
            res.status(500).send({
                status: "failed",
                message: error.message
            });
        }
    };

export const updateOnlineclassStatusController = async (req, res) => {
    try {
        const { onlineclassId } = req.params;
        const { is_active, ...rest } = req.body;
        
        if (Object.keys(rest).length > 0) {
            return res.status(400).send({
                success: false,
                message: 'Only "is_active" field is allowed to be updated',
            });
        }

        const updatedOnlineclass = await Onlineclass.findOneAndUpdate({uuid:onlineclassId}, { is_active }, { new: true });

        res.status(200).send({
            success: true,
            message: 'Online class status updated successfully',
            updatedOnlineclass
        })
    
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

export const deleteOnlineclassController = async (req, res) => {
    try {
        const { onlineclassId } = req.params;
        await Onlineclass.findOneAndUpdate({uuid:onlineclassId}, { is_deleted: true });
        const log_data = {user: req?.user?._id ,role: req.user?.role,type:"institute",action:"delete",title:"online class deleted",details:`${data.class_name} - deleted successfully`,model:"online class",institute:req?.user?.institute_id,branch:req?.user?.branch_id}
        await createLogger(log_data)
        res.status(200).send({
            success: true,
            message: 'Onlineclass deleted successfully'
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

export const getAllOnlineClassesController = async (req, res) => {
    try {
        let filterArgs = FilterQuery(req.query, DefaultFilterQuerys.online_class);
        let { page = 1, perPage = 10,month,year,course } = req.query;
        page = parseInt(page);
        perPage = parseInt(perPage);


        // Convert month and year to integers if they exist
        if (month) {
            filterArgs.month = parseInt(month);
        }
        if (year) {
            filterArgs.year = parseInt(year);
        }
        if (course) {
            filterArgs.course = course; // Assuming course is a string
        }


        const institute = await getInstituteDetailswithUUID(filterArgs?.institute);
        if (!institute) {
            return res.status(404).json({
                success: false,
                message: 'Institute not found',
            });
        }

        const branch = await getBranchDetailsWithUUID(filterArgs?.branch);
        if (!branch) {
            return res.status(404).json({
                success: false,
                message: 'Branch not found',
            });
        }

         // Create the query object for filtering
         const query = {
            ...filterArgs,
            is_deleted: false,
            institute: institute?._id,
            branch: branch?._id,
        };

        if (month) {
            query.month = month; // Assuming month is stored in a field named 'month'
        }

        if (year) {
            query.year = year; // Assuming year is stored in a field named 'year'
        }

        if (course) {
            query.course = course_name; // Assuming course is stored in a field named 'course_name'
        }

        const count = await Onlineclass.countDocuments(query);

        // const count = await Onlineclass.countDocuments({
        //     ...filterArgs,
        //     is_deleted: false,
        //     institute: institute?._id,
        //     branch: branch?._id,
        // });
        const onlineClasses = await Onlineclass.find({
            ...filterArgs,
            is_deleted: false,
            institute: institute?._id,
            branch: branch?._id,
        })
            .populate({
                path: "batch",
                populate: {
                    path: "student",
                },
            })
            .populate("instructors")
            .populate("coordinators")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });

        const totalPages = Math.ceil(count / perPage);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        res.status(200).json({
            success: true,
            count: count,
            last_page: totalPages,
            data: onlineClasses,
            hasNextPage,
            hasPreviousPage,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// export const getOnlineClassDetailsWithId = async (req,res) => {
//     try {
//         const {onlineclassId} = req.params

//         const online_class = await Onlineclass.findOne({uuid:onlineclassId}) 
//         .populate({
//             path : "batch",
//             populate : [{path:"student"},{path:"course"}]
//         }).populate("instructors")
//         .populate("coordinators")

//         res.status(200).json({status:"success",message:"Online class retrived successfully",data:online_class})   
//         } catch (error) {
//           res.status(500).json({status:"failed",message:error?.message}) 
//         }
// }

export const getOnlineClassDetailsWithId = async (req, res) => {
    try {
      const { onlineclassId } = req.params;
      const { courseName, year, month } = req.query; // Get filters from query parameters
  
      // Build filter conditions based on query parameters
      const filterConditions = { uuid: onlineclassId };
  
      if (courseName) {
        filterConditions["batch.course.course_name"] = courseName; 
      }
  
      if (year && month) {
        const startOfMonth = new Date(`${year}-${month}-01`);
        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(endOfMonth.getMonth() + 1); 
  
        filterConditions.start_time = {
          $gte: startOfMonth,
          $lt: endOfMonth,
        };
      }
  
      const online_class = await Onlineclass.findOne(filterConditions)
        .populate({
          path: "batch",
          populate: [{ path: "student" }, { path: "course" }],
        })
        .populate("instructors")
        .populate("coordinators");
  
      res.status(200).json({
        status: "success",
        message: "Online class retrieved successfully",
        data: online_class,
      });
    } catch (error) {
      res.status(500).json({ status: "failed", message: error?.message });
    }
  };
  
