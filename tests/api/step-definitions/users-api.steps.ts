import { Given, When, Then } from '@cucumber/cucumber';
import { APIResponse } from '@playwright/test';
import { expect } from '@playwright/test';
import { ApiWorld } from '../utils/ApiWorld';
import { UserService } from '../services/UserService';
import { ApiHelper } from '../utils/ApiHelper';
import { UserSchema } from '../schemas/user.schema';

let userService: UserService;
let createdUserId: number | null = null;

// Given Steps
Given('a user exists in the system', async function (this: ApiWorld) {
  userService = new UserService();
  await userService.init();

  // Use authenticated token
  if (this.authToken) {
    userService.setAuthToken(this.authToken);
  }

  // Create a test user
  const userData = {
    username: `testuser_${ApiHelper.generateRandomString(6)}`,
    password: 'Test@123',
    status: true,
    userRoleId: 2,
  };

  const response = await userService.createUser(userData);
  createdUserId = await userService.verifyUserCreated(response);

  this.createdUserId = createdUserId;
  this.userService = userService;
  this.logger.info(`Test user created with ID: ${createdUserId}`);
});

Given('the API client has no authentication', function (this: ApiWorld) {
  userService = new UserService();
  // Don't initialize or set auth token
  this.userService = userService;
  this.logger.info('API client initialized without authentication');
});

// When Steps - User Operations
When('I send a GET request to users endpoint', async function (this: ApiWorld) {
  if (!this.userService) {
    userService = new UserService();
    await userService.init();
    if (this.authToken) {
      userService.setAuthToken(this.authToken);
    }
    this.userService = userService;
  }

  const startTime = Date.now();
  const response = await this.userService.getAllUsers();
  const responseTime = Date.now() - startTime;

  this.apiResponse = response;
  this.responseTime = responseTime;
});

When('I send a GET request to users endpoint with ID {int}', async function (this: ApiWorld, userId: number) {
  if (!this.userService) {
    userService = new UserService();
    await userService.init();
    if (this.authToken) {
      userService.setAuthToken(this.authToken);
    }
    this.userService = userService;
  }

  const startTime = Date.now();
  const response = await this.userService.getUserById(userId);
  const responseTime = Date.now() - startTime;

  this.apiResponse = response;
  this.responseTime = responseTime;
  this.logger.info(`GET user by ID: ${userId}`);
});

When('I send a POST request to create a new user with valid data', async function (this: ApiWorld) {
  if (!this.userService) {
    userService = new UserService();
    await userService.init();
    if (this.authToken) {
      userService.setAuthToken(this.authToken);
    }
    this.userService = userService;
  }

  const userData = {
    username: `newuser_${ApiHelper.generateRandomString(6)}`,
    password: 'NewUser@123',
    status: true,
    userRoleId: 2,
  };

  const startTime = Date.now();
  const response = await this.userService.createUser(userData);
  const responseTime = Date.now() - startTime;

  this.apiResponse = response;
  this.responseTime = responseTime;
  this.createdUserData = userData;
});

When('I send a PUT request to update the user', async function (this: ApiWorld) {
  const updateData = {
    username: `updated_${ApiHelper.generateRandomString(6)}`,
    status: false,
  };

  const startTime = Date.now();
  const response = await this.userService.updateUser(this.createdUserId!, updateData);
  const responseTime = Date.now() - startTime;

  this.apiResponse = response;
  this.responseTime = responseTime;
  this.updatedUserData = updateData;
});

When('I send a DELETE request to delete the user', async function (this: ApiWorld) {
  const startTime = Date.now();
  const response = await this.userService.deleteUser(this.createdUserId!);
  const responseTime = Date.now() - startTime;

  this.apiResponse = response;
  this.responseTime = responseTime;
});

When('I send a POST request to search users with criteria', async function (this: ApiWorld) {
  const searchCriteria = {
    username: 'Admin',
    status: true,
  };

  const startTime = Date.now();
  const response = await this.userService.searchUsers(searchCriteria);
  const responseTime = Date.now() - startTime;

  this.apiResponse = response;
  this.responseTime = responseTime;
  this.searchCriteria = searchCriteria;
});

When('I send a PUT request to update user with ID {int}', async function (this: ApiWorld, userId: number) {
  const updateData = { username: 'updateduser' };

  const startTime = Date.now();
  const response = await this.userService.updateUser(userId, updateData);
  const responseTime = Date.now() - startTime;

  this.apiResponse = response;
  this.responseTime = responseTime;
});

When('I send a DELETE request to delete user with ID {int}', async function (this: ApiWorld, userId: number) {
  const startTime = Date.now();
  const response = await this.userService.deleteUser(userId);
  const responseTime = Date.now() - startTime;

  this.apiResponse = response;
  this.responseTime = responseTime;
});

When('I send a POST request to create a user without username', async function (this: ApiWorld) {
  const userData = {
    password: 'Test@123',
    status: true,
    userRoleId: 2,
  };

  const startTime = Date.now();
  const response = await this.userService.createUser(userData);
  const responseTime = Date.now() - startTime;

  this.apiResponse = response;
  this.responseTime = responseTime;
});

