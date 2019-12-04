import { Injectable } from '@nestjs/common';
import * as Joi from '@hapi/joi';

import { PermissionEnum } from './permissions.entity';
import ConfigService from '../config/config.service';

@Injectable()
export default class AccessControlSchemas {
  private name = Joi.string()
    .trim()
    .regex(/\s/, {
      name: 'no space',
      invert: true,
    })
    .rule({
      message: this.configService.getErrorMsg('USR_10'),
    })
    .normalize();

  private ID = Joi.string()
    .max(20)
    .rule({
      message: this.configService.getErrorMsg('USR_15'),
    })
    .min(20)
    .rule({
      message: this.configService.getErrorMsg('USR_15'),
    });

  role: Joi.ObjectSchema = Joi.object({
    name: this.name.required().lowercase(),
  });

  service: Joi.ObjectSchema = Joi.object({
    name: this.name.required(),
    isActive: Joi.boolean(),
  });

  permission: Joi.ObjectSchema = Joi.object({
    type: Joi.string()
      .valid(...Object.values(PermissionEnum))
      .required()
      .lowercase(),

    /* eslint-disable */
    service_id: this.ID.required(),
    /* eslint-enable */
  });

  roleParams: Joi.ObjectSchema = Joi.object({
    roleId: this.ID.required(),
    permissionId: this.ID,
  });

  serviceParams: Joi.ObjectSchema = Joi.object({
    serviceId: this.ID.required(),
  });

  constructor(private readonly configService: ConfigService) {}
}
