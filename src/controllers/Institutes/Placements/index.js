import Batch from "../../../models/Institutes/Batch/index.js"
import { PlacementModel } from "../../../models/Institutes/Placements/index.js"
import Validations from "../../../validations/index.js"
import { getInstituteDetailswithUUID } from "../common/index.js"

export const createPlacemetControl = async (req, res) => {
  try {
    const value = Validations.createPlacement(req.body)

    const uuid = await getInstituteDetailswithUUID(value.institute)

    value.institute = uuid._id

    const data = await PlacementModel.create({ ...value })

    if (!data) {
      return res.status(500).json({ status: false, data, message: "created failed" })
    }
    res.status(200).json({ status: true, message: "placement created" })
  } catch (error) {
    console.log("Placement", error)
    res.status(500).json({ status: true, message: "internal server error" })
  }
}

export const updatePlacementControl = async (req, res) => {
  try {
    const { uuid } = req.body
    const { student } = req.body

    const data = await PlacementModel.findOneAndUpdate({ uuid }, { student }, { new: true })

    if (!data) {
      return res.status(500).json({ status: false, message: "update failed" })
    }
    res.status(200).json({ status: true, data, message: "placement updated" })

  } catch (error) {
    console.log("Placement", error)
    res.status(500).json({ status: false, message: "internal server error" })
  }
}

export const fetchPlacementControl = async (req, res) => {
  try {
    const {studentId} = req.params;

    const data = await PlacementModel.find({ student: studentId, is_delete: false }).populate({ path: 'student', select: "-password -contact_info" }).populate('institute')

    res.status(200).json({ status: true, data: data, message: "fetched" })
  } catch (error) {
    console.log("Placement", error)
    res.status(500).json({ status: false, message: "internal server error" })
  }
}

export const fetchAllPlacementsControl = async (req, res) => {
  try {
    const { page = 1, limit = 10, institute_id } = req.query;

    const uuid = await getInstituteDetailswithUUID(institute_id)

    const data = await PlacementModel.find({ institute: uuid._id, is_delete: false, is_active: true })
      .populate({
        path: "student",
        select: "full_name gender image email"
      });

    res.status(200).json({ status: true, data, message: "fetched all data" });
  } catch (error) {
    console.error("Error in fetchAllPlacementsControl:", error);
    res.status(500).json({ status: false, message: "internal server error" });
  }
};

export const deletePlacementControl = async (req, res) => {
  try {
    const { id } = req.params

    await PlacementModel.findOneAndUpdate({ uuid: id }, { is_delete: true })

    res.status(200).json({ status: true, message: "deleted" })
  } catch (error) {
    console.log("Placement", error)
    res.status(500).json({ status: false, message: "internal server error" })
  }
}