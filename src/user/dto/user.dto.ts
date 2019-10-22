import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, IsBoolean } from 'class-validator';

class UserDTO implements Readonly<UserDTO> {
  @ApiModelProperty()
  @IsString()
  username: string;

  @ApiModelProperty({ required: true })
  @IsString()
  email: string;

  @ApiModelProperty({ required: true })
  @IsString()
  password: string;

  @IsBoolean()
  isActive: boolean;
}


export { UserDTO };
