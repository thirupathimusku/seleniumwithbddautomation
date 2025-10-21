@login @authentication @critical-path @smoke-test
Feature: OrangeHRM Login Functionality
  As a registered user of OrangeHRM
  I want to log in to the application
  So that I can access the HR management system

  Background:
    Given the user navigates to the OrangeHRM login page

  @positive @P0 @LOGIN-E2E-004
  Scenario: Successful login with valid admin credentials
    Given the login page is displayed correctly
    When the user enters "Admin" in the username field
    And the user enters "admin123" in the password field
    And the user clicks the login button
    Then the user should be redirected to the dashboard
    And the dashboard should display the main navigation menu
    And the user profile icon should appear in the top-right corner
    And the URL should contain "dashboard"
    And no error messages should be displayed

  @positive @P1 @LOGIN-E2E-005
  Scenario: Login page elements are displayed correctly
    Then the username field should be visible and enabled
    And the password field should be visible and enabled
    And the login button should be visible and enabled
    And the company logo should be visible
    And the forgot password link should be visible

  @negative @P0 @LOGIN-E2E-011
  Scenario: Login with invalid username
    When the user enters "InvalidUser" in the username field
    And the user enters "admin123" in the password field
    And the user clicks the login button
    Then an error message should be displayed
    And the user should remain on the login page

  @negative @P0 @LOGIN-E2E-012
  Scenario: Login with invalid password
    When the user enters "Admin" in the username field
    And the user enters "wrongpassword" in the password field
    And the user clicks the login button
    Then an error message should be displayed
    And the user should remain on the login page

  @negative @P0 @LOGIN-E2E-013
  Scenario: Login with empty credentials
    When the user leaves the username field empty
    And the user leaves the password field empty
    And the user clicks the login button
    Then an error message should be displayed
    And the user should remain on the login page

  @negative @P0
  Scenario: Login with empty username
    When the user leaves the username field empty
    And the user enters "admin123" in the password field
    And the user clicks the login button
    Then an error message should be displayed

  @negative @P0
  Scenario: Login with empty password
    When the user enters "Admin" in the username field
    And the user leaves the password field empty
    And the user clicks the login button
    Then an error message should be displayed

  @security @P0 @LOGIN-E2E-015
  Scenario Outline: SQL injection attempts should be rejected
    When the user enters "<sql_payload>" in the username field
    And the user enters "admin123" in the password field
    And the user clicks the login button
    Then an error message should be displayed
    And the user should remain on the login page

    Examples:
      | sql_payload                        |
      | ' OR '1'='1                        |
      | admin'--                           |
      | ' UNION SELECT * FROM users--      |
      | admin' OR 1=1--                    |

  @security @P0 @LOGIN-E2E-016
  Scenario Outline: XSS attempts should be sanitized
    When the user enters "<xss_payload>" in the username field
    And the user enters "admin123" in the password field
    And the user clicks the login button
    Then an error message should be displayed
    And no script execution should occur

    Examples:
      | xss_payload                           |
      | <script>alert('XSS')</script>         |
      | javascript:alert('XSS')               |
      | <img src=x onerror=alert('XSS')>      |

  @boundary @P1 @LOGIN-E2E-018
  Scenario Outline: Login with different username case variations
    When the user enters "<username>" in the username field
    And the user enters "admin123" in the password field
    And the user clicks the login button
    Then the login result should be "<expected_result>"

    Examples:
      | username | expected_result |
      | Admin    | success         |
      | admin    | failure         |
      | ADMIN    | failure         |
      | AdMiN    | failure         |

  @boundary @P1 @LOGIN-E2E-019
  Scenario Outline: Login with leading/trailing spaces in username
    When the user enters "<username>" in the username field
    And the user enters "admin123" in the password field
    And the user clicks the login button
    Then the login should be successful

    Examples:
      | username  |
      |  Admin    |
      | Admin     |
      |  Admin    |

  @performance @P0 @LOGIN-E2E-028
  Scenario: Login response time should be less than 3 seconds
    When the user enters "Admin" in the username field
    And the user enters "admin123" in the password field
    And the user records the start time
    And the user clicks the login button
    Then the login should complete within 3 seconds
    And the user should be redirected to the dashboard

  @regression @P1 @LOGIN-E2E-032
  Scenario: Logout and re-login functionality
    Given the user is logged in with valid credentials
    When the user logs out
    Then the user should be redirected to the login page
    When the user logs in again with valid credentials
    Then the user should be successfully logged in

  @accessibility @P2 @LOGIN-E2E-030
  Scenario: Password field should be masked
    Then the password field type should be "password"
    When the user enters "admin123" in the password field
    Then the entered password should not be visible as plain text

  @data-driven @P0
  Scenario Outline: Login with multiple valid user types
    When the user enters "<username>" in the username field
    And the user enters "<password>" in the password field
    And the user clicks the login button
    Then the user should be redirected to the dashboard
    And the user role should be "<role>"

    Examples:
      | username | password    | role          |
      | Admin    | admin123    | Administrator |
