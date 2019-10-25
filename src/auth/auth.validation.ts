import * as Joi from '@hapi/joi';

export default class AuthSchemas {
  static signUp: Joi.ObjectSchema = Joi.object({
    username: Joi.string()
      .max(16)
      .min(3),
    email: Joi.string()
      .email()
      .required()
      .normalize(),
    password: Joi.string()
      .pattern(/^[a-zA-Z0-9]{4,16}$/)
      .required()
      .min(4)
      .max(16)
      .label('Password')
      .error(new Error('Password is incorrect.')),
  });

  static login: Joi.ObjectSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });
}