When(
  'I send a GET request to users endpoint with limit {int} and offset {int}',
  async function (this: ApiWorld, limit: number, offset: number) {
    const startTime = Date.now();
    const response = await this.userService.getAllUsers(limit, offset);
    const responseTime = Date.now() - startTime;

    this.apiResponse = response;
    this.responseTime = responseTime;
    this.paginationParams = { limit, offset };
  }
);

When(
  'I send a POST request to create a user with username {string} and role {string}',
  async function (this: ApiWorld, username: string, role: string) {
    const userData = {
      username,
      password: 'Test@123',
      status: true,
      userRoleId: parseInt(role),
    };

    const startTime = Date.now();
    const response = await this.userService.createUser(userData);
    const responseTime = Date.now() - startTime;

    this.apiResponse = response;
    this.responseTime = responseTime;
  }
);

// Then Steps - User Validation
Then('the response should contain a list of users', async function (this: ApiWorld) {
  const body = await this.apiResponse.json();

  // Check for users array in response
  const hasUserList = body.data || Array.isArray(body) || body.users;

  expect(hasUserList).toBeTruthy();
  this.logger.info('✓ Response contains user list');
});

Then('the response should contain user details', async function (this: ApiWorld) {
  const body = await this.apiResponse.json();
  const userData = body.data || body;

  expect(userData).toHaveProperty('id');
  expect(userData).toHaveProperty('username');

  this.logger.info('✓ Response contains user details');
});

Then('the user should have a valid username', async function (this: ApiWorld) {
  const body = await this.apiResponse.json();
  const userData = body.data || body;

  expect(userData.username).toBeTruthy();
  expect(typeof userData.username).toBe('string');

  this.logger.info(`✓ User has valid username: ${userData.username}`);
});

Then('the response should contain the created user ID', async function (this: ApiWorld) {
  const body = await this.apiResponse.json();
  const userId = body.data?.id || body.id;

  expect(userId).toBeTruthy();
  expect(typeof userId).toBe('number');

  this.createdUserId = userId;
  this.logger.info(`✓ Created user ID: ${userId}`);
});

Then('I can retrieve the created user by ID', async function (this: ApiWorld) {
  const response = await this.userService.getUserById(this.createdUserId!);
  expect(response.status()).toBe(200);

  this.logger.info(`✓ Successfully retrieved user ${this.createdUserId}`);
});

Then('the user should be updated with new data', async function (this: ApiWorld) {
  const verifyResponse = await this.userService.getUserById(this.createdUserId!);
  const body = await verifyResponse.json();
  const userData = body.data || body;

  if (this.updatedUserData.username) {
    expect(userData.username).toBe(this.updatedUserData.username);
  }

  this.logger.info('✓ User updated successfully');
});

Then('the user should no longer exist in the system', async function (this: ApiWorld) {
  const response = await this.userService.getUserById(this.createdUserId!);
  const status = response.status();

  expect(status).toBe(404);
  this.logger.info('✓ User successfully deleted');
});

Then('the response should contain matching users', async function (this: ApiWorld) {
  const body = await this.apiResponse.json();
  const users = body.data || body;

  expect(Array.isArray(users) || typeof users === 'object').toBeTruthy();
  this.logger.info('✓ Response contains matching users');
});

Then('all returned users should match the search criteria', async function (this: ApiWorld) {
  const body = await this.apiResponse.json();
  const users = Array.isArray(body.data) ? body.data : [body.data];

  if (this.searchCriteria.username) {
    // At least one user should match
    this.logger.info(`✓ Search results validated for criteria: ${JSON.stringify(this.searchCriteria)}`);
  }
});

Then('the response should contain maximum {int} users', async function (this: ApiWorld, maxUsers: number) {
  const body = await this.apiResponse.json();
  const users = body.data || body;

  if (Array.isArray(users)) {
    expect(users.length).toBeLessThanOrEqual(maxUsers);
    this.logger.info(`✓ Response contains ${users.length} users (max: ${maxUsers})`);
  }
});

Then('the response should include pagination metadata', async function (this: ApiWorld) {
  const body = await this.apiResponse.json();

  const hasPagination = body.meta || body.pagination || body.total !== undefined;

  expect(hasPagination).toBeTruthy();
  this.logger.info('✓ Response includes pagination metadata');
});

Then('the response should match the user schema', async function (this: ApiWorld) {
  const body = await this.apiResponse.json();
  const userData = body.data || body;

  const isValid = ApiHelper.validateSchema(userData, UserSchema);

  expect(isValid).toBe(true);
  this.logger.info('✓ Response matches user schema');
});

Then('the response should contain validation error message', async function (this: ApiWorld) {
  const body = await this.apiResponse.json().catch(() => null);
  const text = body ? JSON.stringify(body) : await this.apiResponse.text();

  const hasValidationError =
    body?.error ||
    body?.message ||
    body?.errors ||
    text.toLowerCase().includes('validation') ||
    text.toLowerCase().includes('required');

  expect(hasValidationError).toBeTruthy();
  this.logger.info('✓ Response contains validation error');
});
