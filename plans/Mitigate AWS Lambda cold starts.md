# Goal Description

Mitigate AWS Lambda cold starts for critical user-facing endpoints without exceeding the AWS Free Tier. We will keep the application responsive by scheduling "warm-up" pings to the most critical Lambdas.

## Proposed Changes

We will use **AWS EventBridge (CloudWatch Events)** to periodically ping the lambdas. EventBridge is completely free for up to 1,000 rules, and AWS Lambda allows 1,000,000 free invocations per month. Pinging 4 critical lambdas every 5 minutes 24/7 equals ~35,000 invocations per month, costing absolutely nothing.

### Components

#### 1. Terraform Infrastructure
- Add an AWS EventBridge Rule with a `rate(5 minutes)` schedule.
- Attach the Rule to the following user-facing Lambdas:
  - `pre_sign_up` (Authentication)
  - `fetch_dashboard` (Initial page load)
  - `submit_test` (Grading test)
  - `ai_advice` (AI Tutor)
- Add the necessary `aws_lambda_permission` to allow EventBridge to trigger these Lambdas.

#### 2. Lambda Code Adjustments
- Add a tiny check at the top of the handler in the 4 Lambdas:
  ```javascript
  if (event.source === 'serverless-warmup') {
      console.log('Warmup ping received, keeping lambda warm.');
      return 'warmed';
  }
  ```
- This ensures the Lambda stays active in memory without actually running any business logic (like querying Bedrock or DynamoDB).

## Open Questions
> [!NOTE]
> You mentioned "between 8-8 am est". I recommend running the warm-up pings **24/7 every 5 minutes**. It uses less than 4% of your monthly free tier allowance and guarantees no cold starts regardless of timezone shifts or late-night studying. Let me know if you approve this 24/7 approach or if you strictly want it limited to a specific time window!

## Verification Plan
1. Run `make tf-create-demo` to deploy the new EventBridge rule and updated Lambdas.
2. Confirm via AWS logs that the lambdas successfully receive the ping and return `'warmed'`.
3. Re-run `make test-e2e` to verify the flakiness is gone since the `pre_sign_up` lambda will now be permanently warm.
