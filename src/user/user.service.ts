import { ConflictException, Injectable } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import normalizeEmail from '../utils/normalizeEmail';
import UserRepository from './user.repository';

@Injectable()
export default class UserService {
  constructor(private readonly userRepository: UserRepository) {
  }

  async findAll(): Promise<UserDTO[]> {
    return this.userRepository.find();
  }

  async signUp(userPayload: UserDTO): Promise<UserDTO> {
    const normalizedEmail = normalizeEmail(userPayload.email);

    const userFound = await this.userRepository
      .countUserOccurrence(normalizedEmail, userPayload.username);

    if (userFound) {
      throw new ConflictException('The Email/Username already exists');
    }

    return this.userRepository.save(userPayload);
  }
}
