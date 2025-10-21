import { Browser, BrowserContext, Page, chromium, firefox, webkit } from '@playwright/test';
import { Logger } from './Logger';

/**
 * Browser Helper
 * Manages browser instances and contexts
 */
export class BrowserHelper {
  private logger: Logger;
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;

  constructor() {
    this.logger = new Logger();
  }

  /**
   * Launch browser based on configuration
   */
  async launchBrowser(): Promise<Browser> {
    const browserType = process.env.BROWSER || 'chromium';
    const headless = process.env.HEADLESS === 'true';
    const slowMo = parseInt(process.env.SLOW_MO || '0');

    this.logger.info(`Launching ${browserType} browser in ${headless ? 'headless' : 'headed'} mode`);

    const launchOptions = {
      headless,
      slowMo,
      args: ['--start-maximized', '--disable-blink-features=AutomationControlled'],
    };

    switch (browserType.toLowerCase()) {
      case 'firefox':
        this.browser = await firefox.launch(launchOptions);
        break;
      case 'webkit':
      case 'safari':
        this.browser = await webkit.launch(launchOptions);
        break;
      case 'chromium':
      case 'chrome':
      case 'msedge':
      default:
        this.browser = await chromium.launch(launchOptions);
        break;
    }

    return this.browser;
  }

  /**
   * Create browser context
   */
  async createContext(): Promise<BrowserContext> {
    if (!this.browser) {
      await this.launchBrowser();
    }

    const viewportWidth = parseInt(process.env.VIEWPORT_WIDTH || '1920');
    const viewportHeight = parseInt(process.env.VIEWPORT_HEIGHT || '1080');

    this.context = await this.browser!.newContext({
      viewport: { width: viewportWidth, height: viewportHeight },
      recordVideo: process.env.VIDEO_ON_FAILURE === 'true' ? { dir: 'test-results/videos' } : undefined,
      acceptDownloads: true,
      ignoreHTTPSErrors: true,
      permissions: ['geolocation', 'notifications'],
    });

    // Enable tracing if configured
    if (process.env.TRACE_ON_FAILURE === 'true') {
      await this.context.tracing.start({ screenshots: true, snapshots: true });
    }

    return this.context;
  }

  /**
   * Create new page
   */
  async createPage(): Promise<Page> {
    if (!this.context) {
      await this.createContext();
    }

    this.page = await this.context!.newPage();
    this.page.setDefaultTimeout(parseInt(process.env.DEFAULT_TIMEOUT || '30000'));
    this.page.setDefaultNavigationTimeout(parseInt(process.env.NAVIGATION_TIMEOUT || '30000'));

    return this.page;
  }

  /**
   * Get current page
   */
  getPage(): Page | null {
    return this.page;
  }

  /**
   * Get current context
   */
  getContext(): BrowserContext | null {
    return this.context;
  }

  /**
   * Get current browser
   */
  getBrowser(): Browser | null {
    return this.browser;
  }

  /**
   * Close page
   */
  async closePage(): Promise<void> {
    if (this.page) {
      await this.page.close();
      this.page = null;
    }
  }

  /**
   * Close context
   */
  async closeContext(): Promise<void> {
    if (this.context) {
      await this.context.close();
      this.context = null;
    }
  }

  /**
   * Close browser
   */
  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Save trace on failure
   */
  async saveTrace(scenarioName: string): Promise<void> {
    if (this.context && process.env.TRACE_ON_FAILURE === 'true') {
      const tracePath = `test-results/traces/${scenarioName.replace(/\s/g, '-')}-${Date.now()}.zip`;
      await this.context.tracing.stop({ path: tracePath });
      this.logger.info(`Trace saved to: ${tracePath}`);
    }
  }

  /**
   * Take screenshot on failure
   */
  async takeScreenshotOnFailure(scenarioName: string): Promise<Buffer | null> {
    if (this.page && process.env.SCREENSHOT_ON_FAILURE === 'true') {
      const screenshotPath = `screenshots/${scenarioName.replace(/\s/g, '-')}-${Date.now()}.png`;
      const screenshot = await this.page.screenshot({ path: screenshotPath, fullPage: true });
      this.logger.info(`Screenshot saved to: ${screenshotPath}`);
      return screenshot;
    }
    return null;
  }
}
