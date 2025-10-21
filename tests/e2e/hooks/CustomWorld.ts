import { World, IWorldOptions } from '@cucumber/cucumber';
import { Page, Browser, BrowserContext } from '@playwright/test';
import { BrowserHelper } from '../utils/BrowserHelper';
import { Logger } from '../utils/Logger';
import { AllureHelper } from '../utils/AllureHelper';

/**
 * Custom World class for Cucumber
 * Extends the base World class with Playwright and custom utilities
 */
export class CustomWorld extends World {
  public browser?: Browser;
  public context?: BrowserContext;
  public page?: Page;
  public browserHelper: BrowserHelper;
  public logger: Logger;
  public allure: AllureHelper;

  // Store scenario information
  public scenarioName?: string;
  public scenarioTags?: string[];
  public scenarioStatus?: 'passed' | 'failed' | 'skipped';

  constructor(options: IWorldOptions) {
    super(options);

    // Initialize utilities
    this.browserHelper = new BrowserHelper();
    this.logger = new Logger();
    this.allure = new AllureHelper();
  }

  /**
   * Initialize browser for the scenario
   */
  async init(): Promise<void> {
    this.browser = await this.browserHelper.launchBrowser();
    this.context = await this.browserHelper.createContext();
    this.page = await this.browserHelper.createPage();

    this.logger.info('Browser initialized successfully');
  }

  /**
   * Cleanup resources after scenario
   */
  async cleanup(): Promise<void> {
    if (this.page) {
      await this.page.close();
    }
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }

    this.logger.info('Browser cleanup completed');
  }

  /**
   * Take screenshot on failure
   */
  async captureScreenshot(scenarioName: string): Promise<void> {
    if (this.page) {
      const screenshot = await this.browserHelper.takeScreenshotOnFailure(scenarioName);
      if (screenshot) {
        await this.allure.attachScreenshot(`Failure Screenshot - ${scenarioName}`, screenshot);
      }
    }
  }

  /**
   * Save trace on failure
   */
  async captureTrace(scenarioName: string): Promise<void> {
    await this.browserHelper.saveTrace(scenarioName);
  }

  /**
   * Attach page HTML to report
   */
  async attachPageHTML(): Promise<void> {
    if (this.page) {
      const html = await this.page.content();
      await this.allure.attachText('Page HTML', html);
    }
  }

  /**
   * Attach console logs to report
   */
  async attachConsoleLogs(logs: string[]): Promise<void> {
    if (logs.length > 0) {
      await this.allure.attachText('Console Logs', logs.join('\n'));
    }
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    if (this.page) {
      return await this.page.title();
    }
    return '';
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    if (this.page) {
      return this.page.url();
    }
    return '';
  }
}
