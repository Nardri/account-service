import { EntityRepository, Repository } from 'typeorm';

import UserEntity from '../user/user.entity';

@EntityRepository(UserEntity)
export default class UserRepository extends Repository<UserEntity> {
  async findByEmail(email: string): Promise<UserEntity> {
    const qb = this.createQueryBuilder('users').where('users.email = :email', {
      email,
    });
    return qb.getOne();
  }

  async findByEmailWithPermissions(email: string): Promise<UserEntity> {
    const qb = this.createQueryBuilder('users')
      .leftJoin('users.role', 'role')
      .leftJoin('role.permissions', 'permission')
      .leftJoin('permission.service', 'service')
      .where('users.email = :email', { email })
      .select([
        'users',
        'role.id',
        'role.name',
        'service.id',
        'service.name',
        'service.isActive',
        'permission.id',
        'permission.type',
      ]);

    return qb.getOne();
  }

  async countUserOccurrence(email: string): Promise<number> {
    const qb = this.createQueryBuilder('users').where('users.email = :email', {
      email,
    });
    return qb.getCount();
  }
}
