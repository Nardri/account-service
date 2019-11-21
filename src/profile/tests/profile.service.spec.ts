import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import ProfileService from '../profile.service';
import ProfileRepository from '../profile.repository';
import { repositoryMockFactory } from '../../../e2e/mocks';
import ProfileEntity from '../profile.entity';

describe('ProfileService', () => {
  let service: ProfileService;
  let profileRepo: ProfileRepository;
  let profileEntity: ProfileEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: getRepositoryToken(ProfileRepository),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    profileRepo = module.get<ProfileRepository>(ProfileRepository);

    profileEntity = new ProfileEntity();
    profileEntity.firstName = 'test';
    profileEntity.lastName = 'user';
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a user profile', async done => {
    jest.spyOn(profileRepo, 'findProfile').mockResolvedValue(profileEntity);

    await service.getProfile('test-id').then(res => {
      expect(res).toBeInstanceOf(Object);
      expect(res).toHaveProperty('firstName');
      expect(res).toHaveProperty('lastName');
      expect(res.firstName).toBe(profileEntity.firstName);
      done();
    });
  });
});
