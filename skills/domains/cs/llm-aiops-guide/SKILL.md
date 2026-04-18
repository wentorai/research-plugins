---
name: llm-aiops-guide
description: "Papers on LLMs for IT operations and AIOps research"
metadata:
  openclaw:
    emoji: "🖥️"
    category: "domains"
    subcategory: "cs"
    keywords: ["AIOps", "LLM operations", "IT automation", "log analysis", "incident management", "DevOps AI"]
    source: "https://github.com/Jun-jie-Huang/awesome-LLM-AIOps"
---

# LLM for AIOps Guide

## Overview

A curated collection of research on applying LLMs to IT Operations (AIOps) — log analysis, anomaly detection, incident management, root cause analysis, and automated remediation. Tracks how foundation models are transforming traditional rule-based operations tooling into intelligent, adaptive systems. Relevant for CS researchers at the intersection of systems, NLP, and operations.

## Research Areas

```
LLM for AIOps
├── Log Analysis
│   ├── Log parsing (template extraction)
│   ├── Anomaly detection (from log sequences)
│   ├── Log summarization
│   └── Root cause from logs
├── Incident Management
│   ├── Incident triage and routing
│   ├── Severity classification
│   ├── Similar incident retrieval
│   └── Resolution recommendation
├── Root Cause Analysis
│   ├── Topology-aware diagnosis
│   ├── Multi-signal correlation
│   └── Causal inference
├── Monitoring & Alerting
│   ├── Metric anomaly detection
│   ├── Alert correlation
│   ├── Noise reduction
│   └── Capacity planning
└── Automated Remediation
    ├── Runbook generation
    ├── Script generation
    ├── Self-healing systems
    └── Change impact analysis
```

## Key Practices for LLM Operations

### Model Monitoring

```
Production LLM monitoring dimensions:

QUALITY MONITORING
- Output quality scores: automated evaluation (LLM-as-judge, BERTScore, ROUGE)
- Hallucination rate: factual grounding checks against retrieval context
- Refusal rate: track over-cautious or under-cautious safety filters
- Latency percentiles: p50, p95, p99 for time-to-first-token and total generation
- Token usage: input/output token distributions, context window utilization

DRIFT DETECTION
- Input drift: embedding-space distribution shift (cosine distance, MMD)
- Output drift: topic/style distribution changes over time windows
- Performance drift: sliding-window accuracy on held-out evaluation sets
- Concept drift: monitor for domain vocabulary shifts in user queries
- Baseline comparison: periodically re-evaluate against golden test suites

OPERATIONAL HEALTH
- GPU utilization and memory pressure (per-device, per-replica)
- Request queue depth and timeout rates
- Cache hit rates (KV cache, semantic cache, prompt cache)
- Error rates by error category (OOM, context overflow, timeout, malformed output)
- Throughput: tokens/second per deployment, requests/minute
```

### A/B Testing for LLMs

```
Designing valid A/B tests for LLM systems:

CHALLENGES UNIQUE TO LLMs
- High output variance: same prompt can produce different outputs
- Evaluation subjectivity: many tasks lack clear ground truth
- Latency-quality tradeoff: larger models are better but slower
- Cost confound: better model may cost 10x more per query

RECOMMENDED APPROACH
1. Define metrics BEFORE experiment:
   - Primary: task-specific quality (accuracy, user satisfaction, resolution rate)
   - Secondary: latency, cost per query, token efficiency
   - Guardrail: safety violations, hallucination rate

2. Traffic splitting strategy:
   - User-level randomization (not request-level) to avoid confusion
   - Minimum 1-2 weeks for stable estimates
   - Stratify by user segment (power users vs. new users)

3. Evaluation methods:
   - Automated scoring with LLM-as-judge (calibrated against human raters)
   - Blind human evaluation on sampled outputs (inter-rater agreement > 0.7)
   - Downstream business metrics (ticket resolution time, user retention)

4. Statistical rigor:
   - Bootstrap confidence intervals for LLM quality scores
   - Account for multiple comparisons when testing many variants
   - Report effect sizes, not just p-values
```

## Toolchain Overview

### Experiment Tracking and Model Registry

