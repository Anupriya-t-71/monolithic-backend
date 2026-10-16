import Joi from "joi"

const staff_attedence = Joi.object({
    institute : Joi.string().required(),
    branch : Joi.string().required(),
    staff : Joi.string().required(),
    date : Joi.date().required(),
    status : Joi.string().valid("present","absent").required()
})

export const StaffAttedenceValidations = (data) => {
    const {error,value} = staff_attedence.validate(data)
    if(error){
      throw new Error(error.details?.map((detail)=>detail.message).join(" ,"))
    }
    return value
}