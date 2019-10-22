import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { Connection } from 'typeorm';

import AppModule from '../src/app/app.module';
import DatabaseModule from '../src/shared/database/database.module';

export const createAndMigrateApp: () => Promise<INestApplication> = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule, DatabaseModule],
  }).compile();

  let app = moduleFixture.createNestApplication<NestExpressApplication>(new ExpressAdapter());
  app = await app.init();

  const connection = app.get(Connection);
  await connection.dropDatabase();
  await connection.runMigrations();

  return app;
};

export const closeAppAndDropDB: (app) => Promise<void> = async (app) => {
  const connection = app.get(Connection);
  await connection.dropDatabase();
  await connection.close();
  await app.close();
};
