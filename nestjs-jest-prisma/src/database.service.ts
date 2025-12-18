import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { Database as DatabaseInterface, User, CreateUserDto } from "./types";

@Injectable()
export class DatabaseService
  implements DatabaseInterface, OnModuleInit, OnModuleDestroy
{
  private prisma!: PrismaClient;

  async onModuleInit() {
    this.prisma = new PrismaClient();
    await this.prisma.$connect();
  }

  async onModuleDestroy() {
    if (this.prisma) {
      await this.prisma.$disconnect();
    }
  }

  async save(
    user: CreateUserDto & { id?: number; isActive: boolean }
  ): Promise<User> {
    const saved = await this.prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        isActive: user.isActive,
      },
    });
    return {
      id: saved.id,
      email: saved.email,
      name: saved.name,
      isActive: saved.isActive,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      isActive: user.isActive,
    };
  }
}
