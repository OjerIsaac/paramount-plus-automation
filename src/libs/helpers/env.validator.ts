import * as Joi from 'joi';

export const envVarsSchema = Joi.object({
  PORT: Joi.number().default(3000),

  NODE_ENV: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),

  FRONTEND_VERIFY_EMAIL_URL: Joi.string().required(),
  FRONTEND_RESET_PASSWORD_URL: Joi.string().required(),
  FRONTEND_CLIENT_LOGIN_URL: Joi.string().required(),

  FRONTEND_ADMIN_LOGIN_URL: Joi.string().required(),
  FRONTEND_ADMIN_VERIFY_EMAIL_URL: Joi.string().required(),
  FRONTEND_ADMIN_RESET_PASSWORD_URL: Joi.string().required(),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),

  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().required(),
  SMTP_USERNAME: Joi.string().required(),
  SMTP_PASSWORD: Joi.string().required(),
  SMTP_FROM: Joi.string().required(),

  BUCKET_NAME: Joi.string().required(),
  BUCKET_ACCESS_KEY: Joi.string().required(),
  BUCKET_SECRET_KEY: Joi.string().required(),
  BUCKET_REGION: Joi.string().required(),

  CLICK_BASE_URL: Joi.string().required(),

  POSTBACK_SETTING: Joi.string().required(),
});
