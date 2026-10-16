import Joi from "joi";

const AdminticketValidationSchema = Joi.object({
    id: Joi.number(),
    uuid: Joi.string(),
    institute: Joi.string().required(),
    issue_type : Joi.string(),
    branch:Joi.string().required(),
    description : Joi.string().required(),
    solution : Joi.string() ,
    file : Joi.string().optional(),
    query: Joi.string().required(),
    date: Joi.date(),
    priority: Joi.string(),
    status: Joi.string(),
    is_active: Joi.boolean().default(true),
    is_deleted: Joi.boolean().default(false)
}).options({ abortEarly: false });

export const AdminTicketValidation = (data) => {
    const {error,value} = AdminticketValidationSchema.validate(data)
    if(error){
       throw new Error(error.details.map((detail)=>detail.message).join(", "))
    }
    return value
}