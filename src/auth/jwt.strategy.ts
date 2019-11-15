import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import ConfigService from '../config/config.service';

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
  constructor(private readonly configService: ConfigService) {
    super(configService.getJwtStrategyOptions());
  }

  async validate(payload: IJWTToken): Promise<IJWTToken> {
    return { id: payload.id, email: payload.email };
  }
}
