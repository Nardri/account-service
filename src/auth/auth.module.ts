import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import AuthController from './auth.controller';
import AuthService from './auth.service';
import UserModule from '../user/user.module';
import JwtStrategy from './jwt.strategy';
import ConfigService from '../config/config.service';
import GoogleStrategy from './google.strategy';
import AccessControlModule from '../access-control/access-control.module';
import AuthSchemas from './auth.validation';

@Module({
  imports: [
    PassportModule.register({
      property: 'user',
      session: false,
    }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => configService.getJWTConfig(),
      inject: [ConfigService],
    }),
    UserModule,
    AccessControlModule,
  ],
  providers: [AuthService, AuthSchemas, JwtStrategy, GoogleStrategy],
  exports: [UserModule, AccessControlModule],
  controllers: [AuthController],
})
export default class AuthModule {}
