# Fix DynamoDB Throttling (Scale to 100+ Students)

## Goal
Switch all 6 DynamoDB tables in the SAT backend from `PROVISIONED` (locked to 1 Read/Write Capacity Unit) to `PAY_PER_REQUEST` (On-Demand). This will instantly resolve the throttling errors causing the E2E tests to fail/hang and ensures the backend can seamlessly support 100+ concurrent students without crashing.

## Proposed Changes

### `terraform/environments/demo/serverless.tf`

We will modify the billing mode and remove the static capacity rules for the following DynamoDB table definitions:
- `aws_dynamodb_table.users`
- `aws_dynamodb_table.tests`
- `aws_dynamodb_table.progress`
- `aws_dynamodb_table.activity_log`
- `aws_dynamodb_table.reviews`
- `aws_dynamodb_table.aggregates`

For each table, the configuration will change as follows:

#### [MODIFY] `serverless.tf`
```diff
-  billing_mode   = "PROVISIONED"
-  read_capacity  = 1
-  write_capacity = 1
+  billing_mode   = "PAY_PER_REQUEST"
```

## Verification Plan

### Automated Tests
- Re-run `make test-e2e` to confirm that the `test_take_test_steps.py` and `test_login_steps.py` tests run smoothly without hanging.
- Re-run `make cleanup-e2e` to confirm the cleanup script completes in a few seconds (as opposed to > 1 minute), proving that the database `scan` is no longer being throttled.

### Manual Verification
- Run `terraform apply` and check the AWS console (or Terraform outputs) to verify that the table capacities have been successfully modified to On-Demand.
