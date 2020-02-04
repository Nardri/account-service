import { ApiProperty } from '@nestjs/swagger';

import { ServiceAPIResponse } from '../shared/base/base.interface';

export class AuthDTO {
  @ApiProperty()
  email: string;

  @ApiProperty()
  accessToken: string;
}

export class AuthResponse extends ServiceAPIResponse<AuthDTO> {
  data: AuthDTO;
}
