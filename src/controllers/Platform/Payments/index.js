import { Sequence } from "../../../models/common/common.js";
import Payment from "../../../models/Platform/Payments/index.js";
import { getInstituteDetailswithUUID, getSubscriptionDateDetails, getSubscriptionPlanDetailsWithUUID } from "../../Institutes/common/index.js";
import Institute from "../../../models/Institutes/Institute/index.js";
import { id } from "date-fns/locale";
import SubscriptionUpdateRequestModle from "../../../models/Automation/Subscription/index.js";
import { SubscriptionActivationEmail } from '../../../utils/helpers.js'
import * as SubscriptionModels from "../../../models/Administration/Subscription/index.js"
import { InstitutesRoles } from "../../../models/Administration/Roles_And_Permissions/index.js";
import { InstituteAdmin } from "../../../models/Administration/Authorization/index.js";

export const CreateSubscriptionPaymentController = async (institute_uuid, institute_name, subscription_uuid, session) => {
  try {

      const existingPayment = await Payment.findOne({ institute: institute_uuid }).session(session);
      if (existingPayment) {
          throw new Error("Institute Payment Already Exists");
      }

      const subscription_details = await getSubscriptionPlanDetailsWithUUID(subscription_uuid);
      if (!subscription_details) throw new Error("Subscription not found");

      const { start_date, end_date } = await getSubscriptionDateDetails(subscription_details.duration);
      const pay_historyId = `${institute_name.slice(0, 4).toUpperCase()}001`;

      const newPayment = new Payment({
          institute: institute_uuid,
          paymentMethod: "cash",
          currentSubscriptionPlan: {
              startDate: start_date,
              endDate: end_date,
              planId: subscription_details._id,
          },
          subscriptionHistory: [{
              startDate: start_date,
              endDate: end_date,
              planId: subscription_details._id,
              isActive: true,
              isExpired: false
          }],
          paymentHistory: [{
              paymentId: pay_historyId,
              paymentMethod: "cash",
              amount: subscription_details.price,
              status: "Completed"
          }]
      });

      await newPayment.save({ session });
      return newPayment;
  } catch (error) {
      throw new Error(error.message);
  }
};


export const CreateInstitutePaymentController = async (req, res) => {
  try {
    const { institute_id, subscription_uuid, } = req.body
    const institute_details = await getInstituteDetailswithUUID(institute_id)
    console.log(institute_details, "institute_details")

    const institute_subscription_payment = await Payment.findOne({ institute: institute_details?._id })
    if (institute_subscription_payment) {
      console.log(institute_subscription_payment, "sub")
      throw new Error("Institute Payment Alreday Exists")
    }

    const subscription_details = await getSubscriptionPlanDetailsWithUUID(subscription_uuid)
    const { start_date, end_date } = await getSubscriptionDateDetails(subscription_details?.duration)

    const pay_historyId = `${institute_details?.institute_name.slice(0, 4).toUpperCase()}001`
    const new_institute_payments = new Payment({
      institute: institute_details?._id,
      paymentMethod: "cash",
      currentSubscriptionPlan: { startDate: start_date, endDate: end_date, planId: subscription_details?._id, },
      subscriptionHistory: [{ startDate: start_date, endDate: end_date, planId: subscription_details?._id, isActive: true, isExpired: false }],
      paymentHistory: [{ paymentId: pay_historyId, paymentMethod: "cash", amount: subscription_details?.price, status: "Completed" }]
    })
    await new_institute_payments.save()
    res.status(200).json({ status: "success", message: "Institute Payment Created Successfully", data: new_institute_payments })
  } catch (error) {
    res.status(500).json({ status: "failed", message: error?.message })
  }
}

export const getInstitutePaymentController = async (req, res) => {
  try {
    let { page = 1, perPage = 10 } = req.query

    const countPayments = await Payment.countDocuments({})
    const payment_list = await Payment.find({})
      .populate({ path: "institute", model: "institutes" }).populate({ path: "currentSubscriptionPlan", populate: { path: "planId", model: "subscriptionsPlans" } })
      .skip((page - 1) * perPage).limit(perPage)
    const list = payment_list.filter((item) => item.institute !== null)
    const last_page = Math.ceil(countPayments / perPage)
    res.status(200).json({ status: "success", message: "Institute Payments retrived successfully", data: { data: payment_list, last_page: last_page, page: page } })
  } catch (error) {
    res.status(500).json({ status: "failed", message: error?.message })
  }
}

export const getInstitutePaymentDetailsWithInstituteIdController = async (req, res) => {
  try {
    const { institute_id } = req.params
    console.log(institute_id,"institute_id")
    const institute_details = await getInstituteDetailswithUUID(institute_id)
    const payment_details = await Payment.findOne({ institute: institute_details?._id })
      .populate({ path: "institute", model: "institutes" }).populate({ path: "currentSubscriptionPlan", populate: { path: "planId", model: "subscriptionsPlans" } })
      console.log(payment_details+"The payment details is not null ");

      res.status(200).json({ status: 'success', message: "subscription payment retrived successfully", data: payment_details })
  } catch (error) {
    res.status(500).json({ status: 'failed', message: error?.message })
  }
}


