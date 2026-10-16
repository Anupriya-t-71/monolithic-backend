import Joi from "joi";

// const StudentSchema = Joi.object({
//     title: Joi.string().required(),
//     body: Joi.string().required(),
//     institute: Joi.string().required(),  
//     branch: Joi.string().required(),     
//     course: Joi.string().required(),     
//     batch: Joi.string().required(),  
//     student : Joi.optional(),    
//     is_active: Joi.boolean().default(true),
//     is_delete: Joi.boolean().default(false),
//     type : Joi.string().required(),
//     link : Joi.string().optional()
// })
const StudentSchema = Joi.object({
    title: Joi.string(),
    body: Joi.string(),
    institute: Joi.string(),  
    branch: Joi.string(),     
    course: Joi.string(),     
    batch: Joi.string(),  
    student : Joi.optional(),    
    is_active: Joi.boolean().default(true),
    is_delete: Joi.boolean().default(false),
    type : Joi.string(),
    link : Joi.string().optional()
})

export const studentNotification = (data) => {
    // console.log(data,'validate')
    const {value,error} = StudentSchema.validate(data)
    if(error){
      throw new Error(error?.details?.map((detail)=>detail?.message).join(" ,"))
    }
    return value
}