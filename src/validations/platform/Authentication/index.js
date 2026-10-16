import joi from "joi"

const Login = joi.object({
    email : joi.string().required(),
    password : joi.string().required()
}).options({abortEarly:false})

export const LoginValiation = (data) => {
    const { error, value } = Login.validate(data)
    if(error){
        throw new Error(error.details.map((details)=>details.message).join(", "))
    }
    return value
}

const Otp = joi.object({
    token : joi.string().length(10).required(),
    otp : joi.string().length(6).required(),
    email : joi.string().required()
})

export const OtpValidation = ( data ) => {
    const {error,value} = Otp.validate(data)
    if(error){
    throw new Error(error.details.map((detail)=>detail.message).join(", "))
    }
    return value
}

const ResetPassword = joi.object({
    email : joi.string().required(),
    otp : joi.string().required(),
    token : joi.string().required(),
    confirm_password : joi.string().required()
}).options({abortEarly:false})

export const ResetPasswordValidations = (data) => {
    const {error,value} = ResetPassword.validate(data)
    if(error){
       throw new Error(error.details.map((detail)=>detail.message).join(", "))
    }
    return value
}