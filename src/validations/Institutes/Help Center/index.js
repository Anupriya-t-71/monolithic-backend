import Joi from "joi";

const helpCenterValidationSchema = Joi.object({
    id: Joi.number(),
    uuid: Joi.string(),
    institute_id: Joi.string().required(),
    branch_id:Joi.string().required(),
    question: Joi.string().required(),
    answer: Joi.string().required(),
    category: Joi.string().required(),
    videolink:Joi.string().required(),
    is_active: Joi.boolean().default(true),
    is_deleted: Joi.boolean().default(false)
}).options({ abortEarly: false });

export default helpCenterValidationSchema;
