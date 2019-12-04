import { Injectable } from '@nestjs/common';

import ProfileRepository from './profile.repository';
import { ProfileResponse } from './profile.dto';
import ProfileEntity from './profile.entity';

@Injectable()
export default class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  /**
   * access control Response method
   */
  private static profileResponse(
    data: ProfileEntity | string,
  ): ProfileResponse {
    return {
      data,
    } as ProfileResponse;
  }

  async getProfile(id: string): Promise<ProfileResponse> {
    const profile = await this.profileRepository.findProfile(id);
    return ProfileService.profileResponse(profile);
  }
}
