@api @authentication @auth-api
Feature: Authentication API
  As an API client
  I want to authenticate via API
  So that I can access protected resources

  Background:
    Given the API client is initialized

  @positive @P0 @API-AUTH-001
  Scenario: Successful authentication with valid credentials via API
    When I send a POST request to login endpoint with valid credentials
    Then the API response status code should be 200
    And the response time should be less than 3000 milliseconds
    And the response should contain authentication data

  @negative @P0 @API-AUTH-002
  Scenario: Authentication fails with invalid username via API
    When I send a POST request to login endpoint with invalid username
    Then the API response status code should be 401
    And the response should contain an error message

  @negative @P0 @API-AUTH-003
  Scenario: Authentication fails with invalid password via API
    When I send a POST request to login endpoint with invalid password
    Then the API response status code should be 401
    And the response should contain an error message

  @negative @P0 @API-AUTH-004
  Scenario: Authentication fails with empty credentials via API
    When I send a POST request to login endpoint with empty username
    Then the API response status code should be 400 or 401
    And the response should contain an error message

  @security @P0 @API-AUTH-005
  Scenario Outline: SQL injection attempts via authentication API should be rejected
    When I send a POST request to login endpoint with username "<sql_payload>" and password "admin123"
    Then the API response status code should be 401
    And the response should not contain database error messages
    And the response should contain an error message

    Examples:
      | sql_payload                   |
      | ' OR '1'='1                   |
      | admin'--                      |
      | ' UNION SELECT * FROM users-- |

  @performance @P0 @API-AUTH-006
  Scenario: Authentication API response time should meet SLA
    When I send a POST request to login endpoint with valid credentials
    Then the API response status code should be 200
    And the response time should be less than 3000 milliseconds

  @positive @P1 @API-AUTH-007
  Scenario: Logout via API after successful authentication
    Given I am authenticated via API
    When I send a POST request to logout endpoint
    Then the API response status code should be 200
    And the session should be terminated

  @data-driven @P1
  Scenario Outline: Authentication API with different credential combinations
    When I send a POST request to login endpoint with username "<username>" and password "<password>"
    Then the API response status code should be <expected_status>

    Examples:
      | username    | password     | expected_status |
      | Admin       | admin123     | 200             |
      | InvalidUser | admin123     | 401             |
      | Admin       | wrongpass    | 401             |
      |             | admin123     | 400             |
      | Admin       |              | 400             |
