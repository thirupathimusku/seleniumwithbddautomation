# 📁 Project Structure

## Complete Directory Tree

```
demo/
│
├── 📁 tests/
│   └── 📁 e2e/
│       ├── 📁 features/                    # BDD Feature Files (Gherkin)
│       │   └── 📄 login.feature           # Login test scenarios (16 scenarios)
│       │
│       ├── 📁 step-definitions/            # Step Definition Implementations
│       │   └── 📄 login.steps.ts          # Login step definitions (30+ steps)
│       │
│       ├── 📁 pages/                       # Page Object Models
│       │   ├── 📄 BasePage.ts             # Base page with common methods
│       │   ├── 📄 LoginPage.ts            # Login page elements & actions
│       │   └── 📄 DashboardPage.ts        # Dashboard page elements & actions
│       │
│       ├── 📁 testdata/                    # Test Data Management
│       │   ├── 📄 credentials.json        # Test credentials & payloads
│       │   └── 📄 TestDataManager.ts      # Data access layer (Singleton)
│       │
│       ├── 📁 utils/                       # Utility Helpers
│       │   ├── 📄 Logger.ts               # Winston logger with custom formatting
│       │   ├── 📄 AllureHelper.ts         # Allure reporting helper
│       │   └── 📄 BrowserHelper.ts        # Browser lifecycle management
│       │
│       ├── 📁 hooks/                       # Cucumber Hooks & World Setup
│       │   ├── 📄 CustomWorld.ts          # Custom world with Playwright integration
│       │   └── 📄 hooks.ts                # Before/After/BeforeAll/AfterAll hooks
│       │
│       └── 📁 config/                      # Configuration Files (reserved)
│
├── 📁 docs/                                # Documentation & QA Artifacts
│   ├── 📁 qa/
│   │   └── 📁 assessments/
│   │       └── 📄 orangehrm-login-test-design-20251021.md  # Test design document
│   │
│   ├── 📁 stories/
│   │   └── 📄 orangehrm_login_story.md    # User story
│   │
│   └── 📁 architecture/                    # Architecture docs (if any)
│
├── 📁 logs/                                # Generated - Test Execution Logs
│   ├── test-execution.log                 # All logs
│   └── errors.log                          # Error logs only
│
├── 📁 screenshots/                         # Generated - Failure Screenshots
│   └── *.png                               # Auto-captured on test failure
│
├── 📁 test-results/                        # Generated - Test Results
│   ├── 📁 videos/                          # Video recordings (if enabled)
│   ├── 📁 traces/                          # Playwright traces for debugging
│   ├── cucumber-report.html                # Cucumber HTML report
│   └── cucumber-report.json                # Cucumber JSON report
│
├── 📁 allure-results/                      # Generated - Allure Raw Results
│   └── *.json                              # Allure test result files
│
├── 📁 allure-report/                       # Generated - Allure HTML Report
│   └── index.html                          # Allure report entry point
│
├── 📁 node_modules/                        # Dependencies (npm install)
│
├── 📄 package.json                         # NPM dependencies & scripts
├── 📄 package-lock.json                    # Locked dependency versions
├── 📄 tsconfig.json                        # TypeScript configuration
├── 📄 cucumber.json                        # Cucumber configuration
├── 📄 .env                                 # Environment variables (local)
├── 📄 .env.example                         # Environment variables template
├── 📄 .gitignore                           # Git ignore rules
│
├── 📄 README-AUTOMATION.md                 # Complete framework documentation
├── 📄 QUICKSTART.md                        # 5-minute quick start guide
├── 📄 TEST-AUTOMATION-SUMMARY.md           # Framework summary & overview
└── 📄 PROJECT-STRUCTURE.md                 # This file
```

---

## 📊 File Count by Category

### Source Files (Framework Code)
| Category | Files | Description |
|----------|-------|-------------|
| Feature Files | 1 | BDD scenarios in Gherkin |
| Step Definitions | 1 | Step implementations |
| Page Objects | 3 | Login, Dashboard, Base |
| Test Data | 2 | JSON data + Manager |
| Utilities | 3 | Logger, Allure, Browser |
| Hooks | 2 | CustomWorld + Hooks |
| **Total** | **12** | **Core test files** |

### Configuration Files
| File | Purpose |
|------|---------|
| package.json | Dependencies & scripts |
| tsconfig.json | TypeScript settings |
| cucumber.json | Cucumber settings |
| .env | Environment variables |
| .env.example | Environment template |
| .gitignore | Git ignore rules |
| **Total: 6** | **Configuration** |

### Documentation Files
| File | Purpose |
|------|---------|
| README-AUTOMATION.md | Full documentation |
| QUICKSTART.md | Quick start guide |
| TEST-AUTOMATION-SUMMARY.md | Framework summary |
| PROJECT-STRUCTURE.md | This file |
| orangehrm-login-test-design-20251021.md | Test design |
| **Total: 5** | **Documentation** |

### **Grand Total: 23 files** (excluding generated artifacts)

---

## 🎯 File Purposes

### 📁 tests/e2e/features/
**Purpose**: Write test scenarios in human-readable Gherkin syntax
- `login.feature` - 16 login test scenarios with tags

