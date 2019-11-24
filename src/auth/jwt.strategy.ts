import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import ConfigService from '../config/config.service';
import AuthService from './auth.service';

interface IJWTToken {
  id: string;
  email: string;
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

  async validate(payload: IJWTToken): Promise<IJWTToken> {
    const userData = await this.authService.validateUser(payload.id);
    return { id: userData.id, email: userData.email };
  }
}
