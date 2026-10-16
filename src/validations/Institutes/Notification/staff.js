import Joi from "joi";

const staffSchema =  Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
    institute: Joi.string().required(),  
    branch: Joi.string().required(),    
    type : Joi.string().required(),
    link:Joi.optional(), 
    staff : Joi.optional(),    
    is_active: Joi.boolean().default(true),
    is_delete: Joi.boolean().default(false),
})

export const staffNotification = (data) => {
    const {error,value} = staffSchema.validate(data)
    if(error){
        throw new Error(error?.details?.map((detail)=>detail?.message).join(" ,"))
    }
    return value
}