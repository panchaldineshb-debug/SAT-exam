# Goal: Implement 4 Cost-Effective SAT Features

We will implement 4 highly requested, cost-effective features that leverage our existing Serverless architecture:
1. **Mistake Journal**
2. **Score History & Trend Graph**
3. **Problem of the Day**
4. **Global Percentile Ranking**

---

## Open Questions

> [!TIP]
> **To keep this manageable, I plan to implement and deploy this in phases.**
> First, I will build the purely frontend features (Mistake Journal, Trend Graph, Problem of the Day). Once those are deployed and tested, I will update the Terraform configuration and Lambda for the Global Percentile Ranking. Does this phased approach sound good?

---

## Proposed Changes

### Phase 1: Pure Frontend Enhancements (Zero AWS Changes)

#### [NEW] `public/data/daily_questions.json`
- Create a JSON file containing an array of 5-10 sample SAT questions (Math and Reading).
- The frontend will download this static file (extremely cheap S3 GET) to power the "Problem of the Day".

#### [MODIFY] `package.json`
- Install `recharts` for charting the score history.

#### [NEW] `src/components/ScoreChart.jsx`
- A React component that takes the `completedTests` dictionary, extracts the dates and scores, sorts them chronologically, and renders a `LineChart` showing the student's score trend over time.

#### [NEW] `src/components/MistakeJournal.jsx`
- A React component that iterates through all `completedTests`.
- Compares the `userAnswers` against the actual correct answers (found in the `tests` prop).
- Renders a list of all missed questions grouped by Test so the student can study their weak points.

#### [NEW] `src/components/DailyChallenge.jsx`
- Fetches `/data/daily_questions.json`.
- Uses a modulus operator on the current day (`new Date().getDay()`) to deterministically pick a question.
- Displays a quick interactive question card.

#### [MODIFY] `src/components/Dashboard.jsx`
- Import and render `ScoreChart`, `MistakeJournal` (as a new Tab), and `DailyChallenge` (as a sidebar widget).

---

### Phase 2: Global Percentile Ranking (Terraform & Backend)

#### [MODIFY] `terraform/environments/demo/serverless.tf`
- **IAM Policy**: Add `s3:PutObject` to the `sat_lambda_dynamo_policy` so the `daily_summary` Lambda can write files to the static hosting S3 bucket.
- **Environment Variables**: Update the `aws_lambda_function.daily_summary` resource to pass in `PROGRESS_TABLE` and `S3_BUCKET_NAME` (`aws_s3_bucket.react_app.bucket`).

#### [MODIFY] `backend/lambdas/daily_summary/index.mjs`
- While sending the nightly email, add logic to `Scan` the `PROGRESS_TABLE` for all `COMPLETED` tests.
- Extract all the scores into a simple array (e.g. `[1200, 1150, 1500, 1340]`).
- Use the AWS SDK `S3Client` to upload this array as a `scores_distribution.json` file to the static hosting bucket. 
- *Why this is brilliant:* Calculating percentiles on the backend for every user is expensive. Generating one small static JSON file nightly and letting the frontend calculate its own percentile is virtually free!

#### [MODIFY] `src/App.jsx`
- Fetch `/scores_distribution.json` on load. Pass it down to the Dashboard to display: *"Your average score puts you in the Top X%!"*

---

## Verification Plan

### Automated Tests
- Run `make test-e2e` to ensure the Dashboard UI updates do not break the existing test flows.
- Write new Playwright tests for interacting with the Mistake Journal.

### Manual Verification
- Deploy Phase 1 (`make tf-create-demo`). Verify the new UI elements on the live CloudFront URL.
- Deploy Phase 2. Manually trigger `make send-daily-summary` (which invokes the Cron Lambda immediately) to verify it successfully writes the JSON file to S3 without IAM permission errors.
