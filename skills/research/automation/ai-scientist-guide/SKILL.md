---
name: ai-scientist-guide
description: "End-to-end automated scientific discovery with AI Scientist v2"
metadata:
  openclaw:
    emoji: "🤖"
    category: "research"
    subcategory: "automation"
    keywords: ["ai-scientist", "research automation", "scientific workflow", "AI experiment design"]
    source: "https://github.com/SakanaAI/AI-Scientist-v2"
---

# AI Scientist Guide

## Overview

The AI Scientist v2 is a fully autonomous scientific research system developed by Sakana AI that can generate hypotheses, run experiments, analyze data, and write complete scientific manuscripts. It represents the cutting edge of AI-driven research automation, having produced the first workshop paper written entirely by AI and accepted through peer review at ICLR 2025.

Unlike its predecessor (v1), the AI Scientist v2 removes reliance on human-authored templates, generalizes across Machine Learning domains, and employs a progressive agentic tree search guided by an experiment manager agent. This guide explains how to set up, configure, and use the system effectively, as well as how to integrate its principles into your own research workflows.

This skill is relevant for researchers interested in accelerating their experimental cycles, exploring automated hypothesis generation, or understanding how agentic AI systems approach scientific discovery. Even if you do not use AI Scientist v2 directly, the concepts behind its design -- structured ideation, tree-based experiment exploration, automated writing -- can inform how you organize your own research.

## System Architecture

The AI Scientist v2 operates through a multi-stage pipeline:

```
Topic Description (.md)
    |
    v
[Ideation Stage] --> Research Ideas (.json)
    |
    v
[Experiment Stage] --> Best-First Tree Search (BFTS)
    |                   - Multiple parallel workers
    |                   - Automatic debugging
    |                   - Experiment manager agent
    v
[Analysis Stage] --> Results + Figures
    |
    v
[Writing Stage] --> Complete Paper (.pdf)
    |
    v
[Review Stage] --> Automated Peer Review
```

### Key Components

| Component | Role | Model Used |
|-----------|------|------------|
| Ideation Agent | Generates research hypotheses | Configurable (GPT-4o, Claude) |
| Experiment Manager | Guides tree search exploration | Claude 3.5 Sonnet (default) |
| Analysis Agent | Interprets results, creates figures | Same as experiment |
| Writing Agent | Drafts full paper with LaTeX | o1-preview (default) |
| Citation Agent | Finds and integrates references | GPT-4o (default) |
| Review Agent | Simulates peer review | GPT-4o (default) |

## Installation and Setup

### Prerequisites

- Linux with NVIDIA GPU (CUDA support required)
- Python 3.11+
- conda or mamba package manager

### Step-by-Step Installation

```bash
# 1. Create and activate environment
conda create -n ai_scientist python=3.11
conda activate ai_scientist

# 2. Install PyTorch with CUDA
conda install pytorch torchvision torchaudio pytorch-cuda=12.4 \
  -c pytorch -c nvidia

# 3. Install PDF and LaTeX tools
conda install anaconda::poppler conda-forge::chktex

# 4. Clone and install
git clone https://github.com/SakanaAI/AI-Scientist-v2.git
cd AI-Scientist-v2
pip install -r requirements.txt

# 5. Set API keys
export OPENAI_API_KEY=<key>
export S2_API_KEY=<key>  # Optional but recommended
```

## Running the Pipeline

### Stage 1: Ideation

Create a topic description file following this structure:

```markdown
# Title
Exploring Efficient Fine-Tuning Methods for Large Language Models

# Keywords
LoRA, parameter-efficient fine-tuning, LLM adaptation, low-rank

# TL;DR
Investigate novel parameter-efficient methods for adapting LLMs to
domain-specific tasks with minimal compute.

# Abstract
Large language models require substantial resources for full fine-tuning.
Parameter-efficient methods like LoRA reduce this cost but may sacrifice
performance. We seek to explore new approaches that balance efficiency
and effectiveness across diverse downstream tasks.
```

Run ideation:

