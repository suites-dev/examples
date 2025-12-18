import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { MikroORM } from "@mikro-orm/core";
import { SqliteDriver } from "@mikro-orm/sqlite";
import { UserEntity } from "./user.entity";
import { Database as DatabaseInterface, User } from "./types";

@Injectable()
export class DatabaseService
  implements DatabaseInterface, OnModuleInit, OnModuleDestroy
{
  private orm!: MikroORM<SqliteDriver>;

  async onModuleInit() {
    this.orm = await MikroORM.init<SqliteDriver>({
      driver: SqliteDriver,
      dbName: ":memory:",
      entities: [UserEntity],
      allowGlobalContext: true,
    });
    const generator = this.orm.getSchemaGenerator();
    await generator.createSchema();
  }

  async onModuleDestroy() {
    if (this.orm) {
      await this.orm.close();
    }
  }

  async save(user: User): Promise<User> {
    const em = this.orm.em.fork();
    const entity = em.create(UserEntity, {
      id: user.id,
      email: user.email,
      name: user.name,
      isActive: user.isActive,
    });
    await em.persistAndFlush(entity);
    return {
      id: entity.id,
      email: entity.email,
      name: entity.name,
      isActive: entity.isActive,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const em = this.orm.em.fork();
    const entity = await em.findOne(UserEntity, { email });
    if (!entity) return null;
    return {
      id: entity.id,
      email: entity.email,
      name: entity.name,
      isActive: entity.isActive,
    };
  }
}
