# Goal: Trace Teacher and Student Ratings Independently

Currently, the rating system tracks a single average rating and count for each practice test, grouping all users (students, teachers, parents) together. We want to update the system to independently trace and display the average 5-star ratings given by Teachers versus Students.

## Proposed Changes

---

### Backend (`lambdas`)

#### [MODIFY] [backend/lambdas/submit_review/index.mjs](file:///Users/panchaldineshb/Downloads/SAT-exam/backend/lambdas/submit_review/index.mjs)
- Update the DynamoDB `UpdateExpression` logic for the `AGGREGATES_TABLE`.
- When a review is submitted, calculate which role the user selected (`Student` vs `Teacher/Tutor`).
- Update specific attributes in DynamoDB (`studentStars`, `studentCount`, `teacherStars`, `teacherCount`) using the `ADD` command.
- Add robust handling to gracefully transfer a rating if a user updates their existing review and accidentally changes their role.

#### [MODIFY] [backend/lambdas/get_ratings/index.mjs](file:///Users/panchaldineshb/Downloads/SAT-exam/backend/lambdas/get_ratings/index.mjs)
- Update the scanning logic to extract `studentStars`, `studentCount`, `teacherStars`, and `teacherCount`.
- Calculate two separate mathematical averages (`studentRating` and `teacherRating`) and append them to the API JSON response alongside the `total` stats.

---

### Frontend (`src/components`)

#### [MODIFY] [src/components/Dashboard.jsx](file:///Users/panchaldineshb/Downloads/SAT-exam/src/components/Dashboard.jsx)
- Update the test card UI (in both the Drills tab and the main Math/Verbal tabs) to display multi-line rating badges.
- If Teacher ratings exist, show a line for `★ 4.9 Teacher (12)`.
- If Student ratings exist, show a line for `★ 4.3 Student (45)`.
- If a test was rated *before* this update (and therefore doesn't have role-specific tracking), fallback to displaying the combined average so old data isn't lost.

## Open Questions

> [!IMPORTANT]
> 1. Right now the form has three roles: "Student", "Teacher/Tutor", and "Parent". I plan to only show "Teacher" and "Student" averages on the dashboard. Is that okay, or do you want Parent averages shown as well?
> 2. The old reviews currently in the database won't have the new `studentStars` or `teacherStars` fields, so they will fallback to the "combined" display. Are you okay with starting fresh with tracking role-specific ratings from this point forward?

## Verification Plan

### Automated Tests
- Run `make test-e2e` to ensure the E2E tests still successfully submit 5-star reviews without breaking the updated lambda payload.

### Manual Verification
- Deploy the Lambdas and Frontend.
- Login and submit a review as a "Teacher/Tutor", then check the Dashboard to verify it displays as "Teacher".
- Update the review to "Student", and verify the Dashboard dynamically shifts the rating to the "Student" category.
