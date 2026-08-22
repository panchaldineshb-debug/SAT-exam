Your assessment is directionally right: the central risk is **indirect prompt injection combined with excessive local, credential, or network access**, not a guarantee that every Antigravity session will leak secrets. For this SAT project, the biggest exposure is its AWS deployment tooling and the permissions needed to manage Cognito, DynamoDB, S3/CloudFront, Lambda, Bedrock, SQS, SES, and Terraform state.[1][2]

## Project-specific risks

Your project’s deployment workflow uses a Makefile, Terraform CLI, packaging, frontend synchronization, separate demo and production environments, and remote Terraform state. An agent allowed to run those commands could potentially inspect environment variables, modify IaC, deploy altered Lambdas, upload changed frontend assets, or access state if the local identity permits it.[1]

The platform architecture also has several high-value resources: Cognito identities, student progress/test/review data in DynamoDB, AI tutoring through Bedrock, scheduled email through SES, and S3-hosted data/assets. A compromised developer session should therefore be treated as capable of affecting both confidentiality and integrity—not only reading secrets.[2]

## Recommended boundary

Use an agent-facing workspace that is deliberately unable to reach production:

| Area | Safe operating rule |
|---|---|
| AWS identity | Use a dedicated development AWS account and a short-lived IAM role, not root credentials or a production administrator profile. |
| Credentials | Keep production `.env` files, AWS profiles, Terraform variable files, private keys, and browser sessions outside the agent-visible directory. |
| Terraform | Give the agent access only to a demo backend/state and demo workspace; prevent it from selecting or assuming the production role. |
| Deployment | Require manual review for `terraform apply`, CloudFront invalidations, S3 syncs, IAM changes, Cognito changes, and Lambda deployments. |
| Network | Disable agent web/network access when practical; otherwise require confirmation for every new outbound domain or command that can send data. |
| Untrusted content | Do not let the agent process external repositories, PRs, issue text, docs, or webpages in the same session that can access AWS credentials or deployment state. |

## Least-privilege design

For the SAT application, use **distinct Lambda execution roles**, rather than a shared broad role:

- `ai_advice`: permission to invoke only the required Bedrock model and update only the appropriate student-feedback/progress records.
- `submit_test` and `submit_review`: write access only to the relevant DynamoDB tables or narrowly scoped indexes.
- `fetch_dashboard` and `get_ratings`: read access only to the required tables/attributes.
- `daily_summary`: limited read access to its reporting inputs plus permission to send through the narrowly configured SES identity.
- Deployment role: separate from runtime roles, scoped to the demo environment unless a human intentionally assumes the production deployment role.

This aligns with the architecture’s microservice separation: the dashboard reads progress and aggregates, submissions write test/progress/activity data, ratings reads aggregates, and the AI tutor interacts with Bedrock plus progress storage.[2]

## Terraform state matters

Treat Terraform state as sensitive even if it is not meant to contain plaintext secrets. State can reveal resource identifiers, endpoints, configuration, and occasionally sensitive values depending on provider resources and how variables are modeled. Because the project uses Terraform to provision core AWS services and reads/writes remote state, production state should be isolated from any coding-agent session.[1]

Practical controls:

- Separate state buckets/backends and KMS keys for demo versus production.
- Restrict production state access to a dedicated CI/CD or human-admin role.
- Enable versioning, encryption, access logging, and alerts on state-backend access.
- Avoid passing secrets to Terraform where possible; reference Secrets Manager or SSM Parameter Store values at runtime instead.

## Immediate checklist

1. Rotate any AWS access keys, API tokens, database credentials, Cognito secrets, or `.env` values that may have been readable in an agent-enabled session.
2. Remove persistent credentials from the workstation environment, shared config directories, and repository-adjacent files; use short-lived federation/role credentials instead.
3. Verify no secrets are committed in Git history, build artifacts, Terraform state, Lambda ZIPs, frontend bundles, or S3 deployment buckets.
4. Create a dedicated demo AWS account and agent-safe IAM role with a short session duration, region restrictions, explicit resource ARNs, and no production account access.
5. Put a human approval gate in front of destructive or externally visible actions: deployments, IAM updates, SES sends, Cognito changes, and network egress.
6. Audit CloudTrail, S3 data events where appropriate, Bedrock invocation logs/configuration, and CI/deployment logs for unexpected access or deployments.

The most important operating principle is simple: **an agent should never have simultaneous access to untrusted instructions and production-capable secrets or credentials.** Your existing demo/prod separation is a useful starting point, but it becomes protective only when the identities, Terraform state, secrets, and deployment permissions are genuinely isolated.[1]

Sources
