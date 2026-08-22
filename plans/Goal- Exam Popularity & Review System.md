# Goal: Exam Popularity & Review System

Implement a tracking system to measure the popularity and difficulty of SAT exams and drills. Users will be able to rate tests (1-5 stars), categorize difficulty (Easy, Medium, Hard), and identify their role (Student vs. Teacher). The Dashboard will display aggregate star ratings and review counts for each test.

## User Review Required
> [!NOTE]
> Review the data model and UI placement. Do we want to require users to complete the test before leaving a review, or can they review at any time? (The plan assumes they can only review after completing the test / from the Review Screen).

## Open Questions
> [!IMPORTANT]
> 1. Should reviews be anonymous to other users, or should we display the reviewer's first name/username?
> 2. Should we display the written comments anywhere, or just use the data for internal tracking/aggregates on the dashboard for now?

## Proposed Changes

---

### Database (Terraform)
We need new DynamoDB tables to store the reviews and calculate aggregates efficiently.

#### [MODIFY] `terraform/environments/demo/serverless.tf`
- Add `aws_dynamodb_table.reviews`:
  - `name`: `sat_reviews-{suffix}`
  - `hash_key`: `testId` (String)
  - `range_key`: `userId` (String)
- Add `aws_dynamodb_table.aggregates`:
  - `name`: `sat_aggregates-{suffix}`
  - `hash_key`: `testId` (String)

---

### Backend Lambdas
New API routes to handle submitting and fetching ratings.

#### [NEW] `backend/lambdas/submit_review/index.mjs`
- Handles `POST /reviews`.
- Validates payload: `testId`, `rating` (1-5), `difficulty` (Easy/Medium/Hard), `role` (Student/Teacher), `comment` (optional).
- Inserts/updates the user's review in the `sat_reviews` table.
- Atomically updates the `sat_aggregates` table to recalculate the `averageRating` and `reviewCount` for the specific `testId`.

#### [NEW] `backend/lambdas/get_ratings/index.mjs`
- Handles `GET /ratings`.
- Scans the `sat_aggregates` table and returns a map of `{ testId: { averageRating, reviewCount } }`.

#### [MODIFY] `terraform/environments/demo/serverless.tf`
- Provision the new Lambdas and API Gateway routes (`POST /reviews`, `GET /ratings`).

---

### Frontend UI
Update the React app to display and collect ratings.

#### [NEW] `src/components/TestReviewForm.jsx`
- A reusable React component containing a 5-star rating widget, a dropdown for difficulty (Easy, Medium, Hard), a radio button for Role (Student/Teacher), and an optional text area for comments.
- Submits data to `POST /reviews`.

#### [MODIFY] `src/App.jsx`
- Add logic to fetch `GET /ratings` during the initial dashboard load and pass the `ratings` state down to `Dashboard`.

#### [MODIFY] `src/components/Dashboard.jsx`
- Accept `ratings` as a prop.
- On each test/drill card, display the aggregate star rating (e.g., ⭐ 4.5) and the number of reviews (e.g., `(12)`).

#### [MODIFY] `src/components/ReviewMode.jsx` & `src/components/MarkdownDrill.jsx`
- Embed the `<TestReviewForm testId={test.id} />` at the bottom of the review screens so users are prompted to leave a review after finishing their practice.

## Verification Plan

### Automated Tests
- Update `test_take_test_steps.py` to ensure the E2E test can still submit the test and successfully navigate past (or interact with) the new Review form on the Review page.

### Manual Verification
- Deploy via `make tf-create-demo`.
- Log in, complete a test, submit a review.
- Navigate back to the Dashboard and verify the star rating appears on the test card.
