import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { NewUserDTO } from '../user/user.dto';
import UserService from '../user/user.service';
import { AuthResponse } from './auth.dto';

@Injectable()
export default class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async signUp(userPayload: NewUserDTO): Promise<AuthResponse> {
    const newUser = await this.userService.create(userPayload);
    const payload = {
      id: newUser.id,
      email: newUser.email,
    };

    return {
      data: {
        email: payload.email,
        accessToken: this.jwtService.sign(payload),
      },
    };
  }

  async login(userPayload: NewUserDTO): Promise<AuthResponse> {
    const user = await this.userService.login(userPayload);
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
}
