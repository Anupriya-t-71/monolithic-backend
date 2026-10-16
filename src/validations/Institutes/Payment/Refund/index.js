import Joi from "joi";

const refund = Joi.object({
    id: Joi.number(),
    uuid: Joi.string(),
    institute_id: Joi.string().required(),
    branch_name: Joi.string().required(),
    course_name: Joi.string().required(),
    batch_name: Joi.string().required(),
    student: Joi.string().required(),
    studentfees:Joi.string().required(),
    payment_date: Joi.string(),
    // transaction_id: Joi.string().required(),
    // total_amount: Joi.string().required(),
    amount: Joi.number().required(),
    file_upload: Joi.string(),
    is_active: Joi.boolean().default(true),
    is_deleted: Joi.boolean().default(false)
}).options({ abortEarly: false });

export const RefundValidation = (data) => {
    const {error,value} = refund.validate(data)
    if(error){
       throw new Error(error.details.map((detail)=>detail.message).join(", "))
    }
    return value
}


