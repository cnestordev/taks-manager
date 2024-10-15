const Joi = require('joi');

// Task schema
const taskValidationSchema = Joi.object({
    title: Joi.string().required().min(1).max(255),
    description: Joi.string().required().min(1).max(1024),
    priority: Joi.string().valid('Low', 'Medium', 'High').required(),
    isDeleted: Joi.boolean().default(false),
    isExpanded: Joi.boolean().default(true)
});

// Middleware for validating task payload
const validateTask = (req, res, next) => {
    const { error } = taskValidationSchema.validate(req.body);

    if (error) {
        console.log(error)
        return res.status(400).json({ error: error.details[0].message });
    }

    next();
};

module.exports = validateTask;
