---
name: infiagent-benchmark-guide
description: "Agent benchmark for data analysis evaluation (ICML 2024)"
metadata:
  openclaw:
    emoji: "🏆"
    category: "analysis"
    subcategory: "statistics"
    keywords: ["InfiAgent", "benchmark", "data analysis", "agent evaluation", "ICML", "DABench"]
    source: "https://github.com/InfiAgent/InfiAgent"
---

# InfiAgent Data Analysis Benchmark Guide

## Overview

InfiAgent (ICML 2024) is a benchmark for evaluating AI agents on data analysis tasks. It provides DABench — a standardized set of data analysis problems ranging from basic EDA to complex statistical modeling, each with ground-truth solutions and automated evaluation metrics. Measures agent capabilities in code generation, statistical reasoning, and visualization.

## Benchmark Structure

```
DABench (Data Analysis Benchmark)
├── Task Categories
│   ├── Data Understanding (profiling, cleaning)
│   ├── Exploratory Analysis (distributions, correlations)
│   ├── Statistical Testing (hypothesis tests)
│   ├── Visualization (appropriate chart selection)
│   ├── Modeling (regression, classification)
│   └── Interpretation (insights, conclusions)
├── Difficulty Levels
│   ├── Easy (single-step operations)
│   ├── Medium (multi-step analysis)
│   └── Hard (complex reasoning + code)
└── Evaluation Metrics
    ├── Code executability
    ├── Answer correctness
    ├── Visualization quality
    └── Statistical validity
```

## Usage

```python
from infiagent import DABench

bench = DABench()

# List tasks
for task in bench.tasks[:5]:
    print(f"[{task.difficulty}] {task.id}: {task.description}")
    print(f"  Dataset: {task.dataset}")
    print(f"  Category: {task.category}")

# Evaluate an agent
from infiagent import evaluate

results = evaluate(
    agent_fn=my_data_agent,
    tasks="all",
    timeout=120,
)

print(f"Executability: {results.exec_rate:.1%}")
print(f"Correctness: {results.correct_rate:.1%}")
print(f"Statistical validity: {results.stats_valid:.1%}")
```

## Task Examples

```python
# Easy: "What is the mean and standard deviation of column X?"
# Medium: "Is there a significant correlation between A and B?
#          Control for confounders C and D."
# Hard: "Build a predictive model for Y using all available
#        features. Report cross-validated performance and
#        identify the 3 most important features."
```

## Leaderboard Results

```python
# Selected results from DABench
scores = {
    "GPT-4 + Code": {"exec": 95, "correct": 67},
    "Claude 3.5 Sonnet": {"exec": 93, "correct": 64},
    "GPT-3.5 + Code": {"exec": 88, "correct": 45},
    "CodeLlama-34B": {"exec": 72, "correct": 31},
}

print(f"{'Agent':<22} {'Exec%':>6} {'Correct%':>9}")
for agent, s in scores.items():
    print(f"{agent:<22} {s['exec']:>5}% {s['correct']:>8}%")
```

## Use Cases

1. **Agent evaluation**: Standard benchmark for data analysis agents
2. **Model comparison**: Compare LLMs on analytical tasks
3. **Capability testing**: Assess statistical reasoning abilities
4. **Research**: Study agent strengths and failure modes
5. **Development**: Target specific weak areas for improvement

## References

- [InfiAgent GitHub](https://github.com/InfiAgent/InfiAgent)
- [DABench Paper (ICML 2024)](https://arxiv.org/abs/2401.05507)
