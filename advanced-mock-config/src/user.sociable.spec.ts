/**
 * Sociable Unit Tests with Advanced Mock Configuration
 *
 * This file demonstrates .mock().final() and .mock().impl() patterns
 * in sociable tests where some dependencies are REAL (exposed) and
 * others are mocked.
 */

import { type Mocked, TestBed } from '@suites/unit';
import { UserService } from './user.service';
import { UserValidator } from './user.validator';
import { UserRepository } from './user.repository';
import { Database, DATABASE_TOKEN, User } from './types';

describe('User Service Unit Spec (Sociable Tests)', () => {
  /**
   * PATTERN 1: Sociable test with .mock().final()
   *
   * Expose real collaborators (UserValidator, UserRepository) while
   * using .final() to lock down the external boundary (Database).
   */
  describe('with .mock().final() on external boundary', () => {
    let userService: UserService;

    beforeAll(async () => {
      const { unit } = await TestBed.sociable(UserService)
        .expose(UserValidator) // Real validation logic
        .expose(UserRepository) // Real repository logic
        // Lock database behavior - external I/O should be predictable
        .mock<Database>(DATABASE_TOKEN)
        .final({
          findByEmail: async () => null, // Always "user not found"
          save: async (user: User) => user // Always succeeds
        })
        .compile();

      userService = unit;
    });

    it('should validate and create user with real validation logic', async () => {
      // Real validator runs - valid email and name
      const result = await userService.createUser({
        email: 'valid@example.com',
        name: 'Valid User'
      });

      expect(result.email).toBe('valid@example.com');
      expect(result.name).toBe('Valid User');
      expect(result.isActive).toBe(true);
    });

    it('should reject invalid email using real validator', async () => {
      // Real validator rejects invalid email
      await expect(
        userService.createUser({
          email: 'invalid-email',
          name: 'Test'
        })
      ).rejects.toThrow('Invalid email format');
    });

    it('should reject short name using real validator', async () => {
      // Real validator rejects short name
      await expect(
        userService.createUser({
          email: 'test@example.com',
          name: 'A'
        })
      ).rejects.toThrow('Name must be at least 2 characters');
    });
  });

  /**
   * PATTERN 2: Sociable test with .mock().impl()
   *
   * Expose real collaborators while using .impl() for flexible
   * control over the external boundary with per-test overrides.
   */
  describe('with .mock().impl() on external boundary', () => {
    let userService: UserService;
    let database: Mocked<Database>;

    beforeAll(async () => {
      const { unit, unitRef } = await TestBed.sociable(UserService)
        .expose(UserValidator) // Real validation logic
        .expose(UserRepository) // Real repository logic
        // Flexible database mock - can override per-test
        .mock<Database>(DATABASE_TOKEN)
        .impl((stubFn) => ({
          findByEmail: stubFn().mockResolvedValue(null),
          save: stubFn().mockImplementation(async (user) => user)
        }))
        .compile();

      userService = unit;
      database = unitRef.get<Database>(DATABASE_TOKEN);
    });

    it('should create user with default database behavior', async () => {
      const result = await userService.createUser({
        email: 'valid@example.com',
        name: 'Valid User'
      });

      expect(result.email).toBe('valid@example.com');
      expect(database.save).toHaveBeenCalled();
    });

    it('should throw when user exists - override findByEmail', async () => {
      // Override to simulate existing user
      database.findByEmail.mockResolvedValue({
        id: 1,
        email: 'existing@example.com',
        name: 'Existing User',
        isActive: true
      });

      await expect(
        userService.createUser({
          email: 'existing@example.com',
          name: 'New User'
        })
      ).rejects.toThrow('User with this email already exists');

      // Reset for next test
      database.findByEmail.mockResolvedValue(null);
    });

    it('should still use real validator even with flexible database', async () => {
      // Real validator runs regardless of database configuration
      await expect(
        userService.createUser({
          email: 'invalid-email',
          name: 'Test'
        })
      ).rejects.toThrow('Invalid email format');
    });
  });
});

/**
 * Sociable + Mock Configuration Summary:
 *
 * .expose() + .mock().final():
 * - Real collaborators for business logic
 * - Locked mocks for external boundaries (DB, APIs)
 * - Consistent, predictable external behavior
 * - Best for: testing real interactions with fixed external state
 *
 * .expose() + .mock().impl():
 * - Real collaborators for business logic
 * - Flexible mocks for external boundaries
 * - Can simulate different external states per-test
 * - Best for: testing how real code handles various external responses
 */

