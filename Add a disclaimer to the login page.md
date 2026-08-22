# Goal Description

1. Add a disclaimer to the login page (`LoginScreen.jsx`) clearly stating that the app is for free practice, not affiliated with the College Board, and advising users under 18 to notify a parent.
2. Implement true "Passwordless Magic Link" authentication. When users sign up or sign in, they will receive an email containing a direct link. Clicking the link automatically logs them in—no password required.

> [!WARNING]
> Implementing true passwordless authentication using AWS Cognito requires completely removing passwords and transitioning to a Custom Authentication Flow. 

## User Review Required

### SES Email Dependency
To send custom "Magic Link" emails securely for passwordless login, we must use **Amazon SES (Simple Email Service)** inside an AWS Lambda function (`CreateAuthChallenge`). 
AWS SES is in a "Sandbox" mode by default. This means you can only send emails **to** and **from** email addresses that you have manually verified in the AWS console. If you intend for other users to use this app, you will need to request AWS to move your SES account out of the sandbox. Is this acceptable?

## Open Questions

1. **Domain for Magic Links**: The magic link needs to point to the frontend application (e.g., `https://d13t5b1x75ap0r.cloudfront.net/?email=...&code=...`). Are you okay with using the currently deployed CloudFront domain for this?
2. **Sender Email**: Which email address should the SES emails be sent *from*? You will need to verify this email address in the AWS SES console.

## Proposed Changes

### AWS Infrastructure (Terraform)
We will transition the Cognito User Pool to use a Custom Authentication flow and provision 3 new Lambda functions to handle the passwordless login.

#### [MODIFY] `terraform/environments/demo/serverless.tf`
- Add SES permissions to the `sat_lambda_exec_role`.
- Add 3 new Lambda functions: `define_auth_challenge`, `create_auth_challenge`, and `verify_auth_challenge`.
- Attach these lambdas to the `aws_cognito_user_pool` under `lambda_config`.
- Update `aws_cognito_user_pool_client` to enable `CUSTOM_AUTH_FLOW_ONLY`.

### Backend Lambdas (Node.js)
We will create the required lambdas for Cognito's custom auth state machine.

#### [NEW] `backend/lambdas/define_auth_challenge/index.mjs`
- Instructs Cognito to issue a custom challenge.

#### [NEW] `backend/lambdas/create_auth_challenge/index.mjs`
- Generates a secure random code (magic link token).
- Uses the AWS SDK (`@aws-sdk/client-ses`) to send the custom email you provided, substituting `[First Name]` and appending the `[Login Link]`.

#### [NEW] `backend/lambdas/verify_auth_challenge/index.mjs`
- Compares the code provided by the user (via the magic link) with the code generated in the previous step.

### Frontend UI (React)
We will remove all password fields and update the UI to handle magic links.

#### [MODIFY] `src/components/LoginScreen.jsx`
- Add the requested disclaimer at the bottom of the screen.
- Remove the password field entirely.
- Update `handleSignIn` and `handleSignUp` to use `signIn` without a password, triggering the `CUSTOM_CHALLENGE`.
- Add logic to parse `?email=...&code=...` from the URL. If present, automatically call `sendCustomChallengeAnswer(code)` to complete the login process and log the user in.

## Verification Plan

### Manual Verification
1. I will execute the Terraform deployment to provision the new Custom Auth Lambdas.
2. I will ask you to verify a "Sender" email address in the AWS SES Console.
3. We will run the frontend locally, request a magic link, and verify that the custom email is successfully delivered and successfully authenticates the user when clicked.
4. Update the Playwright E2E tests to bypass or mock the magic link flow for automated testing.
