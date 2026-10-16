import Joi from "joi";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const notificationValidationSchema = Joi.object({
    id: Joi.number(),
    uuid: Joi.string(),
    institute_id: Joi.string().required(),
    branch_id: Joi.string(),
    batch_id: Joi.string(),
    title: Joi.string().required(),
    description: Joi.string(),
    type: Joi.string(),
    student: Joi.array().items(Joi.string().pattern(objectIdPattern)),
    staff: Joi.string(),
    course: Joi.string(),
    remainder: Joi.string(),
    is_active: Joi.boolean().default(true),
    is_deleted: Joi.boolean().default(false)
}).options({ abortEarly: false });

export default notificationValidationSchema;
