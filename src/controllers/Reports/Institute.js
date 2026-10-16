import Branch from "../../models/Institutes/Branch/index.js";
import Category from "../../models/Institutes/Category/index.js";
import Course from "../../models/Institutes/Course/index.js";
import Institute from "../../models/Institutes/Institute/index.js";
import Note from "../../models/Institutes/Course/Notes_Model.js";
import {InstituteNon_TeachingStaff, InstituteStudent, InstituteTeaching_Staff} from "../../models/Institutes/Administration/Authorization/index.js";
import Student_Fee_Model from "../../models/Institutes/Payment/Student_Fee_Model.js";
import Staff_Salary_Model from "../../models/Institutes/Payment/Staff_Salary_Model.js";
import { getBranchDetailsWithUUID, getInstituteDetailswithUUID } from "../Institutes/common/index.js";
import Batch from "../../models/Institutes/Batch/index.js";
import { startOfYear, endOfYear, format } from "date-fns"
import { InstituteSubscription, SubscriptionFeatures } from "../../models/Administration/Subscription/index.js";
import { StudentTicket, TeachingTicket, StaffTicket, InstituteAdminTicket } from "../../models/Institutes/Ticket/Ticket.js";



const getTopCourseCountWithBatches = async (limit=3,filters) => {
  const topCourses = await Batch.aggregate([
    {
        $match : { is_deleted: false , ...filters}
    },
    {
        $group : {
            _id : "$course",
            batchCount : { $sum: 1}
        }
    },
    {
        $sort : {
            batchCount : -1
        }
    }
  ])
  return topCourses.map((course) =>course?._id)
}

const getMonthlyRevenue = async (year,filters) => {
      const startDate = startOfYear(new Date(year,0,1))
      const endDate = endOfYear(new Date(year,11,31)) 

      const revenueData = await Student_Fee_Model.aggregate([
        {
            $match: {
                payment_date : {
                    $gte : format(startDate, 'yyyy-MM-dd'),
                    $lte : format(endDate,'yyyy-MM-dd')
                },
                is_deleted : false,
                ...filters
            }
        },
        {
            $group : {
                _id : {
                    month: { $month: { $dateFromString: { dateString: "$payment_date" } } },
                    year: { $year: { $dateFromString: { dateString: "$payment_date" } } }
                },
                totalRevenue: { $sum: "$paid_amount" }
            }
        },
        {
            $project: {
                _id: 0,
                month: "$_id.month",
                year: "$_id.year",
                totalRevenue: 1
            }
        },
        {
            $sort: { month: 1 }
        }
      ])

      const revenueArray = new Array(12).fill(0);

    revenueData.forEach(data => {
        const monthIndex = data.month - 1; 
        revenueArray[monthIndex] = data.totalRevenue || 0;
    });
    
    return revenueArray;

}


const getMonthlyExpenses = async (year, filters) => {
    const startDate = startOfYear(new Date(year, 0, 1));
    const endDate = endOfYear(new Date(year, 11, 31));

    const expensesData = await Staff_Salary_Model.aggregate([
        {
            $match: {
                payment_date: {
                    $gte: format(startDate, 'yyyy-MM-dd'),
                    $lte: format(endDate, 'yyyy-MM-dd')
                },
                is_deleted: false,
                ...filters
            }
        },
        {
            $group: {
                _id: {
                    month: { $month: { $dateFromString: { dateString: "$payment_date" } } },
                    year: { $year: { $dateFromString: { dateString: "$payment_date" } } }
                },
                totalExpenses: { $sum: "$paid_amount" }
            }
},
{
    $project: {
        _id: 0,
        month: "$_id.month",
        year: "$_id.year",
        totalExpenses: 1
    }
},
{
    $sort: { month: 1 }
}
]);

const expensesArray = new Array(12).fill(0);

expensesData.forEach(data => {
const monthIndex = data.month - 1;
expensesArray[monthIndex] = data.totalExpenses || 0;
});

return expensesArray;
};

