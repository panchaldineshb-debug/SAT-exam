import pytest
from pytest_bdd import scenarios, given, when, then
from playwright.sync_api import expect

# Load all scenarios from the feature file
scenarios('../features/compliance.feature')

@given("I am on the login page")
def am_on_login_page(page):
    # The fixture already navigates to BASE_URL, which shows the login screen if unauthenticated
    expect(page.locator("text=Welcome Back")).to_be_visible(timeout=10000)

@when("I click on the Terms of Use link")
def click_terms_link(page):
    page.goto(page.url.split('?')[0] + "?view=terms", wait_until="domcontentloaded")

@when("I click on the Privacy Policy link")
def click_privacy_link(page):
    page.goto(page.url.split('?')[0] + "?view=privacy", wait_until="domcontentloaded")

@then("I should see the Terms of Use page loaded")
def verify_terms_loaded(page):
    # Expect a heading containing "Terms"
    expect(page.locator("text=Terms of Use").first).to_be_visible(timeout=10000)

@then("I should see the Privacy Policy page loaded")
def verify_privacy_loaded(page):
    # Expect a heading containing "Privacy"
    expect(page.locator("text=Privacy Policy").first).to_be_visible(timeout=10000)

@when("I click on the About Us link")
def click_about_link(page):
    page.goto(page.url.split('?')[0] + "?view=about", wait_until="domcontentloaded")

@then("I should see the About Us page loaded")
def verify_about_loaded(page):
    # Expect a heading containing "About Us"
    expect(page.locator("text=About Us").first).to_be_visible(timeout=10000)
