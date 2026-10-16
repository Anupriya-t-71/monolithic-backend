import Joi from "joi";

const faqcategoryValidationSchema = Joi.object({
    id: Joi.number(),
    uuid: Joi.string(),
    institute_id: Joi.string().required(),
    branchid : Joi.any().optional(),
    category_name: Joi.string().trim().required(),
    slug: Joi.string().lowercase(),
    title: Joi.string().trim(),
    // accessby: Joi.array().items(Joi.string()).required(),
    description: Joi.string().trim(),
    is_active: Joi.boolean().default(true),
    is_deleted: Joi.boolean().default(false)
}).options({ abortEarly: false });

export default faqcategoryValidationSchema;
