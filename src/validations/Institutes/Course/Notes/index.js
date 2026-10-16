import Joi from "joi";

const noteValidationSchema = Joi.object({
    id: Joi.number(),
    uuid: Joi.string(),
    institute: Joi.string().required(),
    branch: Joi.string().required(),
    course: Joi.string().required(),
    title: Joi.string().required(),
    slug: Joi.string().lowercase(),
    description: Joi.string().required(),
    file: Joi.string(),
    is_active: Joi.boolean().default(true),
    is_delete: Joi.boolean().default(false)
}).options({ abortEarly: false });

export const NotesValidation = (data) => {
    const {error,value} = noteValidationSchema.validate(data,{ abortEarly : false })
    if(error){
        throw new Error(error.details.map((detail)=>detail.message).join(", "))
    }
    return value
}
