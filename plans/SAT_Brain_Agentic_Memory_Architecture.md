# SAT Brain: Agentic Memory as a Knowledge Wiki
## Architecture & Verification Specification

### 1. Executive Summary & Objective
To achieve a **1400+ score on the Digital SAT** and raise high school Algebra 2 performance to an **A**, standard stateless AI tutors and naive vector search (RAG) are insufficient. They suffer from "error amnesia"—treating each practice question in isolation and repeatedly explaining formulas without understanding **Student's recurring psychological, pacing, and algebraic trap vulnerabilities**.

Inspired by **Perplexity's Brain Architecture** and the **Karpathy LLM-Wiki paradigm**, the **SAT Brain** is a persistent, self-compiling, and human-auditable Knowledge Wiki. It treats Student's preparation not as ephemeral chat logs or vector fragments, but as a living, topologically linked Markdown knowledge graph.

---

### 2. Core Architectural Components

```
                ┌──────────────────────────────────────────────────────────────┐
                │                     SAT PRACTICE TEST                        │
                │        (Student finishes practice test / exercises)          │
                └──────────────────────────────┬───────────────────────────────┘
                                               │
                                               ▼
                                  [Event: submit_test via SQS]
                                               │
                                               ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ BACKGROUND COMPILER AGENT                                                                  │
│                                                                                             │
│  1. Ingestion: Parses raw answers, time-per-question telemetry, and decoy choices.          │
│  2. Synthesis: Drafts updates to Student Profile & Skill Nodes in a Staging Buffer.         │
│                                                                                             │
│  ────────────────────────────── DUAL VERIFICATION GATES ──────────────────────────────────  │
│                                                                                             │
│  [GATE 1: Deterministic Validation]            [GATE 2: Semantic Verification]              │
│  • YAML Frontmatter schema valid               • Hypotheses grounded in actual test data    │
│  • Citations to test/question IDs exist        • No contradictory mastery ratings           │
│  • Markdown headers & level taxonomy met       • Proper decoy classification alignment      │
│                                                                                             │
│                         ┌─────────────────────────────┐                                     │
│                         │ Pass Both Verification Gates│                                     │
│                         └──────────────┬──────────────┘                                     │
│                                        │                                                    │
│                                        ▼                                                    │
│  3. Controlled Synchronization:                                                             │
│     Compares Staged Output vs. Prior State (Diff Engine).                                   │
│     Applies atomic updates to Durable Knowledge Wiki + Version History.                     │
└────────────────────────────────────────┬────────────────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ DURABLE KNOWLEDGE WIKI (S3 / Local Markdown Repo with Version History)                      │
│                                                                                             │
│ ├── profile.md                    (Pacing habits, target score, overall trajectory)         │
│ ├── traps_and_decoys.md           (Catalog of decoys defeated vs. fallen for)               │
│ ├── changelog.md                  (Inspectable audit trail of every modification)           │
│ └── skills/                                                                                 │
│     ├── algebra2_linear_systems.md                                                          │
│     ├── algebra2_quadratics.md                                                              │
│     └── advanced_math_functions.md                                                          │
└────────────────────────────────────────┬────────────────────────────────────────────────────┘
                                         │
                                         ▼ (Fast Context Preload)
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ FOREGROUND TUTOR AGENT (Real-Time "Ask AI Tutor" / Hint Generator)                          │
│                                                                                             │
│ • Loads only the relevant, compiled 1-page skill summary (minimal tokens, sub-second).      │
│ • Enforces strict tutoring rules: hints only, guided steps, anti-guessing, plain text math. │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 3. Dual-Stage Verification Engine

Any update proposed by the background compiler **must pass both verification gates** before being merged into the durable wiki.

#### Gate 1: Deterministic Validation Checks
These checks are objective, programmatic, and rule-based (zero LLM evaluation required):
1. **Frontmatter Schema Conformance:**
   Every skill document must include required YAML metadata:
   ```yaml
   ---
   skill_id: "alg2_quadratics_factoring"
   domain: "Advanced Math"
   current_level: "Medium" # Foundations | Medium | Advanced
   mastery_score: 0.78     # 0.00 to 1.00
   last_evaluated_test_id: "test4"
   target_check_risk: "High" # High | Medium | Low
   citations:
     - test_id: "test4"
       question_id: "q18"
       status: "incorrect"
       decoy_type: "intermediate_step_trap"
   ---
   ```
2. **Citation & Cross-Link Integrity:**
   - Every cited question ID (`test4:q18`) must exist in the authoritative test registry (`test4.json` or DynamoDB `tests` table).
   - Broken internal Markdown links (e.g., `[[linear_systems]]`) immediately fail the build.
3. **Document Structure & College Board Taxonomy:**
   - Markdown documents must strictly contain predefined sections:
     - `# Skill Summary`
     - `## Decoys Defeated vs. Trapped`
     - `## Step-by-Step Lesson Breakdown (Foundations / Medium / Advanced)`
     - `## Prescribed Micro-Drill Routines`

