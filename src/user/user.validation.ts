import { Injectable } from '@nestjs/common';
import * as Joi from '@hapi/joi';

import AuthSchemas from '../auth/auth.validation';

@Injectable()
export default class UserSchemas extends AuthSchemas {
  private ID = Joi.string()
    .max(20)
    .rule({
      message: this.configService.getErrorMsg('USR_15'),
    })
    .min(20)
    .rule({
      message: this.configService.getErrorMsg('USR_15'),
    });

  assignUserRole: Joi.ObjectSchema = Joi.object({
    /* eslint-disable */
    role_id: this.ID.required(),
    user_id: this.ID.required(),
    /* eslint-enable */
  });
}
