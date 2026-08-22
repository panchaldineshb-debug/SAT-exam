Feature: Compliance Pages
  As a prospective user
  I want to view the Terms of Use and Privacy Policy
  So that I understand my rights and how my data is handled

  Scenario: User can view the Terms of Use page
    Given I am on the login page
    When I click on the Terms of Use link
    Then I should see the Terms of Use page loaded

  Scenario: User can view the Privacy Policy page
    Given I am on the login page
    When I click on the Privacy Policy link
    Then I should see the Privacy Policy page loaded

  Scenario: User can view the About Us page
    Given I am on the login page
    When I click on the About Us link
    Then I should see the About Us page loaded
