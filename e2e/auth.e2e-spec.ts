import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'typeorm';

import { closeAppAndDropDB, createAndMigrateApp } from './mocksAndUtils';
import loadFixtures from './fixtures/loader';
import ConfigService from '../src/config/config.service';
import { TObject } from '../src/shared/base/base.type';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let configService: ConfigService;
  let data: TObject;

  beforeEach(async () => {
    app = await createAndMigrateApp();
    const connection = app.get(Connection);
    await loadFixtures('profiles', connection);
    await loadFixtures('users', connection);

    configService = app.get<ConfigService>(ConfigService);
    data = {
      email: 'test-user@example.com',
      password: 'TestPassword1234',
    };
  });

  afterEach(async () => {
    await closeAppAndDropDB(app);
  });

  it('/auth/signup (POST) - Succeeds', async (done) => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(data)
      .set('Accept', 'application/json')
      .expect(201)
      .expect(res => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('email');
        expect(res.body.data).toHaveProperty('accessToken');
        expect(res.body.data['email']).toBeTruthy();
        expect(res.body.data['accessToken']).toBeTruthy();
        done();
      });
  });

  it('/auth/signup (POST) - Fails with invalid password', async (done) => {
    data.password = 'TestPasswordUser';
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(data)
      .set('Accept', 'application/json')
      .expect(400)
      .expect(res => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('statusCode');
        expect(res.body).toHaveProperty('message');
        expect(res.body).toHaveProperty('path');
        expect(res.body).toHaveProperty('timestamp');
        expect(res.body['message']).toBe(configService.getErrorMsg('USR_04'));
        done();
      });
  });

  it('/auth/signup (POST) - Fails with invalid email', async (done) => {
    data.email = 'test-userexample.com';
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(data)
      .set('Accept', 'application/json')
      .expect(400)
      .expect(res => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('statusCode');
        expect(res.body).toHaveProperty('message');
        expect(res.body).toHaveProperty('path');
        expect(res.body).toHaveProperty('timestamp');
        expect(res.body['message']).toBe(configService.getErrorMsg('USR_07'));
        done();
      });
  });

  it('/auth/login (POST) - Succeeds', async (done) => {
    data.email = 'test-first@example.com';
    data.password = 'Password12';
    await request(app.getHttpServer())
      .post('/auth/login')
      .send(data)
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('email');
        expect(res.body.data).toHaveProperty('accessToken');
        expect(res.body.data['email']).toBeTruthy();
        expect(res.body.data['accessToken']).toBeTruthy();
        done();
      });
  });

  it('/auth/login (POST) - Fails with unknown email.', async (done) => {
    data.email = 'unknownUser@example.com';
    await request(app.getHttpServer())
      .post('/auth/login')
      .send(data)
      .expect(401)
      .set('Accept', 'application/json')
      .expect(res => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('statusCode');
        expect(res.body).toHaveProperty('message');
        expect(res.body).toHaveProperty('path');
        expect(res.body).toHaveProperty('timestamp');
        expect(res.body['message']).toBe(configService.getErrorMsg('USR_05'));
        done();
      });
  });

  it('/auth/login (POST) - Fails with unknown password.', async (done) => {
    data.password = 'TestPassword123';
    data.email = 'test-first@example.com';

    await request(app.getHttpServer())
      .post('/auth/login')
      .send(data)
      .expect(401)
      .set('Accept', 'application/json')
      .expect(res => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('statusCode');
        expect(res.body).toHaveProperty('message');
        expect(res.body).toHaveProperty('path');
        expect(res.body).toHaveProperty('timestamp');
        expect(res.body['message']).toBe(configService.getErrorMsg('USR_01'));
        done();
      });
  });

  it('/auth/login (POST) - Fails with invalid password', async (done) => {
    data.password = 'TestPasswordUser';
    await request(app.getHttpServer())
      .post('/auth/login')
      .send(data)
      .set('Accept', 'application/json')
      .expect(400)
      .expect(res => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('statusCode');
        expect(res.body).toHaveProperty('message');
        expect(res.body).toHaveProperty('path');
        expect(res.body).toHaveProperty('timestamp');
        expect(res.body['message']).toBe(configService.getErrorMsg('USR_04'));
        done();
      });
  });

  it('/auth/login (POST) - Fails with invalid email', async (done) => {
    data.email = 'test-userexample.com';
    await request(app.getHttpServer())
      .post('/auth/login')
      .send(data)
      .set('Accept', 'application/json')
      .expect(400)
      .expect(res => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('statusCode');
        expect(res.body).toHaveProperty('message');
        expect(res.body).toHaveProperty('path');
        expect(res.body).toHaveProperty('timestamp');
        expect(res.body['message']).toBe(configService.getErrorMsg('USR_07'));
        done();
      });
  });

  it('/auth/login (POST) - Fails when the users haven\'t set password.', async (done) => {
    data.email = 'test-third@example.com';
    await request(app.getHttpServer())
      .post('/auth/login')
      .send(data)
      .set('Accept', 'application/json')
      .expect(401)
      .expect(res => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toHaveProperty('statusCode');
        expect(res.body).toHaveProperty('message');
        expect(res.body).toHaveProperty('path');
        expect(res.body).toHaveProperty('timestamp');
        expect(res.body['message']).toBe(configService.getErrorMsg('USR_01'));
        done();
      });
  });
});
