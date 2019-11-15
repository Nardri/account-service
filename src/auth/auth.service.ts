import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { NewUserDTO, UserDTO } from '../user/user.dto';
import UserService from '../user/user.service';
import { AuthResponse } from './auth.dto';

@Injectable()
export default class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  private authResponse(user: UserDTO): AuthResponse {
    const payload = {
      id: user.id,
      email: user.email,
    };

    return {
      data: {
        email: payload.email,
        accessToken: this.jwtService.sign(payload),
      },
    };
  }

  async signUp(userPayload: NewUserDTO): Promise<AuthResponse> {
    const newUser = await this.userService.create(userPayload);
    return this.authResponse(newUser);
  }

  async login(userPayload: NewUserDTO): Promise<AuthResponse> {
    const user = await this.userService.login(userPayload);
    return this.authResponse(user);
  }

  async handlePassportAuth(profile: any): Promise<AuthResponse> {
    const { _json } = profile;
    const data = {
      provider: profile.provider,
      thirdPartyId: profile.id,
      name: _json.name,
      email: _json.email,
      firstName: _json.given_name,
      lastName: _json.family_name,
      picture: _json.picture,
      verified: _json.email_verified,
    };

    const user = await this.userService.handleOauthData(data);
    return this.authResponse(user);
  }
}
