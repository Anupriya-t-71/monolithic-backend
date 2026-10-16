import Joi from "joi";


const courseValidationSchema = Joi.object({
    id: Joi.number(),
    uuid: Joi.string(),
    institute_id: Joi.any().optional(),
    branch_id: Joi.any().optional(),
    branch_ids : Joi.array().optional(),
    category: Joi.string().optional(),
    course_name: Joi.string().required(),
    slug: Joi.string().lowercase(),
    duration: Joi.string().required(),
    actual_price: Joi.number().required(),
    current_price: Joi.number().required(),
    rating: Joi.number().valid(1, 2, 3, 4, 5).required(),
    reviews: Joi.number().required(),
    class_type: Joi.array().items(Joi.string().valid('offline', 'online')).required(),
    overview: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    thumbnail: Joi.string().required(),
    is_active: Joi.boolean().default(true),
    is_deleted: Joi.boolean().default(false)
}).options({ abortEarly: false });

export const CourseValidation = (data) => {
    const {error,value} = courseValidationSchema.validate(data)
    if(error){
       throw new Error(error.details.map((details)=>details.message).join(", "))
    }
    return value
}
