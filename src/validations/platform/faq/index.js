import Joi from "joi";

const PlatformFaqCategory = Joi.object({
    identity : Joi.string().required(),
    description : Joi.string().optional()
}).options({abortEarly:false})

export const createPlatformFaqValidation = ( data ) => {
     const {value,error} = PlatformFaqCategory.validate(data)
     if(error){
        throw new Error(error.details.map((details)=>details.message).join(", "))
     }
     return value
}

const PlatformFaq = Joi.object({
    identity : Joi.string().required(),
    description : Joi.string().optional(),
    category : Joi.string().required()
})

export const createPlatformFaqsValidations = (data) => {
    const {value,error} = PlatformFaq.validate(data)
    if(error){
     throw new Error(error.details.map((detail)=>detail.message).join(", "))
    }
    return value
}