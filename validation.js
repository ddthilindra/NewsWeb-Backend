const Joi = require("@hapi/joi");

const userRegistrationValidation = (data) => {
    const schema = Joi.object({
    firstName: Joi.string().required().label("FirstName").min(4),
    lastName: Joi.string().required().label("LastName").min(4),
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password").min(8),
    mobile: Joi.string().required().label("Mobile").min(10),
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
