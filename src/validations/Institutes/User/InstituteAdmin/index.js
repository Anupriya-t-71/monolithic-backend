import Joi from "joi"

const InstituteUser =Joi.object({
     institute_id : Joi.string().required(),
     branch : Joi.string().required(),
     first_name : Joi.string().required(),
     last_name : Joi.string().required(),
     username : Joi.string().required(),
     password : Joi.string().required(),
     designation : Joi.string().optional(),
     password:Joi.string().optional(),
     confirm_password : Joi.string().required(),
     phone_number : Joi.string().required(),
     email : Joi.string().email().required(),
     role : Joi.string().required(),
     image : Joi.string().optional()
})

export const InstituteUserValidation = async (data) => {
    const {value,error} = InstituteUser.validate(data)
    if(error){
        throw new Error(error?.details?.map((detail)=>detail.message).join(", "))
    }
    return value
}