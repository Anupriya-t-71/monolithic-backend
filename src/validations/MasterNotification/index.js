import Joi from "joi"

const MANotificationSchema = Joi.object({
    type:Joi.string().required(),
    recipients:Joi.array().items(Joi.string().required()),
    trigger:Joi.string().required(),
    status:Joi.string(),
    sendAt:Joi.date(),
    isRead:Joi.boolean,
    meta:Joi.string(),
    retryCount:Joi.number(),
    // startTime:Joi.string(),
    // endTime:Joi.string(),
    channels:Joi.array().items(Joi.string()),
    tempType:Joi.string().required(),
    tempName:Joi.string().required(),
    tempContent:Joi.string().required(),
    tempSubject:Joi.string().required(), 
})

export const getMANotificationValidation=(data)=>{
  const {error,value} = MANotificationSchema.validate(data)
    if(error){
      throw new Error(error.details?.map((detail)=>detail.message).join(" ,"))
    }
    return value
}
