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
    # Regenerate the email inside the function to ensure a fresh email if the test is rerun!
    import uuid
    test_context["email"] = f"e2e_{uuid.uuid4().hex[:8]}@example.com"
    
    # For a valid login, we will first Sign Up to ensure the account exists and is fresh.
    # 1. Switch to Sign Up mode
    page.locator("button:has-text('Sign Up')").first.click()
    expect(page.locator("text=Create Account")).to_be_visible(timeout=10000)
    
    # 1.5. Age Gate
    page.locator("#birthMonth").select_option("1")
    page.locator("#birthYear").select_option("2000")
    page.locator("button:has-text('Next Step')").click()
    expect(page.locator("text=Account Details")).to_be_visible(timeout=10000)
    
    # 2. Fill in the credentials
    page.locator("#email").fill(test_context["email"])
    page.locator("#password").fill(test_context["password"])
    page.locator("#terms").check()
    page.wait_for_timeout(1000)
    
    # 3. Submit
    page.locator("button:has-text('Sign Up')").click()
    
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

@when("I try to sign up with an age under 13")
def sign_up_under_13(page):
    import time
    time.sleep(2)
    # Switch to Sign Up mode
    page.locator("button:has-text('Sign Up')").first.click()
    expect(page.locator("text=Create Account")).to_be_visible(timeout=10000)
    
    # Age Gate - current year minus 10 years to trigger under 13
    import datetime
    recent_year = str(datetime.datetime.now().year - 10)
    page.locator("#birthMonth").select_option("1")
    page.locator("#birthYear").select_option(recent_year)
    page.locator("button:has-text('Next Step')").click()

@then("I should see an error message indicating age restriction")
def verify_age_restriction(page):
    expect(page.locator("text=not eligible to create an account at this time")).to_be_visible(timeout=10000)
