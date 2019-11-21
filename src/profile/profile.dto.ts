import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import UserEntity from '../user/user.entity';
import { Gender } from './profile.entity';

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
