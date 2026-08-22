Feature: SAT Practice Test
  As a student
  I want to take a practice test
  So that I can see my score and track my progress

  Scenario: Complete a practice test successfully
    Given I am logged in to the SAT Dashboard
    When I click on a test to start
    And I submit the test
    Then I should see my test score
    When I submit a 5 star review
    Then I should see a thank you message

  Scenario: Cancel a practice test
    Given I am logged in to the SAT Dashboard
    When I click on a test to start
    And I cancel the test
    Then I should be returned to the dashboard and my progress for that test should be reset

  Scenario: Get AI Tutor feedback after a practice test
    Given I am logged in to the SAT Dashboard
    When I click on a test to start
    And I submit the test
    Then I should see my test score
    And I should see the async AI feedback loading message
    When I return to the dashboard and wait for the AI Tutor
    And I review the completed test
    Then I should see the generated AI advice
