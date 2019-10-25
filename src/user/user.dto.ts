import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsBoolean } from 'class-validator';

class NewUserDTO implements Readonly<NewUserDTO> {
  @ApiModelProperty()
  @IsString()
  username: string;

  @ApiModelProperty({ required: true })
  @IsString()
  email: string;

  @ApiModelProperty({ required: true })
  @IsString()
  password: string;
}

class UserDTO extends NewUserDTO implements Readonly<UserDTO> {
  @IsString()
  id: string;

  @IsBoolean()
  isActive: boolean;
}

export { UserDTO, NewUserDTO };
