import { InstituteSubscription } from "../../models/Administration/Subscription/index.js";

export const getSubscriptionDetails = async (instituteId) => {
  return await InstituteSubscription.findOne({ instituteId })
    .populate({
      path: 'instituteId',
      model: 'institutes'
    })
    .populate({
      path: 'subscriptionId',
      model: 'subscriptionsPlans',
      populate: {
        path: 'features.feature',
        model: 'SubscriptionsFeatures'
      }
    })
    .populate({
      path: 'features',
      populate: {
        path: 'feature',
        model: 'SubscriptionsFeatures'
      }
    });
};

const findFeature = (features, resource) => {
  return features.find(feature => feature?.feature?.identity === resource);
};

export const checkSubscriptionController = async (resource, req, res, next) => {
  try {
    const instituteId = req.user?.institute_id;
    if (!instituteId) {
      return res.status(400).json({ status: "failed", message: "Institute ID is required" });
    }

    const subscriptionDetails = await getSubscriptionDetails(instituteId);
    if (!subscriptionDetails) {
      return res.status(404).json({ status: "failed", message: "Subscription not found" });
    }

    
    const instituteSubscriptionFeature = findFeature(subscriptionDetails.features, resource);

    const subscriptionFeature = findFeature(subscriptionDetails.subscriptionId.features, resource);

    const hasPermission = instituteSubscriptionFeature && subscriptionFeature && (parseInt(subscriptionFeature.count) > parseInt(instituteSubscriptionFeature.count)) ? true :  false 

    if (hasPermission || subscriptionFeature?.count === 'unlimited') {
      next();
    } else {
      res.status(403).json({ status: "failed", message: "Subscription limit reached. Update your subscription plan." });
    }
  } catch (error) {
    console.error("Error in checkSubscriptionController:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

export const updateSubscriptionController = async (resource,instituteId) => {
  try {
    if (!instituteId) {
      throw new Error("Institute ID is required")
    }

    const subscriptionDetails = await getSubscriptionDetails(instituteId);
    if (!subscriptionDetails) {
      throw new Error("Subscription not found")
    }
    
    const instituteSubscriptionFeature = findFeature(subscriptionDetails.features, resource);
    const subscriptionFeature = findFeature(subscriptionDetails.subscriptionId.features, resource);

    if (!instituteSubscriptionFeature || !subscriptionFeature) {
      throw new Error("Feature not found")
    }
    
    let count = parseInt(instituteSubscriptionFeature.count) + 1
    let strcount = count.toString();
    await InstituteSubscription.updateOne(
        {
           _id: subscriptionDetails._id,
          "features.feature": instituteSubscriptionFeature.feature
        },
        {
          $set:{
            "features.$.count" : strcount
          }
        }
      )
  } catch (error) {
    console.error("Error in updateSubscriptionController:", error);
    throw new Error(error)
  }
};

export const checkSubscription =(resource) => async(req,res,next)  => {
   try {
    await checkSubscriptionController(resource,req,res,next) 
   } catch (error) {
    res.status(500).json({status:"failed",message:error?.message})
   }
}

export const updateSubscription = async (resource,instituteId) => {
  try {
  await updateSubscriptionController(resource,instituteId)  
  } catch (error) {
    return error
  }
}