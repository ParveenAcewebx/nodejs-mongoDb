const Joi = require('joi')

const testSchema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    age: Joi.string().required(),
    age1: Joi.string().required()
});

module.exports = testSchema;