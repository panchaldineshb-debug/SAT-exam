# Exam Popularity & Review System Walkthrough

I have successfully designed and built the complete end-to-end review and rating system for the SAT Exam Platform! The system captures students' and teachers' feedback and aggregates this data on the main Dashboard to help users identify popular or challenging tests.

## Changes Made

### 1. Database (Terraform)
- Created `sat_reviews` table in DynamoDB to persist individual reviews (partition key: `testId`, sort key: `userId`).
- Created `sat_aggregates` table in DynamoDB to maintain running totals (`totalStars` and `reviewCount`) per test for fast retrieval without expensive database scans.
- Updated the `sat_lambda_exec_role` IAM policies to grant the Lambda functions read/write access to the new tables.

### 2. Backend Lambdas
- **`submit_review` API**: Added a new Lambda function capable of processing reviews. It validates inputs, ensures users are authenticated via Cognito, inserts the review into the `sat_reviews` table, and atomically updates the aggregate stats in `sat_aggregates`.
- **`get_ratings` API**: Added a new Lambda function that performs a fast scan of the `sat_aggregates` table to return average star ratings and review counts across all tests in a single API call.

### 3. Frontend React App
- **TestReviewForm**: Created a new UI component `TestReviewForm.jsx` that presents a sleek, dark-themed 5-star rating system, difficulty selector, and comment box.
- **Review Mode Integration**: Integrated the review form at the bottom of `ReviewMode.jsx` and `MarkdownDrill.jsx` so users are prompted to leave a review right after completing their practice.
- **Dashboard Enhancements**: Updated `App.jsx` to simultaneously fetch the global `/ratings` data alongside the user's `/dashboard` progress. The main `Dashboard.jsx` now visually highlights the average star rating and review count right on the test cards.

## Validation Results

- **Infrastructure Deployment**: Successfully ran `make tf-create-demo` which provisioned the tables, Lambdas, and API Gateway routes, and deployed the updated React frontend to S3/CloudFront.
- **End-to-End Tests**: Updated the Playwright test suite (`take_test.feature`) to automatically submit a 5-star review at the end of the test.
- **Test Success**: All 4 tests successfully passed in 34 seconds!
