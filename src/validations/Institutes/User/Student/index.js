import Joi from "joi";

const studentValidationSchema = Joi.object({
    id: Joi.number(),
    uuid: Joi.string(),
    roll_id: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    institute_id: Joi.string().required(),
    branch_id: Joi.string().required(),
    batch_id: Joi.string().required(),
    dob: Joi.string().required(),
    gender: Joi.string().valid("Male", "Female", "Other").required(),
    course: Joi.string().required(),
    qualification: Joi.string().required(),
    contact_info: Joi.object({
        state: Joi.string().required(),
        city: Joi.string().required(),
        pincode: Joi.number().required(),
        address1: Joi.string().required(),
        address2: Joi.string().required(),
        phone_number: Joi.number().min(1000000000).max(9999999999).required(),
        alternate_phone_number: Joi.number().min(1000000000).max(9999999999).required()
    }).required(),
    is_active: Joi.boolean().default(true),
    is_deleted: Joi.boolean().default(false)
}).options({ abortEarly: false });

export default studentValidationSchema;
