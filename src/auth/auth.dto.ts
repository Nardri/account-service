import { ApiModelProperty } from '@nestjs/swagger';

import { ServiceAPIResponse } from '../shared/base/base.interface';

export class AuthDTO {
  @ApiModelProperty()
  email: string;

  @ApiModelProperty()
  accessToken: string;
}

export class AuthResponse extends ServiceAPIResponse<AuthDTO> {
  data: AuthDTO;
}
