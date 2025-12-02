# Suites + NestJS + Sinon

Simple user management example demonstrating [Suites](https://suites.dev) with NestJS and Sinon.

## Prerequisites

- Node.js 18 or higher
- pnpm installed globally

## About Sinon

Sinon provides test doubles (spies, stubs, mocks) that work with any assertion library:
- Works with Chai, Node's assert, or other assertion libraries
- Does not include built-in assertions like Jest or Vitest
- Used with Mocha as the test runner

Instead of Jest's `.toHaveBeenCalled()`, Sinon provides properties like `.called` that you check with your chosen assertion library.

## What This Demonstrates

- ✅ **Solitary unit tests** - Test UserService in complete isolation
- ✅ **Sociable unit tests** - Test components together with real validation, mocked I/O
- ✅ **Token injection** - DATABASE_TOKEN as external boundary
- ✅ **Class injection** - UserValidator and UserRepository

## Running the Example

```bash
pnpm install
pnpm test
```

All tests should pass, demonstrating both solitary and sociable testing strategies.

## Project Structure

```
src/
├── types.ts                    # User types and interfaces
├── user.validator.ts           # Validation logic (no dependencies)
├── user.repository.ts          # Data access (token injection)
├── user.service.ts             # Business logic (class injections)
├── user.solitary.spec.ts       # Solitary unit tests
└── user.sociable.spec.ts       # Sociable unit tests
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

- [nestjs-jest](../nestjs-jest) - Same framework with Jest
- [nestjs-vitest](../nestjs-vitest) - Same framework with Vitest (faster execution)
- [inversify-sinon](../inversify-sinon) - InversifyJS with Sinon/Mocha

## Learn More

- [Suites Documentation](https://suites.dev)
- [NestJS Integration](https://suites.dev/docs/nestjs)
- [Testing Strategies](https://suites.dev/docs/testing-strategies)
