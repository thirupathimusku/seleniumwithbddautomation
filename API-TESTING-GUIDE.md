# 🚀 API Testing Guide

## Overview

This framework includes comprehensive **API testing capabilities** using Playwright's built-in API testing features integrated with Cucumber BDD and Allure reporting.

---

## 📁 API Test Structure

```
tests/api/
├── features/              # BDD feature files for API tests
│   ├── auth-api.feature   # Authentication API scenarios
│   └── users-api.feature  # User management API scenarios
├── step-definitions/      # Step definition implementations
│   ├── auth-api.steps.ts  # Auth API step definitions
│   └── users-api.steps.ts # User API step definitions
├── services/              # API service layer (like Page Objects)
│   ├── AuthService.ts     # Authentication service
│   └── UserService.ts     # User management service
├── schemas/               # JSON schema definitions
│   └── user.schema.ts     # User schema validation
├── testdata/              # API test data
│   └── api-test-data.json # Test data for API tests
└── utils/                 # API utilities
    ├── ApiClient.ts       # Base API client
    ├── ApiHelper.ts       # Helper methods
    ├── ApiWorld.ts        # Cucumber world for API
    └── api-hooks.ts       # API-specific hooks
```

---

## 🎯 Running API Tests

### Run All API Tests
```bash
npm run test:api
```

### Run Specific API Test Suites
```bash
# Authentication API tests only
npm run test:api:auth

# User Management API tests only
npm run test:api:users
```

### Run By Tags
```bash
# Run P0 API tests
npm run test:tags "@api and @P0"

# Run positive API scenarios
npm run test:tags "@api and @positive"

# Run security API tests
npm run test:tags "@api and @security"
```

### Run E2E and API Tests Together
```bash
# Run all tests (E2E + API)
npm run test:all

# Or simply
npm test
```

---

## 📊 API Test Coverage

### Authentication API Tests (9 scenarios)

| ID | Priority | Scenario |
|----|----------|----------|
| API-AUTH-001 | P0 | Successful authentication with valid credentials |
| API-AUTH-002 | P0 | Authentication fails with invalid username |
| API-AUTH-003 | P0 | Authentication fails with invalid password |
| API-AUTH-004 | P0 | Authentication fails with empty credentials |
| API-AUTH-005 | P0 | SQL injection prevention |
| API-AUTH-006 | P0 | Response time SLA validation |
| API-AUTH-007 | P1 | Logout after authentication |

### User Management API Tests (14 scenarios)

| ID | Priority | Scenario |
|----|----------|----------|
| API-USER-001 | P1 | Get all users |
| API-USER-002 | P1 | Get user by ID |
| API-USER-003 | P0 | Create new user |
| API-USER-004 | P1 | Update existing user |
| API-USER-005 | P1 | Delete user |
| API-USER-006 | P1 | Search users |
| API-USER-007 | P1 | Get non-existent user (404) |
| API-USER-008 | P0 | Create user without required fields |
| API-USER-009 | P1 | Update non-existent user (404) |
| API-USER-010 | P1 | Delete non-existent user (404) |
| API-USER-011 | P2 | Pagination support |
| API-USER-012 | P1 | Response time SLA |
| API-USER-013 | P1 | Schema validation |
| API-USER-014 | P0 | Unauthorized access prevention |

**Total API Tests: 23 scenarios**

---

## 🔧 API Service Layer

### AuthService

Handles all authentication-related API calls:

```typescript
const authService = new AuthService();
await authService.init();

// Login
const response = await authService.login('Admin', 'admin123');

// Get auth token
const token = await authService.loginAndGetToken('Admin', 'admin123');

// Set token for subsequent requests
authService.setAuthToken(token);

// Logout
await authService.logout();
```

### UserService

Handles all user management API calls:

```typescript
const userService = new UserService();
await userService.init();
userService.setAuthToken(token);

// Get all users
const users = await userService.getAllUsers(limit, offset);

// Get user by ID
const user = await userService.getUserById(1);

// Create user
const newUser = await userService.createUser(userData);

// Update user
const updated = await userService.updateUser(userId, updateData);

// Delete user
await userService.deleteUser(userId);

// Search users
const results = await userService.searchUsers(criteria);
```