| Tool | Focus | Key Capabilities |
|------|-------|-----------------|
| MLflow | End-to-end ML lifecycle | Experiment tracking, model registry, deployment, LLM evaluation |
| Weights & Biases | Experiment tracking + LLM monitoring | Traces, prompt versioning, evaluation tables, sweeps |
| LangSmith | LLM application observability | Trace visualization, prompt playground, dataset management, online evaluation |
| Comet ML | Experiment management | Model comparison, artifact tracking, LLM prompt tracking |

### Serving and Inference

| Tool | Focus | Key Capabilities |
|------|-------|-----------------|
| vLLM | High-throughput serving | PagedAttention, continuous batching, tensor parallelism, speculative decoding |
| TGI (Text Generation Inference) | Production serving | Quantization, streaming, multi-LoRA, watermarking |
| Ollama | Local model running | Easy setup, model library, OpenAI-compatible API |
| TensorRT-LLM | NVIDIA-optimized inference | FP8 quantization, in-flight batching, custom kernels |
| SGLang | Structured generation serving | RadixAttention, constrained decoding, multi-modal support |

### Orchestration and Pipelines

| Tool | Focus | Key Capabilities |
|------|-------|-----------------|
| LangChain / LangGraph | LLM application framework | Chains, agents, tool use, stateful multi-actor workflows |
| Haystack | NLP pipeline framework | RAG pipelines, document processing, evaluation |
| Prefect / Airflow | Workflow orchestration | DAG scheduling, retry logic, observability |
| Ray Serve | Distributed serving | Auto-scaling, multi-model composition, batch inference |

## Typical LLMOps Pipeline Architecture

```
End-to-end LLMOps pipeline:

┌─────────────────────────────────────────────────────────────────┐
│                     DATA PREPARATION                            │
│  Raw data → Cleaning → Annotation → Train/Eval split            │
│  Tools: Label Studio, Argilla, Lilac, DVC                       │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   MODEL DEVELOPMENT                             │
│  Base model selection → Fine-tuning (LoRA/QLoRA) → Evaluation   │
│  Tools: Hugging Face Transformers, Axolotl, LLaMA-Factory       │
│  Eval: lm-evaluation-harness, HELM, custom domain benchmarks    │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   MODEL REGISTRY & CI                           │
│  Version control → Automated testing → Approval gates           │
│  Tools: MLflow Registry, W&B Model Registry, HF Hub             │
│  Tests: regression suite, safety checks, latency benchmarks     │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   DEPLOYMENT                                    │
│  Quantization → Containerization → Canary rollout → Full deploy │
│  Tools: vLLM, TGI, Docker, Kubernetes, Terraform                │
│  Strategy: blue-green or canary with automatic rollback          │
└──────────────────────────┬──────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   PRODUCTION MONITORING                         │
│  Quality monitoring → Drift detection → Alerting → Feedback     │
│  Tools: LangSmith, W&B Weave, Prometheus + Grafana, PagerDuty  │
│  Loop: degradation detected → trigger re-evaluation → retrain   │
└─────────────────────────────────────────────────────────────────┘
```

### Pipeline Design Principles

1. **Reproducibility**: Every model version must be traceable to its training data, hyperparameters, and base model. Use deterministic seeds and pin library versions.
2. **Evaluation-first**: Define evaluation criteria before training. Include both automated metrics and human evaluation protocols.
3. **Gradual rollout**: Never switch 100% traffic to a new model instantly. Use canary deployments (1% -> 10% -> 50% -> 100%) with automatic rollback on quality regression.
4. **Feedback loops**: Collect user feedback (explicit thumbs up/down, implicit engagement metrics) and route it back to evaluation datasets.
5. **Safety gates**: Automated checks for toxic output, PII leakage, and prompt injection before any model promotion.

## Cost Optimization Strategies

### Quantization

```
Reducing model size and inference cost:

QUANTIZATION METHODS
- GPTQ: Post-training quantization, good quality at 4-bit, widely supported
- AWQ (Activation-aware Weight Quantization): Better quality than GPTQ at 4-bit
- GGUF: CPU-friendly format, variable bit-width (Q4_K_M, Q5_K_M, Q8_0)
- FP8: NVIDIA H100/B200 native, minimal quality loss, 2x throughput vs FP16
- AQLM: Additive quantization, state-of-the-art at 2-bit

PRACTICAL GUIDANCE
- 8-bit: negligible quality loss for most tasks (~0.1% accuracy drop)
- 4-bit: slight quality loss, acceptable for many production uses (~1-3% accuracy drop)
- 2-3 bit: noticeable degradation, use only when cost is critical
- Always evaluate on YOUR task after quantization (general benchmarks can be misleading)
- Combine quantization with speculative decoding for further speedup
```

