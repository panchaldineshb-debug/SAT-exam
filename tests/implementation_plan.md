# Set Up Playwright BDD (Given-When-Then) Testing in Python

We will set up an automated testing framework using Python, Playwright, and `pytest-bdd`. This will allow us to write tests in plain English (Gherkin syntax: Given-When-Then) which are executed by a real browser against your live CloudFront URL (`https://d13t5b1x75ap0r.cloudfront.net/`).

## Open Questions

> [!NOTE]
> Do you have a specific test user account (e.g., `test_student` with a known password) that we should use for the login automation? I will need to seed this user or hardcode the credentials as an environment variable to ensure the tests pass reliably.

## Proposed Changes

---

### 1. Test Dependencies
We need to install the testing libraries into your existing Python virtual environment (`.venv`).

#### [NEW] `requirements-test.txt`
Create a requirements file specifying:
- `pytest`
- `pytest-playwright`
- `pytest-bdd`

#### [MODIFY] `Makefile`
Add a new `test-e2e` target to:
- Install the test dependencies
- Run `playwright install` (to download the browser binaries)
- Execute `pytest tests/`

---

### 2. Testing Framework Setup
We will establish the standard `pytest-bdd` folder structure.

#### [NEW] `tests/conftest.py`
This file configures global Pytest fixtures. It will configure Playwright to automatically start a browser, navigate to the base URL (`https://d13t5b1x75ap0r.cloudfront.net/`), and pass the `page` object to all our tests.

---

### 3. Feature Files (Gherkin)
This is where the actual Given-When-Then test cases live.

#### [NEW] `tests/features/login.feature`
We will write our first scenarios:
```gherkin
Feature: Login functionality
  As a student
  I want to log into the SAT Exam Dashboard
  So that I can practice my tests

  Scenario: Successful login with valid credentials
    Given I navigate to the SAT Dashboard homepage
    When I enter my valid username and password
    And I click the login button
    Then I should see the dashboard view

  Scenario: Failed login with invalid password
    Given I navigate to the SAT Dashboard homepage
    When I enter my valid username and an invalid password
    And I click the login button
    Then I should see an error message indicating invalid credentials
```

---

### 4. Step Definitions (Python Code)
These files bridge the English feature files with Playwright's automation API.

#### [NEW] `tests/step_defs/test_login_steps.py`
This will contain the Python functions decorated with `@given`, `@when`, and `@then` that actually find the HTML elements (e.g. `page.get_by_placeholder("Username").fill(...)`) and assert on the UI state using Playwright.

## Verification Plan

### Automated Tests
Once implemented, I will run the end-to-end tests locally:
```bash
make test-e2e
```
This will spin up a headless browser, execute the Given-When-Then steps against your live CloudFront deployment, and report success/failure.
