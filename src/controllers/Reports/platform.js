import Mail from "../../models/Notification/Mail.js";
import { getInstituteDetailswithUUID, getBranchDetailsWithUUID } from "../Institutes/common/index.js";

export const getPlatformMailReports = async (req, res) => {
    try {
        const { year, month } = req.params;
        const { instituteId, branchId } = req.query;

        const institute = await getInstituteDetailswithUUID(instituteId);
        const branch = await getBranchDetailsWithUUID(branchId);

        const dateFilter = {};
        if (year) {
            dateFilter.$gte = new Date(year, 0, 1);
            dateFilter.$lte = new Date(year, 11, 31);
        }
        if (month) {
            dateFilter.$gte = new Date(year, month - 1, 1);
            dateFilter.$lte = new Date(year, month, 0);
        }

        const mailReports = await Mail.find({
            institute_id: institute._id,
            branch_id: branch._id,
            date: dateFilter
        });

        res.status(200).json({
            success: true,
            mailReports,
            message: 'Platform mail reports retrieved successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};



