Feature: SAT Dashboard Login
  As a student
  I want to log into the SAT Exam Dashboard
  So that I can practice my tests

  Scenario: Failed login with invalid credentials
    Given I navigate to the SAT Dashboard homepage
    When I enter the username "invalid_student@example.com" and password "wrong_password123"
    And I click the login button
    Then I should see an error message indicating invalid credentials

  Scenario: Successful login with valid credentials
    Given I navigate to the SAT Dashboard homepage
    When I enter my valid username and password
    And I click the login button
    Then I should be successfully logged in and see the dashboard
