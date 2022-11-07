import * as Joi from 'joi';

const now = Date.now();
const cutoffDate = new Date(now - 1000 * 60 * 60 * 24 * 365 * 18);

export const PersonalInformationSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  DOB: Joi.date().iso().max(cutoffDate).required(),
  COR: Joi.string().required(),
  COB: Joi.string().required(),
  phoneNumber: Joi.string().required(),
});
