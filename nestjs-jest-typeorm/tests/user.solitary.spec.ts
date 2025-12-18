import { type Mocked, TestBed } from '@suites/unit';
import { UserService } from '../src/user.service';
import { UserRepository } from '../src/user.repository';
import { UserValidator } from '../src/user.validator';

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

  beforeEach(() => {
    jest.clearAllMocks();
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
    
    // Verify validator was called with correct DTO
    expect(validator.validate).toHaveBeenCalledTimes(1);
    expect(validator.validate).toHaveBeenCalledWith({
      email: 'test@example.com',
      name: 'Test User'
    });
    
    // Verify repository.exists was called after validation
    expect(repository.exists).toHaveBeenCalledTimes(1);
    expect(repository.exists).toHaveBeenCalledWith('test@example.com');
    
    // Verify repository.create was called with correct user data
    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(repository.create).toHaveBeenCalledWith({
      id: expect.any(Number),
      email: 'test@example.com',
      name: 'Test User',
      isActive: true
    });
  });

  it('should throw error when validation fails', async () => {
    validator.validate.mockReturnValue({
      isValid: false,
      errors: ['Invalid email format']
    });

    await expect(
      userService.createUser({ email: 'bad', name: 'Test' })
    ).rejects.toThrow('Validation failed: Invalid email format');

    // Verify validator was called
    expect(validator.validate).toHaveBeenCalledTimes(1);
    expect(validator.validate).toHaveBeenCalledWith({
      email: 'bad',
      name: 'Test'
    });
    
    // Verify repository methods were NOT called when validation fails
    expect(repository.exists).not.toHaveBeenCalled();
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('should throw error when user already exists', async () => {
    validator.validate.mockReturnValue({ isValid: true, errors: [] });
    repository.exists.mockResolvedValue(true);

    await expect(
      userService.createUser({ email: 'existing@example.com', name: 'Test' })
    ).rejects.toThrow('User with this email already exists');

    // Verify validator was called
    expect(validator.validate).toHaveBeenCalledTimes(1);
    expect(validator.validate).toHaveBeenCalledWith({
      email: 'existing@example.com',
      name: 'Test'
    });
    
    // Verify repository.exists was called
    expect(repository.exists).toHaveBeenCalledTimes(1);
    expect(repository.exists).toHaveBeenCalledWith('existing@example.com');
    
    // Verify repository.create was NOT called when user exists
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('should call repository.findByEmail when finding user by email', async () => {
    repository.findByEmail.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      isActive: true
    });

    const result = await userService.findByEmail('test@example.com');

    expect(result).not.toBeNull();
    expect(result?.email).toBe('test@example.com');
    
    // Verify repository.findByEmail was called with correct email
    expect(repository.findByEmail).toHaveBeenCalledTimes(1);
    expect(repository.findByEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('should return null when user is not found', async () => {
    repository.findByEmail.mockResolvedValue(null);

    const result = await userService.findByEmail('notfound@example.com');

    expect(result).toBeNull();
    
    // Verify repository.findByEmail was called
    expect(repository.findByEmail).toHaveBeenCalledTimes(1);
    expect(repository.findByEmail).toHaveBeenCalledWith('notfound@example.com');
  });
});

