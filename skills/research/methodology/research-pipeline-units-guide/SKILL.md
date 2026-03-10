---
name: research-pipeline-units-guide
description: "Evidence-first semantic research pipeline methodology"
metadata:
  openclaw:
    emoji: "🔬"
    category: "research"
    subcategory: "methodology"
    keywords: ["research pipeline", "evidence-first", "semantic units", "methodology", "research workflow", "structured inquiry"]
    source: "https://github.com/WILLOSCAR/research-units-pipeline-skills"
---

# Research Pipeline Units Guide

## Overview

Research Pipeline Units is a methodology for structuring research as composable, evidence-first semantic units. Instead of monolithic literature reviews, it decomposes research into atomic claims, evidence units, and reasoning chains that can be independently verified, combined, and reused. Each unit has clear provenance, confidence levels, and connections to other units. Suited for systematic reviews and evidence synthesis.

## Core Concepts

```
Research Pipeline
├── Claim Unit
│   ├── Statement (falsifiable assertion)
│   ├── Evidence (supporting sources)
│   ├── Confidence (high/medium/low)
│   └── Counter-evidence (opposing sources)
├── Evidence Unit
│   ├── Source (paper, dataset, experiment)
│   ├── Extraction (quote, data point, figure)
│   ├── Quality (study design, bias risk)
│   └── Relevance (to claim)
├── Reasoning Chain
│   ├── Premises (claim units)
│   ├── Logic (deductive, inductive, abductive)
│   └── Conclusion (derived claim)
└── Knowledge Map
    ├── Clusters (related claims)
    ├── Contradictions (conflicting evidence)
    └── Gaps (missing evidence)
```

## Building Claim Units

```python
from research_units import ClaimUnit, EvidenceUnit

# Create an evidence-backed claim
claim = ClaimUnit(
    statement="Retrieval-augmented generation reduces "
              "hallucination in LLMs by 40-60%",
    confidence="medium",
    evidence=[
        EvidenceUnit(
            source="Lewis et al., 2020",
            doi="10.48550/arXiv.2005.11401",
            extraction="RAG reduces factual errors by 43% "
                       "on Natural Questions",
            quality="high",  # Peer-reviewed, strong methodology
        ),
        EvidenceUnit(
            source="Shuster et al., 2021",
            doi="10.48550/arXiv.2104.07567",
            extraction="Knowledge-grounded dialogue 54% fewer "
                       "hallucinated facts",
            quality="medium",
        ),
    ],
    counter_evidence=[
        EvidenceUnit(
            source="Mallen et al., 2023",
            extraction="RAG helps less for popular knowledge "
                       "that LLMs already encode",
            quality="high",
        ),
    ],
)

print(f"Claim: {claim.statement}")
print(f"Confidence: {claim.confidence}")
print(f"Supporting: {len(claim.evidence)} sources")
print(f"Opposing: {len(claim.counter_evidence)} sources")
```

## Reasoning Chains

```python
from research_units import ReasoningChain

chain = ReasoningChain(
    premises=[
        ClaimUnit("RAG reduces hallucination (Lewis 2020)"),
        ClaimUnit("Knowledge conflicts degrade RAG quality "
                  "(Chen 2022)"),
        ClaimUnit("Adaptive retrieval mitigates conflicts "
                  "(Jiang 2023)"),
    ],
    logic="inductive",
    conclusion=ClaimUnit(
        statement="Adaptive retrieval-augmented generation "
                  "with conflict resolution is the most "
                  "promising approach to LLM factuality",
        confidence="medium",
    ),
)

# Validate chain
validation = chain.validate()
print(f"Valid: {validation.is_valid}")
print(f"Gaps: {validation.gaps}")
print(f"Strength: {validation.strength}")
```

## Knowledge Maps

```python
from research_units import KnowledgeMap

kmap = KnowledgeMap("RAG for Factuality")

# Add clusters of related claims
kmap.add_cluster("retrieval_methods", [claim1, claim2, claim3])
kmap.add_cluster("conflict_resolution", [claim4, claim5])
kmap.add_cluster("evaluation", [claim6, claim7])

# Identify contradictions
contradictions = kmap.find_contradictions()
for c in contradictions:
    print(f"Conflict: {c.claim_a.statement[:50]}...")
    print(f"  vs: {c.claim_b.statement[:50]}...")
    print(f"  Resolution: {c.suggested_resolution}")

# Identify gaps
gaps = kmap.find_gaps()
for g in gaps:
    print(f"Gap: {g.description}")
    print(f"  Between: {g.cluster_a} ↔ {g.cluster_b}")
    print(f"  Suggested research: {g.suggestion}")

# Export
kmap.export("knowledge_map.json")
kmap.visualize("knowledge_map.html")
```

## Pipeline Workflow

```markdown
### Step-by-Step Research Pipeline
1. **Define scope**: Research question → decomposed sub-questions
2. **Search**: Literature search per sub-question
3. **Extract**: Create evidence units from each paper
4. **Claim**: Formulate claims supported by evidence
5. **Chain**: Build reasoning chains linking claims
6. **Map**: Assemble knowledge map showing landscape
7. **Synthesize**: Write narrative from structured units
8. **Validate**: Peer review individual units + chains
```

## Use Cases

1. **Systematic reviews**: Structured evidence synthesis
2. **Research proposals**: Evidence-backed argument construction
3. **Collaborative research**: Shared, verifiable claim units
4. **Teaching**: Demonstrate evidence-based reasoning
5. **Knowledge management**: Reusable research building blocks

## References

- [research-units-pipeline-skills](https://github.com/WILLOSCAR/research-units-pipeline-skills)