### Caching Strategies

```
Multi-layer caching for LLM systems:

EXACT MATCH CACHE
- Hash the full prompt, return cached response for identical queries
- Hit rate: typically 5-15% for general-purpose, 30-60% for structured queries
- Tools: Redis, DragonflyDB, in-memory LRU

SEMANTIC CACHE
- Embed the prompt, return cached response for semantically similar queries
- Similarity threshold: 0.95+ cosine similarity (tune per use case)
- Tools: GPTCache, Redis with vector search, Qdrant
- Risk: semantically similar prompts may require different answers

KV CACHE OPTIMIZATION
- PagedAttention (vLLM): eliminates memory waste from pre-allocated KV cache
- Prefix caching: reuse KV cache for shared system prompts across requests
- Quantized KV cache: FP8 or INT8 KV values (H100+, ~2x context capacity)

PROMPT CACHING (API providers)
- Anthropic prompt caching: cache static prefix, pay reduced rate for cached tokens
- OpenAI cached context: automatic for repeated prefixes
- Design prompts with static prefix (system prompt, examples) + dynamic suffix (user query)
```

### Intelligent Routing

```
Cost-quality optimization through model routing:

TIERED MODEL ROUTING
- Simple queries → small/fast model (e.g., GPT-4o-mini, Claude Haiku, Llama-8B)
- Complex queries → large/capable model (e.g., GPT-4o, Claude Sonnet, Llama-70B)
- Critical queries → frontier model (e.g., o3, Claude Opus)

ROUTING STRATEGIES
1. Classifier-based: Train a small classifier on query complexity
   - Features: query length, vocabulary complexity, domain signals
   - Labels: which model tier produces acceptable quality
   - Cost: classifier inference is negligible (<1ms, <$0.001)

2. Cascade (try-small-first):
   - Route to cheapest model first
   - Check output quality with a verifier
   - Escalate to larger model if quality is insufficient
   - Effective when >50% of queries are simple

3. Task-based routing:
   - Summarization, translation → mid-tier model
   - Code generation, math reasoning → high-tier model
   - Classification, extraction → small model or fine-tuned specialist

EXPECTED SAVINGS
- Typical 40-70% cost reduction vs. routing everything to the best model
- Quality degradation: <5% when routing thresholds are properly calibrated
```

## Key Papers

| Paper | Year | Focus |
|-------|------|-------|
| LogPPT | 2023 | Few-shot log parsing with prompt tuning |
| OpsEval | 2024 | Benchmark for evaluating LLMs in AIOps |
| D-Bot | 2024 | LLM-based database diagnosis |
| RCAgent | 2024 | Agent for root cause analysis |
| LogAgent | 2024 | Autonomous log analysis agent |
| AIOpsLab | 2024 | Holistic benchmark suite for AIOps agents |
| MonitorAssistant | 2024 | LLM-based alert correlation and noise reduction |
| LLM4Ops Survey | 2024 | Comprehensive survey of LLMs for IT operations |

## Use Cases

1. **Literature tracking**: Follow LLM-AIOps research evolution
2. **System design**: Learn intelligent operations patterns
3. **Benchmark comparison**: Evaluate AIOps approaches
4. **Research planning**: Identify under-explored AIOps problems
5. **Industry applications**: Bridge research to production AIOps
6. **Cost modeling**: Design cost-efficient LLM serving architectures
7. **Pipeline design**: Architect end-to-end LLMOps workflows

## References

- [awesome-LLM-AIOps](https://github.com/Jun-jie-Huang/awesome-LLM-AIOps)
- [OpsEval Benchmark](https://arxiv.org/abs/2310.07637)
- [vLLM: Easy, Fast, and Cheap LLM Serving](https://arxiv.org/abs/2309.06180)
- [LangSmith Documentation](https://docs.smith.langchain.com/)
- [MLflow LLM Evaluation](https://mlflow.org/docs/latest/llms/llm-evaluate/index.html)
- [FrugalGPT: How to Use LLMs While Reducing Cost](https://arxiv.org/abs/2305.05176)
- [RouteLLM: Learning to Route LLMs](https://arxiv.org/abs/2406.18665)
