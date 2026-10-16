import Teaching_Staff from "../../../../../models/Institutes/Attendance/Staff/Teaching_Staff.js";

export const markAttendance = async (req, res) => {
    const { id, date, status } = req.body;

    try {
        const staff = await Teaching_Staff.findOne(id);
        if (!staff) {
            return res.status(404).json({ message: "Teaching staff not found" });
        }

        staff.daily_attendance.push({ date, status });
        await staff.save();

        res.status(200).json({ message: "Attendance marked successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
