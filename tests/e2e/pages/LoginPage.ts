import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Login Page Object Model
 * Contains all elements and actions for the OrangeHRM login page
 */
export class LoginPage extends BasePage {
  // Page elements
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly companyLogo: Locator;
  private readonly forgotPasswordLink: Locator;
  private readonly errorMessage: Locator;
  private readonly loginHeader: Locator;
  private readonly usernameLabel: Locator;
  private readonly passwordLabel: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize page elements
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.companyLogo = page.locator('img[alt*="company-branding"], img[alt*="logo"]').first();
    this.forgotPasswordLink = page.getByText('Forgot your password?');
    this.errorMessage = page.locator('.oxd-alert-content-text, .oxd-alert--error, [role="alert"]');
    this.loginHeader = page.locator('h5').filter({ hasText: 'Login' });
    this.usernameLabel = page.locator('label').filter({ hasText: 'Username' });
    this.passwordLabel = page.locator('label').filter({ hasText: 'Password' });
  }

  /**
   * Navigate to login page
   */
  async goto(): Promise<void> {
    const loginUrl = process.env.LOGIN_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';
    await this.navigateTo(loginUrl);
    await this.waitForPageLoad();
  }

  /**
   * Verify login page is loaded
   */
  async verifyLoginPageLoaded(): Promise<void> {
    await this.allure.step('Verify login page is loaded', async () => {
      await this.verifyElementVisible(this.usernameInput, 'Username field');
      await this.verifyElementVisible(this.passwordInput, 'Password field');
      await this.verifyElementVisible(this.loginButton, 'Login button');
    });
  }

  /**
   * Enter username
   * @param username - Username to enter
   */
  async enterUsername(username: string): Promise<void> {
    await this.fill(this.usernameInput, username, 'Username field');
  }

  /**
   * Enter password
   * @param password - Password to enter
   */
  async enterPassword(password: string): Promise<void> {
    await this.fill(this.passwordInput, password, 'Password field');
  }

  /**
   * Click login button
   */
  async clickLoginButton(): Promise<void> {
    await this.click(this.loginButton, 'Login button');
  }

  /**
   * Perform login with credentials
   * @param username - Username
   * @param password - Password
   */
  async login(username: string, password: string): Promise<void> {
    await this.allure.step(`Login with username: ${username}`, async () => {
      await this.enterUsername(username);
      await this.enterPassword(password);
      await this.clickLoginButton();
    });
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    await this.waitForElement(this.errorMessage, 5000);
    return await this.getText(this.errorMessage);
  }

  /**
   * Verify error message is displayed
   */
  async verifyErrorMessageDisplayed(): Promise<void> {
    await this.verifyElementVisible(this.errorMessage, 'Error message');
  }

  /**
   * Verify error message contains text
   * @param expectedText - Expected error message text
   */
  async verifyErrorMessageContains(expectedText: string): Promise<void> {
    const actualMessage = await this.getErrorMessage();
    await this.allure.step(`Verify error message contains: ${expectedText}`, async () => {
      if (!actualMessage.includes(expectedText)) {
        throw new Error(`Expected error message to contain "${expectedText}", but got "${actualMessage}"`);
      }
    });
  }

  /**
   * Verify company logo is visible
   */
  async verifyCompanyLogoVisible(): Promise<void> {
    await this.verifyElementVisible(this.companyLogo, 'Company logo');
  }

  /**
   * Verify forgot password link is visible
   */
  async verifyForgotPasswordLinkVisible(): Promise<void> {
    await this.verifyElementVisible(this.forgotPasswordLink, 'Forgot password link');
  }

  /**
   * Verify username field is visible and enabled
   */
  async verifyUsernameFieldState(): Promise<void> {
    await this.allure.step('Verify username field is visible and enabled', async () => {
      await this.verifyElementVisible(this.usernameInput, 'Username field');
      const isEnabled = await this.isEnabled(this.usernameInput);
      if (!isEnabled) {
        throw new Error('Username field is not enabled');
      }
    });
  }

  /**
   * Verify password field is visible and enabled
   */
  async verifyPasswordFieldState(): Promise<void> {
    await this.allure.step('Verify password field is visible and enabled', async () => {
      await this.verifyElementVisible(this.passwordInput, 'Password field');
      const isEnabled = await this.isEnabled(this.passwordInput);
      if (!isEnabled) {
        throw new Error('Password field is not enabled');
      }
    });
  }

  /**
   * Verify password field type is password (masked)
   */
  async verifyPasswordFieldMasked(): Promise<void> {
    await this.allure.step('Verify password field is masked', async () => {
      const inputType = await this.passwordInput.getAttribute('type');
      if (inputType !== 'password') {
        throw new Error(`Expected password field type to be 'password', but got '${inputType}'`);
      }
    });
  }

  /**
   * Verify login button is visible and enabled
   */
  async verifyLoginButtonState(): Promise<void> {
    await this.allure.step('Verify login button is visible and enabled', async () => {
      await this.verifyElementVisible(this.loginButton, 'Login button');
      const isEnabled = await this.isEnabled(this.loginButton);
      if (!isEnabled) {
        throw new Error('Login button is not enabled');
      }
    });
  }

  /**
   * Clear username field
   */
  async clearUsername(): Promise<void> {
    await this.usernameInput.clear();
  }

  /**
   * Clear password field
   */
  async clearPassword(): Promise<void> {
    await this.passwordInput.clear();
  }

  /**
   * Verify no error message is displayed
   */
  async verifyNoErrorMessage(): Promise<void> {
    await this.allure.step('Verify no error message is displayed', async () => {
      const isVisible = await this.isVisible(this.errorMessage);
      if (isVisible) {
        const message = await this.getText(this.errorMessage);
        throw new Error(`Expected no error message, but found: ${message}`);
      }
    });
  }
}