//used to make a dummy  payment for the subscription that has a upgrade req by passing institte id and subscription uuid
export const updatepaymentController = async (institute_id, subscription_uuid) => {
  try {
    console.log("came into payment schedular");
    
    const institute_details = await Institute.findOne({ _id: institute_id })
    const existing_payment = await Payment.findOne({ institute: institute_id })
    const paymenthistory = existing_payment.paymentHistory.length
    const subscription_details = await getSubscriptionPlanDetailsWithUUID(subscription_uuid)
    const pay_historyId = `${institute_details?.institute_name.slice(0, 4).toUpperCase()}${paymenthistory + 1}`
    const defaultPayment = { paymentId: pay_historyId, paymentMethod: "cash", amount: subscription_details?.price, status: "Pending" }
    existing_payment.paymentHistory.push(defaultPayment)

    await existing_payment.save()
    // return true
  } catch (error) {
    return error?.message
  }
}


//if a payment is completed then changes shopuld happen in original subs and 
export const UpdatepaymentSubscription = async (req, res) => {
  try {

    console.log("came into the upgrade for the asiohfasblfhasfha");

    const { paymentstatus, payment_id,instituteId } = req.body
    console.log("came "+paymentstatus ,payment_id,instituteId);

    // const sanitizedInstituteId = institute_id.slice(1);
    const institute_detailsId = await getInstituteDetailswithUUID(instituteId)
    
    console.log(institute_detailsId);
    
    const institute_id = institute_detailsId?._id
    // const institute_detailsId = await getInstituteDetailswithUUID(institute_id)

    const institute_details = await Institute.findOne({ _id: institute_id })
    const institute_subscription_payment = await Payment.findOne({ institute: institute_details?._id })
    console.log(institute_subscription_payment);

    if (institute_subscription_payment) {
      const payment = institute_subscription_payment.paymentHistory.find(payment => payment._id.toString() === payment_id);
      // console.log("Found payment:", payment);
      // console.log("Found payment:stauts", payment.status);
      payment.status = paymentstatus
      await institute_subscription_payment.save();

      if (paymentstatus === "Completed") {

        const upgradesubscriptiondetails = await SubscriptionUpdateRequestModle.findOne({ institute: institute_id });
        const subscription_id = upgradesubscriptiondetails.newsubscription
        console.log(upgradesubscriptiondetails.newsubscription+"waht id ");
        const subscription_details = await SubscriptionModels.SubscriptionPlans.findOne({ _id: subscription_id })

        const { start_date, end_date } = await getSubscriptionDateDetails(subscription_details?.duration)
        // console.log(subscription_details + "t he subs detailes and features");
         console.log( "test1");

        //used to upgrade the payments 
        const currentSubscriptionPlan = { startDate: start_date, endDate: end_date, planId: subscription_details?._id, }
        const subscriptionHistory = { startDate: start_date, endDate: end_date, planId: subscription_details?._id, isActive: true, isExpired: false }
        institute_subscription_payment.currentSubscriptionPlan = currentSubscriptionPlan
        institute_subscription_payment.subscriptionHistory.push(subscriptionHistory)
        institute_subscription_payment.save();
        console.log( "test2");

        //used to upgrade the insittiute subscriptions
        const features = subscription_details.features
        const id = subscription_details._id
        const subscription_uuid = subscription_details.uuid
        const subscription_name = subscription_details.identity
        console.log("the unit is"+subscription_details.duration.unit+subscription_details.duration.value);
        
        const getSubscriptionExpireDate = (value, unit) => {
          const expirationDate = new Date()
          if (unit === 'monthly') {
            expirationDate.setMonth(expirationDate.getMonth() + value)
            expirationDate.setHours(0, 0, 0, 0)
          } else if (unit === 'yearly') {
            const currentMonth = expirationDate.getMonth();
            expirationDate.setFullYear(expirationDate.getFullYear() + value);
            expirationDate.setMonth(currentMonth);
            expirationDate.setHours(0, 0, 0, 0);
          } 
          else if (unit === 'day') {
            expirationDate.setDate(expirationDate.getDate() + value); // Corrected to add days
            expirationDate.setHours(0, 0, 0, 0);
        
          } 
          else {
            throw new Error('Invalid duration unit');
          }
          return expirationDate
        }
        const expireDate = getSubscriptionExpireDate(subscription_details.duration.value, subscription_details.duration.unit)
        const institutesubscription = await SubscriptionModels.InstituteSubscription.findOne({ instituteId: institute_id },);
        console.log( "test2");

        institutesubscription.subscriptionId = id
        institutesubscription.features = features
        institutesubscription.expirationDate = expireDate
        institutesubscription.is_cancelled = false
        const admin_role = await InstitutesRoles.findOne({ identity: "Institute Admin" })
        const adminId = admin_role._id;
        const institute_admin = await InstituteAdmin.findOne({ role: admin_role._id })

        const institute_adminfinder = await InstituteAdmin.find({
          institute_id: institute_id,
          role: admin_role._id
        });
        console.log( "test3");





        await institutesubscription.save()
        console.log("activation email sent");
        // await SubscriptionActivationEmail(recipientEmail, subscription_name, expireDate, start_date, payment_id)
        console.log("activation email sent");

        res.status(200).json({ status: 'success', message: "subscription payment Completed successfully", })

      }
      //if payment is completed comes to an end
      else {
        console.log("Do nothing");

      }

    }

  } catch (error) {
    res.status(500).json({ status: "failed", message: error?.message })
  }
}