import os
import pytest
from playwright.sync_api import sync_playwright

# You can override this locally via environment variables if needed
BASE_URL = os.getenv("TEST_BASE_URL", "https://d13t5b1x75ap0r.cloudfront.net/")

@pytest.fixture(scope="session")
def browser():
    """Setup browser for the entire test session."""
    with sync_playwright() as p:
        # Run in headless mode by default, can be overridden for debugging
        headless = os.getenv("HEADLESS", "true").lower() == "true"
        # Slow down interactions by 500ms when running visually so it's easy to follow
        slow_mo = 500 if not headless else 0
        browser = p.chromium.launch(headless=headless, slow_mo=slow_mo)
        yield browser
        browser.close()

@pytest.fixture(scope="function")
def context(browser):
    """Create a new incognito browser context for each test."""
    context = browser.new_context()
    yield context
    context.close()

@pytest.fixture(scope="function")
def page(context):
    """Create a new page in the isolated context."""
    page = context.new_page()
    page.goto(BASE_URL, wait_until="domcontentloaded")
    yield page
    page.close()
