import * as Joi from 'joi';

export const ApproveEmailSchema = Joi.object({
  approveToken: Joi.string().required(),
});
