import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import UserEntity from '../user/user.entity';
import ProfileEntity, { Gender } from './profile.entity';
import { ServiceAPIResponse } from '../shared/base/base.interface';

// eslint-disable-next-line import/prefer-default-export
export class ProfileDTO implements Readonly<ProfileDTO> {
  @ApiProperty({ required: true })
  @IsString()
  username: string;

  @ApiProperty({ required: true })
  @IsString()
  firstName: string;

  @ApiProperty({ required: true })
  @IsString()
  lastName: string;

  @IsString()
  photoUrl?: string;

  @IsString()
  phone?: string;

  @ApiProperty({ required: true })
  @IsString()
  gender: Gender;

  user: UserEntity;
}

export class ProfileResponse extends ServiceAPIResponse<ProfileEntity> {
  data: ProfileEntity;
}
