import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';

import UserEntity from '../user.entity';
import UserRepository from '../user.repository';
import UserService from '../user.service';
import { NewUserDTO } from '../user.dto';
import {
  configServiceMsgMock,
  repositoryMockFactory,
  rmqMock,
} from '../../../e2e/mocksAndUtils';
import { IOAuthProfile } from '../user.interface';
import ProfileRepository from '../../profile/profile.repository';
import ConfigService from '../../config/config.service';
import UserSchemas from '../user.validation';

describe('UserService', () => {
  let service: UserService;
  let configService: ConfigService;
  let userRepo: UserRepository;
  let userLoginPayload: NewUserDTO;
  let userSignUpPayload: NewUserDTO;
  let userEntity: UserEntity;
  let oauthData: IOAuthProfile;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        UserSchemas,
        {
          provide: ConfigService,
          useValue: configServiceMsgMock,
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

    service = module.get<UserService>(UserService);
    configService = module.get<ConfigService>(ConfigService);
    userRepo = module.get<UserRepository>(UserRepository);

    userLoginPayload = new NewUserDTO();
    userLoginPayload.email = 'example@test.com';
    userLoginPayload.password = 'Example12';

    userSignUpPayload = new NewUserDTO();
    userSignUpPayload.email = 'example@test.com';
    userSignUpPayload.password = 'example';

    userEntity = new UserEntity();
    userEntity.id = '-lhd-sjs';
    userEntity.email = 'example@test.com';
    userEntity.password = 'Example12';
    userEntity.isActive = true;

    oauthData = {
      email: userEntity.email,
      verified: true,
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of users', async () => {
    expect(await service.findAll()).toStrictEqual([]);
  });

  it('should create a user', async done => {
    jest.spyOn(userRepo, 'countUserOccurrence').mockResolvedValue(0);
    jest.spyOn(userRepo, 'findByEmail').mockResolvedValue(userEntity);
    await service.create(userSignUpPayload).then(res => {
      expect(res).toBeInstanceOf(Object);
      expect(res).toHaveProperty('email');
      expect(res).toHaveProperty('password');
      expect(res.email).toBe(userSignUpPayload.email);
      done();
    });
  });

  it('should throw an error if the user already exists', async done => {
    jest.spyOn(userRepo, 'countUserOccurrence').mockResolvedValue(1);
    await service
      .create(userSignUpPayload)
      .then()
      .catch(err => {
        expect(err).toBeInstanceOf(Error);
        expect(err.status).toBe(409);
        expect(err.message.message).toBe(configService.getErrorMsg('USR_03'));
        done();
      });
  });

  it('should return a user entity for the auth service login.', async done => {
    jest.spyOn(userRepo, 'findByEmail').mockResolvedValue(userEntity);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    await service.login(userLoginPayload).then(res => {
      expect(res).toBeInstanceOf(Object);
      expect(res.email).toBe(userEntity.email);
      expect(res.id).toBe(userEntity.id);
      done();
    });
  });

  it('should throw an error if user doesn\'t exit.', async done => {
    jest.spyOn(userRepo, 'findByEmail').mockResolvedValue(undefined);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    await service
      .login(userLoginPayload)
      .then()
      .catch(err => {
        expect(err).toBeInstanceOf(Error);
        expect(err.status).toBe(401);
        expect(err.message.message).toBe(configService.getErrorMsg('USR_05'));
        done();
      });
  });

  it('should throw an error if password is incorrect.', async done => {
    jest.spyOn(userRepo, 'findByEmail').mockResolvedValue(userEntity);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
    await service
      .login(userLoginPayload)
      .then()
      .catch(err => {
        expect(err).toBeInstanceOf(Error);
        expect(err.status).toBe(401);
        expect(err.message.message).toBe(configService.getErrorMsg('USR_01'));
        done();
      });
  });

  it('should throw an error if password field is empty when fetched from database.', async done => {
    userEntity.password = null;
    jest.spyOn(userRepo, 'findByEmail').mockResolvedValue(userEntity);
    await service
      .login(userLoginPayload)
      .then()
      .catch(err => {
        expect(err).toBeInstanceOf(Error);
        expect(err.status).toBe(401);
        expect(err.message.message).toBe(configService.getErrorMsg('USR_01'));
        done();
      });
  });

  it('should throw an error if user is inactive.', async done => {
    userEntity.isActive = false;

    jest.spyOn(userRepo, 'findByEmail').mockResolvedValue(userEntity);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    await service
      .login(userLoginPayload)
      .then()
      .catch(err => {
        expect(err).toBeInstanceOf(Error);
        expect(err.status).toBe(401);
        expect(err.message.message).toBe(configService.getErrorMsg('USR_06'));
        done();
      });
  });

  it('should return Oauth user data if user already exists', async done => {
    jest.spyOn(userRepo, 'findByEmail').mockResolvedValue(userEntity);
    await service.handleOauthData(oauthData).then(res => {
      expect(res).toBeInstanceOf(Object);
      expect(res.email).toBe(userEntity.email);
      expect(res.id).toBe(userEntity.id);
      done();
    });
  });

  it('should return create and return a user data if Oauth user is not registered', async done => {
    jest.spyOn(userRepo, 'findByEmail').mockResolvedValue(null);
    await service.handleOauthData(oauthData).then(res => {
      expect(res).toBeInstanceOf(Object);
      expect(res.email).toBe(userEntity.email);
      expect(res.verified).toBe(oauthData.verified);
      done();
    });
  });
});
