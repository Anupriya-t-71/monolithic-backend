import * as SubscriptionModels from "../../../models/Administration/Subscription/index.js"
import SubscriptionUpdateRequestModle from "../../../models/Automation/Subscription/index.js";
import { Sequence } from "../../../models/common/common.js"
import * as Helpers from "../../../utils/helpers.js"
import { getInstituteDetailswithUUID } from "../../Institutes/common/index.js";
import { insertAndScheduleJobs } from "../../../Notification/Subscription_Schedule.js"

import { updatepaymentController } from '../../../controllers/Platform/Payments/index.js'
import { SubscriptionCancelEmail, SubscriptionRejectionEmail } from '../../../utils/helpers.js'

import { InstitutesRoles } from "../../../models/Administration/Roles_And_Permissions/index.js";
import { InstituteAdmin } from "../../../models/Administration/Authorization/index.js";
export const createSubscriptionFeatureController = async (req, res) => {
  const data = req.body;
  let FeatureSequenceId = await Sequence.findOne({ _id: "SubscriptionsFeatureId" })
  const isArray = Array.isArray(data)
  try {
    if (isArray) {
      const addIdAndUUIDs = await Promise.all(data.map(async (feature) => {
        if (!feature.id) {
          const uuid = await Helpers.generateUUID();
          const seq = await Sequence.findOneAndUpdate({ _id: "SubscriptionsFeatureId" }, { $inc: { seq: 1 } }, { new: true, upsert: true });
          feature.id = seq.seq;
          feature.uuid = uuid;
        }
        return feature;
      }));
      const subscritpionFeatures = await SubscriptionModels.SubscriptionFeatures.insertMany(addIdAndUUIDs);

      return res.status(200).json({ status: "success", message: "subscription feature created successfully", data: subscritpionFeatures });
    } else {
      const subscriptionFeature = await SubscriptionModels.SubscriptionFeatures.create(data);
      return res.status(200).json({ status: "success", message: "subscritpion feature created successfully", data: subscriptionFeature });
    }
  } catch (error) {
    if (isArray) {
      const sequence = await Sequence.findOneAndUpdate({ _id: "SubscriptionsFeatureId" }, { seq: FeatureSequenceId.seq })
    }
    return res.status(500).json({ status: "failed", message: error?.message, data: null });
  }
};

export const getSubscriptionFeatures = async (req, res) => {
  try {
    const subscription_features = await SubscriptionModels.SubscriptionFeatures.find()
    res.status(200).json({ status: "success", message: "subscription features retrieved successfully", data: subscription_features })
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message, data: null })
  }
}


export const createSubscriptionPlan = async (req, res) => {
  const data = req.body;
  let PlanId = await Sequence.findOne({ _id: "SubscriptionsPlanId" })
  const isArray = Array.isArray(data)
  try {
    if (isArray) {
      const addIdAndUUIDs = await Promise.all(data.map(async (feature) => {
        if (!feature.id) {
          const uuid = await Helpers.generateUUID();
          const seq = await Sequence.findOneAndUpdate({ _id: "SubscriptionsPlanId" }, { $inc: { seq: 1 } }, { new: true, upsert: true });
          feature.id = seq.seq;
          feature.uuid = uuid;
        }
        return feature;
      }));
      const subscritpionFeatures = await SubscriptionModels.SubscriptionPlans.insertMany(addIdAndUUIDs);

      return res.status(200).json({ status: "success", message: "subscription plans created successfully", data: subscritpionFeatures });
    } else {
      const updateIds = await Promise.all(data.features?.map(async (feature) => {
        if (feature.feature) {
          console.log(feature.feature)
          const features = await SubscriptionModels.SubscriptionFeatures.findOne({ identity: feature.feature })
          console.log(features, "feature")
          feature.feature = features._id
        }
        return feature
      }))

      const subscriptionFeature = await SubscriptionModels.SubscriptionPlans.create({ ...data, features: updateIds });
      return res.status(200).json({ status: "success", message: "subscritpion plan created successfully", data: subscriptionFeature });
    }
  } catch (error) {

    if (isArray) {
      const sequence = await Sequence.findOneAndUpdate({ _id: "SubscriptionsPlanId" }, { seq: PlanId.seq })
    }
    console.log(error, "error")
    return res.status(500).json({ status: "failed", message: error?.message, data: null });
  }
}

