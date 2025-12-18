import { InferSelectModel } from 'drizzle-orm';
import { users } from './schema';

export type User = InferSelectModel<typeof users>;

export interface CreateUserDto {
  email: string;
  name: string;
}

export interface UserValidationResult {
  isValid: boolean;
  errors: string[];
}

export const DATABASE_TOKEN = 'DATABASE';

export interface Database {
  save(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}

