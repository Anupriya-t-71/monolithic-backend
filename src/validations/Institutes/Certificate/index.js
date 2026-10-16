import Joi from "joi";

const certificateValidationSchema = Joi.object({
    id: Joi.number(),
    uuid: Joi.string(),
    institute_id: Joi.string().required(),
    branch_id: Joi.string().required(),
    course: Joi.string().required(),
    batch_id: Joi.string().required(),
    certificate_name: Joi.string(),
    slug: Joi.string().lowercase(),
    student: Joi.string().required(),
    description: Joi.string(),
    file_upload: Joi.string(),
    is_active: Joi.boolean().default(true),
    is_deleted: Joi.boolean().default(false)
}).options({ abortEarly: false });

export const certificatevalidation = (data) => {
    const {error,value} = certificateValidationSchema.validate(data)
    if(error){
       throw new Error(error.details.map((detail)=>detail.message).join(", "))
    }
    return value
}
