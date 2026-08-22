# ---------------------------------------------------------
# GitHub Actions OIDC Provider for AWS
# ---------------------------------------------------------

# Create the OIDC Provider in IAM
resource "aws_iam_openid_connect_provider" "github_actions" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  # GitHub's OIDC thumbprint (can occasionally change, but this is standard)
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1", "1c58a3a8518e8759bf075b76b750d4f2df264fcd"]
}

# ---------------------------------------------------------
# IAM Role for GitHub Actions
# ---------------------------------------------------------

data "aws_iam_policy_document" "github_actions_assume_role" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github_actions.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    # Lock down to a specific repository and branch (e.g. main)
    # Replace `<your-github-org>/<your-repo-name>`
    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:YourOrg/SAT-exam:ref:refs/heads/main"]
    }
  }
}

resource "aws_iam_role" "github_actions_deploy" {
  name               = "sat-github-actions-prod-deploy"
  assume_role_policy = data.aws_iam_policy_document.github_actions_assume_role.json
}

# Attach policies necessary for deployment.
# In a true least-privilege setup, you would scope this to only allow
# managing specific resources (S3, DynamoDB, API Gateway, Lambdas, etc.)
# For this example, we attach AdministratorAccess for simplicity of deployment, 
# but it is highly recommended to scope this down for production!
resource "aws_iam_role_policy_attachment" "github_actions_deploy_admin" {
  role       = aws_iam_role.github_actions_deploy.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}

output "github_actions_role_arn" {
  value = aws_iam_role.github_actions_deploy.arn
  description = "The ARN of the IAM Role for GitHub Actions to assume. Update this in .github/workflows/deploy.yml"
}
