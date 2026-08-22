import os
import random
from pytest_bdd import scenarios, given, when, then
from playwright.sync_api import expect
import keyring

scenarios("../features/take_test.feature")

@given("I am logged in to the SAT Dashboard")
def logged_in_dashboard(page):
    # Retrieve credentials securely
    username = keyring.get_password("SAT_Exam_Test_User", "username")
    password = keyring.get_password("SAT_Exam_Test_User", "password")
    
    if not username or not password:
        raise RuntimeError("Test credentials not found in keyring. Run 'make set-test-credentials' first.")
    
    page.locator("#email").fill(username)
    page.locator("#password").fill(password)
    page.locator("button[type='submit']").click()
    
    expect(page.locator("text=Sign Out")).to_be_visible(timeout=10000)

@when("I click on a test to start")
def start_random_test(page):
    # Wait for tests to load
    expect(page.locator(".test-card").first).to_be_visible(timeout=10000)
    
    # Try to find a test that hasn't been started, or one that is in progress.
    # We'll just grab any button that allows entering the test view.
    start_buttons = page.locator("text=Start Practice →").all()
    if not start_buttons:
        start_buttons = page.locator("text=Resume →").all()
        
    assert len(start_buttons) > 0, "No available tests to start."
    random.choice(start_buttons).click()
    
    # Verify we entered the practice view
    expect(page.locator("text=Save & Quit")).to_be_visible(timeout=10000)

@when("I submit the test")
def submit_test(page):
    def handle_dialog(dialog):
        print("DIALOG TRIGGERED:", dialog.type, dialog.message)
        dialog.accept()
    page.on("dialog", handle_dialog)
    
    max_questions = 150
    for _ in range(max_questions):
        submit_btn = page.locator("button:has-text('Submit Test')")
        next_btn = page.locator("button:has-text('Next')")
        
        if submit_btn.is_visible():
            submit_btn.click()
            # Wait for submission to complete
            page.wait_for_timeout(2000)
            break
        elif next_btn.is_visible():
            next_btn.click()
            page.wait_for_timeout(100)
        else:
            page.wait_for_timeout(200)

@then("I should see my test score")
def verify_test_score(page):
    # Verify the ReviewMode component is shown
    expect(page.locator("text=Accuracy")).to_be_visible(timeout=15000)
    expect(page.locator("text=Incorrect Answers")).to_be_visible(timeout=15000)
    expect(page.locator("button:has-text('Back to Dashboard')")).to_be_visible(timeout=15000)

@when("I cancel the test")
def cancel_test(page):
    def handle_dialog(dialog):
        print("DIALOG TRIGGERED:", dialog.type, dialog.message)
        dialog.accept()
    # Need to remove existing dialog handlers if any, but since it's a new scenario it should be fine
    page.on("dialog", handle_dialog)
    
    cancel_btn = page.locator("button:has-text('✖ Cancel Test')")
    expect(cancel_btn).to_be_visible(timeout=10000)
    cancel_btn.click()

@then("I should be returned to the dashboard and my progress for that test should be reset")
def returned_to_dashboard(page):
    expect(page.locator("text=Sign Out")).to_be_visible(timeout=10000)
    expect(page.locator(".test-card").first).to_be_visible(timeout=10000)
