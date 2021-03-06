import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import AuthController from '../auth.controller';
import AuthService from '../auth.service';
import UserRepository from '../../user/user.repository';
import UserService from '../../user/user.service';
import {
  configServiceMsgMock,
  jwtServiceMock,
  repositoryMockFactory,
  rmqMock,
} from '../../../e2e/mocksAndUtils';
import { UserDTO } from '../../user/user.dto';
import ProfileRepository from '../../profile/profile.repository';
import AuthSchemas from '../auth.validation';
import ConfigService from '../../config/config.service';

describe('Auth Controller', () => {
  let controller: AuthController;
  let authService: AuthService;
  let configService: ConfigService;
  let expected: any;
  let userLoginPayload: UserDTO;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UserService,
        AuthSchemas,
        {
          provide: ConfigService,
          useValue: configServiceMsgMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        {
          provide: getRepositoryToken(UserRepository),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(ProfileRepository),
          useFactory: repositoryMockFactory,
        },
        {
          provide: 'RMQ_SERVICE',
          useValue: rmqMock,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);

    userLoginPayload = new UserDTO();
    userLoginPayload.email = 'example@test.com';
    userLoginPayload.password = 'Example12';

    expected = {
      data: {
        email: 'test@example.com',
        accessToken: 'JWT-TOKEN',
      },
    };
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an access token and email on sign up with correct details', async done => {
    jest.spyOn(authService, 'signUp').mockResolvedValue(expected);
    await controller.signUp(userLoginPayload).then(res => {
      expect(res).toStrictEqual(expected);
      done();
    });
  });

  it('should throw an error on sign up with incorrect details', async done => {
    userLoginPayload.password = 'kkl';
    jest.spyOn(authService, 'signUp').mockResolvedValue(expected);
    await controller
      .signUp(userLoginPayload)
      .then()
      .catch(err => {
        expect(err.status).toStrictEqual(400);
        expect(err.message['message']).toStrictEqual(
          configService.getErrorMsg('USR_04'),
        );
        done();
      });
  });

  it('should return an access token and email on login with correct details', async done => {
    jest.spyOn(authService, 'login').mockResolvedValue(expected);
    await controller.login(userLoginPayload).then(res => {
      expect(res).toStrictEqual(expected);
      done();
    });
  });

  it('should throw an error on login with incorrect details', async done => {
    userLoginPayload.password = 'ool';
    jest.spyOn(authService, 'login').mockResolvedValue(expected);
    await controller
      .login(userLoginPayload)
      .then()
      .catch(err => {
        expect(err.status).toStrictEqual(400);
        expect(err.message['message']).toStrictEqual(
          configService.getErrorMsg('USR_04'),
        );
        done();
      });
  });

  it('should be defined [google authentication route]', () => {
    expect(controller.googleLogin).toBeDefined();
  });

  it('should be defined [google callback route]', () => {
    expect(controller.googleCallBack).toBeDefined();
  });
});
