import Joi from "joi";

const classValidationSchema = Joi.object({
    id: Joi.number(),
    uuid: Joi.string(),
    institute: Joi.string().required(),
    branch: Joi.string().required(),
    batch: Joi.string().required(),
    class_name: Joi.string().required(),
    course : Joi.string().required(),
    slug: Joi.string().lowercase(),
    start_date: Joi.string().required(),
    start_time: Joi.string().required(),
    end_time: Joi.string().required(),
    instructors: Joi.array().required(),
    coordinators: Joi.array().optional(),
    is_active: Joi.boolean().default(true),
    is_deleted: Joi.boolean().default(false)
}).options({ abortEarly: false });

export const OfflineClassValidation = (data) => {
    const {error,value} = classValidationSchema.validate(data, { abortEary: false })
    if(error){
      throw new Error(error.details.map((detail) => detail.message ).join(", "))
    }
    return value
}
