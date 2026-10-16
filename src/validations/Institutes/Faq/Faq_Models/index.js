import Joi from "joi";

const faqValidationSchema = Joi.object({
    id: Joi.number(),
    uuid: Joi.string(),
    category_id: Joi.string().required(),
    title: Joi.string().trim(),
    description: Joi.string().trim(),
    accessby: Joi.array().items(Joi.string()).required(),
    vidlink: Joi.string().trim(),
    pagelink: Joi.string().trim(),
    is_active: Joi.boolean().default(true),
    is_deleted: Joi.boolean().default(false)
}).options({ abortEarly: false });

export default faqValidationSchema;
