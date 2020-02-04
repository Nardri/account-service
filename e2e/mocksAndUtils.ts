import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { Connection, Repository } from 'typeorm';

import AppModule from '../src/app/app.module';
import BaseSubscriber from '../src/shared/base/base.subscriber';
import AllExceptionFilter from '../src/shared/filters/exception.filter';
import AppService from '../src/app/app.service';
import { errorCodesObject, messageCodeObject } from '../src/config/config.constants';
import ConfigService from '../src/config/config.service';
import { TObject } from '../src/shared/base/base.type';

export type MockType<T> = {
  [P in keyof T]: jest.Mock<{}>;
};

/*eslint-disable */
// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findByEmail: jest.fn(entity => entity),
    findByEmailWithPermissions: jest.fn(entity => entity),
    countUserOccurrence: jest.fn(entity => entity),
    findProfile: jest.fn(entity => entity),
    find: jest.fn(() => Array()),
    findOneOrFail: jest.fn(entity => entity),
    findOne: jest.fn(entity => entity),
    save: jest.fn(entity => entity),
    update: jest.fn(entity => entity),
    getRoles: jest.fn(entity => entity),
    getServices: jest.fn(entity => entity),
    delete: jest.fn(entity => entity),
    deletePermission: jest.fn(entity => entity),
    checkPermission: jest.fn(entity => entity),
    createPermission: jest.fn(entity => entity),
  }),
);
/* eslint-enable */

export const configServiceMsgMock = {
  getErrorMsg: (key): string => (errorCodesObject[key] ? errorCodesObject[key] : 'Invalid'),
  getMsg: (key): string => (messageCodeObject[key] ? messageCodeObject[key] : 'Invalid'),
};

export const rmqMock = {};

export const createAndMigrateApp: () => Promise<INestApplication> = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
    providers: [
      BaseSubscriber,
      {
        provide: APP_FILTER,
        useClass: AllExceptionFilter,
      },
      {
        provide: ConfigService,
        useValue: configServiceMsgMock,
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
  await connection.synchronize(true);

  return app;
};

export const closeAppAndDropDB: (
  app: INestApplication,
) => Promise<void> = async app => {
  await app.close();
};

export const jwtServiceMock = {
  sign: jest.fn(() => 'JWT-TOKEN'),
};

export const registerTestUser: (app: INestApplication, email: string) => Promise<TObject> = async (app, email) => {
  const res = await request(app.getHttpServer())
    .post('/auth/signup')
    .send({
      email,
      password: 'Password12',
    });

  return res.body.data;
};

export const loginTestUser: (app: INestApplication, email: string) => Promise<TObject> = async (app, email) => {
  const res = await request(app.getHttpServer())
    .post('/auth/login')
    .send({
      email,
      password: 'Password12',
    });

  return res.body.data;
};
