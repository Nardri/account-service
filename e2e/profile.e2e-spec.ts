import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'typeorm';

import { closeAppAndDropDB, createAndMigrateApp, loginTestUser, registerTestUser } from './mocksAndUtils';
import loadFixtures from './fixtures/loader';
import ConfigService from '../src/config/config.service';

describe('ProfileController (e2e)', () => {
  let app: INestApplication;
  let configService: ConfigService;
  let newUser: any;
  let user: any;

  beforeEach(async () => {
    app = await createAndMigrateApp();
    const connection = app.get(Connection);
    await loadFixtures('profiles', connection);
    await loadFixtures('users', connection);

    configService = app.get<ConfigService>(ConfigService);
    newUser = await registerTestUser(app, 'testuser@gmail.com');
  });

  afterEach(async () => {
    await closeAppAndDropDB(app);
  });

  it('/profile (GET) - Succeeds', async (done) => {
    await request(app.getHttpServer())
      .get('/profile')
      .set('Authorization', `Bearer ${newUser['accessToken']}`)
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toBeInstanceOf(Object);
        expect(res.body.data['id']).toBeDefined();
        expect(res.body.data['gender']).toStrictEqual(0);
        expect(res.body.data['firstName']).toBeNull();
        done();
      });
  });

  it('/profile (GET) - Succeeds with firstName and lastName defined', async (done) => {
    user = await loginTestUser(app, 'test-first@example.com');

    await request(app.getHttpServer())
      .get('/profile')
      .set('Authorization', `Bearer ${user['accessToken']}`)
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toBeInstanceOf(Object);
        expect(res.body.data['id']).toBeDefined();
        expect(res.body.data['gender']).toStrictEqual(1);
        expect(res.body.data['firstName']).toBeDefined();
        expect(res.body.data['lastName']).toBeDefined();
        done();
      });
  });

  it('/profile (GET) - Fails without accessToken', async (done) => {
    await request(app.getHttpServer())
      .get('/profile')
      .expect(401)
      .expect(res => {
        expect(res.body).toHaveProperty('statusCode');
        expect(res.body).toHaveProperty('path');
        expect(res.body).toHaveProperty('timestamp');
        expect(res.body['path']).toBe('/profile');
        done();
      });
  });
});
