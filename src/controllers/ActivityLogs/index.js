import { InstitutesRoles } from "../../models/Administration/Roles_And_Permissions/index.js";
import * as ActivityModels from "../../models/Institutes/Activity Logs/index.js";
import { DefaultFilterQuerys } from "../../utils/data.js";
import { FilterQuery } from "../../utils/helpers.js";

export const logModels = {
  instituteAdmin: ActivityModels.InstituteAdminLogs,
  teachingStaff: ActivityModels.InstituteTeachingStaffLog,
  nonTeachingStaff: ActivityModels.InstituteNonTeachingStaffLog,
  student: ActivityModels.InstituteStudentLog,
  platformAdmin: ActivityModels.PlatformAdminLog,
  developer: ActivityModels.DeveloperActivityLog
};


const addLog = async (Model, data) => {
  console.log("Model" , Model)
  try {
    const log = new Model(data);
    console.log("log : ", log)
    await log.save();
    return log;
  } catch (error) {
    console.error(`Error adding log: ${error}`);
    throw error;
  }
};

const logFunctions = {
  "Institute Admin": data => addLog(ActivityModels.InstituteAdminLogs, data),
  "Teaching Staff": data => addLog(ActivityModels.InstituteTeachingStaffLog, data),
  "Non Teaching Staff": data => addLog(ActivityModels.InstituteNonTeachingStaffLog, data),
  "Student": data => addLog(ActivityModels.InstituteStudentLog, data),
  "Developer": data => addLog(ActivityModels.DeveloperActivityLog, data),
};

const getRoleDetailsById = async (roleId) => {
  try {
    return await InstitutesRoles.findById(roleId);
  } catch (error) {
    console.error(`Error fetching role details: ${error}`);
    throw error;
  }
};

export const createLogger = async (details, type) => {
  try {
    if (type === "platform") {
      return await addLog(ActivityModels.PlatformAdminLog, details);
    }else if (type === "developer") {
      return await addLog(ActivityModels.DeveloperActivityLog, details); // Log Developer Activities
    } 
     else {
      const { role } = details;
      const roleDetails = await getRoleDetailsById(role);
      const logFunction = logFunctions[roleDetails?.identity] || logFunctions["Institute Admin"];
      return await logFunction(details);
    }
  } catch (error) {
    console.error(`Error in createLogger: ${error}`);
    throw error;
  }
};

const map_to_model = {
  "Institute Admin": ActivityModels.InstituteAdminLogs,
  "Teaching Staff": ActivityModels.InstituteTeachingStaffLog,
  "Non Teaching Staff": ActivityModels.InstituteNonTeachingStaffLog,
  "Student": ActivityModels.InstituteStudentLog,
  "Developer": ActivityModels.DeveloperActivityLog,
}


