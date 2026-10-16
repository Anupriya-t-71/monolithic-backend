import Joi from "joi";

const batchValidationSchema = Joi.object({
    id: Joi.number(),
    uuid: Joi.string(),
    // institute_id: Joi.string().required(),
    // branch_id: Joi.string().required(),
    course: Joi.string(),
    batch_name: Joi.string().required(),
    slug: Joi.string().lowercase(),
    start_date: Joi.string().required(),
    end_date: Joi.string().required(),
    student: Joi.array().items(Joi.string().required()).required(),
    instructor: Joi.array().items(Joi.string().required()).required(),
    attendance: Joi.array().items(Joi.string()),
    is_active: Joi.boolean().default(true),
    is_deleted: Joi.boolean().default(false)
}).options({ abortEarly: false });

export const BatchValidation = (data) => {
    const {error,value} = batchValidationSchema.validate(data, { abortEarly: false })
    if(error){
      throw new Error(error.details.map((details)=>details.message))
    }
    return value
}
