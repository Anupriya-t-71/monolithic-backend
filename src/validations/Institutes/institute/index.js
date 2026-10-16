import Joi from 'joi';

const instituteValidationSchema = Joi.object({
    id: Joi.number().optional(),
    uuid: Joi.string().uuid().optional(),
    institute_name: Joi.string().required(),
    slug: Joi.string().lowercase().optional(),
    email: Joi.string().email().required(),
    subscription: Joi.string().required(),
    registered_date: Joi.string().optional(),
    contact_info: Joi.object({
        phone_no: Joi.string().optional(),
        alternate_no: Joi.string().optional(),
        address:{
            address1: Joi.string().optional(),
            address2: Joi.string().optional(),
            state: Joi.string().optional(),
            city: Joi.string().optional(),
            pincode: Joi.number().optional(),
        }
    }).optional(),
    primary_branch: Joi.string().optional(),
    website: Joi.string().optional(),
    description: Joi.string().optional(),
    logo: Joi.string().optional(),
    image: Joi.string().optional(),
    gallery_images: Joi.array().optional(),
    docs : {
      gst: {
        number : Joi.string().optional().allow(null,""),
        file : Joi.string().optional().allow(null,"")
      },
      pan : {
        number : Joi.string().optional().allow(null,""),
        file : Joi.string().optional().allow(null,"")
      },
      licence: {
        number : Joi.string().optional().allow(null,""),
        file: Joi.string().optional().allow(null,"")
      }
    },
    social_media:{
        twitter_id: Joi.any().optional(),
        facebook_id: Joi.any().optional(),
        instagram_id: Joi.any().optional(),
        linkedin_id: Joi.any().optional(),
        pinterest: Joi.any().optional(),
    },
    is_active: Joi.boolean().optional(),
    is_deleted: Joi.boolean().optional(),
});


export const validateInstitute = (data) => {
    const { error, value } = instituteValidationSchema.validate(data, { abortEarly: false });
    if (error) {
        throw new Error(error.details.map((detail) => detail.message).join(', '));
    }
    return value;
};



const updateInstituteValidationSchema = Joi.object({
    institute_name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    contact_info: Joi.object({
        phone_no: Joi.string().optional(),
        alternate_no: Joi.string().optional(),
        address: Joi.object({
            address1: Joi.string().optional(),
            address2: Joi.string().optional(),
            state: Joi.string().optional(),
            city: Joi.string().optional(),
            pincode: Joi.string().optional(),
        }).optional(),
    }).optional(),
    website: Joi.string().optional(),
    description: Joi.string().optional(),
    logo: Joi.string().optional(),
    image: Joi.string().optional(),
    gallery_images: Joi.array().optional(),
    social_media: Joi.object({
        twitter_id: Joi.string().optional(),
        facebook_id: Joi.string().optional(),
        instagram_id: Joi.string().optional(),
        linkedin_id: Joi.string().optional(),
        pinterest_id: Joi.string().optional(),
    }).optional(),
    is_active: Joi.boolean().optional(),
    is_deleted: Joi.boolean().optional(),
});

const updateInstituteStatusValidationSchema = Joi.object({
    institute_active_status: Joi.string().valid("Active", "Blocked", "Suspended").required(),
});

export const validateUpdateInstitute = (data) => {
    const { error, value } = updateInstituteValidationSchema.validate(data, { abortEarly: false });
    if (error) {
        throw new Error(error.details.map((detail) => detail.message).join(', '));
    }
    return value;
};

export const validateUpdateStatusInstitute = (data) => {
    const { error, value } = updateInstituteStatusValidationSchema.validate(data, { abortEarly: false });
    if (error) {
        throw new Error(error.details.map((detail) => detail.message).join(', '));
    }
    return value;
};