---

## 📝 Writing API Tests

### 1. Create Feature File

Create a new `.feature` file in `tests/api/features/`:

```gherkin
@api @my-api
Feature: My API Feature
  Background:
    Given the API client is initialized
    And I am authenticated via API

  @positive @P0
  Scenario: Successful API call
    When I send a GET request to my endpoint
    Then the API response status code should be 200
    And the response time should be less than 2000 milliseconds
```

### 2. Create Service Class

Create a service class in `tests/api/services/`:

```typescript
import { APIResponse } from '@playwright/test';
import { ApiClient } from '../utils/ApiClient';

export class MyService extends ApiClient {
  private readonly endpoints = {
    base: '/api/v2/my-resource',
  };

  async getResource(): Promise<APIResponse> {
    return await this.get(this.endpoints.base);
  }

  async createResource(data: any): Promise<APIResponse> {
    return await this.post(this.endpoints.base, data);
  }
}
```

### 3. Create Step Definitions

Create step definitions in `tests/api/step-definitions/`:

```typescript
import { When, Then } from '@cucumber/cucumber';
import { ApiWorld } from '../utils/ApiWorld';
import { MyService } from '../services/MyService';

When('I send a GET request to my endpoint', async function (this: ApiWorld) {
  const service = new MyService();
  await service.init();

  const startTime = Date.now();
  const response = await service.getResource();
  const responseTime = Date.now() - startTime;

  this.apiResponse = response;
  this.responseTime = responseTime;
});
```

---

## 🎨 API Test Examples

### Example 1: Authentication Test

```gherkin
@api @authentication @P0
Scenario: Successful authentication via API
  Given the API client is initialized
  When I send a POST request to login endpoint with valid credentials
  Then the API response status code should be 200
  And the response time should be less than 3000 milliseconds
  And the response should contain authentication data
```

### Example 2: CRUD Operations

```gherkin
@api @users @P0
Scenario: Complete user lifecycle via API
  Given the API client is initialized
  And I am authenticated via API
  When I send a POST request to create a new user with valid data
  Then the API response status code should be 201
  And the response should contain the created user ID
  When I send a PUT request to update the user
  Then the API response status code should be 200
  When I send a DELETE request to delete the user
  Then the API response status code should be 200
  And the user should no longer exist in the system
```

### Example 3: Data-Driven API Tests

```gherkin
@api @data-driven
Scenario Outline: API with different inputs
  Given the API client is initialized
  When I send a POST request with username "<username>" and role "<role>"
  Then the API response status code should be <expected_status>

  Examples:
    | username   | role | expected_status |
    | validuser1 | 2    | 201             |
    | validuser2 | 1    | 201             |
    |            | 2    | 400             |
```

---

## 🔍 API Validation Methods

### Status Code Validation
```typescript
await this.verifyStatus(response, 200);
```

### Response Time Validation
```typescript
expect(responseTime).toBeLessThan(3000);
```

### Schema Validation
```typescript
ApiHelper.validateSchema(data, UserSchema);
```

### Custom Assertions
```typescript
ApiHelper.assertResponseContainsKey(data, 'id');
ApiHelper.assertResponseContainsValue(data, 'status', true);
ApiHelper.assertArrayNotEmpty(data.users);
```

---

## 📦 Test Data Management

### Using Test Data Files

Test data is stored in `tests/api/testdata/api-test-data.json`:

```json
{
  "authentication": {
    "validCredentials": {
      "admin": {
        "username": "Admin",
        "password": "admin123"
      }
    }
  },
  "users": {
    "createUser": {
      "username": "testuser_api",
      "password": "Test@123",
      "userRoleId": 2
    }
  }
}
```

### Accessing Test Data in Steps

```typescript
import apiTestData from '../testdata/api-test-data.json';

const credentials = apiTestData.authentication.validCredentials.admin;
await authService.login(credentials.username, credentials.password);
```

