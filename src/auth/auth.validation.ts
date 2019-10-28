import * as Joi from '@hapi/joi';

import constants from '../config/config.constants';

export default class AuthSchemas {
  static passwordRegx = /^(?=.*\d)(?=.*[A-Za-z])[A-Za-z0-9]*$/;

  static signUp: Joi.ObjectSchema = Joi.object({
    username: Joi.string()
      .max(16)
      .min(3),
    email: Joi.string()
      .email()
      .required()
      .label('Email')
      .normalize()
      .error(new Error(constants.getErrorMsg('USR_02'))),

    password: Joi.string()
      .regex(AuthSchemas.passwordRegx)
      .required()
      .min(8)
      .max(16)
      .label('Password')
      .error(new Error(constants.getErrorMsg('USR_04'))),
  });

  static login: Joi.ObjectSchema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .label('Email')
      .normalize()
      .error(new Error(constants.getErrorMsg('USR_02'))),

    password: Joi.string()
      .required()
      .regex(AuthSchemas.passwordRegx)
      .min(8)
      .max(16)
      .label('Password')
      .error(new Error(constants.getErrorMsg('USR_04'))),
  });
}
