# ---------------------------------------------------------
# AWS Cognito for Authentication
# ---------------------------------------------------------
resource "aws_cognito_user_pool" "sat_pool" {
  name = "sat-students-pool-${random_id.bucket_suffix.hex}"

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = false
    require_uppercase = true
  }

  schema {
    name                     = "birth_month_year"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = false
  }

  schema {
    name                     = "terms_version"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
  }

  schema {
    name                     = "terms_accepted_at"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
  }

  lambda_config {
    pre_sign_up         = aws_lambda_function.pre_sign_up.arn
    post_authentication = aws_lambda_function.log_auth.arn
  }

  lifecycle {
    ignore_changes = [
      schema
    ]
  }
}

resource "aws_cognito_user_pool_client" "sat_client" {
  name         = "sat-react-client"
  user_pool_id = aws_cognito_user_pool.sat_pool.id

  generate_secret     = false
  explicit_auth_flows = ["ALLOW_USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH", "ALLOW_USER_SRP_AUTH"]
}

resource "aws_ses_email_identity" "magic_link_sender" {
  email = "panchaldineshb@gmail.com"
}

# ---------------------------------------------------------
# Custom Auth Lambdas
# ---------------------------------------------------------
data "archive_file" "pre_sign_up_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../../../backend/lambdas/pre_sign_up"
  output_path = "${path.module}/pre_sign_up.zip"
}

resource "aws_lambda_function" "pre_sign_up" {
  filename         = data.archive_file.pre_sign_up_zip.output_path
  function_name    = "sat_pre_sign_up-${random_id.bucket_suffix.hex}"
  role             = aws_iam_role.cognito_lambdas.arn
  handler          = "index.handler"
  runtime          = "nodejs22.x"
  source_code_hash = data.archive_file.pre_sign_up_zip.output_base64sha256
}


resource "aws_lambda_permission" "allow_cognito_pre_sign_up" {
  statement_id  = "AllowExecutionFromCognitoPreSignUp"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.pre_sign_up.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.sat_pool.arn
}

# ---------------------------------------------------------
# AWS API Gateway
# ---------------------------------------------------------

# ---------------------------------------------------------
# AWS DynamoDB Tables
# ---------------------------------------------------------
resource "aws_dynamodb_table" "users" {
  name         = "sat_users-${random_id.bucket_suffix.hex}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"

  attribute {
    name = "userId"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }
}

resource "aws_dynamodb_table" "tests" {
  name         = "sat_tests-${random_id.bucket_suffix.hex}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "testId"

  attribute {
    name = "testId"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }
}

resource "aws_dynamodb_table" "progress" {
  name         = "sat_progress-${random_id.bucket_suffix.hex}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"
  range_key    = "testId"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "testId"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }
}

resource "aws_dynamodb_table" "activity_log" {
  name         = "sat_activity_log-${random_id.bucket_suffix.hex}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "date"
  range_key    = "timestamp"

  attribute {
    name = "date"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }
}

resource "aws_dynamodb_table" "reviews" {
  name         = "sat_reviews-${random_id.bucket_suffix.hex}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "testId"
  range_key    = "userId"

  attribute {
    name = "testId"
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }
}

resource "aws_dynamodb_table" "aggregates" {
  name         = "sat_aggregates-${random_id.bucket_suffix.hex}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "testId"

  attribute {
    name = "testId"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }
}

# ---------------------------------------------------------
# IAM Role for Lambda
# ---------------------------------------------------------
# ---------------------------------------------------------
# AWS SQS Queue
# ---------------------------------------------------------
resource "aws_sqs_queue" "ai_tutor_dlq" {
  name = "sat_ai_tutor_dlq-${random_id.bucket_suffix.hex}"
}

resource "aws_sqs_queue" "ai_tutor_queue" {
  name                       = "sat_ai_tutor_queue-${random_id.bucket_suffix.hex}"
  visibility_timeout_seconds = 60

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.ai_tutor_dlq.arn
    maxReceiveCount     = 3
  })
}




# ---------------------------------------------------------
# Lambda Functions
# ---------------------------------------------------------
data "archive_file" "fetch_dashboard_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../../../backend/lambdas/fetch_dashboard"
  output_path = "${path.module}/fetch_dashboard.zip"
}

