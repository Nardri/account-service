import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import AppController from './app.controller';
import AppService from './app.service';
import UserModule from '../user/user.module';
import AllExceptionFilter from '../filters/exception.filter';
import { BaseSubscriber } from './base.subscriber';
import DatabaseModule from '../shared/database/database.module';

@Module({
  imports: [
    UserModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [
    BaseSubscriber,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    AppService],
})
export default class AppModule {
}
