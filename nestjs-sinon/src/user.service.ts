import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserValidator } from './user.validator';
import { CreateUserDto, User } from './types';

@Injectable()
export class UserService {
  constructor(
    private repository: UserRepository,
    private validator: UserValidator
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const validation = this.validator.validate(dto);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const exists = await this.repository.exists(dto.email);
    if (exists) {
      throw new Error('User with this email already exists');
    }

    const newUser: User = {
      id: Date.now(),
      email: dto.email,
      name: dto.name,
      isActive: true
    };

    return this.repository.create(newUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findByEmail(email);
  }
}
