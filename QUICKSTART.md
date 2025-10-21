# 🚀 Quick Start Guide - OrangeHRM Test Automation

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Install Playwright Browsers
```bash
npx playwright install chromium
```

### Step 3: Run Your First Test
```bash
npm test
```

That's it! Your tests are running! 🎉

---

## 📊 View Test Results

After tests complete, generate the Allure report:

```bash
npm run report
```

This will:
1. Generate the Allure HTML report
2. Automatically open it in your default browser

---

## 🎯 Quick Commands

| Command | What It Does |
|---------|-------------|
| `npm test` | Run all tests (headless) |
| `npm run test:headed` | Run with visible browser |
| `npm run test:tags "@smoke-test"` | Run smoke tests only |
| `npm run test:tags "@P0"` | Run critical tests only |
| `npm run report` | Generate & view test report |
| `npm run clean` | Clean up test artifacts |

---

## 🧪 Test Structure Overview

```
tests/e2e/
├── features/           # 📝 Write test scenarios here (Gherkin)
├── step-definitions/   # 🔧 Step implementations
├── pages/             # 📄 Page objects (UI element definitions)
├── testdata/          # 💾 Test data (credentials, etc.)
└── utils/             # 🛠️ Helper utilities
```

---

## ✅ Available Test Scenarios

### Login Tests (`@login`)
- ✅ Valid login (Admin)
- ❌ Invalid username
- ❌ Invalid password
- ❌ Empty credentials
- 🔒 SQL injection prevention
- 🔒 XSS attack prevention
- ⚡ Performance validation
- 🔄 Logout & re-login

---

## 🏷️ Running Specific Test Types

### Run by priority
```bash
# Critical tests only
npm run test:tags "@P0"

# High priority tests
npm run test:tags "@P1"
```

### Run by type
```bash
# Positive scenarios only
npm run test:tags "@positive"

# Negative scenarios only
npm run test:tags "@negative"

# Security tests only
npm run test:tags "@security"
```

### Combine tags
```bash
# Critical login tests
npm run test:tags "@login and @P0"

# All critical or high priority
npm run test:tags "@P0 or @P1"
```

---

## 🔧 Common Configuration Changes

### Change Browser
Edit `.env` file:
```properties
BROWSER=chromium    # or firefox, webkit
```

Or run directly:
```bash
BROWSER=firefox npm test
```

### Run in Headed Mode (See Browser)
```bash
HEADLESS=false npm test
```

### Slow Down Test Execution (for debugging)
```bash
SLOW_MO=1000 npm test
```

---

## 📸 Test Artifacts

After running tests, you'll find:

| Location | Content |
|----------|---------|
| `screenshots/` | Failure screenshots |
| `logs/` | Execution logs |
| `test-results/` | Videos & traces |
| `allure-report/` | HTML test report |

---

## 🐛 Quick Debugging Tips

### 1. Test Failed? Check the screenshot
```bash
# Screenshots are automatically saved to screenshots/
# Named by scenario and timestamp
```

### 2. Need more details? Check the logs
```bash
cat logs/test-execution.log
```

### 3. View the Allure report
```bash
npm run report
```
The report shows:
- ✅ Passed/Failed tests
- 📸 Screenshots
- 📋 Step-by-step execution
- ⏱️ Execution time
- 🏷️ Test categorization

---

## 📝 Writing Your First Test

### 1. Create a feature file
`tests/e2e/features/my-feature.feature`

```gherkin
@my-feature @P1
Feature: My New Feature

  Scenario: Test something
    Given I am on the login page
    When I perform some action
    Then I should see the result
```

### 2. Run the test
```bash
npm test
```

Cucumber will show you which steps need implementation.

### 3. Implement the steps
Create `tests/e2e/step-definitions/my-feature.steps.ts`

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../hooks/CustomWorld';

Given('I am on the login page', async function (this: CustomWorld) {
  // Your implementation
});
```

---

## 🎓 Next Steps

1. ✅ Run the existing tests
2. ✅ View the Allure report
3. ✅ Explore the test scenarios in `tests/e2e/features/`
4. ✅ Review the Page Objects in `tests/e2e/pages/`
5. ✅ Check out `README-AUTOMATION.md` for detailed documentation

---

## 💡 Pro Tips

### Tip 1: Run tests in parallel for speed
```bash
npm run test:parallel
```

### Tip 2: Run a single scenario by line number
```bash
npm test -- tests/e2e/features/login.feature:10
```

### Tip 3: Use dry-run to validate Gherkin syntax
```bash
npm test -- --dry-run
```

### Tip 4: Enable verbose logging
```bash
LOG_LEVEL=debug npm test
```

---

## ❓ Troubleshooting

### Tests not running?
```bash
# Reinstall dependencies
npm install

# Reinstall browsers
npx playwright install
```

### Browser not opening in headed mode?
```bash
# Ensure HEADLESS is set to false
HEADLESS=false npm run test:headed
```

### Can't see the report?
```bash
# Make sure tests ran first
npm test

# Then generate report
npm run report:generate

# Open manually
npm run report:open
```

---

## 📚 Learn More

- **Full Documentation**: See `README-AUTOMATION.md`
- **Test Design**: See `docs/qa/assessments/orangehrm-login-test-design-20251021.md`
- **Playwright Docs**: https://playwright.dev/
- **Cucumber Docs**: https://cucumber.io/docs/cucumber/

---

**Happy Testing! 🚀**

Need help? Check the logs or Allure report for detailed information.