resource "aws_lambda_function" "fetch_dashboard" {
  filename         = data.archive_file.fetch_dashboard_zip.output_path
  function_name    = "sat_fetch_dashboard-${random_id.bucket_suffix.hex}"
  role             = aws_iam_role.read_only_lambdas.arn
  handler          = "index.handler"
  runtime          = "nodejs22.x"
  source_code_hash = data.archive_file.fetch_dashboard_zip.output_base64sha256

  environment {
    variables = {
      PROGRESS_TABLE   = aws_dynamodb_table.progress.name
      AGGREGATES_TABLE = aws_dynamodb_table.aggregates.name
    }
  }
}

data "archive_file" "log_auth_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../../../backend/lambdas/log_auth"
  output_path = "${path.module}/log_auth.zip"
}

resource "aws_lambda_function" "log_auth" {
  filename         = data.archive_file.log_auth_zip.output_path
  function_name    = "sat_log_auth-${random_id.bucket_suffix.hex}"
  role             = aws_iam_role.cognito_lambdas.arn
  handler          = "index.handler"
  runtime          = "nodejs22.x"
  source_code_hash = data.archive_file.log_auth_zip.output_base64sha256

  environment {
    variables = {
      ACTIVITY_TABLE = aws_dynamodb_table.activity_log.name
    }
  }
}

resource "aws_lambda_permission" "allow_cognito" {
  statement_id  = "AllowExecutionFromCognito"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.log_auth.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.sat_pool.arn
}

data "archive_file" "submit_test_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../../../backend/lambdas/submit_test"
  output_path = "${path.module}/submit_test.zip"
}

resource "aws_lambda_function" "submit_test" {
  filename         = data.archive_file.submit_test_zip.output_path
  function_name    = "sat_submit_test-${random_id.bucket_suffix.hex}"
  role             = aws_iam_role.submit_lambdas.arn
  handler          = "index.handler"
  runtime          = "nodejs22.x"
  source_code_hash = data.archive_file.submit_test_zip.output_base64sha256

  environment {
    variables = {
      TESTS_TABLE        = aws_dynamodb_table.tests.name
      PROGRESS_TABLE     = aws_dynamodb_table.progress.name
      ACTIVITY_TABLE     = aws_dynamodb_table.activity_log.name
      AGGREGATES_TABLE   = aws_dynamodb_table.aggregates.name
      AI_TUTOR_QUEUE_URL = aws_sqs_queue.ai_tutor_queue.url
    }
  }
}

# ---------------------------------------------------------
# API Gateway (HTTP API)
# ---------------------------------------------------------
resource "aws_apigatewayv2_api" "sat_api" {
  name          = "sat-api-${random_id.bucket_suffix.hex}"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_headers = ["content-type", "authorization"]
  }
}

# Cognito Authorizer
resource "aws_apigatewayv2_authorizer" "cognito" {
  api_id           = aws_apigatewayv2_api.sat_api.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]
  name             = "cognito-authorizer"

  jwt_configuration {
    audience = [aws_cognito_user_pool_client.sat_client.id]
    issuer   = "https://${aws_cognito_user_pool.sat_pool.endpoint}"
  }
}

# Route: GET /dashboard
resource "aws_apigatewayv2_integration" "fetch_dashboard_integration" {
  api_id             = aws_apigatewayv2_api.sat_api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.fetch_dashboard.invoke_arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "fetch_dashboard_route" {
  api_id             = aws_apigatewayv2_api.sat_api.id
  route_key          = "GET /dashboard"
  target             = "integrations/${aws_apigatewayv2_integration.fetch_dashboard_integration.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_lambda_permission" "apigw_fetch_dashboard" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.fetch_dashboard.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.sat_api.execution_arn}/*/*"
}

# Route: POST /submit
resource "aws_apigatewayv2_integration" "submit_test_integration" {
  api_id             = aws_apigatewayv2_api.sat_api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.submit_test.invoke_arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "submit_test_route" {
  api_id             = aws_apigatewayv2_api.sat_api.id
  route_key          = "POST /submit"
  target             = "integrations/${aws_apigatewayv2_integration.submit_test_integration.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_lambda_permission" "apigw_submit_test" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.submit_test.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.sat_api.execution_arn}/*/*"
}

# API Stage
resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.sat_api.id
  name        = "$default"
  auto_deploy = true
}

data "archive_file" "get_ratings_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../../../backend/lambdas/get_ratings"
  output_path = "${path.module}/get_ratings.zip"
}

