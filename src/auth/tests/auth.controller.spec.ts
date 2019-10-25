import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import AuthController from '../auth.controller';
import AuthService from '../auth.service';
import UserRepository from '../../user/user.repository';
import UserService from '../../user/user.service';
import { jwtServiceMock, repositoryMockFactory } from '../../../test/testUtils';
import { UserDTO } from '../../user/user.dto';

describe('Auth Controller', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UserService,
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        {
          provide: getRepositoryToken(UserRepository),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an access token and email on sign up with correct details', async done => {
    const user = new UserDTO();
    user.password = 'test-Password12';
    user.email = 'test@example.com';

    const expected = {
      data: {
        email: 'test@example.com',
        accessToken: 'JWT-TOKEN',
      },
    };

    jest.spyOn(authService, 'signUp').mockResolvedValue(expected);
    await controller.signUp(user).then(res => {
      expect(res).toStrictEqual(expected);
      done();
    });
  });

  it('should throw an error on sign up with incorrect details', async done => {
    const user = new UserDTO();
    user.password = '';
    user.email = 'test@example.com';

    const expected = {
      data: {
        email: 'test@example.com',
        accessToken: 'JWT-TOKEN',
      },
    };

    jest.spyOn(authService, 'signUp').mockResolvedValue(expected);
    await controller
      .signUp(user)
      .then()
      .catch(err => {
        expect(err.status).toStrictEqual(400);
        expect(err.message['message']).toStrictEqual('Password is incorrect.');
        done();
      });
  });
});
