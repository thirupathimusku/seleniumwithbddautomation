# OrangeHRM Test Automation Framework

## 🚀 Overview

This is a comprehensive test automation framework for OrangeHRM application built with:
- **Playwright** - Modern browser automation
- **Cucumber BDD** - Behavior-Driven Development with Gherkin syntax
- **TypeScript** - Type-safe test development
- **Allure** - Beautiful test reporting

## 📁 Project Structure

```
demo/
├── tests/
│   └── e2e/
│       ├── features/           # BDD feature files (.feature)
│       │   └── login.feature
│       ├── step-definitions/   # Step definition implementations
│       │   └── login.steps.ts
│       ├── pages/              # Page Object Models
│       │   ├── BasePage.ts
│       │   ├── LoginPage.ts
│       │   └── DashboardPage.ts
│       ├── testdata/           # Test data management
│       │   ├── credentials.json
│       │   └── TestDataManager.ts
│       ├── utils/              # Utility helpers
│       │   ├── Logger.ts
│       │   ├── AllureHelper.ts
│       │   └── BrowserHelper.ts
│       ├── hooks/              # Cucumber hooks & world setup
│       │   ├── CustomWorld.ts
│       │   └── hooks.ts
│       └── config/             # Configuration files
├── package.json                # Dependencies & scripts
├── tsconfig.json              # TypeScript configuration
├── cucumber.json              # Cucumber configuration
├── .env                       # Environment variables
└── README-AUTOMATION.md       # This file
```

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup Steps

1. **Install dependencies:**
```bash
npm install
```

2. **Install Playwright browsers:**
```bash
npx playwright install
```

3. **Verify installation:**
```bash
npm run test -- --dry-run
```

## 🎯 Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (visible browser)
```bash
npm run test:headed
```

### Run tests in specific browser
```bash
npm run test:chrome
npm run test:firefox
npm run test:edge
```

### Run tests in parallel
```bash
npm run test:parallel
```

### Run tests by tags
```bash
# Run only smoke tests
npm run test:tags "@smoke-test"

# Run only critical tests
npm run test:tags "@P0"

# Run positive scenarios only
npm run test:tags "@positive"

# Run negative scenarios only
npm run test:tags "@negative"

# Run security tests
npm run test:tags "@security"

# Multiple tags (AND)
npm run test:tags "@login and @P0"

# Multiple tags (OR)
npm run test:tags "@P0 or @P1"
```

## 📊 Test Reporting

### Generate and view Allure report
```bash
npm run report
```

### Generate report only
```bash
npm run report:generate
```

### Open existing report
```bash
npm run report:open
```

## 🧪 Test Scenarios

### Positive Scenarios
- ✅ Successful login with valid admin credentials
- ✅ Login page elements verification
- ✅ Dashboard navigation validation
- ✅ Multiple user types login

### Negative Scenarios
- ❌ Login with invalid username
- ❌ Login with invalid password
- ❌ Login with empty credentials
- ❌ Login with empty username only
- ❌ Login with empty password only

### Security Scenarios
- 🔒 SQL injection prevention
- 🔒 XSS attack prevention
- 🔒 Password masking validation

### Boundary & Edge Cases
- ⚠️ Case sensitivity validation
- ⚠️ Whitespace handling
- ⚠️ Maximum length inputs

### Performance Tests
- ⚡ Login response time < 3 seconds

### Regression Tests
- 🔄 Logout and re-login functionality
- 🔄 Browser navigation stability

## 🎨 BDD Feature Example

```gherkin
@login @positive @P0
Scenario: Successful login with valid admin credentials
  Given the user navigates to the OrangeHRM login page
  And the login page is displayed correctly
  When the user enters "Admin" in the username field
  And the user enters "admin123" in the password field
  And the user clicks the login button
  Then the user should be redirected to the dashboard
  And the dashboard should display the main navigation menu
  And the user profile icon should appear in the top-right corner
```

## 🔧 Configuration

### Environment Variables (.env)

Edit `.env` file to customize:

```properties
# Browser settings
BROWSER=chromium          # chromium, firefox, webkit
HEADLESS=false           # true for headless, false for headed
SLOW_MO=0               # Slow down actions by milliseconds

# URLs
BASE_URL=https://opensource-demo.orangehrmlive.com
LOGIN_URL=https://opensource-demo.orangehrmlive.com/web/index.php/auth/login

# Timeouts
DEFAULT_TIMEOUT=30000
NAVIGATION_TIMEOUT=30000

# Test Data
ADMIN_USERNAME=Admin
ADMIN_PASSWORD=admin123

# Reporting
SCREENSHOT_ON_FAILURE=true
VIDEO_ON_FAILURE=false
TRACE_ON_FAILURE=true
```

## 📝 Writing New Tests

### 1. Create Feature File

Create a new `.feature` file in `tests/e2e/features/`:

```gherkin
@new-feature @P1
Feature: New Feature
  Scenario: Test scenario
    Given precondition
    When action
    Then assertion
```

### 2. Create Page Object

Create a new page class in `tests/e2e/pages/`:

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class NewPage extends BasePage {
  private readonly element: Locator;

  constructor(page: Page) {
    super(page);
    this.element = page.locator('selector');
  }

  async performAction(): Promise<void> {
    await this.click(this.element, 'Element description');
  }
}
```

### 3. Create Step Definitions

Create step definitions in `tests/e2e/step-definitions/`:

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../hooks/CustomWorld';

Given('precondition', async function (this: CustomWorld) {
  // Implementation
});

When('action', async function (this: CustomWorld) {
  // Implementation
});

Then('assertion', async function (this: CustomWorld) {
  // Implementation
});
```

## 🏷️ Test Tags Reference

| Tag | Purpose |
|-----|---------|
| `@smoke-test` | Quick smoke tests |
| `@P0` | Critical priority tests |
| `@P1` | High priority tests |
| `@P2` | Medium priority tests |
| `@P3` | Low priority tests |
| `@positive` | Positive test scenarios |
| `@negative` | Negative test scenarios |
| `@security` | Security test scenarios |
| `@performance` | Performance test scenarios |
| `@regression` | Regression test scenarios |
| `@login` | Login feature tests |
| `@authentication` | Authentication tests |

## 🐛 Debugging

### Enable debug logs
```bash
LOG_LEVEL=debug npm test
```

### Run single scenario
```bash
npm test -- tests/e2e/features/login.feature:10
```
(where `:10` is the line number of the scenario)

### View browser in headed mode
```bash
HEADLESS=false npm test
```

### Slow down execution
```bash
SLOW_MO=500 npm test
```

## 📸 Artifacts

After test execution, the following artifacts are generated:

- **Screenshots**: `screenshots/` - Screenshots on test failure
- **Videos**: `test-results/videos/` - Video recordings (if enabled)
- **Traces**: `test-results/traces/` - Playwright traces for debugging
- **Logs**: `logs/` - Detailed execution logs
- **Allure Results**: `allure-results/` - Raw Allure test results
- **Allure Report**: `allure-report/` - HTML test report

## 🧹 Cleanup

Remove all test artifacts:
```bash
npm run clean
```

## 🔍 CI/CD Integration

### GitHub Actions Example

```yaml
name: Test Automation

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: allure-results
          path: allure-results/
```

## 🎓 Best Practices

1. **Use Page Object Model** - Encapsulate page interactions in page classes
2. **Write Readable Gherkin** - Use business language in feature files
3. **Keep Steps Reusable** - Write generic step definitions
4. **Use Test Data Files** - Externalize test data in JSON files
5. **Add Meaningful Assertions** - Verify multiple conditions
6. **Tag Appropriately** - Use tags for test organization
7. **Handle Waits Properly** - Use explicit waits, avoid hard-coded delays
8. **Clean Test Data** - Ensure tests are independent and idempotent

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Cucumber.js Documentation](https://cucumber.io/docs/cucumber/)
- [Allure Report Documentation](https://docs.qameta.io/allure/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Follow the existing code structure
2. Add tests for new features
3. Update documentation
4. Run tests before committing
5. Use meaningful commit messages

## 📧 Support

For issues or questions:
- Check the logs in `logs/` directory
- Review Allure report for detailed test results
- Enable debug logging with `LOG_LEVEL=debug`

---

**Built with ❤️ using Playwright + Cucumber BDD + TypeScript + Allure**
