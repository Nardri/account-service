import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

import { closeAppAndDropDB, createAndMigrateApp } from './mocksAndUtils';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createAndMigrateApp();
  });

  afterEach(async () => {
    await closeAppAndDropDB(app);
  });

  it('/ (GET)', async (done) => {
    await request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(res => {
        expect(res.body).toStrictEqual({ status: 'ok' });
      });
    done();
  });
});