```bash
python ai_scientist/perform_ideation_temp_free.py \
  --workshop-file "ai_scientist/ideas/my_topic.md" \
  --model gpt-4o-2024-05-13 \
  --max-num-generations 20 \
  --num-reflections 5
```

This produces a JSON file with structured research ideas including hypotheses, proposed experiments, and related work.

### Stage 2: Experiment and Paper Generation

```bash
python launch_scientist_bfts.py \
  --load_ideas "ai_scientist/ideas/my_topic.json" \
  --load_code \
  --add_dataset_ref \
  --model_writeup o1-preview-2024-09-12 \
  --model_citation gpt-4o-2024-11-20 \
  --model_review gpt-4o-2024-11-20 \
  --model_agg_plots o3-mini-2025-01-31 \
  --num_cite_rounds 20
```

### Configuration: bfts_config.yaml

Key parameters to tune:

```yaml
agent:
  num_workers: 3        # Parallel exploration paths
  steps: 21             # Maximum nodes to explore
  num_seeds: 3          # Initial root nodes

search:
  max_debug_depth: 3    # Max debug attempts per failing node
  debug_prob: 0.5       # Probability of debugging vs. abandoning
  num_drafts: 3         # Number of independent search trees
```

## Cost and Performance Estimates

| Phase | Typical Cost | Duration |
|-------|-------------|----------|
| Ideation (20 ideas) | $2-5 | 15-30 min |
| Experimentation (BFTS) | $15-20 | 2-6 hours |
| Writing + Citation | $5 | 20-30 min |
| Review | $1-2 | 5-10 min |
| **Total per run** | **$23-32** | **3-7 hours** |

## Integrating AI Scientist Principles Into Your Research

Even without running the full system, you can adopt its methodological ideas:

### Structured Ideation

Use LLMs to brainstorm research directions systematically:

```python
prompt = """
Given the research area of [TOPIC], generate 5 research ideas.
For each idea, provide:
1. Hypothesis (one sentence)
2. Key experiment to test it
3. Expected outcome if hypothesis is true
4. Expected outcome if hypothesis is false
5. Why this matters (impact)
"""
```

### Tree-Based Experiment Design

Instead of running experiments linearly, structure them as a tree:

1. Start with 2-3 seed experiments (broad exploration)
2. Evaluate results at each node
3. Expand the most promising branches
4. Prune branches that show diminishing returns
5. Debug failures before abandoning (up to a depth limit)

### Automated Literature Checks

Use Semantic Scholar API to check novelty before investing in an idea:

```python
import requests

def check_novelty(query, max_results=10):
    url = "https://api.semanticscholar.org/graph/v1/paper/search"
    params = {"query": query, "limit": max_results,
              "fields": "title,year,citationCount"}
    resp = requests.get(url, params=params)
    papers = resp.json().get('data', [])
    return papers
```

## Best Practices

- **Always disclose AI involvement.** If AI Scientist generates any part of your paper, disclose this clearly in the methods section.
- **Validate all generated results.** Automated systems can produce plausible but incorrect code. Review experiments manually.
- **Use sandboxed environments.** The system executes LLM-generated code. Run it in Docker containers.
- **Start with well-defined topics.** Narrow, concrete research questions produce better results than broad ones.
- **Iterate on the topic description.** The quality of the input topic file strongly influences output quality.
- **Combine with human judgment.** Use AI Scientist for ideation and draft generation, but apply human expertise for final decisions.

## References

- [AI-Scientist-v2 Repository](https://github.com/SakanaAI/AI-Scientist-v2) -- Source code (2,229+ stars)
- [AI Scientist v2 Paper](https://pub.sakana.ai/ai-scientist-v2/paper) -- Workshop-Level Automated Scientific Discovery via Agentic Tree Search
- [AI Scientist Blog Post](https://sakana.ai/ai-scientist-first-publication/) -- Sakana AI announcement
- [AIDE: ML Engineering Agent](https://github.com/WecoAI/aideml) -- Foundation for the tree search component
- [Semantic Scholar API](https://api.semanticscholar.org/) -- Literature search API
