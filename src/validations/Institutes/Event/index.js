import Joi from "joi";

const eventValidationSchema = Joi.object({
    id: Joi.number(),
    uuid: Joi.string(),
    title: Joi.string().required(),
    event_name: Joi.string().required(),
    slug: Joi.string().lowercase(),
    start_date: Joi.date().required(),
    end_date: Joi.date().required(),
    event_url: Joi.string().required(),
    guest: Joi.array().items(Joi.string()).required(),
    description: Joi.string().required(),
    is_active: Joi.boolean().default(true),
    is_deleted: Joi.boolean().default(false)
}).options({ abortEarly: false });

export const EventValidation = (data) => {
    const {error,value} = eventValidationSchema.validate(data, { abortEarly: false })
    if(error){
       throw new Error(error.details.map((detail)=>detail.message).join(", "))
    }
    return value
}

