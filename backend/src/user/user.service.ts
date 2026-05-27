import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async create(data: { email: string; passwordHash: string; name?: string }): Promise<User> {
    return this.userRepository.create(data);
  }
}
