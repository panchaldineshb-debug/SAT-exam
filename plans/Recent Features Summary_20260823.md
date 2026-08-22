# 🚀 Recent Features Summary

Here is a complete summary of all the major features, compliance rules, and infrastructure upgrades we have implemented recently to prepare the SAT Exam platform for production and real students!

---

## 1. Privacy, Compliance, & Age Gating (COPPA)
To ensure the platform is legally compliant and safe for students, we added strict data-collection rules:
*   **Neutral Age Gate:** Before signing up, users must provide their birth Month and Year. We no longer ask for full DOB to minimize data footprint.
*   **Hard Backend Enforcement:** If a user is under 13, the frontend stops them, but more importantly, our `pre_sign_up` Lambda **hard blocks** the request on the backend so no PII (email, IP) is ever saved in Cognito.
*   **Legal Disclaimers:** Added explicit links to the **Terms of Use** and **Privacy Policy** in the signup flow, making it clear this is an educational tool not affiliated with the College Board.

## 2. Realistic Scoring & Global Percentiles
We upgraded the scoring logic to give Student (and other students) a much more authentic SAT experience:
*   **Scaled Scoring (400-1600):** Raw test scores are now automatically converted into a mock 400-1600 SAT scale when submitted.
*   **Global Aggregates:** Every submitted test updates a master `SAT_GLOBAL_SCORES` record in the DynamoDB `aggregates` table.
*   **Dynamic Percentiles:** The Dashboard now calculates and displays the student's **Global Percentile** (e.g., "85th Percentile") by running a statistical Z-Score against the global average score.
*   **Dashboard Visuals:** The Score Trend chart and average score metrics now use the new 400-1600 scale natively.

## 3. Infrastructure Stability & Cost Protection
Because you want to keep costs under $100/month, we locked down the AWS backend:
*   **AWS Budgets:** Deployed a strict $100/mo budget with automated email alerts at 50%, 80%, and 100% usage thresholds.
*   **CloudWatch Alarms:** Set up alarms for API 5xx errors, Lambda crashes, DynamoDB throttling, and Bedrock (AI) errors so you are instantly notified if the system struggles.
*   **Cost & Inventory Scripts:** Created `tf_cost.py` and `tf_inventory.py` to give you instant visibility into what AWS resources are running and exactly how much they cost.

## 4. AI-Tutor Resiliency
We made the AI Tutor (Claude 3 Haiku) much more robust against AWS rate limits:
*   **Graceful Fallbacks:** If the AI Tutor hits an AWS `ThrottlingException` or `ModelTimeoutException`, the backend safely intercepts it and returns a friendly message to the student (e.g., *"Our AI Tutor is currently helping many students. Please wait a few seconds..."*) instead of crashing the app.

## 5. E2E Testing & Maintenance
To keep your automated testing smooth:
*   **E2E Cleanup Task:** Added a `make cleanup-e2e` command to the Makefile. This automatically scans Cognito and DynamoDB to purge all leftover `e2e_xxx@example.com` accounts and their test data.
*   **Isolated Test Fixtures:** Fixed a false-positive in the E2E tests where retry-logic was causing "User already exists" errors by ensuring test accounts are properly tracked.

---

### ⚠️ Pending Item: DynamoDB Scaling
As discovered during the `cleanup-e2e` run, the database is currently locked to **1 Read/Write per second (PROVISIONED)**, which causes heavy throttling during test signups and cleanups. 

Whenever you are ready, I can update the Terraform configuration to switch all tables to **PAY_PER_REQUEST (On-Demand)** so the app can support 100+ active students without crashing!
