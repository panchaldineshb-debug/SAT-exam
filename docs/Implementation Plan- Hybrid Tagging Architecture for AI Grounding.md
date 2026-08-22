# Implementation Plan: Hybrid Tagging Architecture for AI Grounding

This plan details the implementation of the scalable "Hybrid Tagging" architecture to safely ground the AI Tutor in foundational SAT rules without hardcoding them into every single question.

## Open Questions
- **Rule Dictionary Location**: I will store `sat_core_rules.json` directly inside the `ai_advice` Lambda directory so it can access it instantly at runtime. Does this work for you, or do you prefer it in a shared `data/` folder? (If in `data/`, we'd need to copy it during deployment).
- **Current Tags**: Are there any specific rule tags and definitions you want me to add immediately to the dictionary? I will seed it with `quadratic_vertex` and `circle_equation` as examples.

## Proposed Changes

---

### 1. Database Seeder

#### [MODIFY] [seed_dynamodb.py](file:///Users/panchaldineshb/Downloads/SAT-exam/scripts/seed_dynamodb.py)
Update the parsing logic to extract a `tags` array from the `tests_data.json` questions and save it securely in the DynamoDB `sat_tests` table alongside the answer keys and explanations.

---

### 2. Test Submission Logic

#### [MODIFY] [submit_test/index.mjs](file:///Users/panchaldineshb/Downloads/SAT-exam/backend/lambdas/submit_test/index.mjs)
Currently, this Lambda evaluates the test and sends `incorrectTopics` to the AI Tutor queue. I will update it to also collect any `tags` attached to the incorrectly answered questions, and pass them as an `incorrectTags` array in the SQS message payload.

---

### 3. AI Tutor (Advice Generation)

#### [NEW] [ai_advice/sat_core_rules.json](file:///Users/panchaldineshb/Downloads/SAT-exam/backend/lambdas/ai_advice/sat_core_rules.json)
Create the Central Rulebook. This will be a simple JSON dictionary mapping rule tags to their full foundational definitions.
```json
{
  "quadratic_vertex": "The vertex form of a parabola is y = a(x-h)^2 + k. The x-coordinate of the vertex (h) is found using h = -b/(2a).",
  "circle_equation": "The equation of a circle is (x-h)^2 + (y-k)^2 = r^2, where (h,k) is the center and r is the radius."
}
```

#### [MODIFY] [ai_advice/index.mjs](file:///Users/panchaldineshb/Downloads/SAT-exam/backend/lambdas/ai_advice/index.mjs)
- Read the local `sat_core_rules.json` dictionary.
- Iterate through the incoming `incorrectTags` array and fetch the corresponding rules.
- Append a **"Grounding Context"** block to the Claude system prompt, containing the exact rules the student needs to learn based on their mistakes.
- Instruct the AI to explicitly reference these grounding rules when providing actionable study advice.

## Verification Plan
### Manual Verification
1. I will deploy the updated Lambdas.
2. I will manually update one test in `public/tests_data.json` to include a `tags: ["quadratic_vertex"]` array on a question.
3. I will run `seed_dynamodb.py` to push it to the database.
4. We will simulate a test submission that fails that specific question, and verify the resulting `aiAdvice` in DynamoDB includes highly specific, grounded advice utilizing the injected rule!
