import Joi from "joi";

const moduleValidationSchema = Joi.object({
    id: Joi.number(),
    uuid: Joi.string(),
    branch: Joi.string().required(),
    course: Joi.string().required(),
    title: Joi.string().required(),
    slug: Joi.string().lowercase(),
    description: Joi.string().required(),
    video: Joi.string(),
    is_active: Joi.boolean().default(true),
    is_deleted: Joi.boolean().default(false)
}).options({ abortEarly: false });

export const CourseModuleValidation = (data) => {
    const {error,value} = moduleValidationSchema.validate(data,{abortEarly:false})
    if(error){
        throw new Error(error.details.map(detail=>detail.message).join(", "))
    }
    return value
}
