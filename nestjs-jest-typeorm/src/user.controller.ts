import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto, User } from "./types";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<User> {
    try {
      return await this.userService.createUser(dto);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Internal server error";
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(":email")
  async getUserByEmail(@Param("email") email: string): Promise<User | null> {
    return this.userService.findByEmail(email);
  }
}
