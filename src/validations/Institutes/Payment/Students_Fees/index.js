import Joi from 'joi';

// Define the Joi schema for payment history
const paymentHistorySchema = Joi.object({
    paid_amount: Joi.number().required(),
    balance: Joi.number().required(),
    payment_date: Joi.string().required(),
    transaction_id: Joi.number().required(),
    payment_method: Joi.string().valid('offline', 'online').default('offline'),
    duepaymentdate: Joi.string(),
});

// Define the Joi schema for student fees
const studentFeesSchema = Joi.object({
    id: Joi.number(),
    uuid: Joi.string(),
    institute_id: Joi.string().required(), 
    branch_id: Joi.string(),
    course_name: Joi.string(),
    batch_name: Joi.string(),
    student: Joi.string().required(),
    paid_amount: Joi.number().required(),
    balance: Joi.number().required(),
    payment_date: Joi.string().required(),
    transaction_id: Joi.number().required(),
    payment_method: Joi.string().valid('offline', 'online').default('offline'),
    duepaymentdate: Joi.string(),
    payment_history: Joi.array().items(paymentHistorySchema).required(),
    is_active: Joi.boolean().default(true),
    is_deleted: Joi.boolean().default(false)
});

export const getStudentFeesValidationSchema = (data) => {
    const {error,value} = studentFeesSchema.validate(data)
    if(error){
      throw new Error(error.details?.map((detail)=>detail.message).join(" ,"))
    }
    return value
}

