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
}

resource "aws_cognito_user_pool_client" "sat_client" {
  name         = "sat-react-client"
  user_pool_id = aws_cognito_user_pool.sat_pool.id

  generate_secret     = false
  explicit_auth_flows = ["ALLOW_USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH", "ALLOW_USER_SRP_AUTH"]
}

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
}

resource "aws_dynamodb_table" "tests" {
  name         = "sat_tests-${random_id.bucket_suffix.hex}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "testId"

  attribute {
    name = "testId"
    type = "S"
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
}

# ---------------------------------------------------------
# IAM Role for Lambda
# ---------------------------------------------------------
resource "aws_iam_role" "lambda_exec" {
  name = "sat_lambda_exec_role-${random_id.bucket_suffix.hex}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_policy" "lambda_dynamo" {
  name = "sat_lambda_dynamo_policy-${random_id.bucket_suffix.hex}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Effect   = "Allow"
        Resource = [
          aws_dynamodb_table.users.arn,
          aws_dynamodb_table.tests.arn,
          aws_dynamodb_table.progress.arn
        ]
      },
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attach" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.lambda_dynamo.arn
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
  role             = aws_iam_role.lambda_exec.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  source_code_hash = data.archive_file.fetch_dashboard_zip.output_base64sha256

  environment {
    variables = {
      PROGRESS_TABLE = aws_dynamodb_table.progress.name
    }
  }
}

data "archive_file" "submit_test_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../../../backend/lambdas/submit_test"
  output_path = "${path.module}/submit_test.zip"
}

resource "aws_lambda_function" "submit_test" {
  filename         = data.archive_file.submit_test_zip.output_path
  function_name    = "sat_submit_test-${random_id.bucket_suffix.hex}"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  source_code_hash = data.archive_file.submit_test_zip.output_base64sha256

  environment {
    variables = {
      TESTS_TABLE    = aws_dynamodb_table.tests.name
      PROGRESS_TABLE = aws_dynamodb_table.progress.name
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
  api_id           = aws_apigatewayv2_api.sat_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.fetch_dashboard.invoke_arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "fetch_dashboard_route" {
  api_id    = aws_apigatewayv2_api.sat_api.id
  route_key = "GET /dashboard"
  target    = "integrations/${aws_apigatewayv2_integration.fetch_dashboard_integration.id}"
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
  api_id           = aws_apigatewayv2_api.sat_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.submit_test.invoke_arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "submit_test_route" {
  api_id    = aws_apigatewayv2_api.sat_api.id
  route_key = "POST /submit"
  target    = "integrations/${aws_apigatewayv2_integration.submit_test_integration.id}"
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
