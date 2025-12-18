/**
 * Solitary Unit Tests with Advanced Mock Configuration
 *
 * This file demonstrates .mock().final() and .mock().impl() patterns
 * in solitary tests where ALL dependencies are mocked.
 */

import { type Mocked, TestBed } from "@suites/unit";
import { UserService } from "../src/user.service";
import { UserRepository } from "../src/user.repository";
import { UserValidator } from "../src/user.validator";
import { UserValidationResult } from "../src/types";

describe("User Service Unit Spec (Solitary Tests)", () => {
  /**
   * PATTERN 1: Using .mock().final() for immutable mock configuration
   *
   * Use .final() when you want to lock down mock behavior that should
   * never change across tests. The functions provided are plain functions,
   * not Jest stubs, and cannot be reconfigured.
   */
  describe("with .mock().final() - immutable configuration", () => {
    let userService: UserService;
    let repository: Mocked<UserRepository>;

    beforeAll(async () => {
      const { unit, unitRef } = await TestBed.solitary(UserService)
        // Lock the validator to always return valid
        // This behavior CANNOT be changed in individual tests
        .mock(UserValidator)
        .final({
          validate: (): UserValidationResult => ({ isValid: true, errors: [] }),
        })
        .compile();

      userService = unit;
      // Repository is a regular mock (not configured with .final())
      // so we can configure it per-test
      repository = unitRef.get(UserRepository);
    });

    it("should create user when validation is locked to pass", async () => {
      repository.exists.mockResolvedValue(false);
      repository.create.mockResolvedValue({
        id: 1,
        email: "test@example.com",
        name: "Test User",
        isActive: true,
      });

      // Validation always passes due to .final() configuration
      const result = await userService.createUser({
        email: "test@example.com",
        name: "Test User",
      });

      expect(result.email).toBe("test@example.com");
      expect(repository.create).toHaveBeenCalled();
    });

    it("should throw error when user already exists", async () => {
      repository.exists.mockResolvedValue(true);

      await expect(
        userService.createUser({ email: "existing@example.com", name: "Test" })
      ).rejects.toThrow("User with this email already exists");
    });
  });

  /**
   * PATTERN 2: Using .mock().impl() for flexible mock configuration
   *
   * Use .impl() when you want sensible defaults that can be overridden
   * per-test. The stubFn() creates Jest mocks that support mockReturnValue(),
   * mockResolvedValue(), and call inspection.
   */
  describe("with .mock().impl() - flexible configuration", () => {
    let userService: UserService;
    let repository: Mocked<UserRepository>;
    let validator: Mocked<UserValidator>;

    beforeAll(async () => {
      const { unit, unitRef } = await TestBed.solitary(UserService)
        // Set up validator with a default that CAN be overridden
        .mock(UserValidator)
        .impl((stubFn) => ({
          validate: stubFn().mockReturnValue({ isValid: true, errors: [] }),
        }))
        // Set up repository with defaults
        .mock(UserRepository)
        .impl((stubFn) => ({
          exists: stubFn().mockResolvedValue(false),
          create: stubFn().mockImplementation(async (user) => user),
          findByEmail: stubFn().mockResolvedValue(null),
        }))
        .compile();

      userService = unit;
      repository = unitRef.get(UserRepository);
      validator = unitRef.get(UserValidator);
    });

    it("should create user with default mock behavior", async () => {
      // Using default behavior set in .impl()
      const result = await userService.createUser({
        email: "test@example.com",
        name: "Test User",
      });

      expect(result.email).toBe("test@example.com");
      expect(validator.validate).toHaveBeenCalledWith({
        email: "test@example.com",
        name: "Test User",
      });
    });

    it("should throw error when validation fails - override default", async () => {
      // Override the default behavior for this test
      validator.validate.mockReturnValue({
        isValid: false,
        errors: ["Invalid email format"],
      });

      await expect(
        userService.createUser({ email: "bad", name: "Test" })
      ).rejects.toThrow("Validation failed: Invalid email format");

      // Reset to default for next test
      validator.validate.mockReturnValue({ isValid: true, errors: [] });
    });

    it("should throw error when user exists - override default", async () => {
      // Override repository.exists for this test
      repository.exists.mockResolvedValue(true);

      await expect(
        userService.createUser({ email: "existing@example.com", name: "Test" })
      ).rejects.toThrow("User with this email already exists");

      // Reset to default
      repository.exists.mockResolvedValue(false);
    });
  });
});

/**
 * Key Differences:
 *
 * .mock().final():
 * - Plain functions, not Jest stubs
 * - Cannot be reconfigured per-test
 * - No call inspection (toHaveBeenCalled)
 * - Use for: locked behavior that must be consistent
 *
 * .mock().impl():
 * - Jest stubs created via stubFn()
 * - CAN be reconfigured per-test
 * - Full call inspection available
 * - Use for: flexible defaults with per-test overrides
 */


