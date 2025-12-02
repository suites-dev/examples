import 'reflect-metadata';

import type { Mocked } from '@suites/unit';
import { TestBed } from '@suites/unit';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserValidator } from './user.validator';
import { expect } from 'chai';
import { before } from 'mocha';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

describe('UserService - Solitary Tests', () => {
  let userService: UserService;
  let repository: Mocked<UserRepository>;
  let validator: Mocked<UserValidator>;

  before(async () => {
    const { unit, unitRef } = await TestBed.solitary(UserService).compile();
    userService = unit;
    repository = unitRef.get(UserRepository);
    validator = unitRef.get(UserValidator);
  });

  it('should create user when validation passes and email is unique', async () => {
    validator.validate.returns({ isValid: true, errors: [] });
    repository.exists.resolves(false);
    repository.create.resolves({
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      isActive: true
    });

    const result = await userService.createUser({
      email: 'test@example.com',
      name: 'Test User'
    });

    expect(result.email).to.equal('test@example.com');
  });

  it('should throw error when validation fails', async () => {
    validator.validate.returns({
      isValid: false,
      errors: ['Invalid email format']
    });

    await expect(
      userService.createUser({ email: 'bad', name: 'Test' })
    ).to.be.rejectedWith('Validation failed: Invalid email format');
  });

  it('should throw error when user already exists', async () => {
    validator.validate.returns({ isValid: true, errors: [] });
    repository.exists.resolves(true);

    await expect(
      userService.createUser({ email: 'existing@example.com', name: 'Test' })
    ).to.be.rejectedWith('User with this email already exists');
  });
});
