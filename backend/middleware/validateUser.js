const Joi = require('joi');

// Base schema for username and password
const baseSchema = {
    username: Joi.string().required().min(3).max(30),
    password: Joi.string().required().min(3)
};

// Login Validation Schema
const loginValidationSchema = Joi.object(baseSchema);

// Task Validation Schema
const taskValidationSchema = Joi.object({
    title: Joi.string().required().min(1).max(255),
    description: Joi.string().required().min(1).max(1024),
    priority: Joi.string().valid('low', 'medium', 'high').required(),
    isDeleted: Joi.boolean().default(false),
    isExpanded: Joi.boolean().default(true)
});

// Registration Validation Schema
const userValidationSchema = Joi.object({
    ...baseSchema,
    tasks: Joi.array().items(taskValidationSchema).default([])
});

const validateLogin = (req, res, next) => {
    const { error } = loginValidationSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    next();
};

const validateUser = (req, res, next) => {
    const { error } = userValidationSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    next();
};

module.exports = {
    validateLogin,
    validateUser
};
