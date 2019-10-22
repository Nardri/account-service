import { EntityRepository, Repository } from 'typeorm';

import UserEntity from '../user/user.entity';

@EntityRepository(UserEntity)
export default class UserRepository extends Repository<UserEntity> {
  async findByEmailOrUsername(email: string, username?: string): Promise<UserEntity> {
    const qb = this
      .createQueryBuilder('users')
      .where('users.email = :email', {
        email,
      })
      .orWhere('users.username = :username', {
        username,
      });
    return qb.getOne();
  }

  async countUserOccurrence(email: string, username?: string): Promise<number> {
    const qb = this
      .createQueryBuilder('users')
      .where('users.email = :email', {
        email,
      })
      .orWhere('users.username = :username', {
        username,
      });

    return qb.getCount();
  }
}
