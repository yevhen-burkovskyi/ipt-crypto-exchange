import * as Joi from 'joi';

import { DatabaseNames } from 'src/core/enums/db.enum';

export const ConfigSchema = Joi.object({
  app: Joi.object({
    port: Joi.number().required(),
  }).required(),
  database: Joi.object({
    type: Joi.string()
      .valid(...Object.values(DatabaseNames))
      .required(),
    host: Joi.string().required(),
    port: Joi.number().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    database: Joi.string().required(),
    autoLoadEntities: Joi.boolean().required(),
    synchronize: Joi.boolean().required(),
    migrationsRun: Joi.boolean().required(),
  }).required(),
  security: Joi.object({
    saltRounds: Joi.number().required(),
    globalSalt: Joi.string().required(),
  }).required(),
  jwt: Joi.object({
    secret: Joi.string().required(),
    expiresIn: Joi.string().required(),
    emailApproveSecret: Joi.string().required(),
  }).required(),
  nodemailer: Joi.object({
    user: Joi.string().required(),
    password: Joi.string().required(),
  }).required(),
  redis: Joi.object({
    server: Joi.string().required(),
    port: Joi.number().required(),
    db: Joi.number().required(),
    auth: Joi.string().required(),
  }).required(),
  timeouts: Joi.object({
    emailConfirm: Joi.number().required(),
  }).required(),
  admin: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }).required(),
}).required();
