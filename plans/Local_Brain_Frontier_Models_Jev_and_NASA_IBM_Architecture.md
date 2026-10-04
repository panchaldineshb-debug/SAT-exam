# Local SAT Brain: Frontier AI Reasoning, TypeSafe's Jev AI, & NASA-IBM Open Science Architecture

## Executive Summary & Vision

To achieve a **1400+ score on the Digital SAT** and an **A in High School Algebra 2**, the **Local SAT Brain on the Mac mini** requires more than standard autoregressive chatbots. 

By synthesizing three cutting-edge AI breakthroughs, we establish an unprecedented, private, zero-cost cognitive architecture running 100% locally on Apple Silicon:

1. **New Frontier Open-Weights Reasoning Models (System Two):**
   - High-depth mathematical chain-of-thought (e.g., **DeepSeek-R1-Distill-Qwen**, **Qwen-2.5-Math-7B**, **Llama-3.2-3B**) quantized (Q4_K_M) on Apple Silicon Metal Performance Shaders (MPS).
   - Generates scaffolded, step-by-step hints and guided conceptual breakdowns while strictly withholding direct answers.

2. **TypeSafe's Jev AI Paradigm (System One Machine-Native Typed Decision Engine):**
   - **Non-autoregressive, zero-token-streaming** typed evaluation.
   - Instead of asking a slow 7B LLM to generate paragraphs to categorize a mistake, a Jev-style typed decision layer ingests structured question telemetry and immediately returns a typed enum (`intermediate_step_trap`, `sign_flip_trap`, `target_check_failure`) with a calibrated confidence score in **<50ms**.
   - Acts as the high-speed guardrail and deterministic evaluator for Gate 1 and Gate 2 verification.

3. **NASA & IBM Foundation Model Collaboration Paradigm (Prithvi / Open Science Harmonization):**
   - Inspired by the open-source **NASA-IBM Prithvi and Lunar Foundation Models** on Hugging Face, which harmonize decades of multi-mission, heterogeneous sensor data into unified scientific representations.
   - The SAT Brain harmonizes heterogeneous student preparation signals—Bluebook digital exams, Khan Academy topic logs, paper PDF practice bundles, Desmos time telemetry, and mistake journal entries—into a single durable, versioned Markdown Knowledge Wiki.

---

