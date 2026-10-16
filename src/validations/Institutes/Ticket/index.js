import Joi from "joi";

const ticketValidationSchema = Joi.object({
    id: Joi.number(),
    uuid: Joi.string(),
    institute: Joi.string().required(),
    issue_type : Joi.string().optional(),
    description : Joi.string().optional(),
    branch:Joi.string().required(),
    user: Joi.string().optional(),
    category : Joi.string().required() ,
    file : Joi.string().required(),
    query: Joi.string().required(),
    date: Joi.date(),
    file_upload:Joi.string(),
    priority: Joi.string(),
    status: Joi.string(),
    is_active: Joi.boolean().default(true),
    is_deleted: Joi.boolean().default(false)
}).options({ abortEarly: false });

export const TicketValidation = (data) => {
    const {error,value} = ticketValidationSchema.validate(data)
    if(error){
       throw new Error(error.details.map((detail)=>detail.message).join(", "))
    }
    return value
}