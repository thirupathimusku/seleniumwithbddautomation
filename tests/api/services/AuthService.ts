import { APIResponse } from '@playwright/test';
import { ApiClient } from '../utils/ApiClient';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
export class AuthService extends ApiClient {
  private readonly endpoints = {
    login: '/web/index.php/auth/validate',
    logout: '/web/index.php/auth/logout',
    session: '/web/index.php/api/v2/admin/users',
  };

  /**
   * Login via API
   * @param username - Username
   * @param password - Password
   */
  async login(username: string, password: string): Promise<APIResponse> {
    const loginData = {
      username,
      password,
    };

    return await this.post(this.endpoints.login, loginData);
  }

  /**
   * Logout via API
   */
  async logout(): Promise<APIResponse> {
    return await this.post(this.endpoints.logout);
  }

  /**
   * Get current session/user info
   */
  async getSessionInfo(): Promise<APIResponse> {
    return await this.get(this.endpoints.session);
  }

  /**
   * Validate token
   * @param token - Auth token to validate
   */
  async validateToken(token: string): Promise<APIResponse> {
    this.setAuthToken(token);
    return await this.getSessionInfo();
  }

  /**
   * Login and get auth token
   */
  async loginAndGetToken(username: string, password: string): Promise<string> {
    const response = await this.login(username, password);
    const cookies = response.headers()['set-cookie'];

    // Extract token from cookies or response
    // This is OrangeHRM-specific - adjust based on actual API
    if (cookies) {
      const tokenMatch = cookies.match(/token=([^;]+)/);
      if (tokenMatch) {
        return tokenMatch[1];
      }
    }

    // Alternative: extract from response body
    try {
      const body = await response.json();
      return body.token || body.access_token || '';
    } catch {
      return '';
    }
  }

  /**
   * Verify login successful
   */
  async verifyLoginSuccessful(response: APIResponse): Promise<void> {
    await this.verifyStatus(response, 200);

    const body = await response.json().catch(() => ({}));

    // OrangeHRM-specific validation
    // Adjust based on actual API response structure
    if (body.error) {
      throw new Error(`Login failed: ${body.error}`);
    }
  }

  /**
   * Verify login failed
   */
  async verifyLoginFailed(response: APIResponse): Promise<void> {
    const status = response.status();

    // Typically 401 (Unauthorized) or 400 (Bad Request)
    if (status !== 401 && status !== 400 && status !== 403) {
      throw new Error(`Expected login to fail, but got status ${status}`);
    }

    this.logger.info(`✓ Login failed as expected with status: ${status}`);
  }
}
