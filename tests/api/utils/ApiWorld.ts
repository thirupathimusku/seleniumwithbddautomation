import { World, IWorldOptions } from '@cucumber/cucumber';
import { APIResponse, APIRequestContext } from '@playwright/test';
import { Logger } from '../../e2e/utils/Logger';
import { AllureHelper } from '../../e2e/utils/AllureHelper';
import { AuthService } from '../services/AuthService';
import { UserService } from '../services/UserService';

/**
 * API World class for Cucumber
 * Extends the base World class with API-specific context
 */
export class ApiWorld extends World {
  public apiContext?: APIRequestContext;
  public apiResponse!: APIResponse;
  public responseTime!: number;
  public logger: Logger;
  public allure: AllureHelper;

  // Services
  public authService?: AuthService;
  public userService?: UserService;

  // Test data
  public authToken?: string;
  public createdUserId?: number;
  public createdUserData?: any;
  public updatedUserData?: any;
  public searchCriteria?: any;
  public paginationParams?: any;

  // Scenario information
  public scenarioName?: string;
  public scenarioTags?: string[];
  public scenarioStatus?: 'passed' | 'failed' | 'skipped';

  constructor(options: IWorldOptions) {
    super(options);

    // Initialize utilities
    this.logger = new Logger();
    this.allure = new AllureHelper();
  }

  /**
   * Cleanup resources after scenario
   */
  async cleanup(): Promise<void> {
    // Dispose of services
    if (this.authService) {
      await this.authService.dispose();
    }

    if (this.userService) {
      await this.userService.dispose();
    }

    this.logger.info('API World cleanup completed');
  }

  /**
   * Get response body as JSON
   */
  async getResponseJson(): Promise<any> {
    if (!this.apiResponse) {
      throw new Error('No API response available');
    }

    return await this.apiResponse.json();
  }

  /**
   * Get response body as text
   */
  async getResponseText(): Promise<string> {
    if (!this.apiResponse) {
      throw new Error('No API response available');
    }

    return await this.apiResponse.text();
  }

  /**
   * Get response status code
   */
  getResponseStatus(): number {
    if (!this.apiResponse) {
      throw new Error('No API response available');
    }

    return this.apiResponse.status();
  }

  /**
   * Get response headers
   */
  getResponseHeaders(): Record<string, string> {
    if (!this.apiResponse) {
      throw new Error('No API response available');
    }

    return this.apiResponse.headers();
  }

  /**
   * Attach response details to Allure
   */
  async attachResponseToReport(): Promise<void> {
    if (!this.apiResponse) {
      return;
    }

    // Attach status code
    await this.allure.addParameter('Status Code', this.getResponseStatus().toString());

    // Attach response time
    if (this.responseTime) {
      await this.allure.addParameter('Response Time', `${this.responseTime}ms`);
    }

    // Attach response body
    try {
      const body = await this.getResponseJson();
      await this.allure.attachJSON('Response Body', body);
    } catch {
      const text = await this.getResponseText();
      if (text) {
        await this.allure.attachText('Response Body', text);
      }
    }

    // Attach headers
    const headers = this.getResponseHeaders();
    await this.allure.attachJSON('Response Headers', headers);
  }
}
