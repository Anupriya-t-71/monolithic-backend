import Joi from "joi";

const subscriptionValidationSchema = Joi.object({
    id: Joi.number(),
    uuid: Joi.string(),
    institute_id: Joi.string().required(),
    plan_name: Joi.string().required(),
    payment_date: Joi.string().required(),
    transaction_id: Joi.string().required(),
    subscription_amount: Joi.string().required(),
    balance: Joi.string().required(),
    subscription_history: Joi.array().items(Joi.object({
        plan_name: Joi.string().required(),
        updated_at: Joi.date().default(Date.now)
    })),
    is_active: Joi.boolean().default(true),
    is_deleted: Joi.boolean().default(false)
}).options({ abortEarly: false });

export default subscriptionValidationSchema;
