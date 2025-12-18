import { User as PrismaUser } from '@prisma/client';

export interface User extends PrismaUser {}

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
  save(user: CreateUserDto & { id?: number; isActive: boolean }): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}


