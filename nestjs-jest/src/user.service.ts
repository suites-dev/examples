import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserName(id: number): Promise<string> {
    const user = await this.userRepository.getUserById(id);
    return user.name;
  }
}