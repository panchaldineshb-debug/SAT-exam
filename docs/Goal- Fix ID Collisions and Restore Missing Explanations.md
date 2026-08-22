# Goal: Fix ID Collisions and Restore Missing Explanations

The core issue is that both Verbal Tests and Math Tests share integer IDs (`1` through `22`). Because the database uses the `id` field as the primary key, the Math tests overwrote the Verbal tests during the initial data upload. Furthermore, the local `public/tests_data.json` had its explanations stripped and overwritten by the upload script, meaning the Verbal explanations are lost from our local workspace and the live database.

To fix this securely and brutally, we need to regenerate the original data with unique IDs and cleanly re-seed the DynamoDB.

> [!WARNING]
> **Data Migration Risk:** By changing test IDs from `1` to `verbal-1` and `math-1`, any existing test histories in the `sat_progress` and `sat_activity_log` tables pointing to ID `1` will become orphaned. Since this is a demo environment, my plan is to ignore or optionally flush old user progress, as untangling which student took Math vs. Verbal for ID `1` is impossible. Let me know if you want to flush progress or just leave it.

## Open Questions

1. **User Progress Data:** Are you okay with me leaving old progress data orphaned, or would you like me to write an extra script to wipe the `sat_progress` and `sat_activity_log` tables to ensure a totally clean slate?
2. **Scraping Time:** Running `scrape_satpanda.py` takes about ~30-40 seconds for 65 tests. Are you comfortable with me running this live web-scraping script from the agent environment?

## Proposed Changes

---

### Data Recovery & Unique IDs

#### [MODIFY] [scrape_satpanda.py](file:///Users/panchaldineshb/Downloads/SAT-exam/scripts/scrape_satpanda.py)
- **Done in Research:** I already updated `scrape_satpanda.py` to output string IDs (`f"{subject}-{test_id}"`) instead of integers.

#### [NEW] `scripts/recover_tests.sh`
- A shell script to run the scraper using the virtual environment (installing `beautifulsoup4` if missing).
- After scraping, it will call `scripts/convert_bundle_to_json.py` to rebuild the two custom full-length tests.
- It will then use a short Python snippet to append the full-length tests back into the newly scraped `public/tests_data.json`.

---

### Database Migration

#### [NEW] `scripts/cleanup_dynamodb.py`
- I will create a script to scan the `sat_tests` DynamoDB table and **delete all existing items**. This is brutal but necessary to wipe out the polluted integer-based IDs (1-35) and ensure no garbage is left behind.

#### [MODIFY] [seed_dynamodb.py](file:///Users/panchaldineshb/Downloads/SAT-exam/scripts/seed_dynamodb.py)
- Ensure it handles string-based `id`s properly (it already does `str(test['id'])`, but I will double check it).

---

## Verification Plan

### Automated Verification
- I will run `scripts/scan_errors.py` again after the new seeding is complete. It should return **zero** cross-subject anomalies!
- I will fetch a Verbal test from DynamoDB using the AWS CLI and verify that the `explanation` specifically discusses grammar and reading concepts, not math equations.

### Manual Verification
- I'll ask you to log in to the UI and open up a Verbal test to verify that the explanations are back and accurate.
