import Joi from "joi"

const Group = Joi.object({
   identity:Joi.string().required(),
   institute_id : Joi.string().required(),
   permissions: Joi.array().required()
})

export const GroupValidation = (data) => {
    const {value,error} = Group.validate(data)
    if(error){
       throw new Error(error?.details?.map((detail)=>detail.message).join(", "))
    }
    return value
}