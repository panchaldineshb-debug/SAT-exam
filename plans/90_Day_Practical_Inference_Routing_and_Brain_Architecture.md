# Practical 90-Day Plan: Local Mac mini Brain & Hybrid Inference Routing Architecture

## Executive Thesis & Strategic Objective

The long-term objective is **NOT** "move Ollama to AWS." 

Moving local models blindly into cloud virtual machines is an expensive, high-maintenance anti-pattern that creates idle billing and operational fatigue. Instead, our goal is to build an **intelligent, provider-neutral inference-routing layer** that:
1. Prioritizes **local Ollama / Apple Silicon MPS compute on the Mac mini** for $0.00 zero-cost, private, sub-second personal tutoring and continuous SAT Brain compilation.
2. Dynamically routes to **AWS CUDA infrastructure (NVIDIA L4 G6 GPU)** *only* when a workload genuinely requires it (e.g., intensive multi-model benchmark evaluation, massive batch embedding generation, or teacher-student model distillation beyond unified memory limits).

---

## The 7 Core Operational Pillars (Next 90 Days)

```
                               ┌───────────────────────────────────────────────────────────┐
                               │                    SAT EXAM WORKLOAD                      │
                               │        (Student Practice Drills, Brain Compilations)      │
                               └─────────────────────────────┬─────────────────────────────┘
                                                             │
                                                             ▼
                               ┌───────────────────────────────────────────────────────────┐
                               │         PROVIDER-NEUTRAL INFERENCE ROUTING LAYER          │
                               │                                                           │
                               │   Endpoints:                                              │
                               │   • POST /chat   (Standardized message payload)           │
                               │   • POST /embed  (Vector embedding generation)            │
                               │   • GET  /health (Latency, provider status, VRAM usage)   │
                               │   • GET  /models (Locally & remotely available models)    │
                               └──────────────┬─────────────────────────────┬──────────────┘
                                              │                             │
                     [Default / Trusted / 0$] │                             │ [Burst / Specialized]
                                              ▼                             ▼
                      ┌───────────────────────────────┐     ┌───────────────────────────────┐
                      │    LOCAL MAC MINI RUNTIME     │     │     AWS GPU LAB (G6 / L4)     │
                      │                               │     │                               │
                      │  • Ollama / llamafile (MPS)   │     │  • Dormant IaC module (count=0│
                      │  • Zero cloud cost ($0.00)    │     │  • 1-2h bounded test sessions │
                      │  • Sub-second local latency   │     │  • Auto-kill timer (+120 min) │
                      │  • Complete data privacy      │     │  • Max $25/month hard cap     │
                      └──────────────┬────────────────┘     └───────────────┬───────────────┘
                                     │                                      │
                                     └──────────────────┬───────────────────┘
                                                        │
                                                        ▼
                                     ┌──────────────────────────────────────┐
                                     │      DURABLE BRAIN TELEMETRY         │
                                     │                                      │
                                     │  • brain/benchmarks/                 │
                                     │  • TTFT, TPS, Cost/Job, Quality      │
                                     │  • Empirical Demand Reassessment     │
                                     └──────────────────────────────────────┘
```

---

### Pillar 1: Build Brain Entirely Locally on the Mac mini

- **Zero-Cloud Local Invariant:** Day-to-day SAT drill evaluations, error telemetry ingestion, and Markdown wiki updates run entirely on the local Apple Silicon Mac mini.
- **Durable File Tree:**
  - `brain/profile.md`: Student pacing, review buffer status, cognitive trajectory.
  - `brain/traps_and_decoys.md`: Authoritative College Board decoy taxonomy.
  - `brain/changelog.md`: Append-only audit record of every state adjustment.
  - `brain/skills/*.md`: Algebra 2 and SAT skill nodes with YAML frontmatter.
- **Verification Gates (Local Execution):**
  - Gate 1: Deterministic schema, citation, and header verification (`scripts/validate_brain_deterministic.py`).
  - Gate 2: Semantic grounding and progression consistency (`scripts/validate_brain_semantic.py`).
  - Sync Engine: Atomic staging, diff generation, and quarantine isolation (`scripts/sync_brain.py`).

---

### Pillar 2: Define Provider-Neutral Inference Interface

The application core must never be tightly coupled to Ollama, llamafile, Bedrock, or vLLM. It communicates exclusively through four standardized HTTP endpoints:

#### 1. `POST /chat`
- **Request Body:**
  ```json
  {
    "messages": [
      {"role": "system", "content": "You are an expert SAT tutor..."},
      {"role": "user", "content": "Explain question 7 from test4."}
    ],
    "temperature": 0.2,
    "max_tokens": 512,
    "model": "auto"
  }
  ```
- **Response Format:**
  ```json
  {
    "id": "chat-8f92b",
    "provider": "local_ollama",
    "model": "llama3.2:3b",
    "message": {"role": "assistant", "content": "Hint: Consider substituting..."},
    "metrics": {
      "ttft_ms": 142.5,
      "tps": 38.4,
      "total_duration_ms": 680.2,
      "cost_usd": 0.0
    }
  }
  ```

#### 2. `POST /embed`
- **Request Body:**
  ```json
  {
    "input": ["Quadratic factoring with sign inversion", "Linear systems substitution"],
    "model": "nomic-embed-text"
  }
  ```
- **Response Format:**
  ```json
  {
    "provider": "local_ollama",
    "embeddings": [[0.012, -0.045, ...]],
    "dimensions": 768
  }
  ```

#### 3. `GET /health`
- **Response Format:**
  ```json
  {
    "status": "healthy",
    "active_provider": "local_ollama",
    "hardware": "Apple M-Series MPS",
    "memory_available_gb": 18.4,
    "uptime_seconds": 84200
  }
  ```

