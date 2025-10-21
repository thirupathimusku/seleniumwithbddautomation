import { Page, Locator, expect } from '@playwright/test';
import { Logger } from '../utils/Logger';
import { AllureHelper } from '../utils/AllureHelper';

/**
 * Base Page Object Model
 * Contains common methods used across all page objects
 */
export class BasePage {
  protected page: Page;
  protected logger: Logger;
  protected allure: AllureHelper;

  constructor(page: Page) {
    this.page = page;
    this.logger = new Logger();
    this.allure = new AllureHelper();
  }

  /**
   * Navigate to a specific URL
   * @param url - URL to navigate to
   */
  async navigateTo(url: string): Promise<void> {
    this.logger.info(`Navigating to: ${url}`);
    await this.allure.step(`Navigate to ${url}`, async () => {
      await this.page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: parseInt(process.env.NAVIGATION_TIMEOUT || '30000'),
      });
    });
  }

  /**
   * Wait for element to be visible
   * @param locator - Element locator
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForElement(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({
      state: 'visible',
      timeout: timeout || parseInt(process.env.DEFAULT_TIMEOUT || '30000'),
    });
  }

  /**
   * Click an element with wait
   * @param locator - Element locator
   * @param description - Description for logging/reporting
   */
  async click(locator: Locator, description: string): Promise<void> {
    this.logger.info(`Clicking: ${description}`);
    await this.allure.step(`Click ${description}`, async () => {
      await this.waitForElement(locator);
      await locator.click();
    });
  }

  /**
   * Fill input field
   * @param locator - Element locator
   * @param value - Value to fill
   * @param description - Description for logging/reporting
   */
  async fill(locator: Locator, value: string, description: string): Promise<void> {
    this.logger.info(`Filling ${description} with: ${value}`);
    await this.allure.step(`Fill ${description}`, async () => {
      await this.waitForElement(locator);
      await locator.clear();
      await locator.fill(value);
    });
  }

  /**
   * Get text from an element
   * @param locator - Element locator
   */
  async getText(locator: Locator): Promise<string> {
    await this.waitForElement(locator);
    const text = await locator.textContent();
    return text?.trim() || '';
  }

  /**
   * Check if element is visible
   * @param locator - Element locator
   */
  async isVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if element is enabled
   * @param locator - Element locator
   */
  async isEnabled(locator: Locator): Promise<boolean> {
    return await locator.isEnabled();
  }

  /**
   * Wait for page load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Take screenshot
   * @param name - Screenshot name
   */
  async takeScreenshot(name: string): Promise<void> {
    const screenshot = await this.page.screenshot({
      path: `screenshots/${name}-${Date.now()}.png`,
      fullPage: true,
    });
    await this.allure.attachScreenshot(name, screenshot);
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Verify element text
   * @param locator - Element locator
   * @param expectedText - Expected text
   */
  async verifyText(locator: Locator, expectedText: string): Promise<void> {
    await this.allure.step(`Verify text: ${expectedText}`, async () => {
      await expect(locator).toHaveText(expectedText);
    });
  }

  /**
   * Verify element is visible
   * @param locator - Element locator
   * @param description - Description for reporting
   */
  async verifyElementVisible(locator: Locator, description: string): Promise<void> {
    await this.allure.step(`Verify ${description} is visible`, async () => {
      await expect(locator).toBeVisible();
    });
  }

  /**
   * Verify URL contains text
   * @param expectedUrlPart - Expected URL part
   */
  async verifyUrlContains(expectedUrlPart: string): Promise<void> {
    await this.allure.step(`Verify URL contains: ${expectedUrlPart}`, async () => {
      expect(this.page.url()).toContain(expectedUrlPart);
    });
  }
}
