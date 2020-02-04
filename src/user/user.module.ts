import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClientsModule } from '@nestjs/microservices';

import UserController from './user.controller';
import UserService from './user.service';
import UserRepository from './user.repository';
import UserEntity from './user.entity';
import ProfileRepository from '../profile/profile.repository';
import UserSchemas from './user.validation';
import rabbitMqClientOptions from '../config/rabbitMq-client.options';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserRepository, ProfileRepository]),
    ClientsModule.register([
      {
        name: 'RMQ_SERVICE',
        ...rabbitMqClientOptions,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserSchemas,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
  exports: [UserService, TypeOrmModule],
})
export default class UserModule {}
