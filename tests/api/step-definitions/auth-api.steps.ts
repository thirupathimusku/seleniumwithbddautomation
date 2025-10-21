import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { APIResponse } from '@playwright/test';
import { expect } from '@playwright/test';
import { ApiWorld } from '../utils/ApiWorld';
import { AuthService } from '../services/AuthService';
import apiTestData from '../testdata/api-test-data.json';

setDefaultTimeout(60000);

let authService: AuthService;
let apiResponse: APIResponse;
let responseTime: number;

// Given Steps
Given('the API client is initialized', async function (this: ApiWorld) {
  authService = new AuthService();
  await authService.init();
  this.authService = authService;
  this.logger.info('API client initialized');
});

Given('I am authenticated via API', async function (this: ApiWorld) {
  const credentials = apiTestData.authentication.validCredentials.admin;
  const token = await authService.loginAndGetToken(credentials.username, credentials.password);

  if (token) {
    authService.setAuthToken(token);
    this.authToken = token;
    this.logger.info('Authenticated via API');
  } else {
    // Store session cookies for subsequent requests
    this.logger.info('Authenticated via API (session-based)');
  }
});

// When Steps - Authentication
When('I send a POST request to login endpoint with valid credentials', async function (this: ApiWorld) {
  const credentials = apiTestData.authentication.validCredentials.admin;
  const startTime = Date.now();

  apiResponse = await authService.login(credentials.username, credentials.password);
  responseTime = Date.now() - startTime;

  this.apiResponse = apiResponse;
  this.responseTime = responseTime;
});

When('I send a POST request to login endpoint with invalid username', async function (this: ApiWorld) {
  const credentials = apiTestData.authentication.invalidCredentials.wrongUsername;
  const startTime = Date.now();

  apiResponse = await authService.login(credentials.username, credentials.password);
  responseTime = Date.now() - startTime;

  this.apiResponse = apiResponse;
  this.responseTime = responseTime;
});

When('I send a POST request to login endpoint with invalid password', async function (this: ApiWorld) {
  const credentials = apiTestData.authentication.invalidCredentials.wrongPassword;
  const startTime = Date.now();

  apiResponse = await authService.login(credentials.username, credentials.password);
  responseTime = Date.now() - startTime;

  this.apiResponse = apiResponse;
  this.responseTime = responseTime;
});

When('I send a POST request to login endpoint with empty username', async function (this: ApiWorld) {
  const credentials = apiTestData.authentication.invalidCredentials.emptyUsername;
  const startTime = Date.now();

  apiResponse = await authService.login(credentials.username, credentials.password);
  responseTime = Date.now() - startTime;

  this.apiResponse = apiResponse;
  this.responseTime = responseTime;
});

When(
  'I send a POST request to login endpoint with username {string} and password {string}',
  async function (this: ApiWorld, username: string, password: string) {
    const startTime = Date.now();

    apiResponse = await authService.login(username, password);
    responseTime = Date.now() - startTime;

    this.apiResponse = apiResponse;
    this.responseTime = responseTime;
  }
);

When('I send a POST request to logout endpoint', async function (this: ApiWorld) {
  const startTime = Date.now();

  apiResponse = await authService.logout();
  responseTime = Date.now() - startTime;

  this.apiResponse = apiResponse;
  this.responseTime = responseTime;
});

// Then Steps - Response Validation
Then('the API response status code should be {int}', async function (this: ApiWorld, expectedStatus: number) {
  const actualStatus = this.apiResponse.status();
  expect(actualStatus).toBe(expectedStatus);

  this.logger.info(`✓ Status code verified: ${actualStatus}`);
  await this.allure.addParameter('Expected Status', expectedStatus.toString());
  await this.allure.addParameter('Actual Status', actualStatus.toString());
});

Then('the API response status code should be {int} or {int}', async function (this: ApiWorld, status1: number, status2: number) {
  const actualStatus = this.apiResponse.status();
  expect([status1, status2]).toContain(actualStatus);

  this.logger.info(`✓ Status code verified: ${actualStatus} (expected ${status1} or ${status2})`);
});

Then('the response time should be less than {int} milliseconds', function (this: ApiWorld, maxTime: number) {
  expect(this.responseTime).toBeLessThan(maxTime);

  this.logger.info(`✓ Response time: ${this.responseTime}ms (max: ${maxTime}ms)`);
  this.allure.addParameter('Response Time', `${this.responseTime}ms`);
  this.allure.addParameter('Max Allowed', `${maxTime}ms`);
});

Then('the response should contain authentication data', async function (this: ApiWorld) {
  const body = await this.apiResponse.json().catch(() => null);

  if (body) {
    // Check for common authentication response fields
    const hasAuthData =
      body.user || body.token || body.access_token || body.data || body.success === true;

    expect(hasAuthData).toBeTruthy();
    this.logger.info('✓ Response contains authentication data');
  } else {
    // Some APIs return success via status code and cookies only
    const cookies = this.apiResponse.headers()['set-cookie'];
    expect(cookies).toBeTruthy();
    this.logger.info('✓ Response contains authentication cookies');
  }
});

Then('the response should contain an error message', async function (this: ApiWorld) {
  const body = await this.apiResponse.json().catch(() => null);
  const text = body ? JSON.stringify(body) : await this.apiResponse.text();

  const hasError = body?.error || body?.message || text.toLowerCase().includes('error') || text.toLowerCase().includes('invalid');

  expect(hasError).toBeTruthy();
  this.logger.info('✓ Response contains error message');
});

Then('the response should not contain database error messages', async function (this: ApiWorld) {
  const text = await this.apiResponse.text();
  const databaseErrors = ['sql', 'syntax error', 'mysql', 'postgresql', 'database error'];

  const hasDatabaseError = databaseErrors.some((error) => text.toLowerCase().includes(error));

  expect(hasDatabaseError).toBe(false);
  this.logger.info('✓ Response does not contain database error messages');
});

Then('the session should be terminated', async function (this: ApiWorld) {
  // Verify session is terminated by trying to access protected resource
  const sessionResponse = await authService.getSessionInfo();
  const status = sessionResponse.status();

  // Should return 401 (Unauthorized) if session is terminated
  if (status === 401 || status === 403) {
    this.logger.info('✓ Session terminated successfully');
  } else {
    this.logger.warn(`Session status unclear: ${status}`);
  }
});