**Example**:
```gherkin
@login @positive @P0
Scenario: Successful login with valid admin credentials
  Given the user navigates to the OrangeHRM login page
  When the user enters "Admin" in the username field
  ...
```

### 📁 tests/e2e/step-definitions/
**Purpose**: Implement the step definitions that execute the Gherkin steps
- `login.steps.ts` - All Given/When/Then implementations

**Example**:
```typescript
When('the user enters {string} in the username field', async function (username: string) {
  await loginPage.enterUsername(username);
});
```

### 📁 tests/e2e/pages/
**Purpose**: Page Object Models - encapsulate page elements and actions
- `BasePage.ts` - Common methods (click, fill, verify, etc.)
- `LoginPage.ts` - Login page specific elements/actions
- `DashboardPage.ts` - Dashboard page specific elements/actions

**Example**:
```typescript
export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;

  async login(username: string, password: string) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }
}
```

### 📁 tests/e2e/testdata/
**Purpose**: Manage test data separately from test code
- `credentials.json` - Test data (valid/invalid credentials, payloads)
- `TestDataManager.ts` - Centralized data access

**Example**:
```typescript
const credentials = TestDataManager.getInstance().getAdminCredentials();
```

### 📁 tests/e2e/utils/
**Purpose**: Reusable utility functions
- `Logger.ts` - Structured logging with Winston
- `AllureHelper.ts` - Add attachments, labels to Allure
- `BrowserHelper.ts` - Browser lifecycle management

### 📁 tests/e2e/hooks/
**Purpose**: Setup and teardown for each test scenario
- `CustomWorld.ts` - Extend Cucumber world with Playwright
- `hooks.ts` - Before/After hooks for browser setup/cleanup

---

## 🔍 Key Design Decisions

### 1. Separation of Concerns
- **Features**: What to test (business logic)
- **Steps**: How to execute (test logic)
- **Pages**: Where elements are (UI logic)
- **Data**: What data to use (test data)

### 2. Reusability
- **BasePage**: Common methods shared across all pages
- **CustomWorld**: Shared context across all scenarios
- **TestDataManager**: Centralized data access

### 3. Maintainability
- **Page Objects**: UI changes only affect page files
- **Test Data**: Data changes only affect JSON files
- **Configuration**: Settings in .env file

### 4. Readability
- **Gherkin**: Business-readable test scenarios
- **TypeScript**: Type-safe, self-documenting code
- **Comments**: Inline documentation

---

## 📦 Generated Artifacts

### Runtime Directories (auto-created)
```
logs/                  # Created on first test run
screenshots/          # Created when test fails
test-results/         # Created by test execution
  ├── videos/         # If VIDEO_ON_FAILURE=true
  └── traces/         # If TRACE_ON_FAILURE=true
allure-results/       # Created by Allure
allure-report/        # Created by "npm run report"
```

---

## 🎨 Visual Flow

```
┌─────────────────┐
│  Feature File   │  (What to test - Gherkin)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Step Definition │  (How to execute - TypeScript)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Page Object    │  (Where elements are - Locators)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Playwright    │  (Browser automation)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Allure Report  │  (Test results visualization)
└─────────────────┘
```

---

## 🚀 Quick Navigation

### Want to...

**Add a new test scenario?**
→ Edit `tests/e2e/features/login.feature`

**Change page locators?**
→ Edit `tests/e2e/pages/LoginPage.ts` or `DashboardPage.ts`

**Add new test data?**
→ Edit `tests/e2e/testdata/credentials.json`

**Change environment settings?**
→ Edit `.env` file

**View test results?**
→ Run `npm run report`

**Add a new page object?**
→ Create new file in `tests/e2e/pages/` extending `BasePage`

**Add new step definitions?**
→ Edit or create new file in `tests/e2e/step-definitions/`

**Change logging behavior?**
→ Edit `tests/e2e/utils/Logger.ts`

**Modify hooks (setup/teardown)?**
→ Edit `tests/e2e/hooks/hooks.ts`

---

## 📚 Import Paths (tsconfig.json aliases)

TypeScript path aliases configured:
```typescript
import { LoginPage } from '@pages/LoginPage';
import { TestDataManager } from '@testdata/TestDataManager';
import { Logger } from '@utils/Logger';
import { AllureHelper } from '@utils/AllureHelper';
import { CustomWorld } from '@hooks/CustomWorld';
```

**Note**: These aliases make imports cleaner and easier to refactor.

---

## ✅ Verification Checklist

Use this to verify your setup:

- [ ] `tests/e2e/features/` contains feature files
- [ ] `tests/e2e/step-definitions/` contains step definitions
- [ ] `tests/e2e/pages/` contains page objects
- [ ] `tests/e2e/testdata/` contains test data
- [ ] `tests/e2e/utils/` contains utilities
- [ ] `tests/e2e/hooks/` contains hooks
- [ ] `.env` file exists with configuration
- [ ] `package.json` contains dependencies
- [ ] `node_modules/` exists (run `npm install`)
- [ ] Documentation files are present

---

**This structure follows industry best practices for test automation frameworks.**
