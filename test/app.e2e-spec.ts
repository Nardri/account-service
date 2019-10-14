import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

import { closeAppAndDropDB, createAndMigrateApp } from './testUtils';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createAndMigrateApp();
  });

  afterAll(async () => {
    await closeAppAndDropDB(app);
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({
        status: 'ok'
      });
  });
});

