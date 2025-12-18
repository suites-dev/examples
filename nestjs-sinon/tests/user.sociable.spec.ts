import 'reflect-metadata';

import type { Mocked } from '@suites/unit';
import { TestBed } from '@suites/unit';
import { UserService } from '../src/user.service';
import { UserValidator } from '../src/user.validator';
import { UserRepository } from '../src/user.repository';
import { Database, DATABASE_TOKEN } from '../src/types';
import { expect } from 'chai';
import { before } from 'mocha';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

describe('User Service Unit Spec (Sociable Tests)', () => {
  let userService: UserService;
  let database: Mocked<Database>;

  before(async () => {
    const { unit, unitRef } = await TestBed.sociable(UserService)
      .expose(UserValidator)
      .expose(UserRepository)
      .compile();

    userService = unit;
    database = unitRef.get<Database>(DATABASE_TOKEN);
  });

  it('should validate and create user with real validation logic', async () => {
    database.findByEmail.resolves(null);
    database.save.callsFake(async (user: any) => user);

    const result = await userService.createUser({
      email: 'valid@example.com',
      name: 'Valid User'
    });

    expect(result.email).to.equal('valid@example.com');
    expect(result.name).to.equal('Valid User');
    expect(result.isActive).to.equal(true);
  });

  it('should reject invalid email using real validator', async () => {
    await expect(
      userService.createUser({
        email: 'invalid-email',
        name: 'Test'
      })
    ).to.be.rejectedWith('Invalid email format');
  });

  it('should reject short name using real validator', async () => {
    await expect(
      userService.createUser({
        email: 'test@example.com',
        name: 'A'
      })
    ).to.be.rejectedWith('Name must be at least 2 characters');
  });
});


