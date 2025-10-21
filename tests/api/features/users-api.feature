@api @users @users-api
Feature: User Management API
  As an API client
  I want to manage users via API
  So that I can perform CRUD operations on user data

  Background:
    Given the API client is initialized
    And I am authenticated via API

  @positive @P1 @API-USER-001
  Scenario: Get all users via API
    When I send a GET request to users endpoint
    Then the API response status code should be 200
    And the response should contain a list of users
    And the response time should be less than 2000 milliseconds

  @positive @P1 @API-USER-002
  Scenario: Get user by ID via API
    When I send a GET request to users endpoint with ID 1
    Then the API response status code should be 200
    And the response should contain user details
    And the user should have a valid username

  @positive @P0 @API-USER-003
  Scenario: Create new user via API
    When I send a POST request to create a new user with valid data
    Then the API response status code should be 201
    And the response should contain the created user ID
    And I can retrieve the created user by ID

  @positive @P1 @API-USER-004
  Scenario: Update existing user via API
    Given a user exists in the system
    When I send a PUT request to update the user
    Then the API response status code should be 200
    And the user should be updated with new data

  @positive @P1 @API-USER-005
  Scenario: Delete user via API
    Given a user exists in the system
    When I send a DELETE request to delete the user
    Then the API response status code should be 200
    And the user should no longer exist in the system

  @positive @P1 @API-USER-006
  Scenario: Search users via API
    When I send a POST request to search users with criteria
    Then the API response status code should be 200
    And the response should contain matching users
    And all returned users should match the search criteria

  @negative @P1 @API-USER-007
  Scenario: Get non-existent user returns 404
    When I send a GET request to users endpoint with ID 999999
    Then the API response status code should be 404

  @negative @P0 @API-USER-008
  Scenario: Create user without required fields fails
    When I send a POST request to create a user without username
    Then the API response status code should be 400
    And the response should contain validation error message

  @negative @P1 @API-USER-009
  Scenario: Update non-existent user returns 404
    When I send a PUT request to update user with ID 999999
    Then the API response status code should be 404

  @negative @P1 @API-USER-010
  Scenario: Delete non-existent user returns 404
    When I send a DELETE request to delete user with ID 999999
    Then the API response status code should be 404

  @pagination @P2 @API-USER-011
  Scenario: Get users with pagination
    When I send a GET request to users endpoint with limit 10 and offset 0
    Then the API response status code should be 200
    And the response should contain maximum 10 users
    And the response should include pagination metadata

  @performance @P1 @API-USER-012
  Scenario: User API response time should meet SLA
    When I send a GET request to users endpoint
    Then the API response status code should be 200
    And the response time should be less than 2000 milliseconds

  @schema @P1 @API-USER-013
  Scenario: User API response should match expected schema
    When I send a GET request to users endpoint with ID 1
    Then the API response status code should be 200
    And the response should match the user schema

  @security @P0 @API-USER-014
  Scenario: Unauthorized request to users API should fail
    Given the API client has no authentication
    When I send a GET request to users endpoint
    Then the API response status code should be 401 or 403

  @data-driven @P2
  Scenario Outline: Create users with different data
    When I send a POST request to create a user with username "<username>" and role "<role>"
    Then the API response status code should be <expected_status>

    Examples:
      | username       | role | expected_status |
      | validuser1     | 2    | 201             |
      | validuser2     | 1    | 201             |
      |                | 2    | 400             |
      | user123        | 999  | 400             |
