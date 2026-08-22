# Goal Description

Address the critical infrastructure and backend security items from the Final Release Checklist to guarantee a safe, robust, and cost-protected environment for Sameer.

## Proposed Changes

We will secure the DynamoDB data with backups, protect your AWS bill with hard budget alerts, and gracefully handle AI Tutor timeouts.

### 1. Enable DynamoDB Point-In-Time Recovery (PITR)
- **Action:** Update `terraform/environments/demo/serverless.tf` to add `point_in_time_recovery { enabled = true }` to all critical DynamoDB tables (`users`, `tests`, `progress`, `activity_log`, `reviews`, `aggregates`).
- **Benefit:** If Sameer accidentally deletes data or a bug corrupts progress, we can restore the database to any second in the last 35 days.

### 2. AWS Budget Alerts & CloudWatch Alarms
- **Action:** Add an `aws_budgets_budget` resource to Terraform with a hard limit of $5.00/month, sending an email directly to `panchaldineshb@gmail.com` if exceeded.
- **Action:** Add an `aws_cloudwatch_metric_alarm` that triggers if the API Gateway experiences `5XXError` (e.g., if Bedrock crashes or a Lambda times out).
- **Benefit:** Total peace of mind regarding the AWS bill.

### 3. Graceful AI Tutor Fallback
- **Action:** Modify the `ai_advice/index.mjs` Lambda. Instead of throwing a 500 error when Bedrock times out or hits a rate limit, it will catch the error and return a 200 OK with a friendly fallback message: *"The AI Tutor is resting right now. Please try again in a moment!"*
- **Benefit:** The UI won't crash or show a generic API error; Sameer gets a friendly, actionable message.

> [!NOTE]
> I have reviewed the `submit_test` and `ai_advice` lambdas. **Learner isolation is already perfectly implemented!** The lambdas securely read the `userId` directly from the Cognito JWT token (`authorizer.claims.sub`), meaning one user can never pass a fake ID in the payload to access another user's data.

## Open Questions

> [!TIP]
> Are you comfortable with a **$5.00 monthly threshold** for the AWS Budget alert?

## Verification Plan
1. Run `make tf-plan-demo` to verify the new Terraform resources (PITR, Budgets, Alarms).
2. Run `make tf-create-demo` to apply the changes.
3. Check the AWS console to confirm the budget alert is active.
