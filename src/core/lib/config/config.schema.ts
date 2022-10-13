import * as Joi from 'joi';

export const ConfigSchema = Joi.object({
  port: Joi.number().required(),
});