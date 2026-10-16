import Joi from "joi";

const instituteNotificationschema = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
    institute: Joi.string().required(),  
    branch: Joi.string().required(),     
    is_active: Joi.boolean().default(true),
    is_delete: Joi.boolean().default(false),
})

const instituteNotification = (data) => {
    const {error,value} = instituteNotificationschema.validate(data)
    if(error){
        throw new Error(error?.details?.map((detail)=>detail?.message).join(" ,"))
    }
    return value
}

export default instituteNotification