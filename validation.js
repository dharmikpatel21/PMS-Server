const Joi = require("joi");

// validate user schema
const registerValidation = (data) => {
    const validateUserSchema = Joi.object({
        name: Joi.string().min(2).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });
    return validateUserSchema.validate(data);
};

const loginValidation = (data) => {
    const validateUserSchema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });
    return validateUserSchema.validate(data);
};

module.exports = { registerValidation, loginValidation };
