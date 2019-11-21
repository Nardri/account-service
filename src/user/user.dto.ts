import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsBoolean } from 'class-validator';

import ProfileEntity from '../profile/profile.entity';

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