#### Gate 2: Semantic Verification Checks
These checks ensure the LLM compiler does not hallucinate trends or introduce logical contradictions:
1. **Evidence Grounding:**
   - A diagnosis such as *"Student struggles with negative signs in quadratic factoring"* must point directly to question logs where Student selected a decoy specifically designed around sign inversion.
   - If evidence cannot be proven from the question's rubric and student's telemetry, the diagnosis is rejected.
2. **Graph Consistency & Progression Logic:**
   - Verifies that mastery levels do not contradict hierarchical prerequisites (e.g., Student cannot be rated "Advanced" in quadratic systems if "Foundations" in linear substitution is failing).
   - Checks that consecutive tests reflect logical delta shifts rather than erratic swings.
3. **Decoy Trap Classification Alignment:**
   - Ensures the identified root cause matches our pedagogical definitions:
     - **Intermediate Step Decoy:** Solved for $x$ when asked for $2x + 1$ or $x + y$.
     - **Sign Flip Decoy:** Factoring error yielding opposite roots.
     - **Rushing / Review Buffer Trap:** Question missed in the final 5 minutes of a module.

---

### 4. Controlled Staging & Synchronization Step

To prevent memory corruption and guarantee state stability:

1. **Isolated Staging Area:**
   - The Background Compiler writes proposed modifications to a temporary staging buffer (`.brain_staging/` or temporary memory).
2. **Three-Way Diff Comparison:**
   - The system computes an explicit diff between the staged file and the current durable file.
   - Identifies:
     - Added insights.
     - Updated mastery scores.
     - Deprecated or resolved weaknesses.
3. **Atomic Commit & Promotion:**
   - Only when **both** Gate 1 and Gate 2 return zero errors does the sync step promote staged files to the active knowledge store.
   - If either gate fails:
     - The staged patch is quarantined.
     - An alert is logged.
     - The active knowledge store remains uncorrupted.

---

### 5. Inspectable Version History & Audit Trail

Student and tutors must never be subjected to a "black box" AI. Every update produces an inspectable audit trail:

1. **Version History & Diff Inspection:**
   - In AWS: S3 Object Versioning + an append-only `changelog.md` tracking diff summaries per session.
   - Local: Markdown file revisions enabling direct visual diffs.
2. **Audit Trail Schema in `changelog.md`:**
   ```markdown
   ## Sync Event: 2026-10-11T11:00:00Z [Trigger: submit_test (test4)]
   - **Validation**: Deterministic (PASS), Semantic (PASS)
   - **Modified**: `skills/algebra2_quadratics.md`
     - Delta: Mastery adjusted from 0.70 -> 0.78
     - Traps Defeated: q12 (Decoy: Sign flip defeated)
     - Traps Missed: q18 (Decoy: Intermediate variable $x$ selected instead of $x + y$)
   - **Next Action**: Inject 1 Intermediate Step drill into next practice session.
   ```

---

### 6. AWS Implementation: Simple, Robust & Cost-Protected

In alignment with our strict AWS principles:
- **Storage:** Amazon S3 (`s3://sat-exam-static-demo-.../brain/{student_id}/`) with Object Versioning enabled. Costs **<$0.02/month**. No expensive vector databases (Pinecone/OpenSearch).
- **Compilation Compute:** Triggered asynchronously via the existing SQS queue (`ai_tutor_queue`) by AWS Lambda (`sat_brain_compiler`). Only runs when a test is submitted (zero idle cost).
- **Foreground Serving:** `sat_ai_advice` Lambda reads the compiled S3 Markdown file (1 GET request = fractions of a millisecond, minimal token prompt).
- **Security:** Strict IAM least-privilege policies; user brains isolated by Cognito Identity ID.

---

### 7. Cost & Inventory Validation Protocol (Guardrails & Automated Verification)

In strict accordance with our workspace AWS principles (Security, Reliability, Cost-effectiveness, Maintainability, Efficiency, Scalability, Simplicity, and User Experience), the SAT Brain architecture must never introduce untracked cloud spend, orphan cloud resources, or architecture drift.

#### 7.1 Architecture Trade-Offs & Cost Analysis