resource "aws_lambda_function" "get_ratings" {
  filename         = data.archive_file.get_ratings_zip.output_path
  function_name    = "sat_get_ratings-${random_id.bucket_suffix.hex}"
  role             = aws_iam_role.read_only_lambdas.arn
  handler          = "index.handler"
  runtime          = "nodejs22.x"
  source_code_hash = data.archive_file.get_ratings_zip.output_base64sha256

  environment {
    variables = {
      AGGREGATES_TABLE = aws_dynamodb_table.aggregates.name
    }
  }
}

data "archive_file" "submit_review_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../../../backend/lambdas/submit_review"
  output_path = "${path.module}/submit_review.zip"
}

resource "aws_lambda_function" "submit_review" {
  filename         = data.archive_file.submit_review_zip.output_path
  function_name    = "sat_submit_review-${random_id.bucket_suffix.hex}"
  role             = aws_iam_role.submit_lambdas.arn
  handler          = "index.handler"
  runtime          = "nodejs22.x"
  source_code_hash = data.archive_file.submit_review_zip.output_base64sha256

  environment {
    variables = {
      REVIEWS_TABLE    = aws_dynamodb_table.reviews.name
      AGGREGATES_TABLE = aws_dynamodb_table.aggregates.name
    }
  }
}

# Route: GET /ratings
resource "aws_apigatewayv2_integration" "get_ratings_integration" {
  api_id             = aws_apigatewayv2_api.sat_api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.get_ratings.invoke_arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "get_ratings_route" {
  api_id    = aws_apigatewayv2_api.sat_api.id
  route_key = "GET /ratings"
  target    = "integrations/${aws_apigatewayv2_integration.get_ratings_integration.id}"
  # Make it publicly accessible or require auth? We require auth to be consistent.
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_lambda_permission" "apigw_get_ratings" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_ratings.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.sat_api.execution_arn}/*/*"
}

# Route: POST /reviews
resource "aws_apigatewayv2_integration" "submit_review_integration" {
  api_id             = aws_apigatewayv2_api.sat_api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.submit_review.invoke_arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "submit_review_route" {
  api_id             = aws_apigatewayv2_api.sat_api.id
  route_key          = "POST /reviews"
  target             = "integrations/${aws_apigatewayv2_integration.submit_review_integration.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_lambda_permission" "apigw_submit_review" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.submit_review.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.sat_api.execution_arn}/*/*"
}

# ---------------------------------------------------------
# SES and Daily Summary (EventBridge)
# ---------------------------------------------------------
resource "aws_ses_email_identity" "admin" {
  email = "panchaldineshb@gmail.com"
}

data "archive_file" "daily_summary_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../../../backend/lambdas/daily_summary"
  output_path = "${path.module}/daily_summary.zip"
}

resource "aws_lambda_function" "daily_summary" {
  filename         = data.archive_file.daily_summary_zip.output_path
  function_name    = "sat_daily_summary-${random_id.bucket_suffix.hex}"
  role             = aws_iam_role.daily_summary.arn
  handler          = "index.handler"
  runtime          = "nodejs22.x"
  source_code_hash = data.archive_file.daily_summary_zip.output_base64sha256

  environment {
    variables = {
      ACTIVITY_TABLE = aws_dynamodb_table.activity_log.name
      PROGRESS_TABLE = aws_dynamodb_table.progress.name
      S3_BUCKET_NAME = aws_s3_bucket.react_app.bucket
      SES_EMAIL      = aws_ses_email_identity.admin.email
    }
  }
}

resource "aws_cloudwatch_event_rule" "daily_summary_cron" {
  name                = "sat-daily-summary-cron"
  description         = "Triggers daily summary lambda every night at 8 PM EST"
  schedule_expression = "cron(0 0 * * ? *)" # Midnight UTC (8 PM EDT / 7 PM EST)
}

resource "aws_cloudwatch_event_target" "daily_summary_target" {
  rule      = aws_cloudwatch_event_rule.daily_summary_cron.name
  target_id = "daily_summary_lambda"
  arn       = aws_lambda_function.daily_summary.arn
}

resource "aws_lambda_permission" "allow_eventbridge" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.daily_summary.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.daily_summary_cron.arn
}

# ---------------------------------------------------------
# AI Advice Lambda and API Route
# ---------------------------------------------------------
data "archive_file" "ai_advice_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../../../backend/lambdas/ai_advice"
  output_path = "${path.module}/ai_advice.zip"
}

resource "aws_lambda_function" "ai_advice" {
  filename         = data.archive_file.ai_advice_zip.output_path
  function_name    = "sat_ai_advice-${random_id.bucket_suffix.hex}"
  role             = aws_iam_role.ai_advice.arn
  handler          = "index.handler"
  runtime          = "nodejs22.x"
  source_code_hash = data.archive_file.ai_advice_zip.output_base64sha256
  timeout          = 30 # Bedrock invocations can take time

  environment {
    variables = {
      PROGRESS_TABLE = aws_dynamodb_table.progress.name
    }
  }
}

resource "aws_lambda_event_source_mapping" "ai_advice_sqs" {
  event_source_arn = aws_sqs_queue.ai_tutor_queue.arn
  function_name    = aws_lambda_function.ai_advice.arn
  batch_size       = 1
}

# ---------------------------------------------------------
# Cost and Availability Safeguards
# ---------------------------------------------------------

resource "aws_budgets_budget" "sat_budget" {
  name         = "sat-budget-${random_id.bucket_suffix.hex}"
  budget_type  = "COST"
  limit_amount = "100.0"
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 50
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = ["panchaldineshb@gmail.com"]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 80
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = ["panchaldineshb@gmail.com"]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 100
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = ["panchaldineshb@gmail.com"]
  }
}

resource "aws_sns_topic" "alerts" {
  name = "sat-alerts-${random_id.bucket_suffix.hex}"
}

resource "aws_sns_topic_subscription" "alerts_email" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = "panchaldineshb@gmail.com"
}

resource "aws_cloudwatch_metric_alarm" "api_gateway_5xx" {
  alarm_name          = "sat-api-5xx-errors-${random_id.bucket_suffix.hex}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "5XXError"
  namespace           = "AWS/ApiGateway"
  period              = "60"
  statistic           = "Sum"
  threshold           = "0"
  alarm_description   = "Triggers if API Gateway returns any 5XX errors (e.g. Bedrock timeout)"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    ApiId = aws_apigatewayv2_api.sat_api.id
  }
}

resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  alarm_name          = "sat-lambda-errors-${random_id.bucket_suffix.hex}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = "60"
  statistic           = "Sum"
  threshold           = "0"
  alarm_description   = "Triggers if any backend Lambda throws errors"
  alarm_actions       = [aws_sns_topic.alerts.arn]
}

resource "aws_cloudwatch_metric_alarm" "dynamodb_throttling" {
  alarm_name          = "sat-dynamodb-throttling-${random_id.bucket_suffix.hex}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "ThrottledRequests"
  namespace           = "AWS/DynamoDB"
  period              = "60"
  statistic           = "Sum"
  threshold           = "0"
  alarm_description   = "Triggers if DynamoDB read/write capacity limits are hit"
  alarm_actions       = [aws_sns_topic.alerts.arn]
}

resource "aws_cloudwatch_metric_alarm" "dlq_messages" {
  alarm_name          = "sat-dlq-messages-${random_id.bucket_suffix.hex}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "ApproximateNumberOfMessagesVisible"
  namespace           = "AWS/SQS"
  period              = "60"
  statistic           = "Sum"
  threshold           = "0"
  alarm_description   = "Triggers if a message permanently fails and is moved to the DLQ"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    QueueName = aws_sqs_queue.ai_tutor_dlq.name
  }
}

data "archive_file" "delete_account_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../../../backend/lambdas/delete_account"
  output_path = "${path.module}/delete_account.zip"
}

resource "aws_lambda_function" "delete_account" {
  filename         = data.archive_file.delete_account_zip.output_path
  function_name    = "sat_delete_account-${random_id.bucket_suffix.hex}"
  role             = aws_iam_role.cognito_lambdas.arn
  handler          = "index.handler"
  runtime          = "nodejs22.x"
  source_code_hash = data.archive_file.delete_account_zip.output_base64sha256

  environment {
    variables = {
      USER_POOL_ID = aws_cognito_user_pool.sat_pool.id
    }
  }
}

resource "aws_apigatewayv2_integration" "delete_account_integration" {
  api_id                 = aws_apigatewayv2_api.sat_api.id
  integration_type       = "AWS_PROXY"
  integration_method     = "POST"
  integration_uri        = aws_lambda_function.delete_account.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "delete_account_route" {
  api_id             = aws_apigatewayv2_api.sat_api.id
  route_key          = "DELETE /account"
  target             = "integrations/${aws_apigatewayv2_integration.delete_account_integration.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_lambda_permission" "allow_api_delete_account" {
  statement_id  = "AllowExecutionFromAPIGateway_delete_account"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.delete_account.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.sat_api.execution_arn}/*/*"
}
