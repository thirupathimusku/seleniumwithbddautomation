import { APIResponse } from '@playwright/test';
import { ApiClient } from '../utils/ApiClient';

/**
 * User Service
 * Handles all user management API calls
 */
export class UserService extends ApiClient {
  private readonly endpoints = {
    users: '/web/index.php/api/v2/admin/users',
    userById: (id: number) => `/web/index.php/api/v2/admin/users/${id}`,
    search: '/web/index.php/api/v2/admin/users/search',
  };

  /**
   * Get all users
   * @param limit - Number of users to retrieve
   * @param offset - Offset for pagination
   */
  async getAllUsers(limit: number = 50, offset: number = 0): Promise<APIResponse> {
    const queryParams = { limit, offset };
    return await this.get(`${this.endpoints.users}?limit=${limit}&offset=${offset}`);
  }

  /**
   * Get user by ID
   * @param userId - User ID
   */
  async getUserById(userId: number): Promise<APIResponse> {
    return await this.get(this.endpoints.userById(userId));
  }

  /**
   * Create new user
   * @param userData - User data
   */
  async createUser(userData: any): Promise<APIResponse> {
    return await this.post(this.endpoints.users, userData);
  }

  /**
   * Update user
   * @param userId - User ID
   * @param userData - Updated user data
   */
  async updateUser(userId: number, userData: any): Promise<APIResponse> {
    return await this.put(this.endpoints.userById(userId), userData);
  }

  /**
   * Delete user
   * @param userId - User ID
   */
  async deleteUser(userId: number): Promise<APIResponse> {
    return await this.delete(this.endpoints.userById(userId));
  }

  /**
   * Search users
   * @param searchCriteria - Search criteria
   */
  async searchUsers(searchCriteria: any): Promise<APIResponse> {
    return await this.post(this.endpoints.search, searchCriteria);
  }

  /**
   * Verify user exists
   */
  async verifyUserExists(userId: number): Promise<void> {
    const response = await this.getUserById(userId);
    await this.verifyStatus(response, 200);

    const body = await response.json();
    if (!body.data || body.data.id !== userId) {
      throw new Error(`User ${userId} does not exist`);
    }

    this.logger.info(`✓ User ${userId} exists`);
  }

  /**
   * Verify user created
   */
  async verifyUserCreated(response: APIResponse): Promise<number> {
    await this.verifyStatus(response, 201);

    const body = await response.json();
    const userId = body.data?.id;

    if (!userId) {
      throw new Error('User created but no ID returned');
    }

    this.logger.info(`✓ User created with ID: ${userId}`);
    return userId;
  }

  /**
   * Verify user deleted
   */
  async verifyUserDeleted(response: APIResponse): Promise<void> {
    await this.verifyStatus(response, 200);
    this.logger.info(`✓ User deleted successfully`);
  }
}
