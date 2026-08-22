import os
import uuid
import random
from pytest_bdd import scenarios, given, when, then
from playwright.sync_api import expect
import keyring

scenarios("../features/take_test.feature")

@given("I am logged in to the SAT Dashboard")
def logged_in_dashboard(page):
    import time
    time.sleep(2)
    base_url = os.getenv("TEST_BASE_URL", "https://d13t5b1x75ap0r.cloudfront.net/")
    page.goto(base_url)
    
    # 1. Switch to Sign Up mode
    page.locator("button:has-text('Sign Up')").first.click()
    expect(page.locator("text=Create Account")).to_be_visible(timeout=10000)
    
    # 2. Fill in the credentials with a random e2e email to avoid conflicts
    page.locator("#email").fill(f"e2e_{uuid.uuid4().hex[:8]}@example.com")
    page.locator("#password").fill("Password123!")
    page.wait_for_timeout(1000)
    
    # 3. Submit (pre_sign_up lambda will auto-confirm)
    page.locator("button[type='submit']").click()
    
    expect(page.locator("text=Sign Out")).to_be_visible(timeout=60000)

@when("I click on a test to start")
def start_random_test(page):
    # Wait for tests to load
    expect(page.locator(".test-card").first).to_be_visible(timeout=10000)
    
    # Try to find a test that hasn't been started, or one that is in progress.
    # We'll just grab any button that allows entering the test view.
    start_buttons = page.locator("text=Start Practice →").all()
    if not start_buttons:
        start_buttons = page.locator("text=Resume →").all()
        
    assert len(start_buttons) > 0, "No tests available to start"
    start_buttons[0].click()
    
    # Wait for the test interface to appear
    expect(page.locator("text=Cancel Test")).to_be_visible(timeout=10000)

@when("I complete the test by selecting answers and navigating to the end")
def complete_test_answers(page):
    # Determine the number of questions in this module
    # The question navigation has buttons for each question
    question_buttons = page.locator(".question-navigation button").all()
    num_questions = len(question_buttons)
    
    assert num_questions > 0, "No questions found in test"
    
    # Loop through each question
    for i in range(num_questions):
        # Click the question button in navigation to jump to it
        # The selector here needs to match the buttons in your navigation.
        # Since they are just numbers, we can click by index.
        page.locator(".question-navigation button").nth(i).click()
        
        # Select a random option for the current question
        # Wait for options to render
        expect(page.locator(".option-btn").first).to_be_visible(timeout=5000)
        options = page.locator(".option-btn").all()
        assert len(options) > 0, f"No options found for question {i+1}"
        
        # Click a random option
        random.choice(options).click()

@when("I submit the test")
def submit_test(page):
    # Accept the confirmation dialog
    page.once("dialog", lambda dialog: dialog.accept())
    
    # Ensure we're on the last question
    page.locator(".question-bubbles-container .question-bubble").last.click()
    
    # Wait for the Submit Test button
    page.locator("text=Submit Test").wait_for(state="visible", timeout=10000)
    page.locator("text=Submit Test").click()

@then("I should see my test score")
def verify_test_results(page):
    # Depending on how the results are rendered, there's usually a score text or progress bar
    # The exact text depends on your UI, e.g., "Score:", "Total Score", or just a number
    expect(page.locator("text=Accuracy")).to_be_visible(timeout=10000)

@when("I cancel the test")
def cancel_test(page):
    # Handle any confirmation dialogs
    page.once("dialog", lambda dialog: dialog.accept())
    page.locator("text=Cancel Test").click()

@then('I should be returned to the dashboard and my progress for that test should be reset')
def verify_return_to_dashboard(page):
    expect(page.locator("h3:has-text(\"Sameer's Progress\")")).to_be_visible(timeout=10000)

@when("I submit a 5 star review")
def submit_review(page):
    # Click the 5th star
    page.locator("text=★").nth(4).click()
    page.locator("text=Submit Review").click()

@then("I should see a thank you message")
def verify_thank_you_message(page):
    expect(page.locator("text=Your review has been submitted successfully.")).to_be_visible(timeout=10000)

@when('I click "Ask AI Tutor"')
def click_ask_ai_tutor(page):
    page.locator("text=Ask AI Tutor").click()

@then("I should see the AI feedback load")
def verify_ai_feedback(page):
    expect(page.locator("text=Analyzing your test")).to_be_visible(timeout=5000)
    expect(page.locator("text=Analyzing your test")).to_be_hidden(timeout=40000)
    expect(page.locator("text=Ask AI Tutor")).to_be_hidden(timeout=5000)
