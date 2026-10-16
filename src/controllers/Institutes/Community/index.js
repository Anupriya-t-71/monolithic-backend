import mongoose from "mongoose";
import chatModel from "../../../models/Institutes/Community/Chat_Model.js";
import { Student, Teaching_Staff, Non_TeachingStaff } from "../../../models/Administration/Authorization/index.js";
import { getBranchDetailsWithUUID, getFullUserDetailsWithPopulate, getInstituteDetailswithUUID, getRoleDetailsWithName, getRoleDetailsWithObjectId } from "../common/index.js";
import { InstituteUser } from "../../../models/Institutes/Administration/Authorization/index.js";
import Batch from "../../../models/Institutes/Batch/index.js";
import { InstituteRoleToMainModel } from "../../../utils/helpers.js";
import Message_Model from "../../../models/Institutes/Community/Message_Model.js";

export const createCommunity = async (req, res) => {
    try {
        const { instituteId, branchId, batchId } = req.params;
        const { group, users, instructors } = req.body;

        const institute = await getInstituteDetailswithUUID(instituteId);
        const branch = await getBranchDetailsWithUUID(branchId);
        const batch = await Batch.findById(batchId);

        if (!batch) {
            return res.status(404).send({
                success: false,
                message: 'Batch not found',
            });
        }

        const groupChat = await chatModel.create({
            institute: institute._id,
            branch: branch._id,
            batch: batch._id,
            group: group,
            users: users,
            instructors: instructors,
            admin: req.user._id
        });

        res.status(200).json({
            status: true,
            message: 'Community created successfully',
            data: groupChat
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message,
        });
    }
};