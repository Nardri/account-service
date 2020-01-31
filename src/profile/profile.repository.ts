import { EntityRepository, Repository } from 'typeorm';

import ProfileEntity from './profile.entity';

@EntityRepository(ProfileEntity)
export default class ProfileRepository extends Repository<ProfileEntity> {
  async findProfile(id: string): Promise<ProfileEntity> {
    const qb = this.createQueryBuilder('profile')
      .leftJoin('profile.user', 'user')
      .addSelect([
        'profile',
        'user.id',
        'user.email',
        'user.isActive',
        'user.verified',
      ])
      .where('user.id = :id', { id });
    return qb.getOne();
  }
}