export const getreports = async (req, res) => {
    try {
        const { instituteId, branchid,year, month} = req.params;

        const institue = await getInstituteDetailswithUUID(instituteId)
        const branch = await getBranchDetailsWithUUID(branchid)
        
        const instituteFilter = { _id: institue?._id };
        const branchFilter = { institute_id: institue?._id };

        if (branchid) {
            branchFilter._id = branch?._id;
        }
       
        const instituteCount = await Institute.countDocuments(instituteFilter);
        const branchCount = await Branch.countDocuments(branchFilter);

        const categoryFilter = { institute_id: institue?._id };
        if (branchid) {
            categoryFilter.branch_id = branch?._id;
        }
        const courseIds = await getTopCourseCountWithBatches(3,categoryFilter)
        const popularCourses = await Course.find({ _id: { $in : courseIds }, is_deleted: false})
        
      
        const currentYear = year || new Date().getFullYear();

        const revenue = await getMonthlyRevenue(currentYear,categoryFilter)
        const expenses = await getMonthlyExpenses(currentYear, categoryFilter);

        
        const categoryCount = await Category.countDocuments(categoryFilter);
        const instituteCategories = await Category.countDocuments({ institute_id: institue?._id })

        const courseFilter = { institute_id: institue?._id };
        if (branchid) {
            courseFilter.branch_id = branch?._id;
        }
        const courseCount = await Course.countDocuments(courseFilter);

        const noteFilter = { institute_id: institue?._id };
        if (branchid) {
            noteFilter.branch_id = branch?._id;
        }
        const noteCount = await Note.countDocuments(noteFilter);
      
        const studentFilter = {institute_id: institue?._id};
        if(branchid){
            studentFilter.branch_id = branch?._id;
        }
        const studentCount = await InstituteStudent.countDocuments(studentFilter) 


        const studentfeeFilter = { institute_id: institue?._id };
        if (branchid) {
            studentfeeFilter.branch_id = branch?._id;
        }

        const studentFees = await Student_Fee_Model.find(studentfeeFilter);

        let totalPaidAmount = 0;
        let totalBalance = 0;

        studentFees.forEach(studentFee => {
            totalPaidAmount += parseFloat(studentFee.paid_amount);
            totalBalance += parseFloat(studentFee.balance);
        });

        const nonTeachingstaffFilter = {institute_id: institue?._id};
        if(branchid){
            nonTeachingstaffFilter.branch_id = branch?._id;
        }
        const nonTeachingstaffCount = await InstituteNon_TeachingStaff.countDocuments(nonTeachingstaffFilter) 

        const TeachingstaffFilter = {institute_id: institue?._id};
        if(branchid){
            nonTeachingstaffFilter.branch_id = branch?._id;
        }
        const TeachingstaffCount = await InstituteTeaching_Staff.countDocuments(TeachingstaffFilter)

        
        const staffSalaryFilter = { institute_id: institue?._id };
        if (branchid) {
            staffSalaryFilter.branch_id = branch?._id;
        }

        const staffSalaries = await Staff_Salary_Model.find(staffSalaryFilter);

        let totalSalaryAmount = 0;
        let totalSalaryBalance = 0;

        staffSalaries.forEach(salary => {
            totalSalaryAmount += parseFloat(salary.salary_amount);
            totalSalaryBalance += parseFloat(salary.balance);
        });



        res.status(200).json({
            success: true,
            instituteCount,
            mainCategory : instituteCategories,
            revenue : revenue,
            expenses: expenses,
            popularCourses,
            branchCount,
            categoryCount,
            courseCount,
            noteCount,
            studentCount,
            totalPaidAmount,
            totalBalance,
            TeachingstaffCount,
            nonTeachingstaffCount,
            totalSalaryAmount,
            totalSalaryBalance,
            message: 'Counts retrieved successfully',
        });
        
    } catch (error) {
        console.log(error,"error")
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getplatformreports = async (req, res) => {
    try {
        const { year, month } = req.params;

        const currentYear = year || new Date().getFullYear();
        const currentMonth = month || new Date().getMonth() + 1; // Default to current month if not provided

        // Total Institute Count
        const totalInstituteCount = await Institute.countDocuments({ is_deleted: false });

        // Institute Subscription Details
        const instituteSubscriptions = await InstituteSubscription.find({}).populate('instituteId subscriptionId');

        // Monthly Revenue

        
        const revenue = await getMonthlyRevenue(currentYear, currentMonth);

        // Monthly Expenses
        const expenses = await getMonthlyExpenses(currentYear, currentMonth);

        // Support Tickets
        const studentTickets = await StudentTicket.countDocuments({ is_deleted: false });
        const teachingTickets = await TeachingTicket.countDocuments({ is_deleted: false });
        const staffTickets = await StaffTicket.countDocuments({ is_deleted: false });
        const adminTickets = await InstituteAdminTicket.countDocuments({ is_deleted: false });

        const activeSubscriptions = await SubscriptionFeatures.countDocuments({ is_active: true });
        const inactiveSubscriptions = await SubscriptionFeatures.countDocuments({ is_active: false });

        res.status(200).json({
            success: true,
            totalInstituteCount,
            instituteSubscriptions,
            revenue,
            expenses,
            activeSubscriptions,
            inactiveSubscriptions,
            supportTickets: {
                studentTickets,
                teachingTickets,
                staffTickets,
                adminTickets
            },
            message: 'Platform reports retrieved successfully',
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};
