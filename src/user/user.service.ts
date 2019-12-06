import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import ConfigService from '../config/config.service';
import ProfileEntity from '../profile/profile.entity';
import ProfileRepository from '../profile/profile.repository';
import { TUserEntity } from '../shared/base/base.type';
import normalizeEmail from '../shared/normalizeEmail';
import { NewUserDTO, UserResponse } from './user.dto';
import UserEntity from './user.entity';
import { IOAuthProfile } from './user.interface';
import UserRepository from './user.repository';

@Injectable()
export default class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly configService: ConfigService,
  ) {}

  private static userResponse(data: TUserEntity | string): UserResponse {
    return {
      data,
    } as UserResponse;
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findUser(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new UnauthorizedException(
        this.configService.getErrorMsg('AUTH_01'),
      );
    }
    return user;
  }

  async login(userPayload: NewUserDTO): Promise<UserEntity> {
    const normalizedEmail = normalizeEmail(userPayload.email);
    const user = await this.userRepository.findByEmail(normalizedEmail);
    if (!user) {
      throw new UnauthorizedException(this.configService.getErrorMsg('USR_05'));
    }

    if (!user.password) {
      throw new UnauthorizedException(this.configService.getErrorMsg('USR_01'));
    }

    const match = await bcrypt.compare(userPayload.password, user.password);

    if (!match) {
      throw new UnauthorizedException(this.configService.getErrorMsg('USR_01'));
    }

    if (!user.isActive) {
      throw new UnauthorizedException(this.configService.getErrorMsg('USR_06'));
    }

    return user;
  }

  async create(userPayload: NewUserDTO): Promise<UserEntity> {
    const normalizedEmail = normalizeEmail(userPayload.email);

    const userFound = await this.userRepository.countUserOccurrence(
      normalizedEmail,
    );

    if (userFound) {
      throw new ConflictException(this.configService.getErrorMsg('USR_03'));
    }

    const salt = await bcrypt.genSalt(10);
    const newUser: NewUserDTO = {
      ...userPayload,
      password: await bcrypt.hash(userPayload.password, salt),
    };

    const newProfile = new ProfileEntity();
    newUser.profile = await this.profileRepository.save(newProfile);
    const savedUser = await this.userRepository.save(newUser);
    return this.userRepository.findByEmail(savedUser.email);
  }

  async handleOauthData(data: IOAuthProfile): Promise<UserEntity> {
    const user = await this.userRepository.findByEmail(data.email);
    const newUser: NewUserDTO = {
      email: data.email,
      verified: data.verified,
    };

    if (!user) {
      const newProfile = new ProfileEntity();
      newProfile.firstName = data.firstName;
      newProfile.lastName = data.lastName;
      newProfile.photoUrl = data.picture;
      newProfile.username = data.name;
      newUser.profile = await this.profileRepository.save(newProfile);
      return this.userRepository.save(newUser);
    }

    return user;
  }
}
