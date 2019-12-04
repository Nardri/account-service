import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import UserEntity from '../user/user.entity';
import ProfileEntity, { Gender } from './profile.entity';
import { ServiceAPIResponse } from '../shared/base/base.interface';

// eslint-disable-next-line import/prefer-default-export
export class ProfileDTO implements Readonly<ProfileDTO> {
  @ApiModelProperty({ required: true })
  @IsString()
  username: string;

  @ApiModelProperty({ required: true })
  @IsString()
  firstName: string;

  @ApiModelProperty({ required: true })
  @IsString()
  lastName: string;

  @IsString()
  photoUrl?: string;

  @IsString()
  phone?: string;

  @ApiModelProperty({ required: true })
  @IsString()
  gender: Gender;

  user: UserEntity;
}

export class ProfileResponse extends ServiceAPIResponse<ProfileEntity> {
  data: ProfileEntity;
}
