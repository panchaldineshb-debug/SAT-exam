import os
import uuid
from pytest_bdd import scenarios, given, when, then, parsers
from playwright.sync_api import expect

# Load the feature file
scenarios("../features/login.feature")

# Store the random email for the current test run so steps can share it
test_context = {
    "email": f"e2e_{uuid.uuid4().hex[:8]}@example.com",
    "password": "Password123!"
}

@given("I navigate to the SAT Dashboard homepage")
def navigate_to_homepage(page):
    # The page is already navigated to BASE_URL by the fixture in conftest.py
    # We can assert we are on the login screen by checking a known element
    expect(page.locator("text=Welcome Back")).to_be_visible(timeout=10000)

@when(parsers.parse('I enter the username "{username}" and password "{password}"'))
def enter_credentials(page, username, password):
    page.locator("#email").fill(username)
    page.locator("#password").fill(password)
    page.locator("button[type='submit']").click()

@when("I enter my valid username and password")
def enter_valid_credentials(page):
    import time
    time.sleep(2)
    # For a valid login, we will first Sign Up to ensure the account exists and is fresh.
    # 1. Switch to Sign Up mode
    page.locator("button:has-text('Sign Up')").first.click()
    expect(page.locator("text=Create Account")).to_be_visible(timeout=10000)
    
    # 2. Fill in the credentials
    page.locator("#email").fill(test_context["email"])
    page.locator("#password").fill(test_context["password"])
    page.wait_for_timeout(1000)
    
    # 3. Submit
    page.locator("button[type='submit']").click()
    
    # Because pre_sign_up auto-confirms 'e2e_' emails, the frontend should immediately sign us in!

@when("I click the login button")
def click_login(page):
    # The submit button was already clicked during the valid/invalid steps
    pass

@then("I should see an error message indicating invalid credentials")
def verify_invalid_credentials(page):
    # Check for the invalid credentials error
    expect(page.locator(".login-error")).to_be_visible(timeout=10000)

@then("I should be successfully logged in and see the dashboard")
def verify_successful_login(page):
    # Check for an element unique to the dashboard after login
    expect(page.locator("text=Sign Out")).to_be_visible(timeout=60000)
