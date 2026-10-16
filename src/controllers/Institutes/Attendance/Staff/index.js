import staff_attedence from "../../../../models/Institutes/Attendance/Staff/index.js";
import OfflineClass from "../../../../models/Institutes/Class/Offline_Model.js";
import OnlineClass from "../../../../models/Institutes/Class/Online_Model.js";
import { DefaultFilterQuerys } from "../../../../utils/data.js";
import { FilterQuery } from "../../../../utils/helpers.js";
import Validations from "../../../../validations/index.js";
import { getBranchDetailsWithUUID, getInstituteDetailswithUUID ,getInstituteUserDetailsWithUUID, getRoleDetailsWithName} from "../../common/index.js";

export const addStaffAttedenceController = async (req,res) => {
    try {
    const value = Validations?.staffAttedence(req.body)
    const {staff,date,status,institute,branch} = value
    const institute_details = await getInstituteDetailswithUUID(institute)
    const branch_details = await getBranchDetailsWithUUID(branch)
    const user_details = await getInstituteUserDetailsWithUUID(staff,"Teaching Staff")

    if(user_details?.branch_id?.toString()!==branch_details?._id.toString()||user_details?.institute_id.toString() !== institute_details?._id?.toString()){
      throw new Error("institute and branch not match")
    }
    const find_attedence = await staff_attedence.findOne({ date: date, staff: user_details?._id })

    if(find_attedence){
      throw new Error("Attedence Already Exists")
    }
    const new_staff_attedence = await staff_attedence.create({staff:user_details?._id,institute:institute_details?._id,branch:branch_details?._id,status:status,date:date})
    res.status(200).json({status:'success',message:"staff attedence added successfully",data:new_staff_attedence})  
    } catch (error) {
      res.status(500).json({status:"failed",message:error?.message})  
    }
}

export const addInitialAttendanceStudent = async (value) => {
  try {
    const {staff,date,status,institute,branch} = value

    const new_staff_attedence = await staff_attedence.create({staff:staff,institute:institute,branch:branch,status:status,date:date})
    return {status:'success',message:"staff attedence added successfully",data:new_staff_attedence}
    } catch (error) {
      throw new Error(error)
    }
}

export const addNonTeachingStaffAttedenceController = async (req,res) => {
  try {
  const value = Validations.staffAttedence(req.body)
  const { staff,date,institute,branch,status} = value
  const institute_details = await getInstituteDetailswithUUID(institute)
  const branch_details = await getBranchDetailsWithUUID(branch)
  const user_details = await getInstituteUserDetailsWithUUID(staff,"Non Teaching Staff") 
 
  if(user_details?.branch_id.toString()!==branch_details?._id.toString()||user_details?.institute_id.toString() !== institute_details?._id.toString()){
    throw new Error("institute and branch not match")
  }
  const new_non_teaching_staff_attedence = await staff_attedence.create({institute:institute_details?._id,branch:branch_details?._id,date:date,status:status,staff:user_details?._id})
  res.status(200).json({status:"sucess",message:"attedence added succesfully",data:new_non_teaching_staff_attedence})
  } catch (error) {
    res.status(500).json({status:"failed",message:error?.message})
  }
}

const converStaffAttedence = (data) => {
  const attendanceSummary = data.reduce((acc, record) => {
    
    const staffId = record?.staff?._id.toString();
    
    if (!acc[staffId]) {
        acc[staffId] = {
            staff_id: staffId,
            staff:record?.staff?.uuid,
            staff_name: record.staff.full_name,
            email: record.staff.email,
            branch : record?.staff?.branch_id?.uuid,
            img: record.staff.image,
            presentCount: 0,
            absentCount: 0
        };
    }

    if (record.status === 'present') {
        acc[staffId].presentCount += 1;
    } else if (record.status === 'absent') {
        acc[staffId].absentCount += 1;
    }

    return acc;
}, {});

return Object.values(attendanceSummary);
}

export const getAllStaffAttedence = async (req,res) => {
  try {
  const { institute,branch} = req.query 
  let {page=1,perPage=10} = req.query
  const filterArgs = FilterQuery(req.query,DefaultFilterQuerys.non_teaching_staff_attedence)

  const institute_details = await getInstituteDetailswithUUID(institute)
  const branch_details = await getBranchDetailsWithUUID(branch)
  const role_details = await getRoleDetailsWithName("Teaching Staff")
  
  const attedence_all = await staff_attedence.find({...filterArgs,institute:institute_details?._id,branch:branch_details?._id})
  .populate({path:"staff",populate:{path:"branch_id"}}).then((data)=>data.filter((i)=>i.staff?.role?.toString() === role_details?._id?.toString()))
  
  const data = converStaffAttedence(attedence_all)

  const count = page*perPage
  const startPage =(page-1)*perPage
  const total = data?.length
  const paginationData = data?.slice(startPage,count)
  const last_page = Math.ceil(total/perPage)

  res.status(200).json({status:"success",message:"attedence retrived successfully",data:paginationData,last_page,count:total})  
  } catch (error) {
    res.status(500).json({status:"failed",message:error?.message})
  }
}

