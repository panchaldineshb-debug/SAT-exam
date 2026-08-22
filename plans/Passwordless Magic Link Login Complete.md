# Passwordless Magic Link Login Complete

We have fully migrated the SAT Prep dashboard from a standard password-based login to a secure, passwordless magic link flow.

## 1. What changed in the Infrastructure
- We configured AWS Cognito to support `CUSTOM_AUTH_FLOW_ONLY`.
- We added four new AWS Lambda functions triggered by Cognito during the auth flow:
    - **PreSignUp (`sat_pre_sign_up`)**: Automatically verifies users and emails behind the scenes so we can immediately challenge them.
    - **Define Auth Challenge (`sat_define_auth_challenge`)**: Determines if the user passed or failed the challenge or if a new challenge is needed.
    - **Create Auth Challenge (`sat_create_auth_challenge`)**: Generates a secure, 6-digit random code and uses Amazon Simple Email Service (SES) to send the "magic link" to the user's email.
    - **Verify Auth Challenge (`sat_verify_auth_challenge`)**: Validates the code provided in the URL parameter against the internal challenge.
- Set up an SES email identity for `panchaldineshb@gmail.com` to dispatch the emails.

## 2. What changed in the Frontend
- Rewrote the `LoginScreen.jsx` component completely:
    - **No More Passwords**: Removed the password input field and the signup toggle. Users only need to enter their email.
    - **Magic Link Detection**: When the site loads, it detects `?email=...&code=...` in the URL and seamlessly authenticates the user in the background.
    - **Disclaimer**: Added the requested disclaimer permanently visible below the login button:
      > "This is free practice, not the real thing — nothing here guarantees your actual SAT score. We're not affiliated with the College Board. Your email is only used to log you in, nothing else. Under 18? Let a parent know you're using this. Good luck."
    - **Custom Flow Invocation**: Calling `signIn` with `authFlowType: 'CUSTOM_WITHOUT_SRP'` to trigger our custom Cognito triggers. If a user is not found, we seamlessly create a background profile with a randomized secure password, which then transitions into the magic link flow.

## 3. Playwright E2E Tests Support
To ensure the end-to-end tests continue working in a CI/CD environment where we can't manually check an inbox:
- We updated `test_login_steps.py` and `test_take_test_steps.py` to adapt to the new flow.
- We added a dedicated bypass in `create_auth_challenge` for the test user `e2e_test_account_do_not_use@example.com`, which bypasses the email step entirely and assigns a static code `123456`.
- Verified the deployment with `make test-e2e` and confirmed 100% test pass rate!

> [!TIP]
> Since SES is in sandbox mode, you can currently only send emails to `panchaldineshb@gmail.com` or other verified identities in the SES console. If you try logging in with another email address, SES might block the email from sending until your account is moved out of the sandbox.
