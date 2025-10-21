# 🚀 Installation Guide

## Prerequisites Check

Before you begin, ensure you have:

| Requirement | Minimum Version | Check Command |
|-------------|----------------|---------------|
| **Node.js** | v16.0.0 or higher | `node --version` |
| **npm** | v8.0.0 or higher | `npm --version` |
| **Git** (optional) | Any version | `git --version` |

---

## 📥 Installation Steps

### Step 1: Navigate to Project Directory
```bash
cd C:\Users\pc\Desktop\AITools\demo
```

### Step 2: Install Node.js Dependencies
```bash
npm install
```

**Expected output:**
```
added 200+ packages in 30s
```

**What this does:**
- Installs Playwright
- Installs Cucumber
- Installs TypeScript
- Installs Allure
- Installs all other dependencies

### Step 3: Install Playwright Browsers
```bash
npx playwright install
```

**Expected output:**
```
Downloading Chromium...
Downloading Firefox...
Downloading WebKit...
```

**What this does:**
- Downloads Chromium browser
- Downloads Firefox browser
- Downloads WebKit (Safari) browser

**To install only Chromium (recommended for quick start):**
```bash
npx playwright install chromium
```

### Step 4: Verify Installation
```bash
npm test -- --dry-run
```

**Expected output:**
```
✔ Feature: OrangeHRM Login Functionality
  ✔ Scenario: Successful login with valid admin credentials
  ✔ Scenario: Login page elements are displayed correctly
  ...
```

**What this does:**
- Validates Gherkin syntax
- Checks step definitions
- Doesn't actually run tests
- Quick validation (~5 seconds)

---

## ✅ Verification Checklist

After installation, verify:

### 1. Check Node Modules
```bash
# Windows PowerShell
Test-Path node_modules

# Linux/Mac
ls -la node_modules/
```

**Expected**: Should return `True` or show directory listing

### 2. Check Playwright Installation
```bash
npx playwright --version
```

**Expected output**: `Version 1.40.1` (or higher)

### 3. Check TypeScript Installation
```bash
npx tsc --version
```

**Expected output**: `Version 5.3.3` (or higher)

### 4. Check Cucumber Installation
```bash
npx cucumber-js --version
```

**Expected output**: `10.0.1` (or higher)

### 5. Verify Environment File
```bash
# Windows PowerShell
Test-Path .env

# Linux/Mac
ls -la .env
```

**Expected**: Should exist and contain configuration

---

## 🧪 Quick Test Run

### Run a Single Smoke Test
```bash
npm run test:tags "@smoke-test"
```

**Expected**:
- Browser opens (or runs headless)
- Test executes
- Results displayed
- Takes ~30 seconds

**If successful, you'll see:**
```
✔ Scenario: Successful login with valid admin credentials
```

---

## 🐛 Troubleshooting

### Issue 1: `npm install` fails

**Error**: `EACCES: permission denied`

**Solution**:
```bash
# Run as administrator (Windows)
# Or use sudo (Linux/Mac)
sudo npm install
```

---

### Issue 2: Playwright install fails

**Error**: `Failed to download browser`

**Solution**:
```bash
# Set proxy if behind corporate firewall
set HTTPS_PROXY=http://proxy.company.com:8080

# Then retry
npx playwright install
```

---

### Issue 3: TypeScript compilation errors

**Error**: `Cannot find module '@playwright/test'`

**Solution**:
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

### Issue 4: Tests fail to run

**Error**: `No scenarios found`

**Solution**:
```bash
# Verify feature files exist
ls tests/e2e/features/

# Verify cucumber config
cat cucumber.json
```

---

### Issue 5: Environment variables not loaded

**Error**: `BASE_URL is undefined`

**Solution**:
```bash
# Verify .env file exists
cat .env

# If missing, copy from example
cp .env.example .env
```

---

## 🔧 Configuration Verification

### Verify TypeScript Configuration
```bash
npx tsc --showConfig
```

**Should show**: Compiler options with paths configured

### Verify Cucumber Configuration
```bash
cat cucumber.json
```

**Should contain**:
- `features` path
- `step-definitions` path
- Allure reporter configuration

### Verify Environment Configuration
```bash
cat .env
```

**Should contain**:
- `BASE_URL`
- `BROWSER`
- `HEADLESS`
- Test credentials

---

## 📊 Post-Installation Test

Run this complete test to verify everything works:

```bash
# 1. Run dry-run validation
npm test -- --dry-run

# 2. Run single test scenario
npm test -- tests/e2e/features/login.feature:6

# 3. Generate report
npm run report:generate

# 4. Clean up
npm run clean
```

