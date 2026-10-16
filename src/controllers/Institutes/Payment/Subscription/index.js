import Subscription from "../../../../models/Institutes/Payment/Subscription_Model.js";
import subscriptionValidationSchema from "../../../../validations/Institutes/Payment/Subscription/index.js";
import { getInstituteDetailswithUUID } from "../../common/index.js";
import { InstituteSubscription, SubscriptionPlans } from "../../../../models/Administration/Subscription/index.js";


export const getAllSubscriptions = async (req, res) => {
    try {
        const planList = await SubscriptionPlans.find().populate({path:"features",populate:{path:"feature"}})
        res.status(200).json({status:"success",message:"subscriptions retrived successfully",data:planList})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Create a New Subscription
export const createSubscription = async (req, res) => {
    const { instituteId, subscriptionId, features, expirationDate } = req.body;

    try {
        const newSubscription = new Subscription({
            instituteId,
            subscriptionId,
            features,
            expirationDate
        });

        await newSubscription.save();
        res.status(201).json(newSubscription);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a Subscription
export const deleteSubscription = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedSubscription = await Subscription.findByIdAndDelete(id);

        if (!deletedSubscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        res.status(200).json({ message: 'Subscription deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Subscription Status
export const getSubscriptionStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const subscription = await Subscription.findById(id).populate('instituteId subscriptionId features.feature');

        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        res.status(200).json(subscription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a Subscription
export const updateSubscription = async (req, res) => {
    const { id } = req.params;
    const { instituteId, subscriptionId, features, expirationDate } = req.body;

    try {
        const updatedSubscription = await Subscription.findByIdAndUpdate(
            id,
            {
                instituteId,
                subscriptionId,
                features,
                expirationDate,
                updatedAt: Date.now()
            },
            { new: true, runValidators: true }
        );

        if (!updatedSubscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        res.status(200).json(updatedSubscription);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update Subscription Status
export const updateSubscriptionStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const subscription = await Subscription.findById(id);

        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        subscription.status = status;
        subscription.updatedAt = Date.now();

        await subscription.save();
        res.status(200).json(subscription);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get Subscription by ID
export const getSubscriptionById = async (req, res) => {
    const { InstituteId } = req.params;

    try {
        const institute = await getInstituteDetailswithUUID(InstituteId)
        const subscription = await InstituteSubscription.find({instituteId:institute?._id}).populate({path:'instituteId subscriptionId',select:"-features"})
        .select("-features")
        res.status(200).json({status:"sucess",message:"subscriptions retrived successfully",data:subscription});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search Subscriptions
export const searchSubscription = async (req, res) => {
    try {
        const query = {};

        // Build query based on request parameters
        if (req.query.instituteId) {
            query.instituteId = req.query.instituteId;
        }
        if (req.query.subscriptionId) {
            query.subscriptionId = req.query.subscriptionId;
        }
        if (req.query.expirationDate) {
            query.expirationDate = { $gte: new Date(req.query.expirationDate) };
        }
        if (req.query.featureId) {
            query['features.feature'] = req.query.featureId;
        }
        if (req.query.status) {
            query.status = req.query.status;
        }

        const subscriptions = await Subscription.find(query)
            .populate('instituteId subscriptionId features.feature');

        res.status(200).json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};