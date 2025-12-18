import { Injectable } from '@nestjs/common';
import { CreateUserDto, UserValidationResult } from './types';

@Injectable()
export class UserValidator {
  validate(dto: CreateUserDto): UserValidationResult {
    const errors: string[] = [];

    if (!dto.email || !dto.email.includes('@')) {
      errors.push('Invalid email format');
    }

    if (!dto.name || dto.name.length < 2) {
      errors.push('Name must be at least 2 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}


