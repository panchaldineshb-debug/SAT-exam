# Backend Security Overhaul & Cloud Migration

This plan details the architectural changes required to transform the SarabiLabs SAT prototype into a secure, production-ready application suitable for students. By utilizing AWS Serverless technologies, we can guarantee data security, prevent cheating, and ensure data integrity—all while keeping infrastructure costs virtually at $0/month (fitting entirely within the AWS Free Tier).

## User Review Required

> [!WARNING]
> **Major Architectural Shift**
> Implementing this plan will transition the app from a purely static, client-side application to a full-stack cloud application. This requires provisioning new AWS resources via Terraform.

> [!TIP]
> **Extremely Low Cost (Free Tier)**
> The proposed stack (Cognito, DynamoDB, Lambda, API Gateway) is designed to operate completely within the AWS Free Tier. You will only pay if the platform scales beyond tens of thousands of active users.

## Proposed Changes

### Phase 1: Authentication (AWS Cognito)
We will replace the insecure local "username" login with an enterprise-grade authentication system.
- **AWS Cognito User Pool:** Provisioned via Terraform to handle secure sign-ups, sign-ins, and password resets.
- **Frontend Integration:** Integrate the AWS SDK into the React app to create a secure login screen, ensuring only authenticated students can access the dashboard.

### Phase 2: Secure Data Storage (AWS DynamoDB)
We will replace browser `localStorage` with a highly scalable NoSQL database.
- **DynamoDB Tables (Provisioned via Terraform):**
  - `UsersTable`: Stores student metadata.
  - `TestsTable`: Stores the **secure answer keys** and explanations (inaccessible to the frontend).
  - `StudentProgressTable`: Stores test history, final scores, and in-progress auto-saves.

### Phase 3: Secure Grading API (AWS API Gateway + Lambda)
We will remove the answer keys from the frontend (`public/tests_data.json`) to prevent cheating.
- **API Gateway:** Acts as the secure front door for the backend.
- **Lambda Functions (Node.js/Python):**
  - `SubmitTest`: Receives the student's selected answers, grades them against the hidden `TestsTable`, saves the final score, and returns the results.
  - `AutoSave`: An endpoint that pulses every 30 seconds during a test to securely save the student's progress to the cloud.
  - `FetchDashboard`: Retrieves the student's historical scores and active tests upon login.

### Phase 4: Frontend Remediation
- **Remove Answer Keys:** Modify `convert_bundle_to_json.py` to output two separate JSON files: a `questions.json` for the public frontend, and an `answers.json` to be seeded into the secure DynamoDB table.
- **API Integration:** Replace all `localStorage` logic in `App.jsx` and `Dashboard.jsx` with secure `fetch()` calls to the new API Gateway endpoints, authenticated via Cognito tokens.

## Open Questions

> [!IMPORTANT]
> **Authentication Method**
> Do you want students to sign up using an Email/Password, or would you prefer to enable Social Logins (like "Sign in with Google") to reduce friction?

> [!IMPORTANT]
> **Existing Data Migration**
> Does Sameer have existing test scores saved in his local browser that we need to manually extract and migrate to the new cloud database, or is it okay to start fresh?

## Verification Plan

### Automated Tests
- Test the Lambda functions locally to ensure the grading algorithm correctly calculates scores.

### Manual Verification
- Deploy the new Terraform infrastructure to a staging environment.
- Create a test student account via Cognito.
- Attempt to inspect network traffic (Chrome DevTools) to verify answer keys are no longer exposed.
- Take a practice test, force-close the browser, reopen it, and verify the Cloud Auto-Save successfully restores progress.
