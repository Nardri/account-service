import { EntityRepository } from 'typeorm';

import BaseRepository from '../shared/base/base.repository';
import UserEntity from '../user/user.entity';

@EntityRepository(UserEntity)
export default class UserRepository extends BaseRepository<UserEntity> {
  async findByEmail(email: string): Promise<UserEntity> {
    const qb = this.createQueryBuilder('users').where('users.email = :email', {
      email,
    });

    return qb.getOne();
  }

  async countUserOccurrence(email: string): Promise<number> {
    const qb = this.createQueryBuilder('users').where('users.email = :email', {
      email,
    });
    return qb.getCount();
  }
}
