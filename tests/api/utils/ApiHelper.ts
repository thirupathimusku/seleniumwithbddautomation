import { APIResponse } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * API Helper - Utility methods for API testing
 * Provides validation, assertion, and helper methods
 */
export class ApiHelper {
  /**
   * Validate JSON schema
   */
  static validateSchema(data: any, schema: any): boolean {
    // Simple schema validation - can be extended with ajv or joi
    for (const key in schema) {
      if (schema[key].required && !(key in data)) {
        throw new Error(`Missing required field: ${key}`);
      }

      if (key in data) {
        const expectedType = schema[key].type;
        const actualType = typeof data[key];

        if (expectedType !== actualType && data[key] !== null) {
          throw new Error(`Field ${key} expected type ${expectedType} but got ${actualType}`);
        }
      }
    }

    return true;
  }

  /**
   * Assert status code
   */
  static async assertStatusCode(response: APIResponse, expectedStatus: number): Promise<void> {
    const actualStatus = response.status();
    expect(actualStatus).toBe(expectedStatus);
  }

  /**
   * Assert response time
   */
  static assertResponseTime(duration: number, maxDuration: number): void {
    expect(duration).toBeLessThan(maxDuration);
  }

  /**
   * Assert response contains key
   */
  static assertResponseContainsKey(data: any, key: string): void {
    expect(data).toHaveProperty(key);
  }

  /**
   * Assert response contains value
   */
  static assertResponseContainsValue(data: any, key: string, expectedValue: any): void {
    expect(data[key]).toBe(expectedValue);
  }

  /**
   * Assert response is array
   */
  static assertResponseIsArray(data: any): void {
    expect(Array.isArray(data)).toBe(true);
  }

  /**
   * Assert array length
   */
  static assertArrayLength(data: any[], expectedLength: number): void {
    expect(data.length).toBe(expectedLength);
  }

  /**
   * Assert array not empty
   */
  static assertArrayNotEmpty(data: any[]): void {
    expect(data.length).toBeGreaterThan(0);
  }

  /**
   * Extract value from response
   */
  static extractValue(data: any, path: string): any {
    const keys = path.split('.');
    let value = data;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return undefined;
      }
    }

    return value;
  }

  /**
   * Generate random string
   */
  static generateRandomString(length: number = 10): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate random email
   */
  static generateRandomEmail(): string {
    return `test.${this.generateRandomString(8)}@example.com`;
  }

  /**
   * Generate random number
   */
  static generateRandomNumber(min: number = 1, max: number = 1000): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Format request body for logging
   */
  static formatRequestBody(body: any): string {
    return JSON.stringify(body, null, 2);
  }

  /**
   * Format response body for logging
   */
  static formatResponseBody(body: any): string {
    return JSON.stringify(body, null, 2);
  }

  /**
   * Parse error response
   */
  static async parseErrorResponse(response: APIResponse): Promise<string> {
    try {
      const body = await response.json();
      return body.error || body.message || JSON.stringify(body);
    } catch {
      return await response.text();
    }
  }

  /**
   * Build query string
   */
  static buildQueryString(params: Record<string, any>): string {
    const queryParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    }

    return queryParams.toString();
  }

  /**
   * Merge headers
   */
  static mergeHeaders(...headerObjects: Record<string, string>[]): Record<string, string> {
    return Object.assign({}, ...headerObjects);
  }

  /**
   * Wait for condition
   */
  static async waitForCondition(
    condition: () => Promise<boolean>,
    timeout: number = 5000,
    interval: number = 500
  ): Promise<void> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error(`Condition not met within ${timeout}ms`);
  }
}
