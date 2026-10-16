import Joi from 'joi';


const InstituteUserValidationSchema = Joi.object({
    id: Joi.number(),
    uuid: Joi.string(),
    first_name: Joi.string(),
    last_name: Joi.string(),
    username: Joi.string(),
    password: Joi.string(),
    roll_no: Joi.number(),
    full_name: Joi.string(),
    institute_id: Joi.string(),
    branch_id: Joi.string(),
    dob: Joi.string(),
    gender: Joi.string().valid('Male', 'Female', 'Other'),
    qualification: Joi.string(),
    email : Joi.string(),
    contact_info: Joi.object({
        state: Joi.string(),
        city: Joi.string(),
        pincode: Joi.number(),
        address1: Joi.string(),
        address2: Joi.string(),
        phone_number: Joi.string().pattern(/^\+?\d{1,3}[- ]?\d{3}[- ]?\d{3}[- ]?\d{4}$/),
        alternate_phone_number: Joi.string().pattern(/^\+?\d{1,3}[- ]?\d{3}[- ]?\d{3}[- ]?\d{4}$/)
    }),
    is_super_user: Joi.boolean().default(false),
    role: Joi.string(),
    user_group: Joi.string(),
    is_active: Joi.boolean().default(true),
    is_delete: Joi.boolean().default(false),
    is_two_auth_completed: Joi.boolean().default(false),
    is_email_verified: Joi.boolean().default(false),
    userDetail : Joi.object().optional(),
    image : Joi.string().optional()
});

const InstituteUserValidation = (data) => {
    const {error,value} = InstituteUserValidationSchema.validate(data,{abortEarly:false})
    if(error){
      throw new Error(error.details.map((detail)=>detail.message).join(", "))
    }
    return value
}


const InstituteTeachingStaffValidationSchema = Joi.object({
    id: Joi.number(),
    uuid: Joi.string(),
    roll_id: Joi.string().required(),
    roll_no: Joi.number(),
    institute_id: Joi.string().required(),
    branch_id: Joi.string().required(),
    course: Joi.array().items(Joi.string().required()).required(),
    username: Joi.string().required(),
    is_active: Joi.boolean().default(true),
    is_deleted: Joi.boolean().default(false)
});

const InstituteTeachingStaffValidation = (data) => {
    const {error,value} = InstituteTeachingStaffValidationSchema.validate(data)
    if(error){
      throw new Error(error.details.map((detail)=>detail.message).join(", "))
    }
    return value
}


const InstituteNonTeachingStaffValidationShema = Joi.object({
    id: Joi.number(),
    uuid: Joi.string(),
    roll_id: Joi.string().required(),
    roll_no: Joi.number(),
    designation: Joi.string().required(),
    institute_id: Joi.string().required(),
    username: Joi.string().required(),
    branch_id: Joi.string().required(),
    is_active: Joi.boolean().default(true),
    is_deleted: Joi.boolean().default(false)
});

const InstituteNonTeachingStaffValidation = (data) => {
    const {error,value} = InstituteNonTeachingStaffValidationShema.validate(data)
    if(error){
       throw new Error(error.details.map((details)=>details.message).join(", "))
    }
    return value
}


const InstituteStudentValidationSchema = Joi.object({
    id: Joi.number(),
    uuid: Joi.string(),
    role: Joi.string().required(),
    
    roll_no: Joi.number(),
    institute_id: Joi.string().required(),
    branch_id: Joi.string().required(),
    batch_id: Joi.string().required(),
    course: Joi.string().required(),
    qualification: Joi.string().required(),
    is_active: Joi.boolean().default(true),
    is_deleted: Joi.boolean().default(false)
});

const InstituteStudentValidation = (data) => {
    const {error,value} = InstituteStudentValidationSchema.validate(data,{ abortEarly: false })
    if(error){
      throw new Error( error.details.map((detail)=>detail.message).join(", "))
    }
    return value
}


const InstituteOtpValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().required(),
    token: Joi.string().required(),
    role: Joi.string(),
    validated: Joi.boolean().default(false),
    is_active: Joi.boolean().default(true),
    is_delete: Joi.boolean().default(false)
});

export const InstituteOtpValidation = (data) => {
    const {error,value} = InstituteOtpValidationSchema.validate(data,{abortEarly:false})
    if(error){
      throw new Error(error.details.map(detail=>detail.message).join(", "))
    }
    return value
}


const InstituteTokenValidationSchema = Joi.object({
    email: Joi.string().required(),
    token: Joi.string().required(),
    uuid: Joi.string()
});

const InstituteTokenValidation = (data) => {
    const {error,value} = InstituteTokenValidationSchema.validate(data,{abortEarly:false})
    if(error){
      throw new Error(error.details.map((details)=>details.message).join(", "))
    }
    return value
}

const ResetPasswordValidationSchema = Joi.object({
    email : Joi.string().required(),
    new_password : Joi.string().required(),
    confirm_password : Joi.string().valid(Joi.ref("new_password")).required()
})

const InstituteResetPasswordValidation = (data) => {
     const { error, value } = ResetPasswordValidationSchema.validate(data,{abortEarly:false})
     if(error){
        throw new Error(error.details.map((detail)=>detail.message).join(", "))
     }
     return value
}

const ChangePassword = Joi.object({
    current_password : Joi.string().required(),
    new_password : Joi.string().required(),
    confirm_password : Joi.string().valid(Joi.ref("new_password")).required()
})

const ChangePasswordValidation = (data) => {
    const { error ,value } = ChangePassword.validate(data,{ abortEarly: false })
    if(error){
      throw new Error(error.details.map((detail) => detail.message).join(", "))
    }
    return value
}

const IdCardValidationSchema = Joi.object({
    id: Joi.number(),
    uuid: Joi.string(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    username: Joi.string(),
    institute_id: Joi.string().required(),
    branch_id: Joi.string().required(),
    role: Joi.string().required(),
    contact: Joi.string().required(),
    address: Joi.string().required(),
    qr_code: Joi.binary().required(),
    roll_id: Joi.string().required()
});

const IdCardValidation = (data) => {
    const {error,value} = IdCardValidationSchema.validate(data,{abortEarly:false})
    if(error){
       throw new Error(error.details.map((detail)=>detail.message).join(", "))
    }
    return value
}

const AuthValidation ={
    InstituteUserValidation,
    InstituteTeachingStaffValidation,
    InstituteNonTeachingStaffValidation,
    InstituteOtpValidation,
    InstituteStudentValidation,
    InstituteTokenValidation,
    IdCardValidation,
    InstituteResetPasswordValidation,
    ChangePassword : ChangePasswordValidation
}
export default AuthValidation;

const updateProfileSchema = Joi.object({
    id: Joi.number(),
    uuid: Joi.string(),
    first_name: Joi.string(),
    last_name: Joi.string(),
    username: Joi.string(),
    password: Joi.string(),
    roll_no: Joi.number(),
    full_name: Joi.string(),
    institute_id: Joi.string(),
    branch_id: Joi.string(),
    dob: Joi.string(),
    gender: Joi.string().valid('Male', 'Female', 'Other'),
    qualification: Joi.string(),
    contact_info: Joi.object({
        state: Joi.string(),
        city: Joi.string(),
        pincode: Joi.number(),
        address1: Joi.string(),
        address2: Joi.string(),
        phone_number: Joi.string().pattern(/^\+?\d{1,3}[- ]?\d{3}[- ]?\d{3}[- ]?\d{4}$/),
    }),
    is_super_user: Joi.boolean().default(false),
    role: Joi.number(),
    user_group: Joi.string(),
    is_active: Joi.boolean().default(true),
    is_delete: Joi.boolean().default(false),
    is_two_auth_completed: Joi.boolean().default(false),
    is_email_verified: Joi.boolean().default(false)
});

export  {updateProfileSchema};