import { ApiModelProperty } from '@nestjs/swagger';

import { ServiceAPIResponse } from '../shared/base/base.interface';

class AuthDTO {
  @ApiModelProperty()
  email: string;

  @ApiModelProperty()
  accessToken: string;
}

class AuthResponse extends ServiceAPIResponse<AuthDTO> {
  data: AuthDTO;
}

export { AuthResponse, AuthDTO };
