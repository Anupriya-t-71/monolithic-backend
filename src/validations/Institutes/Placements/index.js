import Joi from "joi"

const companySchema = Joi.object({
    name:Joi.string().required(),
    email:Joi.string().required(),
    phone:Joi.number().required(),
    address:Joi.string(),
})

const eligibleSchema = Joi.object({
    courseName:Joi.string(),
    education:Joi.array().items(Joi.string().required())
})

const jobSchema = Joi.object({
    name:Joi.string().required(),
    description:Joi.string().required(),
    skils:Joi.array().items(Joi.string().required())
})

const scheduleSchema = Joi.object({
    interviewDate:Joi.date().required(),
    venue:Joi.string().required(),
    address:Joi.string().required(),
})


const PlacementSchema = Joi.object({
        uuid:Joi.string(),
        student:Joi.array().items(Joi.string().required()),
        institute:Joi.string().required(),
        job:jobSchema.required(),
        company:companySchema.required(),
        schedule:scheduleSchema.required(),
        eligible:eligibleSchema.required(),
})

export const getplacementValidationSchema=(data)=>{
  const {error,value} = PlacementSchema.validate(data)
    if(error){
      throw new Error(error.details?.map((detail)=>detail.message).join(" ,"))
    }
    return value
}