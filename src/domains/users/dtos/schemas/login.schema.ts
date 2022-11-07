import * as Joi from 'joi';

export const LoginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