export const updateSubscriptionPlanByUUID = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  console.log("Data", data)
  try {
    if (!id) {
      throw new Error("Subscription Plan ID is required for update.");
    }

    const updatedFeatures = await Promise.all(
      (data.features ?? []).map(async (feature) => {
        if (feature.feature) {
          const featureData = await SubscriptionModels.SubscriptionFeatures.findOne({
            identity: feature.feature,
          });
          console.log("Feature Data", featureData)
          feature.feature = featureData?._id || feature.feature;
        }
        return feature;
      })
    );

    const updatedPlan = await SubscriptionModels.SubscriptionPlans.findOneAndUpdate(
      { _id: id },
      { $set: { ...data, features: updatedFeatures } },
      { new: true }
    );

    if (!updatedPlan) {
      return res.status(404).json({
        status: "failed",
        message: "Subscription plan not found.",
        data: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Subscription plan updated successfully.",
      data: updatedPlan,
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: error?.message,
      data: null,
    });
  }
};




export const getSubscriptionPlans = async (req, res) => {
  try {
    let { page = 1, perPage = 10 } = req.query

    const totalSusbcriptions = await SubscriptionModels.SubscriptionPlans.countDocuments({})
    const subscriptionPlans = await SubscriptionModels.SubscriptionPlans.find({})
      .populate({
        path: 'features.feature',
        model: 'SubscriptionsFeatures'
      }).skip((page - 1) * perPage)
      .limit(perPage)

    const total_pages = Math.ceil(totalSusbcriptions / perPage)
    res.status(200).json({
      status: 'success',
      message: 'Subscription plans retrieved successfully',
      data: { data: subscriptionPlans, last_page: total_pages }
    });
  } catch (error) {
    res.status(500).json({
      status: 'failed',
      message: error.message,
      data: null
    });
  }
};

export const getAllSubscriptionPlans = async (req, res) => {
  try {
    const subscriptionPlans = await SubscriptionModels.SubscriptionPlans.find({}).populate({
      path: 'features.feature',
      model: 'SubscriptionsFeatures'
    })
    res.status(200).json({ status: "success", message: "All subscriptions retrived successfully", data: subscriptionPlans })
  } catch (error) {
    res.status(500).json({ status: "failed", message: error?.message })
  }
}


export const getSubscriptionDetailsWithInstituteIds = async (req, res) => {
  try {
    const populatedInstituteSubscriptions = await SubscriptionModels.InstituteSubscription.find({})
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
      })
    res.status(200).json({ status: "success", message: "subscription retrieved successfully", data: populatedInstituteSubscriptions })
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message })
  }
}

