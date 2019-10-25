import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { NewUserDTO, UserDTO } from './user.dto';
import UserRepository from './user.repository';
import normalizeEmail from '../shared/normalizeEmail';

@Injectable()
export default class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<UserDTO[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<UserDTO> {
    return this.userRepository.findOne({ id });
  }

  async create(userPayload: NewUserDTO): Promise<UserDTO> {
    const normalizedEmail = normalizeEmail(userPayload.email);

    const userFound = await this.userRepository.countUserOccurrence(
      normalizedEmail,
      userPayload.username,
    );

    if (userFound) {
      throw new ConflictException('The Email/Username already exists');
    }

    const newUser: NewUserDTO = {
      ...userPayload,
      password: await bcrypt.hash(userPayload.password, 10),
    };

    return this.userRepository.save(newUser);
  }
}
