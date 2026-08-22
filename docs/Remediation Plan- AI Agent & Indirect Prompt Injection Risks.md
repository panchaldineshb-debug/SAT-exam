# Remediation Plan: AI Agent & Indirect Prompt Injection Risks

Your current local development environment is a massive security liability. By running an AI agent in a workspace with access to deployment tools (Terraform, Make) and AWS credentials, you are one malicious prompt away from complete infrastructure compromise. If an agent reads untrusted data (like a malicious PR or web page) and gets compromised, it can use your local permissions to leak Cognito identities, destroy DynamoDB tables, or hijack Bedrock/SES.

This plan outlines a **brutal, clean, cost-effective, and honest** approach to lock this down. We are going to strictly isolate the agent, enforce least privilege, and remove any ambient access to production.

## User Review Required

> [!WARNING]
> **Credential Rotation**
> You must assume that any AWS keys, `.env` values, or database credentials that have been accessible in this workspace are already compromised. They must be rotated immediately.

> [!IMPORTANT]
> **Human-in-the-Loop Deployments**
> We will sever the agent's ability to directly deploy to production. Production deployments will require explicit human approval and authentication.

## Open Questions

> [!NOTE]
> 1. Are you currently using AWS Organizations? Setting up a dedicated, isolated Demo AWS account is easiest and cheapest under AWS Organizations.
> 2. Are you using long-lived IAM access keys (e.g., in `~/.aws/credentials`)? If so, we need to transition you to AWS IAM Identity Center (AWS SSO) for short-lived, easily revokable access.

## Proposed Changes

### Identity & Local Workspace

We will strip the agent's ambient access to high-value credentials.

- **Migrate to AWS IAM Identity Center (Free & Secure):** Eliminate long-lived IAM users/access keys. Use AWS SSO for short-lived credentials. The agent session will only be granted access to the Demo account role.
- **Isolate Secrets:** Move all production `.env` files, SSH keys, and Terraform variables out of the agent-visible workspace.

### Terraform & Infrastructure as Code

Terraform state contains a map to your entire infrastructure. Production state must be invisible to the agent.

- **State Segregation:** We will configure Terraform to use completely separate S3 buckets and KMS keys for `demo` and `prod` state.
- **Agent Restriction:** The agent will only be able to read/write the `demo` state.
- **Cost-effective State Security:** We will enable S3 Versioning and basic S3 Bucket Policies (cheaper and simpler than complex third-party tools) to protect the state files.

### Least-Privilege Lambda Execution

Broad IAM roles are lazy and dangerous. We will refactor the Terraform code to ensure each Lambda only has exactly what it needs.

- `ai_advice`: Allow `bedrock:InvokeModel` ONLY for the specific model ID.
- `submit_test` / `submit_review`: Allow `dynamodb:PutItem` ONLY for specific tables.
- `daily_summary`: Allow `ses:SendEmail` ONLY for verified identities.

### Cost-Effective Guardrails

- **Service Control Policies (SCPs):** If using AWS Organizations, we will apply free SCPs to explicitly deny the Demo account from accessing unused AWS regions or expensive services (e.g., Mac instances, large SageMaker clusters) to prevent crypto-mining if the demo account is compromised.

## Verification Plan

### Automated Tests
- Run `terraform plan` in the demo environment to ensure the new, scoped-down roles still allow the application to function.
- Attempt to read the production Terraform state bucket from the agent workspace (Expected: **Access Denied**).

### Manual Verification
- You will manually authenticate using AWS SSO, assume the production role, and verify that human-driven deployments still succeed.
- Review AWS CloudTrail logs in the demo account to confirm no unexpected actions were taken by the agent role.
