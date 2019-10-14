import * as Joi from '@hapi/joi';

export default class AuthSchemas {
  static signUp: Joi.ObjectSchema = Joi.object({
    username: Joi.string().max(16).min(3),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(4).max(16),
  });

  static login: Joi.ObjectSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });
}
