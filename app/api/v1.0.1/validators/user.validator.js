const Joi = require("joi");
const userSchema = {
  create: Joi.object({
    name: Joi.string().required().empty(),
    email: Joi.string().email().required().empty(),
    password: Joi.string().required(),
    role: Joi.string().required(),
  }),
  login: Joi.object({
    email: Joi.string().email().required().empty(),
    password: Joi.string().required(),
    role: Joi.string().required(),
  }),
};

module.exports = userSchema;
