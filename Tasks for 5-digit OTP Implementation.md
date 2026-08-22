# Tasks for 5-digit OTP Implementation

- [x] Update Lambdas
  - [x] `create_auth_challenge` to generate 5-digit code
  - [x] `verify_auth_challenge` to verify against session parameter
- [x] Update Frontend
  - [x] Modify `LoginScreen.jsx` to show code input and handle `confirmSignIn`
- [x] Update Tests
  - [x] `test_login_steps.py`
  - [x] `test_take_test_steps.py`
- [/] Verification
  - [/] Run `make tf-create-demo`
  - [ ] Run `make test-e2e`
