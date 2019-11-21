import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import AppController from './app.controller';
import AppService from './app.service';
import AllExceptionFilter from '../shared/filters/exception.filter';
import BaseSubscriber from '../shared/base/base.subscriber';
import DatabaseModule from '../shared/database/database.module';
import AuthModule from '../auth/auth.module';
import ProfileModule from '../profile/profile.module';

@Module({
  imports: [DatabaseModule, AuthModule, ProfileModule],
  controllers: [AppController],
  providers: [
    BaseSubscriber,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    AppService,
  ],
})
export default class AppModule {}
