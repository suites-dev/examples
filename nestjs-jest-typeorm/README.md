# Suites + NestJS + Jest + TypeORM

Simple user management example demonstrating [Suites](https://suites.dev) with NestJS, Jest, and TypeORM.

## Prerequisites

- Node.js 18 or higher
- pnpm installed globally

## What This Demonstrates

- ✅ **Solitary unit tests** - Test UserService in complete isolation
- ✅ **Sociable unit tests** - Test components together with real validation, mocked I/O
- ✅ **Token injection** - DATABASE_TOKEN as external boundary
- ✅ **Class injection** - UserValidator and UserRepository
- ✅ **TypeORM integration** - Entity-based database access with TypeORM

## Running the Example

```bash
pnpm install
pnpm test
```

All tests should pass, demonstrating both solitary and sociable testing strategies.

## Project Structure

**`src/`** - Application code being tested:

```
src/
├── types.ts              # User types and interfaces
├── user.entity.ts        # TypeORM entity definition
├── user.validator.ts     # Validation logic (no dependencies)
├── user.repository.ts    # Data access (token injection)
└── user.service.ts       # Business logic (class injections)
```

**`tests/`** - Tests demonstrating Suites usage:

```
tests/
├── user.solitary.spec.ts # Solitary unit tests (all dependencies mocked)
└── user.sociable.spec.ts # Sociable unit tests (real collaborators)
```

## Key Patterns

### Solitary Unit Tests

Tests one class in complete isolation. All dependencies are mocked.

```typescript
const { unit, unitRef } = await TestBed.solitary(UserService).compile();
const repository: Mocked<UserRepository> = unitRef.get(UserRepository);
repository.exists.mockResolvedValue(false);
```

### Sociable Unit Tests

Tests multiple classes together with real collaborators. External I/O remains mocked.

```typescript
const { unit, unitRef } = await TestBed.sociable(UserService)
  .expose(UserValidator)
  .expose(UserRepository)
  .compile();
const database: Mocked<Database> = unitRef.get(DATABASE_TOKEN);
```

## TypeORM Integration

This example uses TypeORM for entity-based database access. The entity is defined using decorators:

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ default: true })
  isActive: boolean;
}
```

## Comparing Testing Strategies

**When to use Solitary:**
- Testing component logic in isolation
- Controlling all inputs for predictable results
- Dependencies are slow or complex to set up

**When to use Sociable:**
- Verifying components work together correctly
- Testing interactions between business logic components
- Dependencies are fast

## Related Examples

- [nestjs-jest](../nestjs-jest) - NestJS with Jest (no ORM)
- [nestjs-vitest](../nestjs-vitest) - Same framework with Vitest (faster execution)
- [nestjs-sinon](../nestjs-sinon) - Same framework with Sinon/Mocha

## Learn More

- [Suites Documentation](https://suites.dev)
- [NestJS Integration](https://suites.dev/docs/nestjs)
- [Testing Strategies](https://suites.dev/docs/testing-strategies)
- [TypeORM Documentation](https://typeorm.io)


