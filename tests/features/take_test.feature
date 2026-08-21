Feature: SAT Practice Test
  As a student
  I want to take a practice test
  So that I can see my score and track my progress

  Scenario: Complete a practice test successfully
    Given I am logged in to the SAT Dashboard
    When I click on a test to start
    And I submit the test
    Then I should see my test score
