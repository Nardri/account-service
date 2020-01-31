import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import ConfigService from '../config/config.service';
import AuthService from './auth.service';

interface IJWTToken {
  userData: {
    id: string;
    email: string;
    role: string;
  };
  iat?: number;
  exp?: number;
  iss?: string;
  sub?: string;
}

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super(configService.getJwtStrategyOptions());
  }

  async validate(payload: IJWTToken): Promise<any> {
    const userData = await this.authService.validateUser(payload.userData.id);
    return { id: userData.id, email: userData.email };
  }
}
