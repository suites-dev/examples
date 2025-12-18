# Suites + NestJS + Jest + Prisma

Simple user management example demonstrating [Suites](https://suites.dev) with NestJS, Jest, and Prisma ORM.

## Prerequisites

- Node.js 18 or higher
- pnpm installed globally

## What This Demonstrates

- ✅ **Solitary unit tests** - Test UserService in complete isolation
- ✅ **Sociable unit tests** - Test components together with real validation, mocked I/O
- ✅ **Token injection** - DATABASE_TOKEN as external boundary
- ✅ **Class injection** - UserValidator and UserRepository
- ✅ **Prisma ORM integration** - Type-safe database access with Prisma Client

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
├── user.validator.ts     # Validation logic (no dependencies)
├── user.repository.ts    # Data access (token injection)
└── user.service.ts       # Business logic (class injections)
```

**`prisma/`** - Prisma schema:

```
prisma/
└── schema.prisma         # Database schema definition
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

## Prisma ORM Integration

This example uses Prisma ORM for type-safe database access. The schema is defined in `prisma/schema.prisma`:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  isActive  Boolean  @default(true)
}
```

Types are generated from the schema using Prisma Client:

```typescript
import { User as PrismaUser } from '@prisma/client';
export interface User extends PrismaUser {}
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
- [Prisma Documentation](https://www.prisma.io/docs)