export const getUserActivityLogs = async (req, res) => {
  try {
    const userId = req.user?._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    console.log(userId, "userId")
    const fromDateStr = req.query.fromDate;
    const toDateStr = req.query.toDate;

  
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('-').map(num => parseInt(num, 10));
      return new Date(year, month - 1, day);
    };

    const fromDate = fromDateStr ? parseDate(fromDateStr) : null;
    const toDate = toDateStr ? parseDate(toDateStr) : null;

    const endOfDay = (date) => {
      if (!date) return null;
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      return end;
    };

    
    if (!userId) {
      return res.status(400).json({ status: "failed", message: "User ID not provided" });
    }

    const role = await getRoleDetailsById(req.user.role);
    const model = map_to_model[role?.identity];

    console.log("model", model)
    const filterArgs = FilterQuery(req.query, DefaultFilterQuerys.activity_logs);

    
    if (fromDate && toDate) {
      filterArgs.timestamp = {
        $gte: fromDate,
        $lte: endOfDay(toDate)
      };
    } else if (fromDate) {
      filterArgs.timestamp = { $gte: fromDate };
    } else if (toDate) {
      filterArgs.timestamp = { $lte: endOfDay(toDate) };
    }
  console.log("filter", filterArgs)
  
    const logs = await model.find({ ...filterArgs, user: userId})
      .populate({ path: "user"})
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    
    const totalLogs = await model.countDocuments({ ...filterArgs, user: userId });
    const totalPages = Math.ceil(totalLogs / limit);

    
    res.status(200).json({
      status: "success",
      message: "Activities retrieved successfully",
      data: logs,
      pagination: {
        totalLogs,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.log(`Error fetching activity logs: ${error}`);
    res.status(500).json({ status: "failed", message: error?.message });
  }
};


export const getStaffActivityLogs = async (req,res) => {
  try {
  let { staffId } = req.params
  let { page = 1, perPage=10} = req.query

  const TeachingStaffLogs =   await ActivityModels.InstituteTeachingStaffLog.find({user:staffId})
  .skip((page-1)*perPage).limit(perPage)
  const count = await ActivityModels.InstituteTeachingStaffLog.countDocuments({user:staffId})
  const last_page = Math.ceil(count/perPage)
  res.status(200).json({ status : 'success', message : "Activity Log retrived sucessfully", data: { logs : TeachingStaffLogs , last_page, count} })
  } catch (error) {
    res.status(500).json({ status: "failed",message : error?.message})
  }
}

export const getStudentActivityLogs = async (req, res) => {
  try {
    const userId = req.params.studentId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const fromDateStr = req.query.fromDate;
    const toDateStr = req.query.toDate;

  
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('-').map(num => parseInt(num, 10));
      return new Date(year, month - 1, day);
    };

    const fromDate = fromDateStr ? parseDate(fromDateStr) : null;
    const toDate = toDateStr ? parseDate(toDateStr) : null;

    const endOfDay = (date) => {
      if (!date) return null;
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      return end;
    };

    
    if (!userId) {
      return res.status(400).json({ status: "failed", message: "User ID not provided" });
    }

    const role = 'Student';
    const model = map_to_model['Student'];

    const filterArgs = FilterQuery(req.query, DefaultFilterQuerys.activity_logs);

    
    if (fromDate && toDate) {
      filterArgs.timestamp = {
        $gte: fromDate,
        $lte: endOfDay(toDate)
      };
    } else if (fromDate) {
      filterArgs.timestamp = { $gte: fromDate };
    } else if (toDate) {
      filterArgs.timestamp = { $lte: endOfDay(toDate) };
    }
  
    const logs = await model.find({ ...filterArgs, user: userId})
      .populate({ path: "user"})
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    
    const totalLogs = await model.countDocuments({ ...filterArgs, user: userId });
    const totalPages = Math.ceil(totalLogs / limit);

    
    res.status(200).json({
      status: "success",
      message: "Activities retrieved successfully",
      data: logs,
      pagination: {
        totalLogs,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: "failed", message: error?.message });
  }
};


// Developer 

export const getDeveloperActivityLogs = async (req,res) => {
  try {
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

   
    const fromDateStr = req.query.fromDate;
    const toDateStr = req.query.toDate;

    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split("-").map((num) => parseInt(num, 10));
      return new Date(year, month - 1, day);
    };

    const fromDate = fromDateStr ? parseDate(fromDateStr) : null;
    const toDate = toDateStr ? parseDate(toDateStr) : null;

    const endOfDay = (date) => {
      if (!date) return null;
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      return end;
    };

    
    const role = req.query.role;

    if (!role || !map_to_model[role]) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid or missing role parameter",
      });
    }

    const model = map_to_model[role];

    
    const filterArgs = FilterQuery(req.query, DefaultFilterQuerys.activity_logs);

    if (fromDate && toDate) {
      filterArgs.timestamp = {
        $gte: fromDate,
        $lte: endOfDay(toDate),
      };
    } else if (fromDate) {
      filterArgs.timestamp = { $gte: fromDate };
    } else if (toDate) {
      filterArgs.timestamp = { $lte: endOfDay(toDate) };
    }

    
    const logs = await model
      .find(filterArgs)
      .populate({ path: "user", model: "Instituteuserlist" })
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    
    const totalLogs = await model.countDocuments(filterArgs);
    const totalPages = Math.ceil(totalLogs / limit);

    
    res.status(200).json({
      status: "success",
      message: "Activities retrieved successfully",
      data: logs,
      pagination: {
        totalLogs,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error(`Error fetching activity logs: ${error}`);
    res.status(500).json({ status: "failed", message: error.message });
  }
}


export const getMasterAdminActivityLogs = async (req, res) => {
  try {
    const userId = req.user?._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    
    const fromDateStr = req.query.fromDate;
    const toDateStr = req.query.toDate;

  
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('-').map(num => parseInt(num, 10));
      return new Date(year, month - 1, day);
    };

    const fromDate = fromDateStr ? parseDate(fromDateStr) : null;
    const toDate = toDateStr ? parseDate(toDateStr) : null;

    const endOfDay = (date) => {
      if (!date) return null;
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      return end;
    };

    
    if (!userId) {
      return res.status(400).json({ status: "failed", message: "User ID not provided" });
    }

    
    const filterArgs = FilterQuery(req.query, DefaultFilterQuerys.activity_logs);

    
    if (fromDate && toDate) {
      filterArgs.timestamp = {
        $gte: fromDate,
        $lte: endOfDay(toDate)
      };
    } else if (fromDate) {
      filterArgs.timestamp = { $gte: fromDate };
    } else if (toDate) {
      filterArgs.timestamp = { $lte: endOfDay(toDate) };
    }

  
    const logs = await ActivityModels.PlatformAdminLog.find({ ...filterArgs, user: userId})
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    
    const totalLogs = await ActivityModels.PlatformAdminLog.countDocuments({ ...filterArgs, user: userId });
    const totalPages = Math.ceil(totalLogs / limit);

    
    res.status(200).json({
      status: "success",
      message: "Activities retrieved successfully",
      data: logs,
      pagination: {
        totalLogs,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.log(`Error fetching activity logs: ${error}`);
    res.status(500).json({ status: "failed", message: error?.message });
  }
};