import Joi from "joi";

const salaryValidationSchema = Joi.object({
    id: Joi.number(),
    uuid: Joi.string(),
    institute_id: Joi.string().required(),
    branch_id: Joi.string(),
    staff_type: Joi.string().valid('Teaching', 'Non Teaching').required(),
    staff: Joi.string(),
    payment_date: Joi.string().required(),
    transaction_id: Joi.any().required(),
    salary_amount: Joi.number().required(),
    balance: Joi.number().required(),
    file_upload: Joi.string(),
    is_active: Joi.boolean().default(true),
    is_deleted: Joi.boolean().default(false),
    bank_details : {
        account_number : Joi.string(),
        branch : Joi.string(),
        IFSC : Joi.string(),
        bank_name : Joi.string()
    }
}).options({ abortEarly: false });

export const salaryValidation = (data) => {
    const {error,value} = salaryValidationSchema.validate(data)
    if(error){
       throw new Error(error.details.map((detail)=>detail.message).join(", "))
    }
    return value
}