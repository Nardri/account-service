import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import ProfileEntity from './profile.entity';
import ProfileController from './profile.controller';
import ProfileService from './profile.service';
import ProfileRepository from './profile.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProfileEntity, ProfileRepository])],
  controllers: [ProfileController],
  exports: [],
  providers: [ProfileService],
})
export default class ProfileModule {}