---

## 🛡️ Security Testing

### SQL Injection Tests

```gherkin
@security @P0
Scenario Outline: SQL injection prevention
  When I send a POST request with username "<sql_payload>"
  Then the API response status code should be 401
  And the response should not contain database error messages

  Examples:
    | sql_payload                   |
    | ' OR '1'='1                   |
    | admin'--                      |
    | ' UNION SELECT * FROM users-- |
```

### XSS Prevention

API should sanitize all input and not execute scripts.

### Authentication Tests

```gherkin
@security @P0
Scenario: Unauthorized access prevention
  Given the API client has no authentication
  When I send a GET request to protected endpoint
  Then the API response status code should be 401 or 403
```

---

## ⚡ Performance Testing

### Response Time Validation

```gherkin
@performance @P0
Scenario: API response time SLA
  When I send a GET request to users endpoint
  Then the API response status code should be 200
  And the response time should be less than 2000 milliseconds
```

### Performance Thresholds

Configured in `api-test-data.json`:

```json
"performance": {
  "maxResponseTime": {
    "authentication": 3000,
    "userCRUD": 2000,
    "search": 5000
  }
}
```

---

## 📊 Allure Reporting for API Tests

API tests automatically generate detailed Allure reports with:

- ✅ Request method and endpoint
- ✅ Request headers and body
- ✅ Response status code
- ✅ Response headers and body
- ✅ Response time
- ✅ Test parameters
- ✅ Screenshots on failure
- ✅ Step-by-step execution

### View API Test Report

```bash
npm run test:api
npm run report
```

---

## 🏷️ API Test Tags

| Tag | Purpose |
|-----|---------|
| `@api` | All API tests |
| `@auth-api` | Authentication API tests |
| `@users-api` | User management API tests |
| `@positive` | Positive API scenarios |
| `@negative` | Negative API scenarios |
| `@security` | Security API tests |
| `@performance` | Performance API tests |
| `@schema` | Schema validation tests |
| `@pagination` | Pagination tests |
| `@data-driven` | Data-driven tests |
| `@P0` | Critical priority |
| `@P1` | High priority |
| `@P2` | Medium priority |

---

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: API Tests

on: [push, pull_request]

jobs:
  api-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:api
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: api-test-results
          path: allure-results/
```

---

## 🐛 Debugging API Tests

### Enable Debug Logging
```bash
LOG_LEVEL=debug npm run test:api
```

### Run Single API Scenario
```bash
npm run test:api -- tests/api/features/auth-api.feature:6
```

### View Request/Response in Console
Check logs in `logs/test-execution.log`

---

## 💡 Best Practices

### 1. Use Service Layer Pattern
Encapsulate API calls in service classes, not in step definitions.

### 2. Validate Responses Thoroughly
- Check status codes
- Validate response schema
- Verify response time
- Check error messages

### 3. Clean Up Test Data
Always clean up created resources after tests.

### 4. Use Authentication Properly
Store and reuse auth tokens to avoid unnecessary login calls.

### 5. Handle Errors Gracefully
Wrap API calls in try-catch blocks and provide meaningful error messages.

### 6. Avoid Hard-Coded Values
Use test data files and environment variables.

---

## 📚 Additional Resources

- [Playwright API Testing](https://playwright.dev/docs/test-api-testing)
- [Cucumber BDD](https://cucumber.io/docs/cucumber/)
- [Allure Report](https://docs.qameta.io/allure/)

---

## ✅ API Testing Checklist

Before running API tests:

- [ ] API client initialized
- [ ] Authentication configured
- [ ] Test data prepared
- [ ] Environment variables set
- [ ] Endpoints accessible

After running API tests:

- [ ] All tests passed
- [ ] Response times within SLA
- [ ] No security vulnerabilities found
- [ ] Allure report generated
- [ ] Test data cleaned up

---

**API Testing Framework Status: ✅ Production Ready**

For general framework documentation, see `README-AUTOMATION.md`
