import Joi from "joi";

const categoryValidationSchema = Joi.object({
    id: Joi.number(),
    uuid: Joi.string(),
    institute_id: Joi.string().optional(),
    branch_id: Joi.string().optional(),
    category_name: Joi.string().required(),
    image : Joi.string().optional(),
    slug: Joi.string().lowercase(),
    is_active: Joi.boolean().default(true),
    is_deleted: Joi.boolean().default(false)
}).options({ abortEarly: false });

export const ValidateCategory = (data) => {
    const {error,value} = categoryValidationSchema.validate(data,{abortEarly:false})
    if(error){
    throw new Error(error.details.map((details)=>details.message).join(", "))
    }
    return value 
}
