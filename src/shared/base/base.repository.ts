import { DeleteQueryBuilder, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import {
  errorCodesObject,
  messageCodeObject,
} from '../../config/config.constants';

export default abstract class BaseRepository<T> extends Repository<T> {
  async delete(criteria: any): Promise<any> {
    const result = super.delete(criteria);
    const { affected } = await result;
    return new Promise((resolve, reject) => {
      if (affected > 0) {
        resolve(messageCodeObject['USR_MSG_01']);
      }
      reject(new NotFoundException(errorCodesObject['USR_14']));
    });
  }

  async update(criteria: any, entity: QueryDeepPartialEntity<T>): Promise<any> {
    const result = super.update(criteria, entity);
    const { affected } = await result;
    return new Promise((resolve, reject) => {
      if (affected > 0) {
        resolve(messageCodeObject['USR_MSG_02']);
      }
      reject(new NotFoundException(errorCodesObject['USR_14']));
    });
  }

  async queryBuilderDelete(qb: DeleteQueryBuilder<T>): Promise<string> {
    const { affected } = await qb.execute();
    return new Promise((resolve, reject) => {
      if (affected > 0) {
        resolve(messageCodeObject['USR_MSG_01']);
      }
      reject(new NotFoundException(errorCodesObject['USR_14']));
    });
  }
}
