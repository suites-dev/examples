import { type Mocked, TestBed } from '@suites/unit';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserValidator } from './user.validator';

describe('User Service Unit Spec (Solitary Tests)', () => {
  let userService: UserService;
  let repository: Mocked<UserRepository>;
  let validator: Mocked<UserValidator>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(UserService).compile();
    userService = unit;
    repository = unitRef.get(UserRepository);
    validator = unitRef.get(UserValidator);
  });

  it('should create user when validation passes and email is unique', async () => {
    validator.validate.mockReturnValue({ isValid: true, errors: [] });
    repository.exists.mockResolvedValue(false);
    repository.create.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      isActive: true
    });

    const result = await userService.createUser({
      email: 'test@example.com',
      name: 'Test User'
    });

    expect(result.email).toBe('test@example.com');
    expect(validator.validate).toHaveBeenCalledWith({
      email: 'test@example.com',
      name: 'Test User'
    });
    expect(repository.exists).toHaveBeenCalledWith('test@example.com');
    expect(repository.create).toHaveBeenCalled();
  });

  it('should throw error when validation fails', async () => {
    validator.validate.mockReturnValue({
      isValid: false,
      errors: ['Invalid email format']
    });

    await expect(
      userService.createUser({ email: 'bad', name: 'Test' })
    ).rejects.toThrow('Validation failed: Invalid email format');
  });

  it('should throw error when user already exists', async () => {
    validator.validate.mockReturnValue({ isValid: true, errors: [] });
    repository.exists.mockResolvedValue(true);

    await expect(
      userService.createUser({ email: 'existing@example.com', name: 'Test' })
    ).rejects.toThrow('User with this email already exists');
  });
});
