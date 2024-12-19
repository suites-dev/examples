import { TestBed } from '@suites/unit';
import type { Mocked } from '@suites/unit';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

describe('User Service Unit Spec', () => {
  let userService: UserService;
  let userRepository: Mocked<UserRepository>;

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(UserService).compile();
    userService = unit;
    userRepository = unitRef.get(UserRepository);
  });

  it('should return the user name and call repository', async () => {
    userRepository.getUserById.mockResolvedValue({ id: 1, name: 'John Doe', email: 'john@doe.com' });

    const result = await userService.getUserName(1);

    expect(userRepository.getUserById).toHaveBeenCalledWith(1);
    expect(result).toBe('John Doe');
  });
});