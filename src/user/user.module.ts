import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';

import UserController from './user.controller';
import UserService from './user.service';
import UserRepository from './user.repository';
import UserEntity from './user.entity';
import ProfileRepository from '../profile/profile.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserRepository, ProfileRepository]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
  exports: [UserService, TypeOrmModule],
})
export default class UserModule {}
