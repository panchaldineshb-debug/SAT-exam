# Asynchronous AI Tutor (SQS Queue Implementation)

## Goal
To scale the platform to 100,000+ concurrent students without hitting strict Amazon Bedrock rate limits, we will implement the **Asynchronous SQS Queue** strategy. The test submission will return the score instantly, while the AI Tutor request is pushed to a background queue, naturally buffering the load against AWS quotas.

## Proposed Changes

### 1. Terraform (`serverless.tf`)
- **[NEW]** Add an `aws_sqs_queue` named `sat_ai_tutor_queue`.
- **[MODIFY]** Remove the `ai_advice` API Gateway routes, integrations, and permissions.
- **[NEW]** Add an `aws_lambda_event_source_mapping` to trigger the `ai_advice` Lambda from the SQS queue.
- **[MODIFY]** Add SQS `SendMessage` permissions to the `submit_test` IAM Role, and pass the Queue URL as an environment variable.
- **[MODIFY]** Add SQS `ReceiveMessage/DeleteMessage/GetQueueAttributes` and DynamoDB `UpdateItem` permissions to the `ai_advice` IAM Role. Pass the `PROGRESS_TABLE` name as an environment variable.

### 2. Backend (`backend/lambdas/submit_test/index.mjs`)
- **[MODIFY]** After writing the test progress to DynamoDB, calculate the `incorrectTopics` directly.
- **[NEW]** Send a message to the new SQS Queue containing `{ userId, testId, score, totalQuestions, incorrectTopics }`.

### 3. Backend (`backend/lambdas/ai_advice/index.mjs`)
- **[MODIFY]** Change the handler signature to process an SQS Event (batch of records) instead of an API Gateway HTTP request.
- **[MODIFY]** For each record, invoke Bedrock. If Bedrock throws a `ThrottlingException` or `ModelTimeoutException`, we will throw an error to fail the execution, which tells SQS to naturally retry the message later.
- **[NEW]** Upon Bedrock success, update the DynamoDB `progress` table to set `aiAdvice = "..."` for the specific `userId` and `testId`.

### 4. Frontend (`src/components/ReviewMode.jsx`)
- **[MODIFY]** Remove the manual "Ask AI Tutor" button and API call logic.
- **[MODIFY]** Check if `completedInfo.aiAdvice` exists.
    - If it does, display the AI advice.
    - If it does not, display an asynchronous placeholder: *"Your AI Tutor is currently analyzing your test in the background... Check back here in a few minutes!"*

## Verification Plan

### Automated / Manual Verification
- We will run `make tf-create-demo` to apply the full Terraform restructuring.
- Run the local dev server (`make local-demo`).
- Take a test as a student and click "Submit".
- Verify that the score loads instantly and the AI box says *"analyzing in the background"*.
- Wait a few seconds, refresh the dashboard, click the test review, and verify that the AI Advice has magically populated from the background queue worker.
