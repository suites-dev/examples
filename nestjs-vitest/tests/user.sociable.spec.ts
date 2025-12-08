import { Mocked, TestBed } from '@suites/unit';
import { Database, DATABASE_TOKEN } from '../src/types';
import { UserRepository } from '../src/user.repository';
import { UserService } from '../src/user.service';
import { UserValidator } from '../src/user.validator';

describe('User Service Unit Spec (Sociable Tests)', () => {
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

  it('should validate and create user with real validation logic', async () => {
    database.findByEmail.mockResolvedValue(null);
    database.save.mockImplementation(async (user: any) => user);

    const result = await userService.createUser({
      email: 'valid@example.com',
      name: 'Valid User'
    });

    expect(result.email).toBe('valid@example.com');
    expect(result.name).toBe('Valid User');
    expect(result.isActive).toBe(true);
    expect(database.save).toHaveBeenCalled();
  });

  it('should reject invalid email using real validator', async () => {
    await expect(
      userService.createUser({
        email: 'invalid-email',
        name: 'Test'
      })
    ).rejects.toThrow('Invalid email format');
  });

  it('should reject short name using real validator', async () => {
    await expect(
      userService.createUser({
        email: 'test@example.com',
        name: 'A'
      })
    ).rejects.toThrow('Name must be at least 2 characters');
  });
});

