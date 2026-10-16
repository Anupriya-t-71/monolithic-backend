import Non_Teaching_Staff from "../../../../../models/Institutes/Attendance/Staff/Non_Teaching_Staff.js";


export const CreateNonTeachingStaffAttendance = async (req, res) => {
    try {
        const nonstaffattendance = new Non_Teaching_Staff(req.body); 
        await nonstaffattendance.save();
        res.status(200).send({
            success: true,
            message: "Attendance created successfully",
            nonstaffattendance
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Something Error to Create Attendance",
            error
        });
    }
}


export const UpdateNonTeachingStaffAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedAttendance = await Non_Teaching_Staff.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).send({
            success: true,
            message: "Attendance updated successfully",
            updatedAttendance
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to update Attendance",
            error
        });
    }
}


export const DeleteNonTeachingStaffAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        await Non_Teaching_Staff.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: "Attendance deleted successfully"
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to delete Attendance",
            error
        });
    }
}

export const UpdateNonTeachingStaffStatusAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const {is_active} = req.body;

        const updatedAttendance = await Non_Teaching_Staff.findByIdAndUpdate(id, {is_active}, { new: true });
        res.status(200).send({
            success: true,
            message: "Teaching Staff Status Attendance Updated Successfully",
            updatedAttendance
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to Update Status Teaching Staff Attendance",
            error
        });
    }
}

export const GetNonTeachingStaffAttendance = async (req, res) => {
    try {
        const nonTeachingStaffAttendances = await Non_Teaching_Staff.find({});
        res.status(200).send({
            success: true,
            message: "Attendances retrieved successfully",
            nonTeachingStaffAttendances
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to retrieve Attendances",
            error
        });
    }
}


export const GetNonTeachingStaffAttendanceById = async (req, res) => {
    try {
        const { id } = req.params;
        const nonTeachingStaffAttendance = await Non_Teaching_Staff.findById(id);
        if (!nonTeachingStaffAttendance) {
            return res.status(404).send({
                success: false,
                message: "Attendance not found"
            });
        }
        res.status(200).send({
            success: true,
            message: "Attendance retrieved successfully",
            nonTeachingStaffAttendance
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to retrieve Attendance",
            error
        });
    }
}
