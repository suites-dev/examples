import { Injectable } from '@nestjs/common';
import { User } from './types';

@Injectable()
export class UserRepository {
  async getUserById(id: number): Promise<User> {
    // Imagine this fetches from a database
    return { id, name: 'John Doe', email: 'john@doe.com' };
  }
}