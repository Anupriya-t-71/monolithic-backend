
import HelpCenter from "../../../models/Institutes/Help_Center/index.js";
import helpCenterValidationSchema from "../../../validations/Institutes/Help Center/index.js";
import { getBranchDetailsWithUUID, getInstituteDetailswithUUID } from "../common/index.js";


export const createhelpcenterController = async (req, res) => {
    try {
        const { error, value } = helpCenterValidationSchema.validate(req.body);
        if (error && error.details) {
            const { message } = error.details[0]
            return res.status(400).json({ status: "failed", message: message })
        }

        const { institute_id, branch_id } = value;
        const branch = await getBranchDetailsWithUUID(branch_id);
        if (!branch) {
            return res.status(404).json({ success: false, message: "Branch not found" });
        }
        const newhelpcenter = new HelpCenter({ ...value, branch_id: branch._id });

        await newhelpcenter.save();

        res.status(200).send({
            success: true,
            message: 'New helpcenter Created Successfully',
            newhelpcenter
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'something went wrong',
            error: error.message
        })
    }

}

export const updateHelpCenterController = async (req, res) => {
    try {
        const { id } = req.params;

        const { question, answer, category, videolink } = req.body

        const updatedHelpCenter = await HelpCenter.findOneAndUpdate({ uuid: id }, { question: question, answer: answer, category: category, videolink: videolink }, { new: true });

        if (!updatedHelpCenter) {
            return res.status(404).send({
                success: false,
                message: 'Help Center not found'
            });
        }

        res.status(200).send({
            success: true,
            message: 'Help Center updated successfully',
            updatedHelpCenter
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};



export const updateHelpCenterStatusController = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;

        const updatedHelpCenterStatus = await HelpCenter.findByIdAndUpdate(id, { is_active }, { new: true });

        res.status(200).send({
            success: true,
            message: 'HelpCenter status updated successfully',
            updatedHelpCenterStatus
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};


export const deleteHelpCenterController = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await HelpCenter.findOneAndUpdate({ uuid: id }, { is_deleted: true }, { new: true });
        res.status(200).send({
            success: true,
            message: 'HelpCenter deleted successfully',
            data: response
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

const getAllHelpCentersController = async (req, res) => {
    try {

        const { page = 1, perPage = 10, id, instituteid, search } = req.query;


        const institute = await getInstituteDetailswithUUID(instituteid);



        const query = { is_deleted: false };
        if (id) query.id = id;
        if (instituteid) query.institute_id = institute._id;
        if (search) {

            query.category = { $regex: search, $options: 'i' };
        }

        const totalCount = await HelpCenter.countDocuments(query);
        const totalPages = Math.ceil(totalCount / perPage);

        const helpCenters = await HelpCenter.find(query).populate({ path: 'institute_id' }).skip((page - 1) * perPage)
            .limit(perPage);
        return res.status(200).json({
            success: true,
            data: helpCenters,
            totalPages: totalPages,
            currentPage: page,
            totalRecords: totalCount,
            message: 'Help Center Details retrived Sucessfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'An error occurred while fetching help centers',
            error: error.message
        });
    }
};

export default getAllHelpCentersController;
