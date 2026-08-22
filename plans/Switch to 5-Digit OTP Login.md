# Switch to 5-Digit OTP Login

Instead of a magic link, we will switch to a 5-digit One Time Password (OTP) approach. This provides a simpler, universally understood user experience and inherently avoids any cross-device browser issues, as the user simply reads the code from their phone or email and types it into the active browser window.

## Proposed Changes

### `backend/lambdas/create_auth_challenge/index.mjs`
- Generate a 5-digit random integer instead of a signed JWT.
- Change the email template to prominently display the 5-digit code instead of a URL.
- Store the 5-digit code in the session's `privateChallengeParameters`.

### `backend/lambdas/verify_auth_challenge/index.mjs`
- Revert the JWT signature verification.
- Compare the user's submitted 5-digit code with the expected code from `privateChallengeParameters`.

### `src/components/LoginScreen.jsx`
- Introduce a new state `showCodeInput` (boolean).
- Once the user submits their email and `signIn` triggers the custom challenge, change the UI to hide the email input and show a 5-digit code input field.
- Submitting the code will call `confirmSignIn({ challengeResponse: code })`.
- Remove the URL parsing logic (`?email=...&code=...`).

### `tests/step_defs/test_login_steps.py` & `test_take_test_steps.py`
- Update the Playwright E2E tests to simulate entering a 5-digit code in the UI rather than navigating directly to a magic link URL. The bypass code will be `12345`.

## Open Questions

None. This is a standard and robust approach! Please review and click **Proceed** if you'd like me to implement this.
