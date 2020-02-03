import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean } from 'class-validator';

import ProfileEntity from '../profile/profile.entity';
import { ServiceAPIResponse } from '../shared/base/base.interface';
import { TUserEntity } from '../shared/base/base.type';

export class NewUserDTO implements Readonly<NewUserDTO> {
  @ApiProperty({ required: true })
  @IsString()
  email: string;

  @ApiProperty({ required: true })
  @IsString()
  password?: string;

  @IsBoolean()
  verified: boolean;

  profile?: ProfileEntity;
}

export class UserDTO extends NewUserDTO implements Readonly<UserDTO> {
  @IsString()
  id: string;

  @IsBoolean()
  isActive: boolean;
}

export class AssignRoleDTO implements Readonly<AssignRoleDTO> {
  /* eslint-disable */
  @ApiProperty({ required: true })
  @IsString()
  role_id: string;

  /* eslint-disable */
  @ApiProperty({ required: true })
  @IsString()
  user_id: string;
}

export class UserResponse extends ServiceAPIResponse<TUserEntity | string> {
  data: TUserEntity | string;
}
