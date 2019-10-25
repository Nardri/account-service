import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import ConfigService from '../../config/config.service';
import ConfigModule from '../../config/config.module';
import DatabaseService from './database.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => configService.getTypeOrmConfig(),
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export default class DatabaseModule {}
