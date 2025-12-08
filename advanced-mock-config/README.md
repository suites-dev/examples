# Suites + NestJS + Jest (Advanced Mock Configuration)

Simple user management example demonstrating [Suites](https://suites.dev) with NestJS and Jest, showcasing advanced mock configuration patterns using `.mock().final()` and `.mock().impl()`.

## Prerequisites

- Node.js 18 or higher
- pnpm installed globally

## What This Demonstrates

- ✅ **Solitary unit tests** - Test UserService in complete isolation
- ✅ **Sociable unit tests** - Test components together with real validation, mocked I/O
- ✅ **`.mock().final()`** - Immutable mock configuration with plain functions
- ✅ **`.mock().impl()`** - Flexible mock configuration with stub functions
- ✅ **Token injection** - DATABASE_TOKEN as external boundary
- ✅ **Class injection** - UserValidator and UserRepository

## Running the Example

```bash
pnpm install
pnpm test
```

All tests should pass, demonstrating both testing strategies with advanced mock configuration.

## Project Structure

**`src/`** - Application code being tested:

```
src/
├── types.ts              # User types and interfaces
├── user.validator.ts     # Validation logic (no dependencies)
├── user.repository.ts    # Data access (token injection)
└── user.service.ts       # Business logic (class injections)
```

**`tests/`** - Tests demonstrating Suites advanced mock configuration:

```
tests/
├── user.solitary.spec.ts # Solitary tests with .mock().final() and .mock().impl()
└── user.sociable.spec.ts # Sociable tests with .mock().final() and .mock().impl()
```

## Mock Configuration Patterns

### `.mock().final()` - Immutable Configuration

Use when you want to **lock down** mock behavior that should never change:

```typescript
const { unit, unitRef } = await TestBed.solitary(UserService)
  .mock(UserValidator)
  .final({
    // Plain functions - cannot be reconfigured in tests
    validate: () => ({ isValid: true, errors: [] })
  })
  .compile();
```

**Key characteristics:**

- Functions provided to `.final()` are plain functions, not Jest mocks
- Behavior is locked - tests cannot use `mockReturnValue()` or similar
- Call inspection (`toHaveBeenCalled()`) is not available
- Best for: external services, logging, fixed configuration values

### `.mock().impl()` - Flexible Configuration

Use when you want **sensible defaults** that tests can override:

```typescript
const { unit, unitRef } = await TestBed.solitary(UserService)
  .mock(UserValidator)
  .impl((stubFn) => ({
    // Stubs - can be reconfigured and inspected in tests
    validate: stubFn().mockReturnValue({ isValid: true, errors: [] })
  }))
  .compile();

// Later in tests, you can override:
validator.validate.mockReturnValue({ isValid: false, errors: ['Error'] });
```

**Key characteristics:**

- Uses `stubFn()` factory to create Jest mock functions
- Behavior is flexible - tests can reconfigure using `mockReturnValue()`, etc.
- Call inspection (`toHaveBeenCalled()`, `toHaveBeenCalledWith()`) is available
- Best for: most mocks where different tests need different behaviors

## Comparing Testing Strategies

**When to use `.final()`:**

- External APIs (email, SMS, payments) - prevent accidental real calls
- Configuration/settings - fixed test environment values
- Logging/telemetry - consistent, predictable output

**When to use `.impl()`:**

- Database operations - need to simulate different query results
- Collaborator services - need flexibility for different test scenarios
- Any mock where behavior needs to vary per-test

## Comparison Table

| Feature                | `.final()`       | `.impl()`         |
| ---------------------- | ---------------- | ----------------- |
| Reconfigurable         | ❌ No            | ✅ Yes            |
| Call inspection        | ❌ No            | ✅ Yes            |
| Function type          | Plain functions  | Jest stubs        |
| `mockReturnValue()`    | ❌ Cannot use    | ✅ Can use        |
| `toHaveBeenCalled()`   | ❌ Cannot use    | ✅ Can use        |

## Related Examples

- [nestjs-jest](../nestjs-jest) - Basic NestJS + Jest example
- [nestjs-vitest](../nestjs-vitest) - NestJS with Vitest
- [inversify-jest](../inversify-jest) - InversifyJS with Jest

## Learn More

- [Suites Documentation](https://suites.dev)
- [Mock Configuration API](https://suites.dev/docs/api-reference/mock-configuration)
- [Test Doubles Guide](https://suites.dev/docs/guides/test-doubles)
