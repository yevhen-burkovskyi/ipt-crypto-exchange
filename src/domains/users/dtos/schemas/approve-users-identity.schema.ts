import * as Joi from 'joi';

export const ApproveUsersIdentitySchema = Joi.object({
  userIds: Joi.array().items(Joi.string().required()).required(),
}).required();
