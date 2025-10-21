import * as fs from 'fs';
import * as path from 'path';

/**
 * Test Data Manager
 * Centralized management for test data across the framework
 */
export class TestDataManager {
  private static instance: TestDataManager;
  private credentials: any;

  private constructor() {
    this.loadTestData();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): TestDataManager {
    if (!TestDataManager.instance) {
      TestDataManager.instance = new TestDataManager();
    }
    return TestDataManager.instance;
  }

  /**
   * Load test data from JSON files
   */
  private loadTestData(): void {
    const credentialsPath = path.join(__dirname, 'credentials.json');
    this.credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));
  }

  /**
   * Get valid admin credentials
   */
  public getAdminCredentials(): { username: string; password: string; role: string } {
    return this.credentials.validCredentials.admin;
  }

  /**
   * Get valid ESS credentials
   */
  public getESSCredentials(): { username: string; password: string; role: string } {
    return this.credentials.validCredentials.ess;
  }

  /**
   * Get invalid credentials by type
   * @param type - Type of invalid credential (invalidUsername, invalidPassword, etc.)
   */
  public getInvalidCredentials(type: string): any {
    return this.credentials.invalidCredentials[type];
  }

  /**
   * Get SQL injection payloads
   */
  public getSQLInjectionPayloads(): string[] {
    return this.credentials.securityTestPayloads.sqlInjection;
  }

  /**
   * Get XSS payloads
   */
  public getXSSPayloads(): string[] {
    return this.credentials.securityTestPayloads.xssPayloads;
  }

  /**
   * Get special characters test data
   */
  public getSpecialCharacters(): string[] {
    return this.credentials.securityTestPayloads.specialCharacters;
  }

  /**
   * Get boundary test data
   * @param type - Type of boundary test (maxLengthUsername, caseSensitivity, etc.)
   */
  public getBoundaryTestData(type: string): any {
    return this.credentials.boundaryTestData[type];
  }

  /**
   * Get credentials by environment variable (for flexibility)
   */
  public getCredentialsFromEnv(): { username: string; password: string } {
    return {
      username: process.env.ADMIN_USERNAME || 'Admin',
      password: process.env.ADMIN_PASSWORD || 'admin123',
    };
  }

  /**
   * Get all valid credentials
   */
  public getAllValidCredentials(): any {
    return this.credentials.validCredentials;
  }

  /**
   * Get all invalid credentials
   */
  public getAllInvalidCredentials(): any {
    return this.credentials.invalidCredentials;
  }
}
