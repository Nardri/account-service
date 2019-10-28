import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { Connection, Repository } from 'typeorm';

import AppModule from '../src/app/app.module';
import DatabaseModule from '../src/shared/database/database.module';
import BaseSubscriber from '../src/shared/base/base.subscriber';
import AllExceptionFilter from '../src/shared/filters/exception.filter';
import AppService from '../src/app/app.service';
import UserEntity from '../src/user/user.entity';

export type MockType<T> = {
  [P in keyof T]: jest.Mock<{}>;
};

/*eslint-disable */
// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findByEmailOrUsername: jest.fn(entity => entity),
    countUserOccurrence: jest.fn(entity => entity),
    find: jest.fn(() => Array()),
    findOne: jest.fn(() => new UserEntity()),
    save: jest.fn(entity => entity),
  }),
);
/* eslint-enable */

export const createAndMigrateApp: () => Promise<INestApplication> = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule, DatabaseModule],
    providers: [
      BaseSubscriber,
      {
        provide: APP_FILTER,
        useClass: AllExceptionFilter,
      },
      AppService,
    ],
  }).compile();

  let app = moduleFixture.createNestApplication<NestExpressApplication>(
    new ExpressAdapter(),
  );
  app = await app.init();

  const connection = app.get(Connection);
  await connection.dropDatabase();
  await connection.runMigrations();

  return app;
};

export const closeAppAndDropDB: (
  app: INestApplication,
) => Promise<void> = async app => {
  const connection = app.get(Connection);
  await connection.dropDatabase();
  await connection.close();
  await app.close();
};

export const jwtServiceMock = {
  sign: jest.fn(() => 'JWT-TOKEN'),
};
