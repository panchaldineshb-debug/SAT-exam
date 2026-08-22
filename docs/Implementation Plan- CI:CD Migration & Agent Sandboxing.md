# Implementation Plan: CI/CD Migration & Agent Sandboxing

Based on your essential correction, the AI agent must be treated as a fully untrusted execution environment. We will sever all paths that allow the agent to directly interact with production AWS environments.

The agent's role will shift entirely to code authoring and local testing. Actual deployments to AWS will be handled strictly by a protected CI/CD pipeline.

## User Review Required

> [!CAUTION]
> **Complete Agent Disconnect**
> Implementing this plan means the AI agent will **no longer be able to run `terraform apply` or push files to S3/CloudFront** using your local AWS credentials. You will not be able to ask the agent to "deploy to production".

## Open Questions

> [!NOTE]
> 1. Are you using **GitHub** as your version control provider? (This plan assumes GitHub Actions, but can be adapted for GitLab CI or Bitbucket Pipelines).
> 2. For the disposable demo account, do you want a script that tears down the demo environment every night, or just instructions on how to manually nuke it when needed?

## Proposed Changes

### 1. Protected CI/CD Pipeline (GitHub Actions)
We will introduce a `.github/workflows/deploy.yml` pipeline that automates the deployment process previously handled by the local `Makefile`. 

**The Pipeline will:**
1. Checkout the code.
2. Run automated tests (`npm run test` / `pytest`).
3. Build the React frontend.
4. Configure AWS Credentials using **OpenID Connect (OIDC)** (No long-lived access keys stored in GitHub Secrets!).
5. Run `terraform apply` on the `prod` environment.
6. Sync the frontend build to the production S3 bucket and invalidate CloudFront.

**Security Constraints:**
- The pipeline will only trigger on pushes or merges to the `main` branch.
- We will require pull request reviews before code can be merged into `main`.

### 2. OIDC Provider Setup
We will provide Terraform code to establish an IAM OIDC Identity Provider. This allows GitHub Actions to assume a specific deployment role in your AWS account without you having to export or store AWS `AWS_ACCESS_KEY_ID`.

### 3. Agent Execution Boundary Enforcement
We will modify the `Makefile` to explicitly block `tf-create-prod` or any production-facing deployment targets. The Makefile will only retain commands for local dev servers and running test suites.

### 4. Disposable Demo Account Strategy
To ensure the demo account is disposable, we will create a `nuke.sh` script (or `tf-destroy-demo` Makefile target reinforcement) that completely tears down the demo environment, preventing accumulated costs and lingering state.

## Verification Plan

### Automated Tests
- The GitHub Actions workflow will automatically run linting and unit tests before every deployment.
- The pipeline itself acts as the automated verification of the deployment process.

### Manual Verification
1. We will push a benign change (e.g., updating a text string in the frontend) to a branch and open a PR.
2. We will merge the PR and monitor the GitHub Actions UI to verify that OIDC authentication succeeds and the deployment goes through without needing local AWS credentials.
3. We will run `make tf-create-demo` locally *without* AWS credentials exported, verifying that the agent is properly blocked from ambient cloud auth.
