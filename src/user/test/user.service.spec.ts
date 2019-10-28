import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import UserEntity from '../user.entity';
import UserRepository from '../user.repository';
import UserService from '../user.service';
import { NewUserDTO } from '../user.dto';
import { repositoryMockFactory } from '../../../e2e/mocks';
import constants from '../../config/config.constants';

describe('UserService', () => {
  let service: UserService;
  let userRepo: UserRepository;
  let userLoginPayload: NewUserDTO;
  let userSignUpPayload: NewUserDTO;
  let userEntity: UserEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        UserService,
        {
          provide: getRepositoryToken(UserRepository),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepo = module.get<UserRepository>(UserRepository);

    userLoginPayload = new NewUserDTO();
    userLoginPayload.email = 'example@test.com';
    userLoginPayload.password = 'Example12';

    userSignUpPayload = new NewUserDTO();
    userSignUpPayload.email = 'example@test.com';
    userSignUpPayload.username = 'exampleUser';
    userSignUpPayload.password = 'example';

    userEntity = new UserEntity();
    userEntity.id = '-lhd-sjs';
    userEntity.email = 'example@test.com';
    userEntity.password = 'Example12';
    userEntity.isActive = true;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of users', async () => {
    expect(await service.findAll()).toStrictEqual([]);
  });

  it('should return a user', async () => {
    expect(await service.findOne('-lidjndijw')).toStrictEqual(new UserEntity());
  });

  it('should return create a user', async done => {
    jest.spyOn(userRepo, 'countUserOccurrence').mockResolvedValue(0);

    await service.create(userSignUpPayload).then(res => {
      expect(res).toBeInstanceOf(Object);
      expect(res).toHaveProperty('email');
      expect(res).toHaveProperty('password');
      expect(res).toHaveProperty('username');
      expect(res.email).toBe(userSignUpPayload.email);
      expect(res.username).toBe(userSignUpPayload.username);
      done();
    });
  });

  it('should return create an error if the user already exists', async done => {
    jest.spyOn(userRepo, 'countUserOccurrence').mockResolvedValue(1);
    await service
      .create(userSignUpPayload)
      .then()
      .catch(err => {
        expect(err).toBeInstanceOf(Error);
        expect(err.status).toBe(409);
        expect(err.message.message).toBe(constants.getErrorMsg('USR_03'));
        done();
      });
  });

  it('should return a user entity for the auth service.', async done => {
    jest.spyOn(userRepo, 'findByEmailOrUsername').mockResolvedValue(userEntity);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    await service.login(userLoginPayload).then(res => {
      expect(res).toBeInstanceOf(Object);
      expect(res.email).toBe(userEntity.email);
      expect(res.id).toBe(userEntity.id);
      done();
    });
  });

  it('should throw an error if user doesn\'t exit.', async done => {
    jest.spyOn(userRepo, 'findByEmailOrUsername').mockResolvedValue(undefined);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    await service
      .login(userLoginPayload)
      .then()
      .catch(err => {
        expect(err).toBeInstanceOf(Error);
        expect(err.status).toBe(401);
        expect(err.message.message).toBe(constants.getErrorMsg('USR_05'));
        done();
      });
  });

  it('should throw an error if password is incorrect.', async done => {
    jest.spyOn(userRepo, 'findByEmailOrUsername').mockResolvedValue(userEntity);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    await service
      .login(userLoginPayload)
      .then()
      .catch(err => {
        expect(err).toBeInstanceOf(Error);
        expect(err.status).toBe(400);
        expect(err.message.message).toBe(constants.getErrorMsg('USR_01'));
        done();
      });
  });

  it('should throw an error if user is inactive.', async done => {
    userEntity.isActive = false;

    jest.spyOn(userRepo, 'findByEmailOrUsername').mockResolvedValue(userEntity);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    await service
      .login(userLoginPayload)
      .then()
      .catch(err => {
        expect(err).toBeInstanceOf(Error);
        expect(err.status).toBe(400);
        expect(err.message.message).toBe(constants.getErrorMsg('USR_06'));
        done();
      });
  });
});
