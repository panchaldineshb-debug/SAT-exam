# Secure Test Credentials via macOS Keyring

The goal of this implementation is to use the native macOS Keychain (via the Python `keyring` library) to securely store and retrieve the test user's email and password for the Playwright E2E tests, avoiding any hardcoded credentials or plain-text `.env` variables.

## User Review Required

> [!IMPORTANT]
> The automated test will pull the credentials directly from your Mac's secure Keychain. If the credentials don't exist yet, the test will fail until they are set. To make this easy, I'm proposing a helper command (`make set-test-credentials`) that will prompt you to type them securely in the terminal so they get stored safely. 

## Open Questions

> [!NOTE]
> 1. We will use the service name `"SAT_Exam_Test_User"` for the keychain entries. Does that work for you?
> 2. Do you already have a real user registered in your AWS Cognito pool that we can use for these credentials? (If not, we can register one manually via the UI after the setup is done).

## Proposed Changes

### Configuration and Setup

#### [MODIFY] `requirements-test.txt`
Add the `keyring` dependency so it gets installed during `make install-test`.

#### [MODIFY] `Makefile`
Add a new utility target `set-test-credentials`:
```makefile
set-test-credentials:
	@echo "Setting up secure test credentials in macOS Keychain..."
	./.venv/bin/python -c "import keyring; import getpass; \
		user = input('Enter Test User Email: '); \
		keyring.set_password('SAT_Exam_Test_User', 'username', user); \
		pwd = getpass.getpass('Enter Test User Password: '); \
		keyring.set_password('SAT_Exam_Test_User', 'password', pwd); \
		print('Credentials securely saved to macOS Keychain!')"
```

### Test Implementation

#### [MODIFY] `tests/step_defs/test_login_steps.py`
Update the `enter_valid_credentials` step definition to pull from `keyring` instead of `os.getenv`.
```python
import keyring

SERVICE = "SAT_Exam_Test_User"

@when("I enter my valid username and password")
def enter_valid_credentials(page):
    # Retrieve credentials securely from macOS Keychain
    username = keyring.get_password(SERVICE, "username")
    password = keyring.get_password(SERVICE, "password")
    
    if not username or not password:
        raise RuntimeError("Test credentials not found in keyring. Run 'make set-test-credentials' first.")
    
    page.locator("#email").fill(username)
    page.locator("#password").fill(password)
```

## Verification Plan

### Automated Verification
1. Run `make install-test` to install `keyring`.
2. Ensure the code syntax is correct.

### Manual Verification
1. Ask the user to run `make set-test-credentials` and enter a valid test user's email and password.
2. Ask the user to run `make test-e2e` to verify that the credentials are successfully pulled from the keychain and the test passes.
