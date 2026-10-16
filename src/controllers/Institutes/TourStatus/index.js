import { InstituteAdmin } from '../../../models/Administration/Authorization/index.js';
import { Student } from '../../../models/Administration/Authorization/index.js';
import { Teaching_Staff } from '../../../models/Administration/Authorization/index.js';

export const updateTourStatus = async (req, res) => {
    try {
        const { userId, userType, status } = req.body;

        if (!["completed", "pending", "skip"].includes(status)) {
            return res.status(400).json({ status: "failed", message: "Invalid status" });
        }

        let user;
        switch (userType) {
            case "admin":
                user = await InstituteAdmin.findById(userId);
                break;
            case "student":
                user = await Student.findById(userId);
                break;
            case "teacher":
                user = await Teaching_Staff.findById(userId);
                break;
            default:
                return res.status(400).json({ status: "failed", message: "Invalid user type" });
        }

        if (!user) {
            return res.status(404).json({ status: "failed", message: "User not found" });
        }

        user.tour_status = status;
        await user.save();

        return res.status(200).json({ status: "success", message: "Tour status updated successfully" });
    } catch (error) {
        console.error("Error in updateTourStatus:", error);
        return res.status(500).json({ status: "failed", message: "Internal server error" });
    }
};

export const getTourStatus = async (req, res) => {
    try {
        const { userId, userType } = req.params;

        let user;
        switch (userType) {
            case "admin":
                user = await InstituteAdmin.findById(userId);
                break;
            case "student":
                user = await Student.findById(userId);
                break;
            case "teacher":
                user = await Teaching_Staff.findById(userId);
                break;
            default:
                return res.status(400).json({ status: "failed", message: "Invalid user type" });
        }

        if (!user) {
            return res.status(404).json({ status: "failed", message: "User not found" });
        }

        return res.status(200).json({ status: "success", tour_status: user.tour_status });
    } catch (error) {
        console.error("Error in getTourStatus:", error);
        return res.status(500).json({ status: "failed", message: "Internal server error" });
    }
};