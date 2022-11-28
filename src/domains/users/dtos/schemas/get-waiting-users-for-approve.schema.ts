import * as Joi from 'joi';

export const GetWaitingUsersForApproveSchema = Joi.object({
  limit: Joi.number().required(),
  offset: Joi.number().required(),
}).required();
