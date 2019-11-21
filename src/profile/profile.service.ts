import { Injectable } from '@nestjs/common';

import ProfileRepository from './profile.repository';
import { ProfileDTO } from './profile.dto';

@Injectable()
export default class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async getProfile(id: string): Promise<ProfileDTO> {
    return this.profileRepository.findProfile(id);
  }
}
