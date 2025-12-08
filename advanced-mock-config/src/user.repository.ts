import { Injectable, Inject } from '@nestjs/common';
import { Database, User, DATABASE_TOKEN } from './types';

@Injectable()
export class UserRepository {
  constructor(@Inject(DATABASE_TOKEN) private database: Database) {}

  async create(user: User): Promise<User> {
    return this.database.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.database.findByEmail(email);
  }

  async exists(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }
}

