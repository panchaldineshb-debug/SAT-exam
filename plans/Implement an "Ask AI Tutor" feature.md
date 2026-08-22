# Goal Description

Implement an "Ask AI Tutor" feature that analyzes a student's recent test performance and provides personalized study advice using Generative AI. We will use **Amazon Bedrock (Anthropic Claude 3 Haiku)**, as it is the most cost-effective, AWS-native, and robust solution for generating fast, high-quality educational feedback.

## Open Questions

> [!WARNING]
> **Bedrock Model Access**: In order to use Amazon Bedrock, you must have access granted to the `Anthropic Claude 3 Haiku` model in your AWS Account. 
> To verify: Have you enabled model access for Anthropic Claude 3 Haiku in the AWS Bedrock console in `us-east-1`? If not, we can walk through how to click the "Request Model Access" button in the AWS console first.

## Proposed Changes

---

### Frontend

#### [MODIFY] src/components/ReviewMode.jsx
- Add an "✨ Ask AI Tutor for Advice" button below the score summary.
- Add state (`aiLoading`, `aiAdvice`, `aiError`) to manage the API call.
- Render the AI's response in a nicely formatted `div` using markdown or simple text paragraphs.
- Call the new `POST /ai-advice` API Gateway endpoint when the button is clicked, passing the test ID and user's answers.

---

### Backend (Lambda & API)

#### [NEW] backend/lambdas/ai_advice/index.js
- Create a new Node.js Lambda function.
- It will verify the Cognito JWT token.
- Fetch the test details and the user's progress/answers.
- Construct a prompt: *"Student (or Student) just took the SAT Practice Test. They scored X/Y. Here are the questions they missed... Please provide 2-3 short, encouraging paragraphs of study advice."*
- Use `@aws-sdk/client-bedrock-runtime` to invoke the `anthropic.claude-3-haiku-20240307-v1:0` model.
- Return the generated advice.

#### [NEW] backend/lambdas/ai_advice/package.json
- Initialize with `@aws-sdk/client-bedrock-runtime`.

---

### Infrastructure (Terraform)

#### [MODIFY] terraform/environments/demo/serverless.tf
- Update the `aws_iam_policy.lambda_dynamo` (or create a new policy) to grant the `bedrock:InvokeModel` permission to the Lambda execution role.
- Add `data "archive_file" "ai_advice_zip"` to zip the new Lambda.
- Add `resource "aws_lambda_function" "ai_advice"`.
- Add `resource "aws_apigatewayv2_integration" "ai_advice"` for the new Lambda.
- Add `resource "aws_apigatewayv2_route" "ai_advice"` for `POST /ai-advice`.
- Add `resource "aws_lambda_permission" "api_gw_ai_advice"`.

## Verification Plan

### Automated Tests
- Run `make test-e2e` to ensure existing E2E tests still pass and the dashboard flow is not broken.

### Manual Verification
1. Run `make deploy` to push the new Lambda and API Gateway updates.
2. Complete a practice test locally.
3. Click "Ask AI Tutor for Advice" and verify that the Bedrock API responds successfully with contextual advice.
