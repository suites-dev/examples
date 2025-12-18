import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import { Database as DatabaseInterface, User } from "./types";

@Injectable()
export class DatabaseService
  implements DatabaseInterface, OnModuleInit, OnModuleDestroy
{
  private sqlite!: Database.Database;
  private db!: ReturnType<typeof drizzle>;

  async onModuleInit() {
    this.sqlite = new Database(":memory:");
    this.db = drizzle(this.sqlite);

    // Create table
    this.sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        is_active INTEGER NOT NULL DEFAULT 1
      )
    `);
  }

  async onModuleDestroy() {
    if (this.sqlite) {
      this.sqlite.close();
    }
  }

  async save(user: User): Promise<User> {
    this.db
      .insert(users)
      .values({
        id: user.id,
        email: user.email,
        name: user.name,
        isActive: user.isActive,
      })
      .run();

    // Return the user as saved (better-sqlite3 doesn't support returning() in the same way)
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .all();
    return result[0] || null;
  }
}