#### 4. `GET /models`
- **Response Format:**
  ```json
  {
    "local_models": ["llama3.2:3b", "qwen2.5:7b", "nomic-embed-text"],
    "remote_fallback_available": false
  }
  ```

---

### Pillar 3: Infrastructure-as-Code GPU Laboratory Module (Dormant by Default)

- **Terraform Module:** Located in [`terraform/modules/gpu_lab/`](file:///Users/panchaldineshb/Downloads/SAT-exam/terraform/modules/gpu_lab/).
- **Target Instance:** AWS EC2 `g6.xlarge` (NVIDIA L4 Tensor Core GPU, 24 GB VRAM, 4 vCPUs, 16 GB System RAM).
  - *On-Demand Price (us-east-1):* ~$0.804 / hour.
  - *Spot Price (us-east-1):* ~$0.24 – $0.32 / hour.
- **Dormant-by-Default Guardrail:**
  - `enabled = false` (default instance count is strictly `0`).
  - Zero idle cost when not actively running an experiment.
- **Safety Auto-Shutdown Watchdog:**
  - Cloud-init script automatically schedules an un-cancellable system shutdown:
    ```bash
    # Hard safety watchdog: Shuts down machine after 120 minutes to prevent overnight billing
    echo "shutdown -h +120" | at now
    ```

---

### Pillar 4: One 1–2 Hour CUDA Validation Session

- **Pre-Flight Condition:** Local Mac mini Brain and Router must pass 100% of integration tests before any AWS GPU instance is created.
- **Session Goals:**
  1. Boot the dormant G6 module for a single 60–120 minute window.
  2. Validate CUDA kernel compilation and vLLM / Ollama throughput on NVIDIA L4 (Ada Lovelace architecture).
  3. Run comparative benchmark across FP16 and AWQ/GPTQ 4-bit quantization.
  4. Measure true end-to-end network latency from local Mac mini to AWS EC2 over TLS.
- **Teardown Protocol:** Immediately destroy or stop instance upon benchmark completion. Total cost for session: **<$1.60**.

---

### Pillar 5: Save Benchmarks, Latency & Cost-Per-Job in Brain

- **Telemetry Directory:** [`brain/benchmarks/`](file:///Users/panchaldineshb/Downloads/SAT-exam/brain/benchmarks/).
- **Logged Telemetry Schema (`benchmarks.jsonl`):**
  - `timestamp`: ISO-8601 string.
  - `hardware_target`: `apple_silicon_m_series` vs. `aws_g6_nvidia_l4`.
  - `model_id`: e.g. `llama-3.2-3b`, `qwen-2.5-7b`.
  - `ttft_ms`: Time to first token (target: <250ms).
  - `tokens_per_sec`: Generation throughput (target: >30 tok/sec).
  - `sat_math_grounding_score`: % of questions solved with flawless step-by-step guidance without revealing final answers directly.
  - `cost_per_query_usd`: Exact dollar cost per 1,000 queries ($0.00 local vs. AWS).

---

### Pillar 6: Enforce a $25/Month Ceiling with Manual Circuit Breaker

- **Budget Cap:** Hard limit of **$25.00/month** specifically budgeted for experimental compute and lab operations.
- **Alert Tiers:**
  - *Tier 1 (Notice):* $12.50 (50% of budget) — standard Slack/SNS notification.
  - *Tier 2 (Warning):* $20.00 (80% of budget) — warning and verification check.
  - *Tier 3 (Circuit Breaker):* $25.00 (100% of budget) — automatic block on any GPU provisioning script; manual authorization required in `notes.md` before any additional cloud compute can be launched.

---

### Pillar 7: Demand-Driven Scaling Reassessment

Every 30 days (Day 30, Day 60, Day 90), evaluate based strictly on **measured data—not speculative anticipation**:

1. **Volume Audit:** How many questions and SAT Brain syncs did Student complete?
2. **Hardware Saturation:** Did the Mac mini experience thermal throttling, memory swap, or latency spikes during daily study sessions?
3. **Quality Differential:** Did remote 14B/32B CUDA models provide demonstrably superior SAT explanations compared to quantized 3B/7B models running locally on Mac mini?
4. **Conclusion Gate:** If local performance meets 100% of Student's needs, keep AWS GPU lab dormant and spend $0.

---

## 90-Day Milestone Schedule

| Timeframe | Focus Milestone | Deliverable |
| :--- | :--- | :--- |
| **Weeks 1–3 (Days 1–21)** | **Local Brain Hardening** | Finalize local Mac mini Brain pipeline; integrate daily mistake journal sync; run 100% offline drills. |
| **Weeks 4–6 (Days 22–42)** | **Inference Router Interface** | Build `/chat`, `/embed`, `/health`, `/models` provider-neutral router service with local Ollama fallback. |
| **Weeks 7–8 (Days 43–56)** | **Dormant GPU Lab IaC** | Author Terraform `gpu_lab` module with G6/L4 specs, 120-min watchdog, and $25 budget guardrails. |
| **Week 9 (Days 57–63)** | **The 1-2h CUDA Test Flight** | Execute single 90-minute G6 test session. Log TTFT, TPS, and accuracy into `brain/benchmarks/`. Terminate instance. |
| **Weeks 10–12 (Days 64–84)** | **Telemetry & Routine Tuning** | Compare Mac mini vs. CUDA benchmark data in Brain; calibrate student pacing and target check drills. |
| **Day 90** | **Executive Reassessment** | Review measured usage. Determine if hybrid routing requires any cloud compute or remains 100% local. |
