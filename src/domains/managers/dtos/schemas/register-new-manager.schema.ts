import * as Joi from 'joi';

export const RegisterNewManagerSchema = Joi.object({
  email: Joi.string().email().required(),
}).required();
