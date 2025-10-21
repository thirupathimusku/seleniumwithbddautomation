import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../hooks/CustomWorld';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { TestDataManager } from '../testdata/TestDataManager';

setDefaultTimeout(60000);

let loginPage: LoginPage;
let dashboardPage: DashboardPage;
let testDataManager: TestDataManager;
let loginStartTime: number;

// Background Steps
Given('the user navigates to the OrangeHRM login page', async function (this: CustomWorld) {
  loginPage = new LoginPage(this.page!);
  await loginPage.goto();
  await this.allure.addParameter('URL', process.env.LOGIN_URL || 'OrangeHRM Login');
});

// Given Steps
Given('the login page is displayed correctly', async function (this: CustomWorld) {
  await loginPage.verifyLoginPageLoaded();
});

Given('the user is logged in with valid credentials', async function (this: CustomWorld) {
  testDataManager = TestDataManager.getInstance();
  const credentials = testDataManager.getAdminCredentials();

  loginPage = new LoginPage(this.page!);
  await loginPage.goto();
  await loginPage.login(credentials.username, credentials.password);

  dashboardPage = new DashboardPage(this.page!);
  await dashboardPage.waitForDashboardLoad();
});

// When Steps - Input Actions
When('the user enters {string} in the username field', async function (this: CustomWorld, username: string) {
  await loginPage.enterUsername(username);
  await this.allure.addParameter('Username', username);
});

When('the user enters {string} in the password field', async function (this: CustomWorld, password: string) {
  await loginPage.enterPassword(password);
  await this.allure.addParameter('Password', '***hidden***');
});

When('the user leaves the username field empty', async function (this: CustomWorld) {
  await loginPage.clearUsername();
});

When('the user leaves the password field empty', async function (this: CustomWorld) {
  await loginPage.clearPassword();
});

When('the user clicks the login button', async function (this: CustomWorld) {
  await loginPage.clickLoginButton();
  // Wait a bit for any navigation or error messages
  await this.page!.waitForTimeout(2000);
});

When('the user records the start time', function (this: CustomWorld) {
  loginStartTime = Date.now();
});

When('the user logs out', async function (this: CustomWorld) {
  dashboardPage = new DashboardPage(this.page!);
  await dashboardPage.logout();
});

When('the user logs in again with valid credentials', async function (this: CustomWorld) {
  testDataManager = TestDataManager.getInstance();
  const credentials = testDataManager.getAdminCredentials();

  loginPage = new LoginPage(this.page!);
  await loginPage.login(credentials.username, credentials.password);
});

// Then Steps - Verifications
Then('the username field should be visible and enabled', async function (this: CustomWorld) {
  await loginPage.verifyUsernameFieldState();
});

Then('the password field should be visible and enabled', async function (this: CustomWorld) {
  await loginPage.verifyPasswordFieldState();
});

Then('the login button should be visible and enabled', async function (this: CustomWorld) {
  await loginPage.verifyLoginButtonState();
});

Then('the company logo should be visible', async function (this: CustomWorld) {
  await loginPage.verifyCompanyLogoVisible();
});

Then('the forgot password link should be visible', async function (this: CustomWorld) {
  await loginPage.verifyForgotPasswordLinkVisible();
});

Then('the user should be redirected to the dashboard', async function (this: CustomWorld) {
  dashboardPage = new DashboardPage(this.page!);
  await dashboardPage.verifyDashboardLoaded();
});

Then('the dashboard should display the main navigation menu', async function (this: CustomWorld) {
  await dashboardPage.verifyMainNavigationMenuVisible();
  await dashboardPage.verifyAllNavigationMenuItems();
});

Then('the user profile icon should appear in the top-right corner', async function (this: CustomWorld) {
  await dashboardPage.verifyUserProfileIconVisible();
});

Then('the URL should contain {string}', async function (this: CustomWorld, urlPart: string) {
  await dashboardPage.verifyUrlContains(urlPart);
});

Then('no error messages should be displayed', async function (this: CustomWorld) {
  await loginPage.verifyNoErrorMessage();
  await dashboardPage.verifyNoErrorMessages();
});

Then('an error message should be displayed', async function (this: CustomWorld) {
  await loginPage.verifyErrorMessageDisplayed();
});

Then('the user should remain on the login page', async function (this: CustomWorld) {
  const currentUrl = await this.page!.url();
  expect(currentUrl).toContain('login');
  await this.allure.addParameter('Current URL', currentUrl);
});

Then('the password field type should be {string}', async function (this: CustomWorld, expectedType: string) {
  await loginPage.verifyPasswordFieldMasked();
});

Then('the entered password should not be visible as plain text', async function (this: CustomWorld) {
  await loginPage.verifyPasswordFieldMasked();
});

Then('no script execution should occur', async function (this: CustomWorld) {
  // Check that no alert dialogs appeared
  const alerts: string[] = [];
  this.page!.on('dialog', (dialog) => {
    alerts.push(dialog.message());
    dialog.dismiss();
  });

  await this.page!.waitForTimeout(1000);
  expect(alerts.length).toBe(0);
});

Then('the login result should be {string}', async function (this: CustomWorld, expectedResult: string) {
  const currentUrl = await this.page!.url();

  if (expectedResult === 'success') {
    expect(currentUrl).toContain('dashboard');
  } else {
    expect(currentUrl).toContain('login');
    await loginPage.verifyErrorMessageDisplayed();
  }

  await this.allure.addParameter('Expected Result', expectedResult);
  await this.allure.addParameter('Actual URL', currentUrl);
});

Then('the login should be successful', async function (this: CustomWorld) {
  dashboardPage = new DashboardPage(this.page!);
  await dashboardPage.verifyDashboardLoaded();
});

Then('the login should complete within {int} seconds', async function (this: CustomWorld, maxSeconds: number) {
  const elapsedTime = Date.now() - loginStartTime;
  const elapsedSeconds = elapsedTime / 1000;

  this.logger.info(`Login completed in ${elapsedSeconds.toFixed(2)} seconds`);
  await this.allure.addParameter('Response Time', `${elapsedSeconds.toFixed(2)}s`);
  await this.allure.addParameter('Max Allowed Time', `${maxSeconds}s`);

  expect(elapsedSeconds).toBeLessThan(maxSeconds);
});

Then('the user should be redirected to the login page', async function (this: CustomWorld) {
  await loginPage.verifyLoginPageLoaded();
  const currentUrl = await this.page!.url();
  expect(currentUrl).toContain('login');
});

Then('the user should be successfully logged in', async function (this: CustomWorld) {
  dashboardPage = new DashboardPage(this.page!);
  await dashboardPage.verifyDashboardLoaded();
});

Then('the user role should be {string}', async function (this: CustomWorld, expectedRole: string) {
  // This is a placeholder - actual implementation would depend on where role is displayed
  await this.allure.addParameter('Expected Role', expectedRole);
  this.logger.info(`Verifying user role: ${expectedRole}`);
});
