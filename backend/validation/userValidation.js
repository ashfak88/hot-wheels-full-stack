const Joi = require("joi");

const registerSchema = Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
        "string.empty": "Name is required",
        "string.min": "Name should have at least 3 characters",
    }),
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email address",
    }),
    password: Joi.string().min(6).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters long",
    }),
    role: Joi.string().valid("user", "admin").optional(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email address",
    }),
    password: Joi.string().required().messages({
        "string.empty": "Password is required",
    }),
});

module.exports = {
    registerSchema,
    loginSchema,
};
