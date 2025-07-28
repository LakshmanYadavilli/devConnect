const Joi = require("joi");
const validator = require("validator");

const userSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required().email(),
  password: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!validator.isStrongPassword(value)) {
        return helpers.message("Password is not Strong Enough!");
      }
      return value;
    }),
  gender: Joi.string().valid("male", "female", "other").required(),
  age: Joi.number().min(18).required(),
  skills: Joi.array().items(Joi.string()).max(10),
  about: Joi.string().max(100).allow(""),
});

module.exports = userSchema;
