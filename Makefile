DEMO_ENV_DIR ?= terraform/environments/demo

.PHONY: help install install-test clean build local-demo kill-local-demo expose-local share-demo tf-init-demo tf-plan-demo tf-create-demo tf-destroy-demo nuke-demo tf-cost tf-inventory test-e2e test-e2e-ui set-test-credentials get-test-credentials

# Default target: show help
help:
	@echo "SAT Exam App Makefile commands:"
	@echo ""
	@echo "Usage:"
	@echo "  make <target>"
	@echo ""
	@echo "Local Development:"
	@echo "  install          Install project dependencies (npm install)"
	@echo "  install-test     Install python e2e test dependencies"
	@echo "  set-test-credentials Set test credentials in keyring"
	@echo "  get-test-credentials Get test credentials from keyring"
	@echo "  test-e2e         Run Playwright BDD tests"
	@echo "  test-e2e-ui      Run Playwright BDD tests visually (browser opens)"
	@echo "  build            Compile React frontend"
	@echo "  clean            Remove build artifacts (dist/)"
	@echo "  local-demo       Start the Vite local development server"
	@echo "  kill-local-demo  Kill any running local dev server on port 5173"
	@echo "  expose-local     Generate a temporary public URL for local server via localtunnel"
	@echo "  share-demo       Start dev server and localtunnel simultaneously"
	@echo ""
	@echo "AWS Serverless Deployment:"
	@echo "  tf-init-demo     Initialize Terraform in the DEMO environment"
	@echo "  tf-plan-demo     Run Terraform plan for the DEMO environment"
	@echo "  tf-create-demo   [DISABLED] Use GitHub Actions instead"
	@echo "  tf-destroy-demo nuke-demo  Manually destroy the DEMO environment"
	@echo "  tf-inventory     Cross-check live AWS resources against Terraform state"
	@echo "  tf-cost          Report month-to-date AWS spend by service"
	@echo "  send-daily-summary Manually trigger the daily summary email via AWS Lambda"
	@echo "  cleanup-e2e      Clean up auto-generated E2E test users from Cognito and DynamoDB"
	@echo ""

install:
	npm install

install-test:
	./.venv/bin/pip install -r requirements-test.txt
	./.venv/bin/playwright install --with-deps chromium

set-test-credentials:
	./.venv/bin/python keyring/set_credentials.py

get-test-credentials:
	./.venv/bin/python keyring/get_credentials.py

test-e2e:
	./.venv/bin/pytest --reruns 2 --reruns-delay 5 tests/

test-e2e-ui:
	HEADLESS=false ./.venv/bin/pytest --reruns 2 --reruns-delay 5 tests/
clean:
	@echo "Cleaning build artifacts..."
	rm -rf dist

build: clean
	cp -r data public/
	npm run build

local-demo:
	cp -r data public/
	npm run dev

kill-local-demo:
	@echo "Killing local development server on port 5173..."
	-lsof -ti :5173 | xargs kill -9 2>/dev/null || echo "No process found on port 5173"

expose-local:
	@echo "Generating a temporary public URL for your local server..."
	npx localtunnel --port 5173

share-demo:
	@echo "Starting dev server and tunnel simultaneously. (Press Ctrl+C to stop both)"
	cp -r data public/
	npx concurrently "npm run dev" "sleep 2 && npx localtunnel --port 5173"

tf-init-demo:
	cd $(DEMO_ENV_DIR) && terraform init

tf-plan-demo:
	cd $(DEMO_ENV_DIR) && terraform plan

tf-create-demo:
	@echo "=========================================================="
	@echo " ERROR: Agent-driven deployments are permanently disabled."
	@echo " All production changes MUST flow through GitHub Actions."
	@echo "=========================================================="
	@exit 1

nuke-demo:
	@echo "=========================================================="
	@echo " NUKING DEMO ENVIRONMENT"
	@echo " This will completely destroy all disposable resources."
	@echo "=========================================================="
	cd $(DEMO_ENV_DIR) && terraform destroy --auto-approve

tf-destroy-demo nuke-demo: nuke-demo

tf-cost:
	python3 scripts/tf_cost.py $(if $(NOTIFY),--notify,)

tf-inventory:
	-python3 scripts/tf_inventory.py $(if $(NOTIFY),--notify,)

send-daily-summary:
	@echo "Triggering the SAT Exam Daily Summary Email..."
	@FUNC=$$(cd $(DEMO_ENV_DIR) && aws lambda list-functions --query "Functions[?contains(FunctionName, 'sat_daily_summary')].FunctionName" --output text) && \
	aws lambda invoke --function-name $$FUNC response.json && \
	cat response.json && rm response.json

cleanup-e2e:
	@echo "Cleaning up E2E test users from Cognito and DynamoDB..."
	@POOL_ID=$$(aws cognito-idp list-user-pools --max-results 10 --query "UserPools[?contains(Name, 'sat-students-pool')].Id" --output text | awk '{print $$1}') && \
	PYTHONWARNINGS="ignore" ./.venv/bin/python scripts/cleanup_e2e.py --user-pool-id $$POOL_ID