const checkMatchDate = (expiredDate, price) => {
  try {
    const now = new Date();
    const expired = new Date(expiredDate);

    // Extracting year, month, and date
    const currentYear = now.getFullYear();
    const expiredYear = expired.getFullYear();

    const currentMonth = now.getMonth(); // 0-11 (Jan = 0, Dec = 11)
    const expiredMonth = expired.getMonth();

    const currentDate = now.getDate();
    const expiredDay = expired.getDate();

    // Check if the date is in the same year
    const isSameYear = expiredYear === currentYear;
    const isPastYear = expiredYear < currentYear;
    const isFutureYear = expiredYear > currentYear;

    // Check if the month is the same, previous, or future
    const isSameMonth = isSameYear && expiredMonth === currentMonth;
    const isPastMonth = isSameYear && expiredMonth < currentMonth;
    const isFutureMonth = isSameYear && expiredMonth > currentMonth;

    // Determine if the plan is expired
    let isExpired = false;
    let withinDays = 0;

    if (isPastYear || (isPastMonth && !isFutureYear)) {
      isExpired = true;
    } else if (isFutureYear || isFutureMonth) {
      isExpired = false;
    } else if (isSameMonth) {
      // Check if the date has passed in the current month
      isExpired = currentDate > expiredDay;
      if (!isExpired) {
        withinDays = `${expiredDay - currentDate} days remaining`;
      }
    }

    console.log({
      isExpired,
      withinDays,
      currentYear,
      expiredYear,
      currentMonth,
      expiredMonth,
      currentDate,
      expiredDay,
      isSameYear,
      isSameMonth,
      isPastMonth,
      isFutureMonth,
    });

    return { isExpired, withinDays };
  } catch (error) {
    console.error("Error in checkMatchDate:", error);
    return { isExpired: false, withinDays: "Error" };
  }
};

const calculateFeatureUsage = (featureLimits, featureUsage) => {
  const result = [];
  let allFeaturesUsed = true;

  featureLimits.forEach((limit) => {
    const usage = featureUsage.find((u) => u.feature.toString() === limit.feature.toString());

    const usedCount = usage ? usage.count : 0;
    const limitCount = limit.count;
    const remainingCount = limitCount - usedCount;
    console.log(remainingCount, usedCount, limitCount, usedCount)
    if (remainingCount > 0) {
      allFeaturesUsed = false;
    }

    result.push({
      feature: limit.feature,
      limitCount,
      usedCount,
      remainingCount: remainingCount > 0 ? remainingCount : 0,
    });
  });


  return { result, planStatus: allFeaturesUsed }
};


export const getInstituteCurrentSubscriptionStatus = async (req, res) => {
  try {

    const { instituteId } = req.params
    const institute_details = await getInstituteDetailswithUUID(instituteId)
    const subscription_details = await SubscriptionModels.InstituteSubscription.findOne({ instituteId: institute_details?._id }).populate("subscriptionId")
    const end_date = new Date(subscription_details?.endDate)
    const isMatch = checkMatchDate(end_date, subscription_details.subscriptionId.price)
    const futureDays = calculateFeatureUsage(subscription_details.subscriptionId.features, subscription_details.features)
    const expiredDetails = { end_date, ...isMatch }
    console.log(end_date.getDate(), end_date.getMonth())
    res.status(200).json({ status: "success", message: "subscription details retrived successfully", data: { ...expiredDetails, ...futureDays } })
  } catch (error) {
    res.status(500).json({ status: "failed", message: error?.message })
  }
}

