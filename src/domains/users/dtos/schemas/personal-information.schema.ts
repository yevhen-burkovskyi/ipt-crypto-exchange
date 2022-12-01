import * as Joi from 'joi';
import { ServerUtils } from 'src/core/utils/server.utils';

const now = Date.now();
const cutoffDate = new Date(now - ServerUtils.take18YearsInMs());

export const PersonalInformationSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  DOB: Joi.date().iso().max(cutoffDate).required(),
  COR: Joi.string().required(),
  COB: Joi.string().required(),
  phoneNumber: Joi.string().required(),
});
