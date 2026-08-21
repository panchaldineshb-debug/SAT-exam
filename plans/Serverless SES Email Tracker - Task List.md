# Serverless SES Email Tracker - Task List

- [x] 1. Create `sat_activity_log` DynamoDB table in Terraform.
- [x] 2. Create `sat_log_auth` Lambda function (Node.js) and wire it to Cognito Post Auth trigger.
- [x] 3. Update existing `submit_test` Lambda to log to `sat_activity_log`.
- [x] 4. Create `sat_daily_summary` Lambda (Node.js) to query logs and send emails via SES.
- [x] 5. Add EventBridge (Cron) and SES Identity (Email Verification) to Terraform.
- [x] 6. Deploy all infrastructure via `make tf-create-demo`.
- [x] 7. **Manual Verification**: Click the SES verification link sent to Gmail.
- [x] 8. Run automated E2E tests to generate real activity data.
- [x] 9. Manually trigger the daily summary Lambda to verify the HTML email arrives successfully.
