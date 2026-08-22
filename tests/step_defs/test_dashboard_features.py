import os
import uuid
import random
from pytest_bdd import scenarios, given, when, then
from playwright.sync_api import expect

from playwright.sync_api import expect

scenarios("../features/dashboard_features.feature")

@given("I am logged in to the SAT Dashboard")
def logged_in_dashboard(page):
    import time
    time.sleep(2)
    base_url = os.environ.get("TEST_BASE_URL", "https://d13t5b1x75ap0r.cloudfront.net/")
    page.goto(base_url)
    page.locator("button:has-text('Sign Up')").first.click()
    expect(page.locator("text=Create Account")).to_be_visible(timeout=10000)
    
    # Age Gate
    page.locator("#birthMonth").select_option("1")
    page.locator("#birthYear").select_option("2000")
    page.locator("button:has-text('Next Step')").click()
    expect(page.locator("text=Account Details")).to_be_visible(timeout=10000)
    
    page.locator("#email").fill(f"e2e_{uuid.uuid4().hex[:8]}@example.com")
    page.locator("#password").fill("Password123!")
    page.locator("#terms").check()
    page.wait_for_timeout(1000) # Small pause to let form state settle
    page.locator("button:has-text('Sign Up')").click()
    expect(page.locator("text=Sign Out")).to_be_visible(timeout=60000)
    
    # Dismiss cookie notice so it doesn't block clicks at the bottom of the screen
    try:
        page.locator("button:has-text('I Understand')").click(timeout=3000)
    except:
        pass

@when("I click on a test to start")
def start_random_test(page):
    expect(page.locator(".test-card").first).to_be_visible(timeout=10000)
    start_buttons = page.locator("text=Start Practice →").all()
    if not start_buttons:
        start_buttons = page.locator("text=Resume →").all()
    assert len(start_buttons) > 0, "No tests available to start"
    start_buttons[0].click()
    expect(page.locator("text=Cancel Test")).to_be_visible(timeout=10000)

@when("I complete the test by selecting answers and navigating to the end")
def complete_test_answers(page):
    question_buttons = page.locator(".question-bubbles-container .question-bubble").all()
    num_questions = len(question_buttons)
    assert num_questions > 0, "No questions found in test"
    for i in range(num_questions):
        page.locator(".question-bubbles-container .question-bubble").nth(i).click()
        page.wait_for_selector(".option-card, .grid-in-input", timeout=5000)
        mc_options = page.locator(".option-card")
        grid_input = page.locator(".grid-in-input")
        
        if mc_options.count() > 0:
            options = mc_options.all()
            random.choice(options).click()
        elif grid_input.count() > 0:
            grid_input.fill(str(random.randint(1, 99)))

@when("I submit the test")
def submit_test(page):
    page.once("dialog", lambda dialog: dialog.accept())
    page.locator(".question-bubbles-container .question-bubble").last.click()
    page.locator("text=Submit Test").wait_for(state="visible", timeout=10000)
    page.locator("text=Submit Test").click()

@then("I should see my test score")
def verify_test_results(page):
    expect(page.locator("text=Accuracy")).to_be_visible(timeout=10000)

@then('I should see the "Problem of the Day" widget')
def verify_problem_of_the_day(page):
    expect(page.locator("text=Problem of the Day")).to_be_visible(timeout=10000)

@when("I select an answer for the daily challenge")
def select_daily_challenge_answer(page):
    # Wait for the problem of the day to render completely
    page.locator("text=Problem of the Day").wait_for(state="visible", timeout=10000)
    
    # We find the buttons in the space-y-2 div within the DailyChallenge component
    challenge_container = page.locator(".daily-challenge-card").last
    if not challenge_container.is_visible():
        challenge_container = page.locator("div:has-text('Problem of the Day')").last
        
    options = challenge_container.locator("button").all()
    
    # Filter out tab buttons or start buttons if they get caught
    options = [btn for btn in options if "tab-btn" not in btn.get_attribute("class") and "Start" not in btn.inner_text()]
    
    if len(options) > 0:
        options[1].click() # Click the second option to avoid hitting title bars

@then("I should see if the answer was correct or incorrect")
def verify_daily_challenge_result(page):
    expect(page.locator("text=Correct!").or_(page.locator("text=Incorrect"))).to_be_visible(timeout=10000)

@when('I click on the "Mistake Journal" tab')
def click_mistake_journal_tab(page):
    # If we are on the results page, we must return to dashboard first
    try:
        page.wait_for_selector("text=Back to Dashboard", timeout=5000)
        page.locator("text=Back to Dashboard").click()
    except Exception:
        pass
        
    expect(page.locator("text=Mistake Journal")).to_be_visible(timeout=10000)
    page.locator("text=Mistake Journal").click()

@then("I should see the questions I got wrong")
def verify_mistake_journal(page):
    expect(
        page.locator("text=Your Mistake Journal").or_(
        page.locator("text=You haven't made any mistakes yet")
        )
    ).to_be_visible(timeout=10000)

@then('I should see the "Score History" chart')
def verify_score_history(page):
    expect(page.locator("text=Score History").first).to_be_visible(timeout=10000)

@then('I should see my "Global Percentile" ranking')
def verify_global_percentile(page):
    expect(page.locator("text=Global Percentile")).to_be_visible(timeout=10000)