| Architectural Dimension | Vector Database / RAG (Pinecone / OpenSearch) | Local GPU Daemon (EC2 g4dn.xlarge) | **SAT Brain Wiki (S3 + Lambda + Serverless)** | Trade-Off Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **Monthly Cost** | $70.00 – $150.00/month (base cluster cost) | $380.00+/month ($0.526/hr 24/7) | **<$0.02/month** (storage) + ~$0.0001/run | **Cheapest alternative.** Utilizes existing S3 demo bucket (`sat-exam-static-demo-...`) and zero-idle serverless compute. |
| **Simplicity** | High complexity (embeddings, chunking, indexing) | High complexity (custom AMI, driver setup, watchdog) | **Simplest alternative.** Plain Markdown files with deterministic frontmatter parsing. |
| **Security** | Shared multi-tenant vector indexes | Open ports / self-managed host isolation | **Most secure alternative.** Isolated S3 prefixes (`brain/{userId}/*`) with IAM least privilege and Cognito identity scoping. |
| **Reliability** | Index re-sync latency & connection timeouts | Node crashes, CUDA OOM, reboot downtime | **Most reliable alternative.** S3 provides 99.999999999% (11 9's) durability with native Object Versioning. |
| **Maintainability** | Vector database version upgrades & re-indexing | OS patching, GPU drivers, custom models | **Lowest-maintenance alternative.** Zero OS or cluster maintenance overhead. |
| **Scalability** | Provisioned read/write units limit bursts | Fixed 1 GPU instance bottleneck | **Most scalable alternative.** S3 scales to 5,500 GETs/sec per prefix effortlessly; Lambda scales automatically per submission. |

#### 7.2 Automated Cost Validation (`make tf-cost`)

The repository enforces real-time cost governance via `scripts/tf_cost.py`:

1. **Monthly Budget Hard Cap:**
   - Enforced at **$100.00/month** via `aws_budgets_budget.sat_budget`.
   - **Thresholds:**
     - *Normal:* < 50.0% ($50.00).
     - *Warning:* 50.0% – 89.9% ($50.00 – $89.00) triggers budget warning notification.
     - *Critical Alert:* >= 90.0% ($90.00) triggers immediate escalation.
2. **Service Spend Attribution:**
   - Queries AWS Cost Explorer across all utilized services:
     - AWS WAF (`USE1-WebACLV2`, `USE1-RuleV2`)
     - Amazon Route 53 (`HostedZone`)
     - AWS KMS (`us-east-1-KMS-Keys`)
     - AWS Secrets Manager (`Secrets`)
     - AWS Cost Explorer (`APIRequest`)
     - Amazon ECR / S3 / Lambda / SQS
3. **Live Instance Burn Detection:**
   - Detects any accidental or unmonitored running compute instances (e.g. `g4dn.xlarge` at $0.526/hr) and computes exact hourly burn.
4. **Automated Notification Channel:**
   - When run with `NOTIFY=1`, dispatches full itemized cost summary to SNS topic: `arn:aws:sns:us-east-1:618079239197:realtor-ui-alerts`.
5. **Execution Command:**
   ```bash
   make tf-cost NOTIFY=1
   # Or directly:
   python3 scripts/tf_cost.py --notify
   ```

#### 7.3 Automated Inventory & Drift Validation (`make tf-inventory`)

To prevent infrastructure sprawl, orphan resources, and configuration drift, inventory reconciliation is executed via `scripts/tf_inventory.py`:

1. **100% Terraform State Reconciliation:**
   - Inspects active Terraform state in `terraform/environments/demo/` (tracking 78 managed resources: API Gateway routes/integrations, Cognito user pool/client, DynamoDB tables, IAM roles/policies, Lambdas, CloudFront CDN, S3 buckets, SQS queues, and CloudWatch alarms).
2. **Orphan & Shadow Resource Detection:**
   - Scans live AWS APIs in `us-east-1` for resources with prefix `sat-exam*` (EC2, S3, DynamoDB, Lambda, API Gateway) that lack a matching address in Terraform state.
   - Prevents unmanaged buckets or databases from silently generating bills.
3. **Stale State Elimination:**
   - Cross-checks whether resources defined in state have been deleted or modified out-of-band in AWS.
4. **SAT Brain Invariant Verification:**
   - Deploying or running SAT Brain must **never create untracked AWS resources**.
   - Brain artifacts are strictly stored within the pre-existing state-managed S3 bucket (`sat-exam-static-demo-...`) and processed via existing serverless queues.
5. **Automated Drift Alerting:**
   - Dispatches drift findings and inventory counts directly to SNS: `arn:aws:sns:us-east-1:618079239197:realtor-ui-alerts`.
6. **Execution Command:**
   ```bash
   make tf-inventory NOTIFY=1
   # Or directly:
   python3 scripts/tf_inventory.py --notify
   ```

---

### 8. Implementation Roadmap

| Phase | Milestone | Description | Status |
| :--- | :--- | :--- | :--- |
| **Phase 1: Local Knowledge Wiki** | File Schema & Taxonomy | Create initial Markdown templates for Student Profile, Decoy Catalog, and Algebra 2 Skills. | ✅ Complete |
| **Phase 2: Dual Verification Scripts** | Deterministic & Semantic Validators | Implement programmatic validators (`scripts/validate_brain_deterministic.py` and `scripts/validate_brain_semantic.py`). | ✅ Complete |
| **Phase 3: Staging & Sync Engine** | Controlled Promotion | Build staging, diffing, quarantine, and atomic sync script (`scripts/sync_brain.py`) with `changelog.md` audit trail. | ✅ Complete |
| **Phase 4: Cost & Inventory Validation** | Automated Guardrails | Integrate `make tf-cost` and `make tf-inventory` validation into SAT Brain operational checks. | ✅ Complete |
| **Phase 5: SQS & S3 Cloud Execution** | Serverless Async Wiring | Wire `submit_test` SQS events to trigger cloud-based brain compilation and ground foreground tutor advice. | 🔄 Ready for deployment |
