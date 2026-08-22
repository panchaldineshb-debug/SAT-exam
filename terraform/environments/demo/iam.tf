# ---------------------------------------------------------
# Base Assume Role Policy for Lambdas
# ---------------------------------------------------------
data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

# ---------------------------------------------------------
# CloudWatch Logs Policy (Common)
# ---------------------------------------------------------
data "aws_iam_policy_document" "lambda_logging" {
  statement {
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = ["arn:aws:logs:*:*:*"]
  }
}

# ---------------------------------------------------------
# ai_advice
# ---------------------------------------------------------
resource "aws_iam_role" "ai_advice" {
  name               = "sat_ai_advice_role-${random_id.bucket_suffix.hex}"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

data "aws_iam_policy_document" "ai_advice_policy" {
  source_policy_documents = [data.aws_iam_policy_document.lambda_logging.json]

  statement {
    actions   = ["bedrock:InvokeModel"]
    resources = ["arn:aws:bedrock:*::foundation-model/*"] # Limit to specific models in production
  }

  statement {
    actions = [
      "sqs:ReceiveMessage",
      "sqs:DeleteMessage",
      "sqs:GetQueueAttributes"
    ]
    resources = [aws_sqs_queue.ai_tutor_queue.arn]
  }

  statement {
    actions = [
      "dynamodb:GetItem",
      "dynamodb:UpdateItem",
      "dynamodb:PutItem"
    ]
    resources = [aws_dynamodb_table.progress.arn]
  }
}

resource "aws_iam_role_policy" "ai_advice" {
  name   = "ai_advice_policy"
  role   = aws_iam_role.ai_advice.id
  policy = data.aws_iam_policy_document.ai_advice_policy.json
}

# ---------------------------------------------------------
# pre_sign_up & log_auth & delete_account (Cognito)
# ---------------------------------------------------------
resource "aws_iam_role" "cognito_lambdas" {
  name               = "sat_cognito_lambdas_role-${random_id.bucket_suffix.hex}"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

data "aws_iam_policy_document" "cognito_lambdas_policy" {
  source_policy_documents = [data.aws_iam_policy_document.lambda_logging.json]

  statement {
    actions   = ["dynamodb:PutItem", "dynamodb:GetItem", "dynamodb:UpdateItem"]
    resources = [aws_dynamodb_table.activity_log.arn]
  }

  statement {
    actions   = ["cognito-idp:AdminDeleteUser"]
    resources = [aws_cognito_user_pool.sat_pool.arn]
  }
}

resource "aws_iam_role_policy" "cognito_lambdas" {
  name   = "cognito_lambdas_policy"
  role   = aws_iam_role.cognito_lambdas.id
  policy = data.aws_iam_policy_document.cognito_lambdas_policy.json
}

# ---------------------------------------------------------
# fetch_dashboard & get_ratings (Read-Only)
# ---------------------------------------------------------
resource "aws_iam_role" "read_only_lambdas" {
  name               = "sat_read_only_lambdas_role-${random_id.bucket_suffix.hex}"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

data "aws_iam_policy_document" "read_only_lambdas_policy" {
  source_policy_documents = [data.aws_iam_policy_document.lambda_logging.json]

  statement {
    actions = ["dynamodb:Query", "dynamodb:GetItem", "dynamodb:Scan"]
    resources = [
      aws_dynamodb_table.progress.arn,
      aws_dynamodb_table.aggregates.arn
    ]
  }
}

resource "aws_iam_role_policy" "read_only_lambdas" {
  name   = "read_only_lambdas_policy"
  role   = aws_iam_role.read_only_lambdas.id
  policy = data.aws_iam_policy_document.read_only_lambdas_policy.json
}

# ---------------------------------------------------------
# submit_test & submit_review (Write)
# ---------------------------------------------------------
resource "aws_iam_role" "submit_lambdas" {
  name               = "sat_submit_lambdas_role-${random_id.bucket_suffix.hex}"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

data "aws_iam_policy_document" "submit_lambdas_policy" {
  source_policy_documents = [data.aws_iam_policy_document.lambda_logging.json]

  statement {
    actions = ["dynamodb:PutItem", "dynamodb:UpdateItem", "dynamodb:GetItem"]
    resources = [
      aws_dynamodb_table.tests.arn,
      aws_dynamodb_table.progress.arn,
      aws_dynamodb_table.activity_log.arn,
      aws_dynamodb_table.aggregates.arn,
      aws_dynamodb_table.reviews.arn
    ]
  }

  statement {
    actions   = ["sqs:SendMessage"]
    resources = [aws_sqs_queue.ai_tutor_queue.arn]
  }
}

resource "aws_iam_role_policy" "submit_lambdas" {
  name   = "submit_lambdas_policy"
  role   = aws_iam_role.submit_lambdas.id
  policy = data.aws_iam_policy_document.submit_lambdas_policy.json
}

# ---------------------------------------------------------
# daily_summary
# ---------------------------------------------------------
resource "aws_iam_role" "daily_summary" {
  name               = "sat_daily_summary_role-${random_id.bucket_suffix.hex}"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

data "aws_iam_policy_document" "daily_summary_policy" {
  source_policy_documents = [data.aws_iam_policy_document.lambda_logging.json]

  statement {
    actions = ["dynamodb:Query", "dynamodb:Scan", "dynamodb:GetItem"]
    resources = [
      aws_dynamodb_table.activity_log.arn,
      aws_dynamodb_table.progress.arn
    ]
  }

  statement {
    actions   = ["ses:SendEmail", "ses:SendRawEmail"]
    resources = ["*"] # SES specific resources can be tightened later if needed
  }
}

resource "aws_iam_role_policy" "daily_summary" {
  name   = "daily_summary_policy"
  role   = aws_iam_role.daily_summary.id
  policy = data.aws_iam_policy_document.daily_summary_policy.json
}
