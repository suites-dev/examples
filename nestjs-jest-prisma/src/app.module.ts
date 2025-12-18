import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserValidator } from './user.validator';
import { DatabaseService } from './database.service';
import { DATABASE_TOKEN } from './types';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    UserValidator,
    DatabaseService,
    {
      provide: DATABASE_TOKEN,
      useExisting: DatabaseService,
    },
  ],
})
export class AppModule {}

