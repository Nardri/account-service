import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsBoolean } from 'class-validator';

import ProfileEntity from '../profile/profile.entity';
import { ServiceAPIResponse } from '../shared/base/base.interface';
import { TUserEntity } from '../shared/base/base.type';

export class NewUserDTO implements Readonly<NewUserDTO> {
  @ApiModelProperty({ required: true })
  @IsString()
  email: string;

  @ApiModelProperty({ required: true })
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
  @ApiModelProperty({ required: true })
  @IsString()
  role_id: string;

  /* eslint-disable */
  @ApiModelProperty({ required: true })
  @IsString()
  user_id: string;
}

export class UserResponse extends ServiceAPIResponse<TUserEntity | string> {
  data: TUserEntity | string;
}
