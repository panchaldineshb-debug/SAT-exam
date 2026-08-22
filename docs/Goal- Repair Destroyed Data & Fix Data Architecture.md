# Goal: Repair Destroyed Data & Fix Data Architecture

The current backend pipeline contains a critical bug: `scripts/seed_dynamodb.py` destroys the `key` and `explanation` attributes in `public/tests_data.json` every time it runs. If run twice, it pushes empty keys into DynamoDB, failing all student answers automatically.

Fortunately, I have located the original sources for ALL of your test data. We can completely recover all answer keys without losing any questions.

## User Review Required

> [!WARNING]
> This plan will overwrite the existing `public/tests_data.json` and the DynamoDB `sat_tests-1d79949f` table to restore the missing keys. Please review the recovery pipeline below.

## Proposed Changes

### 1. Data Recovery (Regenerating the Master Dataset)

We will abandon `public/tests_data.json` as the source of truth, as it is repeatedly overwritten and stripped of data. Instead, we will create a permanent `data/master_tests.json` that contains 100% of the questions and answers.

To build `data/master_tests.json`, we will:
1. Update `scripts/scrape_satpanda.py` to output its data to `data/master_tests.json` instead of `public/tests_data.json`.
2. Run `scrape_satpanda.py` to re-fetch all 55 math and verbal tests from SatPanda (this recovers the answers for `math-1` to `math-30` and `verbal-1` to `verbal-35`).
3. Write a small script to inject the local custom test suite (`data/full-length-sat-paper-practice-test-suite-2026-08-20/exam.json`) into `data/master_tests.json`, because that file was never stripped and still has its original keys!

### 2. Architectural Fix (Pipeline Separation)

We will modify `scripts/seed_dynamodb.py` to fix the destructive loop.

#### [MODIFY] `scripts/seed_dynamodb.py`
- Change `JSON_FILE` source to read from `data/master_tests.json`.
- Extract the secure payload (`key`, `explanation`, `tags`) and push to DynamoDB `sat_tests-1d79949f`.
- Strip the secure payload from the data in-memory.
- Write the stripped data to `public/tests_data.json`.

**Why this works:** `data/master_tests.json` becomes the read-only source of truth. `public/tests_data.json` becomes a build artifact that is completely disposable and safe to distribute to the frontend.

## Verification Plan

### Automated Verification
- Run `python3 scripts/scrape_satpanda.py` to fetch original answers.
- Run `python3 scripts/seed_dynamodb.py` to populate DynamoDB.
- Run an `aws dynamodb get-item` check to confirm `key` fields in DynamoDB are no longer `""` but contain the correct answer (e.g., `"B"` or `"47"`).
- Run `make test-e2e` to ensure the backend grading logic correctly scores a known test response.

### Manual Verification
- You can reload the UI, submit the test again with `10% of 470 = 47`, and confirm it marks as CORRECT.
