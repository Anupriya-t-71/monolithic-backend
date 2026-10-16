import Joi from "joi";


const branchValidationSchema = Joi.object({
    id: Joi.number(),
    uuid: Joi.string(),
    institute_id: Joi.any().optional(),
    attendance: Joi.string(),
    branch_identity: Joi.string().required(),
    slug: Joi.string().lowercase(),
    contact_info: Joi.object({
        phone_no: Joi.number(),
        alternate_no: Joi.number(),
        address: Joi.string(),
        landmark: Joi.string(),
        state: Joi.string(),
        city: Joi.string(),
        pincode: Joi.number()
    }),
    is_active: Joi.boolean().default(true),
    is_deleted: Joi.boolean().default(false),
    is_primary: Joi.boolean().default(false)
}).options({ abortEarly: false });


export const validateBranchInput = (data) => {
    const {error,value} = branchValidationSchema.validate(data,{ abortEarly: false })
    if(error){
        throw new Error(error.details.map((details)=>details.message).join(", "))
    }
    return value
}
