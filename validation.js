const Joi = require("@hapi/joi");

const userRegistrationValidation = (data) => {
    const schema = Joi.object({
    userName: Joi.string().required().label("UserName").min(4),
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password").min(8),
});
return schema.validate(data);
};

const loginValidate = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().min(8).required(),
  }); 
  return schema.validate(data);
};

module.exports.userRegistrationValidation = userRegistrationValidation;
module.exports.loginValidate = loginValidate;
