import { Injectable } from '@nestjs/common';
import * as Joi from '@hapi/joi';

import ConfigService from '../config/config.service';

@Injectable()
export default class AuthSchemas {
  private passwordRegx = /^(?=.*\d)(?=.*[A-Za-z])[A-Za-z0-9]*$/;

  private email = Joi.string()
    .email()
    .trim()
    .required()
    .label('Email')
    .normalize()
    .rule({
      message: this.configService.getErrorMsg('USR_02'),
    });

  private password = Joi.string()
    .regex(this.passwordRegx)
    .rule({
      message: this.configService.getErrorMsg('USR_04'),
    })
    .required()
    .min(8)
    .max(16)
    .label('Password');

  signUp: Joi.ObjectSchema = Joi.object({
    username: Joi.string()
      .trim()
      .max(16)
      .min(3),

    email: this.email,
    password: this.password,
  });

  login: Joi.ObjectSchema = Joi.object({
    email: this.email,
    password: this.password,
  });

  constructor(private readonly configService: ConfigService) {}
}
