DEMO_ENV_DIR ?= terraform/environments/demo

.PHONY: help install clean build local-demo kill-local-demo expose-local share-demo tf-init-demo tf-plan-demo tf-create-demo tf-destroy-demo tf-cost tf-inventory

# Default target: show help
help:
	@echo "SAT Exam App Makefile commands:"
	@echo ""
	@echo "Usage:"
	@echo "  make <target>"
	@echo ""
	@echo "Local Development:"
	@echo "  install          Install project dependencies (npm install)"
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
	@echo "  tf-create-demo   Apply Terraform, build app, sync to S3, and invalidate CloudFront"
	@echo "  tf-destroy-demo  Manually destroy the DEMO environment"
	@echo "  tf-inventory     Cross-check live AWS resources against Terraform state"
	@echo "  tf-cost          Report month-to-date AWS spend by service"
	@echo ""

install:
	npm install

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

tf-create-demo: build
	cd $(DEMO_ENV_DIR) && terraform apply --auto-approve
	@echo "Deploying SAT Exam to DEMO S3..."
	@BUCKET=$$(cd $(DEMO_ENV_DIR) && terraform output -raw s3_bucket_name) && \
	DIST_ID=$$(cd $(DEMO_ENV_DIR) && terraform output -raw cloudfront_distribution_id) && \
	aws s3 sync ./dist s3://$$BUCKET --delete && \
	aws cloudfront create-invalidation --distribution-id $$DIST_ID --paths "/*"
	@URL=$$(cd $(DEMO_ENV_DIR) && terraform output -raw cloudfront_domain) && \
	echo "DEMO UI deployed successfully! Access it at: https://$$URL"

tf-destroy-demo:
	cd $(DEMO_ENV_DIR) && terraform destroy --auto-approve

tf-cost:
	python3 scripts/tf_cost.py $(if $(NOTIFY),--notify,)

tf-inventory:
	-python3 scripts/tf_inventory.py $(if $(NOTIFY),--notify,)