**All commands should complete without errors.**

---

## 🎯 Next Steps After Installation

1. ✅ **Read the Quick Start**
   ```bash
   cat QUICKSTART.md
   ```

2. ✅ **Run your first test**
   ```bash
   npm test
   ```

3. ✅ **View the report**
   ```bash
   npm run report
   ```

4. ✅ **Explore the framework**
   ```bash
   cat README-AUTOMATION.md
   ```

---

## 📦 What Was Installed?

### Main Dependencies
```json
{
  "@cucumber/cucumber": "^10.0.1",      // BDD framework
  "@playwright/test": "^1.40.1",        // Browser automation
  "typescript": "^5.3.3",               // Type safety
  "allure-cucumberjs": "^2.15.0",       // Reporting
  "winston": "^3.11.0",                 // Logging
  "dotenv": "^16.3.1"                   // Environment config
}
```

### DevDependencies
```json
{
  "ts-node": "^10.9.2",                 // TypeScript execution
  "eslint": "^8.56.0",                  // Code linting
  "prettier": "^3.1.1",                 // Code formatting
  "rimraf": "^5.0.5"                    // Cross-platform file cleanup
}
```

### Total Package Count: ~200 packages
### Total Size: ~500 MB (with browsers)

---

## 🌐 Browser Installation Details

### Installed Browsers

| Browser | Size | Location |
|---------|------|----------|
| Chromium | ~180 MB | `~/.cache/ms-playwright/chromium-*` |
| Firefox | ~120 MB | `~/.cache/ms-playwright/firefox-*` |
| WebKit | ~100 MB | `~/.cache/ms-playwright/webkit-*` |

### Browser Locations (by OS)

**Windows**:
```
%USERPROFILE%\AppData\Local\ms-playwright\
```

**macOS**:
```
~/Library/Caches/ms-playwright/
```

**Linux**:
```
~/.cache/ms-playwright/
```

---

## 🔄 Updating Dependencies

### Update all dependencies
```bash
npm update
```

### Update Playwright browsers
```bash
npx playwright install
```

### Update specific package
```bash
npm update @playwright/test
```

---

## 🗑️ Uninstallation

To completely remove the framework:

```bash
# Remove dependencies
rm -rf node_modules

# Remove package lock
rm package-lock.json

# Remove generated artifacts
npm run clean

# Remove Playwright browsers
npx playwright uninstall --all
```

---

## 💡 Installation Tips

### Tip 1: Faster Installation (Chromium only)
```bash
npm install
npx playwright install chromium
```
**Saves**: ~220 MB (skips Firefox & WebKit)

### Tip 2: Offline Installation
```bash
# On machine with internet
npm install
npm pack

# Transfer .tgz file to offline machine
npm install package-name-1.0.0.tgz
```

### Tip 3: Specific Node Version
```bash
# Using nvm (Node Version Manager)
nvm install 18
nvm use 18
npm install
```

### Tip 4: Skip Optional Dependencies
```bash
npm install --no-optional
```
**Saves**: Installation time

---

## 🎓 Installation Success Indicators

You know installation succeeded when:

- ✅ `node_modules/` folder exists (~200 packages)
- ✅ `npm test -- --dry-run` completes successfully
- ✅ `npx playwright --version` shows version number
- ✅ `.env` file exists with configuration
- ✅ No error messages during installation
- ✅ Browser opens when running `npm run test:headed`

---

## 📞 Getting Help

### Check Logs
```bash
# Installation logs
cat npm-debug.log

# Test execution logs
cat logs/test-execution.log

# Error logs
cat logs/errors.log
```

### Verbose Installation
```bash
npm install --verbose
```

### Check System Requirements
```bash
node --version    # Should be v16+
npm --version     # Should be v8+
```

---

## ✅ Installation Complete!

If all steps completed successfully, you're ready to:

1. **Run tests**: `npm test`
2. **View reports**: `npm run report`
3. **Explore framework**: See `README-AUTOMATION.md`
4. **Get started**: See `QUICKSTART.md`

---

**Installation time**: ~5-10 minutes (depending on internet speed)
**Disk space required**: ~500 MB
**Status**: ✅ Ready for testing!

---

For detailed usage instructions, see:
- `QUICKSTART.md` - Quick start guide
- `README-AUTOMATION.md` - Complete documentation
- `TEST-AUTOMATION-SUMMARY.md` - Framework overview
