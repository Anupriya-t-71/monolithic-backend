import Joi from "joi";


const onlineclassValidationSchema = Joi.object({
    institute: Joi.string().required(),
    branch: Joi.string().required(),
    batch: Joi.string().required(),
    course : Joi.string().required(),
    class_name: Joi.string().required(),
    slug: Joi.string().lowercase(),
    start_date: Joi.string().required(),
    start_time: Joi.string().required(),
    end_time: Joi.string().required(),
    instructors: Joi.array().required(),
    coordinators: Joi.array().optional(),
    video_url: Joi.string(),
    is_active: Joi.boolean().default(true),
    is_deleted: Joi.boolean().default(false)
}).options({ abortEarly: false });

export const OnlineClassValidation = (data) => {
    const {error,value} = onlineclassValidationSchema.validate(data, { abortEarly : false })
    if(error){
        throw new Error(error.details.map(details=>details.message).join(", "))
    }
    return value
}
