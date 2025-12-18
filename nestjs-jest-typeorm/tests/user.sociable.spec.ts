import { type Mocked, TestBed } from "@suites/unit";
import { UserService } from "../src/user.service";
import { UserValidator } from "../src/user.validator";
import { UserRepository } from "../src/user.repository";
import { Database, DATABASE_TOKEN } from "../src/types";

describe("User Service Unit Spec (Sociable Tests)", () => {
  let userService: UserService;
  let database: Mocked<Database>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.sociable(UserService)
      .expose(UserValidator)
      .expose(UserRepository)
      .compile();

    userService = unit;
    database = unitRef.get<Database>(DATABASE_TOKEN);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should validate and create user with real validation logic", async () => {
    database.findByEmail.mockResolvedValue(null);
    database.save.mockImplementation(async (user) => user);

    const result = await userService.createUser({
      email: "valid@example.com",
      name: "Valid User",
    });

    expect(result.email).toBe("valid@example.com");
    expect(result.name).toBe("Valid User");
    expect(result.isActive).toBe(true);

    // Verify database.findByEmail was called via repository.exists
    expect(database.findByEmail).toHaveBeenCalledTimes(1);
    expect(database.findByEmail).toHaveBeenCalledWith("valid@example.com");

    // Verify database.save was called with correct user data
    expect(database.save).toHaveBeenCalledTimes(1);
    expect(database.save).toHaveBeenCalledWith({
      id: expect.any(Number),
      email: "valid@example.com",
      name: "Valid User",
      isActive: true,
    });
  });

  it("should reject invalid email using real validator", async () => {
    await expect(
      userService.createUser({
        email: "invalid-email",
        name: "Test",
      })
    ).rejects.toThrow("Invalid email format");

    // Verify database methods were NOT called when validation fails
    expect(database.findByEmail).not.toHaveBeenCalled();
    expect(database.save).not.toHaveBeenCalled();
  });

  it("should reject short name using real validator", async () => {
    await expect(
      userService.createUser({
        email: "test@example.com",
        name: "A",
      })
    ).rejects.toThrow("Name must be at least 2 characters");

    // Verify database methods were NOT called when validation fails
    expect(database.findByEmail).not.toHaveBeenCalled();
    expect(database.save).not.toHaveBeenCalled();
  });

  it("should call database.findByEmail when finding user by email", async () => {
    database.findByEmail.mockResolvedValue({
      id: 1,
      email: "test@example.com",
      name: "Test User",
      isActive: true,
    });

    const result = await userService.findByEmail("test@example.com");

    expect(result).not.toBeNull();
    expect(result?.email).toBe("test@example.com");

    // Verify database.findByEmail was called via repository
    expect(database.findByEmail).toHaveBeenCalledTimes(1);
    expect(database.findByEmail).toHaveBeenCalledWith("test@example.com");
  });

  it("should return null when user is not found in database", async () => {
    database.findByEmail.mockResolvedValue(null);

    const result = await userService.findByEmail("notfound@example.com");

    expect(result).toBeNull();

    // Verify database.findByEmail was called
    expect(database.findByEmail).toHaveBeenCalledTimes(1);
    expect(database.findByEmail).toHaveBeenCalledWith("notfound@example.com");
  });
});
