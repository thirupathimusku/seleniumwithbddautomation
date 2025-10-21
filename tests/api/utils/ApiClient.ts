import { APIRequestContext, APIResponse, request } from '@playwright/test';
import { Logger } from '../../e2e/utils/Logger';
import { AllureHelper } from '../../e2e/utils/AllureHelper';

/**
 * API Client - Base class for API interactions
 * Provides methods for HTTP requests with logging and reporting
 */
export class ApiClient {
  private context: APIRequestContext | null = null;
  protected logger: Logger;
  protected allure: AllureHelper;
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL?: string) {
    this.logger = new Logger();
    this.allure = new AllureHelper();
    this.baseURL = baseURL || process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  /**
   * Initialize API request context
   */
  async init(): Promise<void> {
    this.context = await request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: this.defaultHeaders,
      ignoreHTTPSErrors: true,
    });
    this.logger.info(`API Client initialized with base URL: ${this.baseURL}`);
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    this.logger.info('Authentication token set');
  }

  /**
   * Set custom header
   */
  setHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }

  /**
   * GET request
   */
  async get(endpoint: string, options?: any): Promise<APIResponse> {
    await this.ensureContext();

    return await this.allure.step(`GET ${endpoint}`, async () => {
      this.logger.info(`Sending GET request to: ${endpoint}`);
      const startTime = Date.now();

      const response = await this.context!.get(endpoint, {
        headers: this.defaultHeaders,
        ...options,
      });

      const duration = Date.now() - startTime;
      await this.logResponse('GET', endpoint, response, duration);

      return response;
    });
  }

  /**
   * POST request
   */
  async post(endpoint: string, data?: any, options?: any): Promise<APIResponse> {
    await this.ensureContext();

    return await this.allure.step(`POST ${endpoint}`, async () => {
      this.logger.info(`Sending POST request to: ${endpoint}`);
      const startTime = Date.now();

      const response = await this.context!.post(endpoint, {
        headers: this.defaultHeaders,
        data,
        ...options,
      });

      const duration = Date.now() - startTime;
      await this.logResponse('POST', endpoint, response, duration, data);

      return response;
    });
  }

  /**
   * PUT request
   */
  async put(endpoint: string, data?: any, options?: any): Promise<APIResponse> {
    await this.ensureContext();

    return await this.allure.step(`PUT ${endpoint}`, async () => {
      this.logger.info(`Sending PUT request to: ${endpoint}`);
      const startTime = Date.now();

      const response = await this.context!.put(endpoint, {
        headers: this.defaultHeaders,
        data,
        ...options,
      });

      const duration = Date.now() - startTime;
      await this.logResponse('PUT', endpoint, response, duration, data);

      return response;
    });
  }

  /**
   * PATCH request
   */
  async patch(endpoint: string, data?: any, options?: any): Promise<APIResponse> {
    await this.ensureContext();

    return await this.allure.step(`PATCH ${endpoint}`, async () => {
      this.logger.info(`Sending PATCH request to: ${endpoint}`);
      const startTime = Date.now();

      const response = await this.context!.patch(endpoint, {
        headers: this.defaultHeaders,
        data,
        ...options,
      });

      const duration = Date.now() - startTime;
      await this.logResponse('PATCH', endpoint, response, duration, data);

      return response;
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint: string, options?: any): Promise<APIResponse> {
    await this.ensureContext();

    return await this.allure.step(`DELETE ${endpoint}`, async () => {
      this.logger.info(`Sending DELETE request to: ${endpoint}`);
      const startTime = Date.now();

      const response = await this.context!.delete(endpoint, {
        headers: this.defaultHeaders,
        ...options,
      });

      const duration = Date.now() - startTime;
      await this.logResponse('DELETE', endpoint, response, duration);

      return response;
    });
  }

  /**
   * Log response details
   */
  private async logResponse(
    method: string,
    endpoint: string,
    response: APIResponse,
    duration: number,
    requestData?: any
  ): Promise<void> {
    const status = response.status();
    const statusText = response.statusText();

    this.logger.info(`${method} ${endpoint} - Status: ${status} ${statusText} - Duration: ${duration}ms`);

    // Add to Allure report
    await this.allure.addParameter('HTTP Method', method);
    await this.allure.addParameter('Endpoint', endpoint);
    await this.allure.addParameter('Status Code', status.toString());
    await this.allure.addParameter('Response Time', `${duration}ms`);

    // Attach request data if present
    if (requestData) {
      await this.allure.attachJSON('Request Body', requestData);
    }

    // Attach response body
    try {
      const responseBody = await response.json();
      await this.allure.attachJSON('Response Body', responseBody);
    } catch {
      const responseText = await response.text();
      if (responseText) {
        await this.allure.attachText('Response Body', responseText);
      }
    }

    // Attach headers
    const headers = response.headers();
    await this.allure.attachJSON('Response Headers', headers);
  }

  /**
   * Verify response status
   */
  async verifyStatus(response: APIResponse, expectedStatus: number): Promise<void> {
    const actualStatus = response.status();

    if (actualStatus !== expectedStatus) {
      const responseBody = await response.text();
      throw new Error(
        `Expected status ${expectedStatus} but got ${actualStatus}. Response: ${responseBody}`
      );
    }

    this.logger.info(`✓ Status code verified: ${actualStatus}`);
  }

  /**
   * Verify response contains key
   */
  async verifyResponseContains(response: APIResponse, key: string): Promise<void> {
    const body = await response.json();

    if (!(key in body)) {
      throw new Error(`Response does not contain key: ${key}`);
    }

    this.logger.info(`✓ Response contains key: ${key}`);
  }

  /**
   * Get response body as JSON
   */
  async getResponseJson(response: APIResponse): Promise<any> {
    return await response.json();
  }

  /**
   * Get response body as text
   */
  async getResponseText(response: APIResponse): Promise<string> {
    return await response.text();
  }

  /**
   * Ensure context is initialized
   */
  private async ensureContext(): Promise<void> {
    if (!this.context) {
      await this.init();
    }
  }

  /**
   * Dispose of context
   */
  async dispose(): Promise<void> {
    if (this.context) {
      await this.context.dispose();
      this.context = null;
      this.logger.info('API Client disposed');
    }
  }
}