export const getallNonTeachingStaffAttedence = async (req,res) => {
  try {
    const { institute,branch} = req.query 

    const institute_details = await getInstituteDetailswithUUID(institute)
    const branch_details = await getBranchDetailsWithUUID(branch)
    const role_details = await getRoleDetailsWithName("Non Teaching Staff")

    const filterArgs = FilterQuery(req.query,DefaultFilterQuerys.teaching_staff_attedence)

    let {page=1,perPage=10} = req.query

    const attedence_all = await staff_attedence.find({...filterArgs,institute:institute_details?._id,branch:branch_details?._id})
    .populate({path:"staff",populate:{path:"branch_id",path:"userDetail"}})
    .then((data)=>data.filter((i)=>i.staff?.role?.toString() === role_details?._id?.toString()))
    console.log(attedence_all,"attendence")
    const data = converStaffAttedence(attedence_all)

    const count = page*perPage
    const startPage =(page-1)*perPage
    const total = data?.length
    const paginationData = data?.slice(startPage,count)
    const last_page = Math.ceil(total/perPage)
    
    res.status(200).json({status:"success",message:"attedence retrived successfully",data:paginationData,last_page,count:total})   
  } catch (error) {
    res.status(500).json({status:"failed",message:error?.message})
  }
}

const daysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

const getMonthNumber = (monthName) => {
  const date = new Date(Date.parse(monthName + " 1, 2024"));
  return date.getMonth();
};

const generateMonthDays = (month, year) => {
  const daysCount = daysInMonth(month, year);
  const days = [];
  for (let day = 1; day <= daysCount; day++) {
      days.push({
          date: new Date(year, month, day).toISOString().split('T')[0],
          status: "absent"
      });
  }
  return days;
};

const formatData = (data, monthName, year) => {
  const month = getMonthNumber(monthName);
  const monthDays = generateMonthDays(month, year);

  data.forEach(item => {
      const itemDate = new Date(item.date).toISOString().split('T')[0];
      const day = monthDays.find(d => d.date === itemDate);
      if (day) {
          day.status = item.status;
      }
  });

  const workingDays = monthDays.filter(day => {
      const date = new Date(day.date);
      return date.getDay() !== 0;
  });

  const presentDays = workingDays.filter(day => day.status === 'present').length;
  const absentDays = workingDays.filter(day => day.status === 'absent').length;

  return {
      totalWorkingDays: workingDays.length,
      presentDays,
      absentDays,
      workingDays,
      data
  };
};

export const getStaffAttedenceWithUserId  = async (req,res) => {
   try{
   const {staffId} = req.params
   const { month } = req.query
   let year = req.query.year || new Date().getFullYear()
  //  let year = new Date().getFullYear()
   const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
   const monthNum = months.indexOf(month)

   const startDate = new Date(year,monthNum,1).toISOString().split('T')[0]
   const endDate = new Date(year,monthNum,31).toISOString().split('T')[0]

   console.log(startDate,'',endDate)
   const user_details = await getInstituteUserDetailsWithUUID(staffId,"Teaching Staff")

   const querys = FilterQuery(req.query,DefaultFilterQuerys.teaching_staff_attedence)
   
   const attedence = await staff_attedence.find({...querys,staff:user_details?._id})
   const filteredAttendance = formatData(attedence,month,year)

   const online_class_data = await OnlineClass.countDocuments({"instructors":user_details?._id,start_date:{$gt:startDate,$lte:endDate}})
   const offline_class_data = await OfflineClass.countDocuments({"instructors":user_details?._id,start_date:{$gt:startDate,$lte:endDate}})
   const count = online_class_data + offline_class_data
   
   res.status(200).json({stauts:"success",message:"attedence retrieved successfully",data:{...filteredAttendance,total_class:count}})
   }catch(error){
    res.status(500).json({status:"failed",message:error?.message})
   }
}

export const getNonTeachingStaffAttedenceWithId = async (req,res) => {
  try {
    const {nonStaffId} = req.params
    const user_details = await getInstituteUserDetailsWithUUID(nonStaffId,"Non Teaching Staff")
    const attedence = await staff_attedence.find({staff:user_details?._id})
    res.status(200).json({stauts:"success",message:"user retrieved successfully",data:attedence})   
  } catch (error) {
    res.status(500).json({status:"fail",message:error?.message})
  }
}

export const GetStaffDailyDetails=async (req,res)=>{
  try {
    const {staffId} = req.params
    const {date} = req.query
    const user  = await getInstituteUserDetailsWithUUID(staffId,"Teaching Staff")

    const online = await OnlineClass.find({instructors:{$in:user?._id}})
    const offline = await OfflineClass.find({instructors:{$in:user?._id}})

    
            const classes = []
            online.forEach((item)=>{
                 if (item.start_date.split('T')[0] == date) {
                    classes.push(item)
                 }
            })
            offline.forEach((item)=>{
                 if (item.start_date.split('T')[0] == date) {
                    classes.push(item)
                 }
            })

      

    res.status(200).json({status:"success",message:"daily classes details fetched",data:classes})

  } catch (error) {
    console.log(error)
    res.status(500).json({status:"failed",message:error?.message})
  }
}