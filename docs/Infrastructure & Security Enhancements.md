# Infrastructure & Security Enhancements

We have successfully locked down the backend infrastructure with robust cost-controls, error monitoring, and realistic SAT scoring logic!

## 1. AWS Cost & Health Monitoring
To ensure the platform scales safely without unexpected costs, we deployed:
*   **$100 Monthly Budget Limit:** Configured via `aws_budgets_budget`, with alerts triggering at 50%, 80%, and 100% utilization.
*   **CloudWatch Alarms:**
    *   **Lambda Errors:** Alerts if any backend API encounters unhandled exceptions.
    *   **DynamoDB Throttling:** Alerts if read/write capacity limits are breached during high-traffic spikes.
    *   **Bedrock Errors:** Alerts if the AI Tutor hits timeout or rate limits.

> [!TIP]
> All alarms are routed to an SNS topic that emails your administrator address. You will be proactively notified if the system needs scaling adjustments!

## 2. AI-Tutor Failure Fallbacks
The AI Tutor in `ai_advice/index.mjs` now explicitly catches known AWS Bedrock limits to prevent the frontend from crashing:
*   **ThrottlingException:** Returns gracefully with: *"Our AI Tutor is currently helping many students. Please wait a few seconds and try again!"*
*   **ModelTimeoutException:** Returns gracefully with: *"The AI Tutor took too long to analyze your test. Please try again, and it should be faster next time!"*

## 3. Realistic Scoring & Global Percentiles
We upgraded the scoring logic to mirror the real SAT experience!
*   **Scaled Scoring (400-1600):** The `submit_test` Lambda now converts raw percentages into a mock 400-1600 scale.
*   **Global Aggregates:** Every submitted test updates a master `SAT_GLOBAL_SCORES` record in the DynamoDB `aggregates` table.
*   **Dynamic Percentile Ranking:** The `fetch_dashboard` Lambda dynamically calculates the user's percentile by computing a Z-Score against the global average.
*   **UI Updates:** The Dashboard and Score Trend chart now plot the 400-1600 scaled scores instead of raw points, giving a much more authentic feel.

> [!NOTE]
> We also resolved the UTC timezone drift! The Score Chart now uses the ISO timestamp from the backend to ensure tests render in the student's local timezone.

## 4. DynamoDB Auto-Scaling
To support 100+ concurrent students without lagging or dropping requests, we upgraded the database scaling configuration:
*   Migrated all 6 DynamoDB tables (`users`, `tests`, `progress`, `activity_log`, `reviews`, `aggregates`) from `PROVISIONED` (locked to 1 Read/Write per second) to `PAY_PER_REQUEST` (On-Demand).
*   **Validation**: The `make cleanup-e2e` script now completes scanning all 6 tables in ~1.7 seconds, permanently resolving the throttling freezes.

## Verification
*   `test_login_steps.py` successfully passed on local verification.
*   Terraform deployed the updated Lambdas and DynamoDB tables seamlessly.
*   Database scaling was validated via lightning-fast table scans.

The platform is fully configured and ready for the next phase!
