# Create SAT Practice Test Suite (August 20, 2026)

This plan outlines the creation of the markdown-based test bundle `full-length-sat-paper-practice-test-suite-2026-08-20`.

## User Review Required

> [!IMPORTANT]
> Generating a true 154-question official-length SAT test in one go is extremely large. To ensure the highest quality and adherence to your specific GAP focus areas (Poison words, Desmos rounding, etc.), I propose creating a **Half-Length "Gauntlet" Simulation**. 
> 
> This will be exactly like a real test (zero hints, strict timing, formatted exactly like the real exam), but will be 50 questions long (25 Reading/Writing, 25 Math) designed to take roughly 60-70 minutes total.
> 
> Does this half-length simulation work for you, or would you prefer I generate a full 100+ question test split across multiple files/sections?

## Open Questions

> [!WARNING]
> Since this is a Phase 4 Simulation, the rule states we must have **zero support** (no hints in the questions). Do you agree with removing all the embedded hints (e.g., 🚨 CRITICAL) that were present in the August 17th drill?

## Proposed Changes

We will create the directory `data/full-length-sat-paper-practice-test-suite-2026-08-20/` and add the following files:

### Test Bundle Files

#### [NEW] `practice-test.md`
The actual exam file. It will contain:
- Section 1: Reading and Writing (Focusing on extreme language/poison words, grammar, and transitions).
- Section 2: Math (Focusing on Algebra 2, exponential vs linear growth, systems of equations, and avoiding premature rounding).
- All questions will be multiple choice and grid-in, with **no embedded hints**.

#### [NEW] `answers.md`
The answer key. 
- Contains only the correct option letters and grid-in values.
- Will not contain the detailed explanations (as those are meant to be reviewed together post-test during our tutoring breakdown).

#### [NEW] `scoring.md`
A rubric for calculating the scaled score for this specific test suite, mimicking the official College Board scoring sheets.

#### [MODIFY] `data/drills_registry.json`
We will register this new test suite in the JSON file so the tracking system knows it exists.

## Verification Plan

### Manual Verification
- I will verify that the math problems are solvable without complex backsolving (enforcing algebraic mastery).
- I will ensure decoy options are properly implemented according to the workspace rules.
- Once created, you will take the test, and we will do a post-test diagnostic review in chat.