export const UpdateSubscriptionRequestController = async (req, res) => {
  try {
    const { instituteId } = req.params;
    const { id } = req.body;
    const institutesubscription = await SubscriptionModels.InstituteSubscription.find(
      { instituteId: instituteId },
    );

    const cancelled_status = institutesubscription[0].is_cancelled;

    if (!cancelled_status) {
      return res.status(400).json({
        status: 'failed',
        message: 'Upgrade is not allowed  please cancel the existing susbcription',
      });
    }

    const cancelledsubscriptionreq = await SubscriptionUpdateRequestModle.findOne({ institute: instituteId },);
    const oldsubscriptionid = institutesubscription[0].subscriptionId;
    console.log("the canceleed subs id is +" + oldsubscriptionid);

    const identity = await SubscriptionModels.SubscriptionPlans.find({ _id: institutesubscription[0].subscriptionId });
    const oldidentity = identity[0].identity;
    console.log("the canceleed subs id is +" + oldsubscriptionid);

    const oldsubscriptionEntry = {
      _id: oldsubscriptionid,
      identity: oldidentity,
      subscription_status: "Cancelled"
    };

    const upgradesubscriptiondetails = await SubscriptionModels.SubscriptionPlans.findOne({ _id: id });
    const upgradeid = upgradesubscriptiondetails._id;

    const subscription_id = upgradesubscriptiondetails.id;
    console.log(oldsubscriptionEntry);
    console.log(upgradeid);
    if (!upgradesubscriptiondetails || upgradesubscriptiondetails.length === 0) {
      return res.status(404).json({
        status: 'failed',
        message: 'Upgrade subscription plan not found',
      });
    }

    const existingupgrade = await SubscriptionUpdateRequestModle.findOne({ institute: instituteId });

    console.log(upgradeid);

    if (existingupgrade) {
      const approvedstatus = existingupgrade.is_approved
      if (!Array.isArray(existingupgrade.oldsubscriptions)) {
        existingupgrade.oldsubscriptions = [];
      }
      console.log(upgradeid);

      existingupgrade.newsubscription = upgradeid
      if (!existingupgrade.is_readed) {

        return res.status(400).json({
          status: 'failed',
          message: 'Upgrade subscription plan is still in progress found please approve the old one ',
        });

      }
      console.log(upgradeid);
      existingupgrade.is_readed = false

      if (approvedstatus) {
        existingupgrade.oldsubscriptions.push(oldsubscriptionEntry);
        existingupgrade.is_readed = false,
          existingupgrade.is_approved
        existingupgrade.is_triggered = true
        await existingupgrade.save();
      }

      return res.status(201).json({
        status: 'success',
        message: 'new upgrade subscription request has been sent ',
        data: { existingupgrade, subscription_id }
      });
    } else {
      console.log("came into else block");

      const new_request = new SubscriptionUpdateRequestModle({
        institute: instituteId,
        newsubscription: upgradeid,
        oldsubscriptions: [oldsubscriptionEntry],

        is_triggered: true
      });
      await new_request.save();
      return res.status(200).json({
        status: 'success',
        message: 'Subscription Plan  request registered successfully',
        data: { upgradeid },
      });
    }
  } catch (error) {
    console.error('Error in subscription upgrade request:', error);
    res.status(500).json({ status: 'failed', message: error.message });
  }
};


export const getAllSubscriptionUpdateRequest = async (req, res) => {
  try {
    console.log("came into the req for subscription upgrade");

    const { institute_id } = req.params;
    console.log(institute_id + "came into the req for subscription upgrade");

    const institute_details = await getInstituteDetailswithUUID(institute_id)
    console.log(institute_details + "the ");

    const upgradesubscription = await SubscriptionUpdateRequestModle.find({ institute: institute_details?._id })
    res.status(200).json({ status: "success", message: "subscription details retrived successfully", data: upgradesubscription })

  } catch (error) {
    res.status(500).json({ status: "failed", message: error?.message })
  }
}


