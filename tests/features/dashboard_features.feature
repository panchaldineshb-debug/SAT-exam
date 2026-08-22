Feature: Dashboard Extra Features
    As a student
    I want to see my mistake journal, score chart, and daily challenge
    So I can track my progress

    Scenario: View Daily Challenge
        Given I am logged in to the SAT Dashboard
        Then I should see the "Problem of the Day" widget
        When I select an answer for the daily challenge
        Then I should see if the answer was correct or incorrect

    Scenario: View Mistake Journal
        Given I am logged in to the SAT Dashboard
        When I click on a test to start
        And I complete the test by selecting answers and navigating to the end
        And I submit the test
        Then I should see my test score
        When I click on the "Mistake Journal" tab
        Then I should see the questions I got wrong

    Scenario: View Score History and Trend Graph
        Given I am logged in to the SAT Dashboard
        Then I should see the "Score History" chart

    Scenario: View Global Percentile Ranking
        Given I am logged in to the SAT Dashboard
        Then I should see my "Global Percentile" ranking
