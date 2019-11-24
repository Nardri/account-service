import { BadRequestException } from '@nestjs/common';
import * as Joi from '@hapi/joi';

import { TObject } from './base/base.type';

/* eslint-disable */
export const validateWithJoi = (
  payload: Object,
  validationSchema: Joi.ObjectSchema | Joi.Schema,
): any => {
  const { error, value: validatedPayload } = validationSchema.validate(payload);

  if (error) {
    throw new BadRequestException(error.message);
  }

  return validatedPayload;
};

export const convertQueryParamToArray = (query: TObject): string[] => {
  let includedQuery = [];
  if (typeof query.include === 'string') {
    includedQuery = query.include.split(' ');
  }
  return includedQuery;
};
