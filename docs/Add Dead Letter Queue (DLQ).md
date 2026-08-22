# Add Dead Letter Queue (DLQ)

This plan adds a Dead Letter Queue (DLQ) to the `ai_tutor_queue` to ensure that messages that fail continuously (e.g. non-throttling bugs, permanent errors) don't loop forever. It also changes the existing CloudWatch Alarm so it only alerts us if a message is moved to the DLQ (meaning the retry mechanism has officially given up).

## User Review Required
> [!IMPORTANT]
> Because we are modifying the CloudWatch alarm, the previous `InvocationClientErrors` alarm will be deleted by Terraform and replaced with a new alarm `sat-dlq-messages-visible`. Is it okay to completely remove the old Bedrock 4xx alarm? (I recommend yes, since 4xx errors are expected during throttling and shouldn't page us).

## Proposed Changes

### Terraform Demo Environment
#### [MODIFY] [serverless.tf](file:///Users/panchaldineshb/Downloads/SAT-exam/terraform/environments/demo/serverless.tf)
- **[NEW] `aws_sqs_queue.ai_tutor_dlq`:** Create a new SQS queue named `sat_ai_tutor_dlq`.
- **[MODIFY] `aws_sqs_queue.ai_tutor_queue`:** Add a `redrive_policy` pointing to the DLQ with `maxReceiveCount = 3`. This means after 3 failures (including throttling retries), the message goes to the DLQ.
- **[MODIFY] `aws_cloudwatch_metric_alarm.bedrock_client_errors`:** Convert this alarm into `aws_cloudwatch_metric_alarm.dlq_messages`.
  - Metric: `ApproximateNumberOfMessagesVisible`
  - Namespace: `AWS/SQS`
  - Threshold: `0` (Trigger if even 1 message lands in the DLQ)
  - Dimensions: `QueueName = aws_sqs_queue.ai_tutor_dlq.name`

## Verification Plan
### Automated Verification
- Run `make deploy-demo` to apply the Terraform changes.
- Ensure Terraform completes successfully without any resource creation errors.
- Trigger a test message manually via CLI to simulate 3 failures and ensure the new DLQ alarm triggers successfully.
