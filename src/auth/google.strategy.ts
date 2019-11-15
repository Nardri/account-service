import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { OAuth2Strategy } from 'passport-google-oauth';

import ConfigService from '../config/config.service';
import AuthService from './auth.service';

@Injectable()
export default class GoogleStrategy extends PassportStrategy(OAuth2Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super(configService.getGoogleStrategyOptions());
  }

  /* eslint-disable*/
  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ): Promise<void> {
    try {
      const validatedProfile = await this.authService.handlePassportAuth(
        profile,
      );
      done(null, validatedProfile);
    } catch (err) {
      done(err, false);
    }
  }

  /* eslint-enable */
}