## The Tri-Tier Cognitive Architecture

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                                HETEROGENEOUS STUDENT INPUTS                               │
│        (Bluebook Exams, Practice Tests, Desmos Telemetry, Scratch-Paper Inputs)           │
└─────────────────────────────────────────────┬─────────────────────────────────────────────┘
                                              │
                                              ▼
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│ TIER 3: NASA-IBM HARMONIZATION BACKBONE (Open Science Foundation Layer)                   │
│                                                                                           │
│ • Unifies multimodal test data into a normalized schema (test_id, question_id, latency).  │
│ • Preserves open, inspectable Markdown graph (brain/profile.md, brain/skills/*.md).       │
│ • Zero vendor lock-in; 100% reproducible on local filesystem with audit trail.            │
└─────────────────────────────────────────────┬─────────────────────────────────────────────┘
                                              │
                                              ▼
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│ TIER 1: TYPESAFE JEV AI ENGINE (System One Typed Decision & Routing Guardrail)            │
│                                                                                           │
│ • Input: Normalized question state + chosen option + correct key + timing.                │
│ • Process: Parallel state evaluation (non-autoregressive, zero token streaming).          │
│ • Output: Typed Decoy Classification + Calibrated Confidence:                             │
│     { "decision": "intermediate_step_trap", "confidence": 0.96, "target_check": false }   │
│ • Execution Time: <50ms on Mac mini M-Series.                                             │
└──────────────────────┬─────────────────────────────────────────────┬──────────────────────┘
                       │                                             │
      [Needs Explanation / Tutoring]                      [Deterministic Wiki Update]
                       │                                             │
                       ▼                                             ▼
┌──────────────────────────────────────────┐    ┌──────────────────────────────────────────┐
│ TIER 2: FRONTIER REASONING (System Two) │    │ GATE 1 & GATE 2 VERIFICATION ENGINE      │
│ (Qwen-2.5-Math / DeepSeek-R1 / Llama3.2) │    │ (Dual-Stage Programmatic Compiler)       │
│                                          │    │                                          │
│ • Generates guided scaffolded hints.     │    │ • Verifies YAML frontmatter & citations. │
│ • Plain-text math; anti-guessing.        │    │ • Enforces progression consistency.      │
│ • Never reveals direct answer.           │    │ • Atomic sync to brain/changelog.md.     │
└──────────────────────────────────────────┘    └──────────────────────────────────────────┘
```

---

## 1. TypeSafe's Jev AI Paradigm: Machine-Native Typed Decision Engine

### The Problem with Pure LLM Classification
Traditional LLMs (e.g. GPT-4 or standard Llama) are **autoregressive text generators**. When asked to classify whether Student fell for an `intermediate_step_trap`:
1. They waste hundreds of tokens generating verbose reasoning: *"Based on the student's answer..."*
2. Latency is high (1,500ms – 3,000ms).
3. Output format can hallucinate invalid schema keys.
4. Token costs add up rapidly.

### How Jev AI Reinvents the Guardrail Layer
TypeSafe's **Jev** is a **System One machine-native model**:
- **Zero Token Streaming:** Evaluates state directly into software-native types.
- **Calibrated Probabilities:** Returns confidence vectors, enabling mathematical certainty thresholds (e.g. only auto-tag if confidence > 0.90).
- **Sub-50ms Execution:** Runs parallel embedding/classification heads that execute instantaneously on Apple Silicon MPS or CPU.

### Local SAT Brain Implementation: `POST /decide`
In [`scripts/inference_router.py`](file:///Users/panchaldineshb/Downloads/SAT-exam/scripts/inference_router.py), we add a machine-native typed decision endpoint:

```json
// Request to /decide
{
  "state": {
    "question_id": "test4:7",
    "prompt": "Solve for x + 7 = 10 and 10^2 = y. Find (x, y).",
    "student_selected": "(3, 10)",
    "correct_key": "(3, 100)",
    "time_spent_seconds": 18
  },
  "candidate_decisions": [
    "intermediate_step_trap",
    "sign_flip_trap",
    "rushing_review_buffer_trap",
    "arithmetic_fatigue_trap"
  ]
}
```

```json
// Response from /decide (<50ms, typed)
{
  "decision": "intermediate_step_trap",
  "confidence": 0.942,
  "requires_system_two_reasoning": true,
  "pedagogical_prescriptions": [
    "Enforce Target Check Rule on scratch paper before selecting answer"
  ]
}
```

---

## 2. NASA-IBM Collaboration Paradigm: Open Science Telemetry Harmonization

### Lessons from Prithvi & Lunar Foundation Models
The NASA-IBM partnership (Prithvi-EO, Surya Heliophysics, Lunar Science Models) demonstrated that solving complex domain challenges requires:
1. **Multi-Source Data Harmonization:** Unifying disparate sensors, formats, and missions into a single normalized tensor representation.
2. **Open Science Principles:** Publishing model weights, schemas, and code on open platforms (Hugging Face / GitHub) so any researcher can reproduce findings without vendor lock-in.

### Application to Student's SAT Exam Prep
Student's practice history comes from multiple heterogeneous sources:
- **Digital SAT Bluebook practice tests** (College Board digital adaptive format).
- **Khan Academy exercise sets** (Unit test mastery percentages).
- **Paper test PDF archives** (Scanned in [`data/`](file:///Users/panchaldineshb/Downloads/SAT-exam/data/)).
- **Desmos calculator telemetry** (Calculation duration and rounding patterns).

#### The Harmonized Telemetry Schema
The SAT Brain harmonizes all incoming practice events into a standardized, open-science JSON record:

```json
{
  "session_id": "session-20261012-0940",
  "student": {
    "grade": "11th Grade",
    "school": "JP Stevens High School",
    "target_score": 1400
  },
  "domain_vector": {
    "algebra_linear_systems": 0.88,
    "algebra_quadratics": 0.78,
    "advanced_math_functions": 0.82
  },
  "behavioral_telemetry": {
    "review_buffer_used": true,
    "scratch_paper_verified": true,
    "desmos_one_line_rule_followed": true,
    "time_per_hard_question_avg_sec": 84.5
  }
}
```

This ensures that regardless of whether Student practices via web UI, CLI drills, or paper tests, the Brain's durable wiki reflects a unified, scientifically calibrated diagnostic profile.

---

## 3. Frontier Open-Weights Reasoning Models (System Two)

When the System One typed layer detects that Student has encountered a genuine conceptual obstacle or trap, it delegates to a **local quantized System Two reasoning model**:

### Recommended Local Model Roster (Apple Silicon Mac mini)

| Model Name | Parameters | Quantization | Mac mini RAM Footprint | Primary Role |
| :--- | :--- | :--- | :--- | :--- |
| **Llama 3.2 3B Instruct** | 3.2B | Q4_K_M | ~2.2 GB | Daily high-speed conversational tutoring & micro-drills. |
| **Qwen 2.5 Math 7B** | 7.6B | Q4_K_M | ~4.7 GB | Deep algebraic proof verification, quadratic factoring guidance. |
| **DeepSeek-R1 Distill Qwen 7B/8B**| 7B–8B | Q4_K_M | ~4.9 GB | Complex multi-step reasoning, explaining subtle College Board reading decoys. |
| **Nomic Embed Text** | 137M | FP16 | ~280 MB | Local embedding generation for curriculum skill cross-linking. |

### Memory & Compute Budget on Mac mini
- **Total System RAM Required:** ~5.5 GB (leaves 10+ GB free for macOS, IDE, and browsers).
- **Inference Speed:** 35 – 55 tokens/second on Apple Silicon M-Series Metal GPU.
- **Cost:** **$0.00 / month forever**.

---

## 4. Implementation Plan & Milestones

### Phase 1: Jev-Style Typed Decision Module (Week 1)
- Add `/decide` endpoint to [`scripts/inference_router.py`](file:///Users/panchaldineshb/Downloads/SAT-exam/scripts/inference_router.py).
- Build lightweight, rule-and-embedding parallel decision head that matches question errors to [`brain/traps_and_decoys.md`](file:///Users/panchaldineshb/Downloads/SAT-exam/brain/traps_and_decoys.md) in <50ms.

### Phase 2: NASA-IBM Open Telemetry Harmonizer (Week 2)
- Implement `scripts/harmonize_telemetry.py` to ingest Bluebook test outputs, Khan Academy scores, and paper test results into normalized Brain schema.
- Validate through Gate 1 deterministic schema and Gate 2 semantic verification.

### Phase 3: Frontier Local Model Integration (Week 3)
- Configure Ollama with `llama3.2:3b` and `qwen2.5-math:7b`.
- Run automated benchmarks measuring Time to First Token (TTFT) and accuracy on SAT Math questions.
- Save results to [`brain/benchmarks/results_log.jsonl`](file:///Users/panchaldineshb/Downloads/SAT-exam/brain/benchmarks/results_log.jsonl).

### Phase 4: Hybrid Router Guardrails (Week 4)
- Wire the Inference Router so all routine drills run through local System One (Jev-style) + local System Two (Qwen/Llama).
- Keep AWS CUDA GPU lab dormant (`enabled = false`) under the strict $25/month ceiling.
