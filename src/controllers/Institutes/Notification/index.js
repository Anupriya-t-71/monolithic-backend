import { ExpirationStatus } from "@aws-sdk/client-s3";
import Notification from "../../../models/Institutes/Notification/index.js";
import notificationValidationSchema from "../../../validations/Institutes/Notification/index.js";
import { getBranchDetailsWithUUID, getInstituteDetailswithUUID } from "../common/index.js";
import NotificationModel from "../../../models/Institutes/Notification/notificationSubscription.js";
import InstituteNotificationSubscriptionModel from "../../../models/Institutes/Notification/instituteNotificationSubscription.js";
import Branch from "../../../models/Institutes/Branch/index.js";
import Institute from "../../../models/Institutes/Institute/index.js";


export const createInstituteSubscriptionController = async (req,res) => {
    try {
    // console.log(req.body)
    const { institute, user, role, subscription } = req.body 
    const branch_id = req.body.branch 
    const branch = await getBranchDetailsWithUUID(branch_id)

    const existingSubscription = await InstituteNotificationSubscriptionModel.findOne({ institute_id: institute, branch_id: branch?._id})
 
    if(existingSubscription){
       existingSubscription.keys = subscription.keys
       existingSubscription.endpoint = subscription.endpoint
       await existingSubscription.save()
    }else{
        const newSubscription = new InstituteNotificationSubscriptionModel({
            institute_id: institute,
            branch_id: branch?._id,
            keys: subscription.keys,
            endpoint : subscription.endpoint,
            expirationTime : subscription.expirationTime,
            user : user?._id
        })
        await newSubscription.save()
    }

    res.status(200).json({status:"success",message:"subscription created successfully"})
    } catch (error) {
      console.log(error,"error")
      res.status(500).json({ status: "failed", message: error?.message}) 
    }
}

export const createNotificationSubscription = async (req,res) => {
    try {
    const {user,role} = req.body
   
    const subscription = req.body.subscription
        
    let existingSubscription = await NotificationModel.findOne({role:role,user:user})
    if(existingSubscription){
        existingSubscription.keys=subscription.keys
        existingSubscription.endpoint = subscription.endpoint
        const data = await existingSubscription.save()
    }else{
        const newSubscription = new  NotificationModel({keys:subscription.keys,endpoint:subscription.endpoint,expirationTime:subscription.expirationTime,user:user,role:role})
        await newSubscription.save()
    }
     
    res.status(200).json({status:"success",message:"subscription created successfully"})
    } catch (error) {
      res.status(500).json({ status: 'failed', message : error?.message }) 
    }
}

export const createstudentNotificationController = async (req, res) => {
    try {
        const { error, value } = notificationValidationSchema.validate(req.body);

        if (error && error.details) {
            const { message } = error.details[0];
            return res.status(400).json({ status: "failed", message: message });
        }

        const branch_id = await Branch.findOne({ uuid: value.branch_id });
        const institute = await Institute.findOne({uuid:req.body.institute_id})
        if (!branch_id) {
            return res.status(404).json({ status: "failed", message: "Branch not found" });
        }

        const notificationData = {
            ...value,
            branch_id: branch_id._id,
            institute_id:institute._id,
            type: value.type || 'student'
        };

        const newNotification = new Notification(notificationData);

        await newNotification.save();
        res.status(200).send({
            success: true,
            message: 'Student Notification Created Successfully',
            newNotification
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};



export const createstaffNotificationController = async (req, res) => {
    try {
        const { error, value } = notificationValidationSchema.validate(req.body);
        if (error && error.details) {
            const { message } = error.details[0];
            return res.status(400).json({ status: "failed", message: message });
        }

        const notificationData = {
            ...value,
            type: value.type || 'staff'
        };

        const newNotification = new Notification(notificationData);
        await newNotification.save();
        res.status(200).send({
            success: true,
            message: 'Staff Notification Created Successfully',
            newNotification
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};




export const getAllNotificationsController = async (req, res) => {
    try {
        const { InstituteId, branchid } = req.params;
        const perPage = 8;
        const page = req.query.page ? req.query.page : 1;
        const { includeDeleted, id, keyword, is_active} = req.query;

        let filterArgs = {   is_deleted: false };

        if (id) {
            const id = await Notification.findOne({ uuid: id });
            if (!id) {
                return res.status(404).json({
                    success: false,
                    message: 'Notification id not found for the provided ID',
                });
            }
            return res.status(200).json({
                success: true,
                id,
            });
        }

        if (!InstituteId) {
            throw new Error('InstituteId is required');
        }
        
        if (!branchid) {
            throw new Error('branchid is required');
        }
        
        const institute = await getInstituteDetailswithUUID(InstituteId);
        if (!institute) {
            throw new Error('Institute not found');
        }
        filterArgs.institute_id = institute._id;
        
        const branch = await getBranchDetailsWithUUID(branchid);
        if (!branch) {
            throw new Error('Branch not found');
        }
        filterArgs.branch_id = branch._id;

        if (is_active) {
            filterArgs.is_active = is_active;
        }

        
        if (includeDeleted) filterArgs.is_deleted = includeDeleted;

        if (keyword) {
            filterArgs.$or = [
                { title: { $regex: keyword, $options: "i" } }
            ];
        }
        const Notifications = await Notification.find(filterArgs)
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 })
            .populate('student');

        const count = await Notification.countDocuments(filterArgs);

        res.status(200).json({
            status: true,
            count,
            data: Notifications,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving Notification.',
            error: error.message,
        });
    }
};


export const updateNotificationController = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedNotification = await Notification.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).send({
            success: true,
            message: 'Notification updated successfully',
            updatedNotification
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};


export const updateNotificationStatusController = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;

        const updatedNotificationStatus = await Notification.findByIdAndUpdate(id, { is_active }, { new: true });

        res.status(200).send({
            success: true,
            message: 'Notification status updated successfully',
            updatedNotificationStatus
        })
    
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};


export const deleteNotificationController = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.findByIdAndUpdate(id, { is_deleted: true });
        res.status(200).send({
            success: true,
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error: error.message
        });
    }
};

