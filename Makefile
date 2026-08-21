BUCKET_NAME ?= sat-exam-app-bucket
ALLOWED_IP ?= 203.0.113.50/32
DEMO_ENV_DIR ?= terraform/environments/demo

.PHONY: all build deploy restrict-ip tf-cost tf-inventory local-demo kill-local-demo expose-local share-demo tf-init-demo tf-create-demo

all: build deploy

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

build:
	cp -r data public/
	npm run build

deploy:
	aws s3 sync dist/ s3://$(BUCKET_NAME)
	@echo "Deployment complete."

tf-init-demo:
	cd $(DEMO_ENV_DIR) && terraform init

tf-create-demo: build
	cd $(DEMO_ENV_DIR) && terraform apply --auto-approve
	@echo "Deploying SAT Exam to DEMO S3..."
	@BUCKET=$$(cd $(DEMO_ENV_DIR) && terraform output -raw s3_bucket_name) && \
	DIST_ID=$$(cd $(DEMO_ENV_DIR) && terraform output -raw cloudfront_distribution_id) && \
	aws s3 sync ./dist s3://$$BUCKET --delete && \
	aws cloudfront create-invalidation --distribution-id $$DIST_ID --paths "/*"
	@URL=$$(cd $(DEMO_ENV_DIR) && terraform output -raw cloudfront_domain) && \
	echo "DEMO UI deployed successfully! Access it at: https://$$URL"

restrict-ip:
	@echo "Generating bucket-policy.json for IP restriction..."
	@echo '{ \
		"Version": "2012-10-17", \
		"Statement": [ \
			{ \
				"Sid": "AllowSpecificIPs", \
				"Effect": "Allow", \
				"Principal": "*", \
				"Action": "s3:GetObject", \
				"Resource": "arn:aws:s3:::$(BUCKET_NAME)/*", \
				"Condition": { \
					"IpAddress": { \
						"aws:SourceIp": [ \
							"$(ALLOWED_IP)" \
						] \
					} \
				} \
			} \
		] \
	}' > bucket-policy.json
	aws s3api put-bucket-policy --bucket $(BUCKET_NAME) --policy file://bucket-policy.json
	@echo "Bucket policy applied restricting access to $(ALLOWED_IP)"

tf-cost:
	python3 scripts/tf_cost.py $(if $(NOTIFY),--notify,)

tf-inventory:
	-python3 scripts/tf_inventory.py $(if $(NOTIFY),--notify,)