export const AppproveSubscriptionRequest = async (req, res) => {
  try {

    // const { instituteId } = req.params;
    const { isapproved, reason, institute_Id } = req.body;
    console.log("came into theapoprocva" + institute_Id + isapproved + reason);




    const institute_details = await getInstituteDetailswithUUID(institute_Id)
    console.log(institute_details + "the ");
    institute_details?._id

    const instituteId = institute_details?._id

    const institutesubscriptionreq = await SubscriptionUpdateRequestModle.findOne({ institute: instituteId },);
    const institutesubscription = await SubscriptionModels.InstituteSubscription.findOne(
      { instituteId: instituteId },
    );
    console.log("came into approval");
    institutesubscription.is_cancelled = false;
    await institutesubscription.save()

    if (isapproved) {

      //send approval  email

      const subscriptionid = institutesubscriptionreq.newsubscription
      institutesubscriptionreq.is_approved = true
      institutesubscriptionreq.is_readed = true
      // institutesubscriptionreq.oldsubscriptions.status = "Approved"
      institutesubscriptionreq.reason_for_rejection = reason
      const subscriptionplans = await SubscriptionModels.SubscriptionPlans.findOne({ _id: subscriptionid })
      console.log("came into approval for true");

      let features = []
      subscriptionplans.features.map(item => {
        const obj = {
          feature: item.feature,
          count: typeof (item.count) === 'string' || typeof (features.count) === 'boolean' ? '0' : 0,
          _id: item._id
        }
        features.push(obj)
      })

      const id = subscriptionplans._id
      const subscription_uuid = subscriptionplans.uuid

      //for dummmy payment record creation
      updatepaymentController(instituteId, subscription_uuid)

      await insertAndScheduleJobs(instituteId, id);
      await institutesubscriptionreq.save()
      await SubscriptionModels.InstituteSubscription.updateOne({ instituteId: institute_details._id }, { subscriptionId: subscriptionid, features })

      return res.status(200).json({ status: "success", message: "subscription details retrived successfully", data: { features, id } })
    }
    else {
      //send rejection email
      const identity = await SubscriptionModels.SubscriptionPlans.find({
        _id: institutesubscriptionreq.newsubscription
      });
      const oldidentity = identity[0].identity;
      const admin_role = await InstitutesRoles.findOne({ identity: "Institute Admin" })
      const adminId = admin_role._id;
      const institute_admin = await InstituteAdmin.findOne({ role: admin_role._id })
      const institute_adminfinder = await InstituteAdmin.find({
        institute_id: instituteId,
        role: admin_role._id
      });
      const recipientEmail = institute_adminfinder[0].email
      console.log(recipientEmail + "the recepient email is " + oldidentity + reason);
      await SubscriptionRejectionEmail(recipientEmail, oldidentity, reason)
      institutesubscriptionreq.is_approved = false
      institutesubscriptionreq.is_readed = true
      institutesubscriptionreq.reason_for_rejection = reason

      await institutesubscriptionreq.save()
      return res.status(200).json({ status: "success", message: "Rejected Subscription" })
    }

  } catch (error) {
    res.status(500).json({ status: "failed", message: error?.message })
  }
}



export const CancelSubscriptionRequest = async (req, res) => {
  try {
    const { instituteId } = req.params; // No need for slicing
    console.log("Received request to cancel subscription for:", instituteId);

    const institutesubscription = await SubscriptionModels.InstituteSubscription.findOne({ instituteId });

    // const cancelledsubscriptionreq = await SubscriptionUpdateRequestModle.findOne( { institute: instituteId }, );

    if (!institutesubscription) {
      return res.status(404).json({ status: "failed", message: "Subscription not found" });
    }
    if (institutesubscription.subscriptionId === null) {
      return res.status(409).json({ status: "failed", message: "already the subscription is cancelled " });
    }

    const identity = await SubscriptionModels.SubscriptionPlans.find({ _id: institutesubscription.subscriptionId });
    const oldidentity = identity[0].identity;

    const admin_role = await InstitutesRoles.findOne({ identity: "Institute Admin" })
    const adminId = admin_role._id;

    const institute_admin = await InstituteAdmin.findOne({ role: admin_role._id })

    const institute_adminfinder = await InstituteAdmin.find({
      institute_id: instituteId,
      role: admin_role._id
    });

    const recipientEmail = institute_adminfinder[0].email
    console.log(recipientEmail + "the recepient email is ");
    cancelledsubscriptionreq.Cancelled_subscriptionId = institutesubscription.subscriptionId;
    institutesubscription.Cancelled_subscriptionId = institutesubscription.subscriptionId;


    await SubscriptionCancelEmail(recipientEmail, oldidentity)

    institutesubscription.is_cancelled = true;
    institutesubscription.subscriptionId = null;
    institutesubscription.features = null;

    await cancelledsubscriptionreq.save();
    await institutesubscription.save();

    return res.status(200).json({ status: "success", message: "Subscription cancelled successfully" });

  } catch (error) {
    console.error("Error in canceling subscription:", error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};
