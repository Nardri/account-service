import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'typeorm';

import { closeAppAndDropDB, createAndMigrateApp, loginTestUser, registerTestUser, createRole, createService } from './mocksAndUtils';
import loadFixtures from './fixtures/loader';
import ConfigService from '../src/config/config.service';
import { TObject } from '../src/shared/base/base.type';
import { PermissionEnum } from '../src/access-control/permissions.entity';

describe('AccessControlController (e2e)', () => {
  let app: INestApplication;
  let configService: ConfigService;
  let newUser: any;
  let role: TObject;
  let service: TObject;
  let data: TObject;

  let TEST_SERVICE = 'TEST_SERVICE';
  let TEST_ROLE = 'accessControl';
  let UPDATE_TEST_ROLE = 'updatedRole';
  let UPDATE_TEST_SERVICE = 'UPDATE_TEST_SERVICE';

  beforeEach(async () => {
    app = await createAndMigrateApp();
    const connection = app.get(Connection);
    await loadFixtures('profiles', connection);
    await loadFixtures('users', connection);
    await loadFixtures('roles', connection);
    await loadFixtures('services', connection);
    await loadFixtures('permissions', connection);

    configService = app.get<ConfigService>(ConfigService);
    newUser = await registerTestUser(app, 'testuser@gmail.com');
    role = await createRole(app, TEST_ROLE);
    service = await createService(app, TEST_SERVICE);

    data = {
      name: 'admin',
    };
  });

  afterEach(async () => {
    await closeAppAndDropDB(app);
  });

  describe('Role (e2e)', () => {

    it('/management/role (POST) - Succeeds', async (done) => {
      await request(app.getHttpServer())
        .post('/management/role')
        .set('Accept', 'application/json')
        .send(data)
        .expect(201)
        .expect(res => {
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toBeInstanceOf(Object);
          expect(res.body.data['id']).toBeDefined();
          expect(res.body.data['name']).toBe(data.name);
          done();
        });
    });

    it('/management/role (POST) - Fails with empty name.', async (done) => {
      data.name = '';
      await request(app.getHttpServer())
        .post('/management/role')
        .set('Accept', 'application/json')
        .send(data)
        .expect(400)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty('statusCode');
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('path');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body['message']).toBe(configService.getErrorMsg('USR_13'));
          done();
        });
    });

    it('/management/role (POST) - Fails with no data provided.', async (done) => {
      await request(app.getHttpServer())
        .post('/management/role')
        .set('Accept', 'application/json')
        .send({})
        .expect(400)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty('statusCode');
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('path');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body['message']).toBe(configService.getErrorMsg('USR_17'));
          done();
        });
    });

    it('/management/role (POST) - Fails with spaces.', async (done) => {
      data.name = 'no space';
      await request(app.getHttpServer())
        .post('/management/role')
        .set('Accept', 'application/json')
        .send(data)
        .expect(400)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty('statusCode');
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('path');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body['message']).toBe(configService.getErrorMsg('USR_10'));
          done();
        });
    });

    it('/management/role (POST) - Fails with already existing role.', async (done) => {
      data.name = 'test-admin';
      await request(app.getHttpServer())
        .post('/management/role')
        .set('Accept', 'application/json')
        .send(data)
        .expect(409)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty('statusCode');
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('path');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body['message']).toBe(configService.getErrorMsg('USR_09'));
          done();
        });
    });

    it('/management/role/:roleId/permission (POST) - Succeeds assign permission to role and service', async (done) => {
      const url = `/management/role/${role['id']}/permission`;
      await request(app.getHttpServer())
        .post(url)
        .set('Accept', 'application/json')
        .send({
          type: PermissionEnum.ALL,
          service_id: service['id'],
        })
        .expect(201)
        .expect(res => {
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toBeInstanceOf(Object);
          expect(res.body.data['id']).toBeDefined();
          expect(res.body.data['type']).toBe(PermissionEnum.ALL);
          expect(res.body.data['role']['name']).toBe(TEST_ROLE.toLocaleLowerCase());
          expect(res.body.data['service']['name']).toBe(TEST_SERVICE);
          done();
        });
    });

    it('/management/role/:roleId/permission/:permissionId (DELETE) - Succeeds delete a permission from a role', async (done) => {
      const url = `/management/role/${role['id']}/permission`;
      let permissionId: any;
      const res = await request(app.getHttpServer())
        .post(url)
        .set('Accept', 'application/json')
        .send({
          type: PermissionEnum.ALL,
          service_id: service['id'],
        });

      permissionId = res.body.data['id'];

      const url2 = `/management/role/${role['id']}/permission/${permissionId}`;
      await request(app.getHttpServer())
        .delete(url2)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toBe(configService.getMsg('USR_MSG_01'));
          done();
        });
    });

    it('/management/role/:roleId/permission (POST) - Fails with unknown service id', async (done) => {
      const url = `/management/role/${role['id']}/permission`;
      await request(app.getHttpServer())
        .post(url)
        .set('Accept', 'application/json')
        .send({
          type: PermissionEnum.ALL,
          service_id: '-LuU7ns_LWBQoT8jIka8',
        })
        .expect(404)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty('statusCode');
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('path');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body['message']).toBe(configService.getErrorMsg('USR_12'));
          done();
        });
    });

    it('/management/role/:roleId/permission (POST) - Fails with unknown role id', async (done) => {
      const url = '/management/role/-LuU7ns_LWBQoTksjIw2/permission';
      await request(app.getHttpServer())
        .post(url)
        .set('Accept', 'application/json')
        .send({
          type: PermissionEnum.ALL,
          service_id: service['id'],
        })
        .expect(404)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty('statusCode');
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('path');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body['message']).toBe(configService.getErrorMsg('USR_12'));
          done();
        });
    });

    it('/management/role (GET) - Succeeds', async (done) => {
      await request(app.getHttpServer())
        .get('/management/role')
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toBeInstanceOf(Array);
          expect(res.body.data.permissions).toBeUndefined();
          expect(res.body.data.length).toBe(3);
          done();
        });
    });

    it('/management/role (GET) - Succeeds including permissions', async (done) => {
      await request(app.getHttpServer())
        .get('/management/role?include=permission')
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toBeInstanceOf(Array);
          expect(res.body.data.length).toBe(3);
          expect(res.body.data[2].permissions).toBeInstanceOf(Array);
          done();
        });
    });

    it('/management/role/:roleId (GET) - Succeeds', async (done) => {
      await request(app.getHttpServer())
        .get(`/management/role/${role['id']}`)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toBeInstanceOf(Object);
          expect(res.body.data.permissions).toBeUndefined();
          done();
        });
    });

    it('/management/role/:roleId (GET) - Succeeds including permissions', async (done) => {
      await request(app.getHttpServer())
        .get(`/management/role/${role['id']}?include=permission`)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toBeInstanceOf(Object);
          expect(res.body.data.permissions).toBeInstanceOf(Array);
          expect(res.body.data['name']).toBe(TEST_ROLE.toLocaleLowerCase());
          done();
        });
    });

    it('/management/role/:roleId (PATCH) - Succeeds', async (done) => {
      await request(app.getHttpServer())
        .patch(`/management/role/${role['id']}`)
        .set('Accept', 'application/json')
        .send({
          name: UPDATE_TEST_ROLE,
        })
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toBe(configService.getMsg('USR_MSG_02'));
          done();
        });
    });

    it('/management/role/:roleId (DELETE) - Succeeds', async (done) => {
      await request(app.getHttpServer())
        .delete(`/management/role/${role['id']}`)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toBe(configService.getMsg('USR_MSG_01'));
          done();
        });
    });

  });

  describe('Service (e2e)', () => {

    it('/management/service (POST) - Succeeds', async (done) => {
      data.name = 'TEST_SERVICE_II';
      await request(app.getHttpServer())
        .post('/management/service')
        .set('Accept', 'application/json')
        .send(data)
        .expect(201)
        .expect(res => {
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toBeInstanceOf(Object);
          expect(res.body.data['id']).toBeDefined();
          expect(res.body.data['name']).toBe(data.name);
          done();
        });
    });

    it('/management/service (POST) - Fails with empty name.', async (done) => {
      data.name = '';
      await request(app.getHttpServer())
        .post('/management/service')
        .set('Accept', 'application/json')
        .send(data)
        .expect(400)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty('statusCode');
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('path');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body['message']).toBe(configService.getErrorMsg('USR_13'));
          done();
        });
    });

    it('/management/service (POST) - Fails with no data provided.', async (done) => {
      await request(app.getHttpServer())
        .post('/management/service')
        .set('Accept', 'application/json')
        .send({})
        .expect(400)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty('statusCode');
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('path');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body['message']).toBe(configService.getErrorMsg('USR_17'));
          done();
        });
    });

    it('/management/service (POST) - Fails with already existing service.', async (done) => {
      data.name = TEST_SERVICE;
      await request(app.getHttpServer())
        .post('/management/service')
        .set('Accept', 'application/json')
        .send(data)
        .expect(409)
        .expect(res => {
          expect(res.body).toBeInstanceOf(Object);
          expect(res.body).toHaveProperty('statusCode');
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('path');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body['message']).toBe(configService.getErrorMsg('USR_09'));
          done();
        });
    });

    it('/management/service (GET) - Succeeds', async (done) => {
      await request(app.getHttpServer())
        .get('/management/service')
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toBeInstanceOf(Array);
          expect(res.body.data.permissions).toBeUndefined();
          expect(res.body.data.length).toBe(3);
          done();
        });
    });

    it('/management/service (GET) - Succeeds including permissions', async (done) => {
      await request(app.getHttpServer())
        .get('/management/service?include=permission')
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toBeInstanceOf(Array);
          expect(res.body.data.length).toBe(3);
          expect(res.body.data[2].permissions).toBeInstanceOf(Array);
          done();
        });
    });

    it('/management/service/:serviceId (GET) - Succeeds', async (done) => {
      await request(app.getHttpServer())
        .get(`/management/service/${service['id']}`)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toBeInstanceOf(Object);
          expect(res.body.data.permissions).toBeUndefined();
          done();
        });
    });

    it('/management/service/:serviceId (GET) - Succeeds including permissions', async (done) => {
      await request(app.getHttpServer())
        .get(`/management/service/${service['id']}?include=permission`)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toBeInstanceOf(Object);
          expect(res.body.data.permissions).toBeInstanceOf(Array);
          expect(res.body.data['name']).toBe(TEST_SERVICE);
          done();
        });
    });

    it('/management/service/:roleId (PATCH) - Succeeds', async (done) => {
      await request(app.getHttpServer())
        .patch(`/management/service/${service['id']}`)
        .set('Accept', 'application/json')
        .send({
          name: UPDATE_TEST_SERVICE,
          isActive: true,
        })
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toBe(configService.getMsg('USR_MSG_02'));
          done();
        });
    });

    it('/management/service/:roleId (DELETE) - Succeeds', async (done) => {
      await request(app.getHttpServer())
        .delete(`/management/service/${service['id']}`)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toBe(configService.getMsg('USR_MSG_01'));
          done();
        });
    });

  });
});
