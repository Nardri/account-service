import { EntityRepository, Repository } from 'typeorm';

import ProfileEntity from './profile.entity';
import { ProfileDTO } from './profile.dto';

@EntityRepository(ProfileEntity)
export default class ProfileRepository extends Repository<ProfileEntity> {
  async findProfile(id: string): Promise<ProfileDTO> {
    const qb = this.createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'user')
      .where('user.id = :id', { id });

    return qb.getOne();
  }
}
