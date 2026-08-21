import os
from pytest_bdd import scenarios, given, when, then, parsers
from playwright.sync_api import expect

# Load the feature file
scenarios("../features/login.feature")

@given("I navigate to the SAT Dashboard homepage")
def navigate_to_homepage(page):
    # The page is already navigated to BASE_URL by the fixture in conftest.py
    # We can assert we are on the login screen by checking a known element
    expect(page.locator("text=Welcome Back").first).to_be_visible(timeout=10000)

@when(parsers.parse('I enter the username "{username}" and password "{password}"'))
def enter_credentials(page, username, password):
    page.locator("#email").fill(username)
    page.locator("#password").fill(password)

@when("I enter my valid username and password")
def enter_valid_credentials(page):
    import keyring
    # Retrieve credentials securely from macOS Keychain
    username = keyring.get_password("SAT_Exam_Test_User", "username")
    password = keyring.get_password("SAT_Exam_Test_User", "password")
    
    if not username or not password:
        raise RuntimeError("Test credentials not found in keyring. Run 'make set-test-credentials' first.")
    
    page.locator("#email").fill(username)
    page.locator("#password").fill(password)

@when("I click the login button")
def click_login(page):
    page.locator("button[type='submit']").click()

@then("I should see an error message indicating invalid credentials")
def verify_invalid_credentials(page):
    # Wait for the login error message div to be visible
    expect(page.locator(".login-error")).to_be_visible(timeout=15000)

@then("I should be successfully logged in and see the dashboard")
def verify_successful_login(page):
    # Check for an element unique to the dashboard after login
    expect(page.locator("text=Sign Out")).to_be_visible(timeout=10000)
