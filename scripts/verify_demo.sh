#!/bin/bash
# Post-deploy verification for terraform/environments/demo. Fails closed:
# any missing/misconfigured resource is a hard failure, not a warning, so
# `make deploy-demo` can't silently report success on a half-deployed demo.
set -euo pipefail

DEMO_ENV_DIR="${1:-terraform/environments/demo}"
FAILED=0

fail() {
  echo "FAIL: $1" >&2
  FAILED=1
}

if [ ! -d "$DEMO_ENV_DIR" ]; then
  echo "FAIL: $DEMO_ENV_DIR does not exist." >&2
  exit 1
fi

OUTPUTS=$(cd "$DEMO_ENV_DIR" && terraform output -json 2>/dev/null) || {
  echo "FAIL: 'terraform output -json' failed in $DEMO_ENV_DIR - has this environment been applied?" >&2
  exit 1
}

if [ -z "$OUTPUTS" ] || [ "$OUTPUTS" = "{}" ]; then
  echo "FAIL: No terraform outputs found in $DEMO_ENV_DIR - nothing appears to be deployed." >&2
  exit 1
fi

json_get() {
  echo "$OUTPUTS" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('$1', {}).get('value', ''))"
}

INSTANCE_ID=$(json_get instance_id)
TEARDOWN_FN=$(json_get teardown_function_name)
AUTO_DESTROY_SCHEDULE=$(json_get auto_destroy_schedule_name)
HOURLY_SCHEDULE=$(json_get hourly_reminder_schedule_name)
ALERTS_TOPIC_ARN=$(json_get alerts_topic_arn)
AUTO_DESTROY_AT=$(json_get auto_destroy_at_utc)

echo "== Demo environment verification =="
echo "Instance:          $INSTANCE_ID"
echo "Teardown Lambda:   $TEARDOWN_FN"
echo "Auto-destroy at:   $AUTO_DESTROY_AT UTC"
echo ""

# 1. Instance check
echo "-- Checking instance is running --"
if [ -n "$INSTANCE_ID" ]; then
  STATE=$(aws ec2 describe-instances --instance-ids "$INSTANCE_ID" \
    --query "Reservations[0].Instances[0].State.Name" --output text 2>/dev/null) || STATE="not-found"
  if [ "$STATE" = "running" ]; then
    echo "OK: instance $INSTANCE_ID is running."
  else
    fail "instance $INSTANCE_ID state is '$STATE', expected 'running'."
  fi
else
  fail "instance_id output is empty."
fi
echo ""

# 2. Teardown Lambda check
echo "-- Checking teardown Lambda --"
if [ -n "$TEARDOWN_FN" ]; then
  LAMBDA_STATE=$(aws lambda get-function --function-name "$TEARDOWN_FN" \
    --query "Configuration.State" --output text 2>/dev/null) || LAMBDA_STATE="not-found"
  if [ "$LAMBDA_STATE" = "Active" ]; then
    echo "OK: Lambda $TEARDOWN_FN is Active."
  else
    fail "Lambda $TEARDOWN_FN state is '$LAMBDA_STATE', expected 'Active'."
  fi
else
  fail "teardown_function_name output is empty."
fi
echo ""

# 3. Scheduler checks
echo "-- Checking schedules --"
for SCHEDULE in "$AUTO_DESTROY_SCHEDULE" "$HOURLY_SCHEDULE"; do
  if [ -z "$SCHEDULE" ]; then
    fail "a schedule name output is empty."
    continue
  fi
  SCHEDULE_JSON=$(aws scheduler get-schedule --name "$SCHEDULE" 2>/dev/null) || {
    fail "schedule '$SCHEDULE' not found via aws scheduler get-schedule."
    continue
  }
  STATE=$(echo "$SCHEDULE_JSON" | python3 -c "import json,sys; print(json.load(sys.stdin).get('State',''))")
  EXPR=$(echo "$SCHEDULE_JSON" | python3 -c "import json,sys; print(json.load(sys.stdin).get('ScheduleExpression',''))")
  if [ "$STATE" = "ENABLED" ]; then
    echo "OK: schedule '$SCHEDULE' is ENABLED ($EXPR)."
  else
    fail "schedule '$SCHEDULE' state is '$STATE', expected 'ENABLED'."
  fi
done
echo ""

# 4. Email subscription check
echo "-- Checking hourly reminder email subscription --"
if [ -n "$ALERTS_TOPIC_ARN" ]; then
  SUB_ARN=$(aws sns list-subscriptions-by-topic --topic-arn "$ALERTS_TOPIC_ARN" \
    --query "Subscriptions[0].SubscriptionArn" --output text 2>/dev/null) || SUB_ARN="not-found"
  if [ "$SUB_ARN" = "PendingConfirmation" ]; then
    fail "email subscription is PendingConfirmation - check your inbox and click the SNS confirmation link, or no reminder emails will ever arrive."
  elif [ -n "$SUB_ARN" ] && [ "$SUB_ARN" != "None" ] && [ "$SUB_ARN" != "not-found" ]; then
    echo "OK: email subscription confirmed ($SUB_ARN)."
  else
    fail "no email subscription found on topic $ALERTS_TOPIC_ARN."
  fi
else
  fail "alerts_topic_arn output is empty."
fi
echo ""

if [ "$FAILED" -ne 0 ]; then
  echo "== Verification FAILED - see FAIL lines above ==" >&2
  exit 1
fi

echo "== All checks passed =="
