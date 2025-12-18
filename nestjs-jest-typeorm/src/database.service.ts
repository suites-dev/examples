import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { DataSource } from "typeorm";
import { UserEntity } from "./user.entity";
import { Database, User } from "./types";

@Injectable()
export class DatabaseService
  implements Database, OnModuleInit, OnModuleDestroy
{
  private dataSource!: DataSource;

  async onModuleInit() {
    this.dataSource = new DataSource({
      type: "better-sqlite3",
      database: ":memory:",
      entities: [UserEntity],
      synchronize: true,
    });
    await this.dataSource.initialize();
  }

  async onModuleDestroy() {
    if (this.dataSource?.isInitialized) {
      await this.dataSource.destroy();
    }
  }

  async save(user: User): Promise<User> {
    const repo = this.dataSource.getRepository(UserEntity);
    const entity = repo.create(user);
    const saved = await repo.save(entity);
    return {
      id: saved.id,
      email: saved.email,
      name: saved.name,
      isActive: saved.isActive,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const repo = this.dataSource.getRepository(UserEntity);
    const entity = await repo.findOne({ where: { email } });
    if (!entity) return null;
    return {
      id: entity.id,
      email: entity.email,
      name: entity.name,
      isActive: entity.isActive,
    };
  }
}
