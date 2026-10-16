import Joi from 'joi';


const notificationSchema = Joi.object({
    title: Joi.string().required().messages({
        'string.empty': 'Title is required',
        'any.required': 'Title is required',
    }),
    body: Joi.string().required().messages({
        'string.empty': 'Body is required',
        'any.required': 'Body is required',
    }),
    instituteId: Joi.string().required().messages({
        'string.empty': 'Institute ID is required',
        'any.required': 'Institute ID is required',
    }),
    branch: Joi.string().required().messages({
        'string.empty': 'Branch is required',
        'any.required': 'Branch is required',
    }),
    status: Joi.string().valid('unread', 'read', 'archived').default('unread').required().messages({
        'any.only': 'Status must be one of unread, read, archived',
        'any.required': 'Status is required',
    }),
    type: Joi.string().valid('general', 'urgent', 'info').default('general').required().messages({
        'any.only': 'Type must be one of general, urgent, info',
        'any.required': 'Type is required',
    }),
    isImportant: Joi.boolean().default(false),
    createdBy: Joi.string().optional().messages({
        'string.empty': 'Created by must be a valid user',
    }),
    is_deleted: Joi.boolean().default(false),
});


export const validateNotification = (data) => {
    const { error, value } = notificationSchema.validate(data);
    if (error) {
        throw new Error(error.details.map((detail) => detail.message).join(' ,'));
    }
    return value;
};
