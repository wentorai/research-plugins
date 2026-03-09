---
name: deep-innovator-guide
description: "AI research for idea generation and scientific discovery methods"
metadata:
  openclaw:
    emoji: "💡"
    category: "research"
    subcategory: "methodology"
    keywords: ["idea generation", "scientific discovery", "innovation", "research ideation", "creative research", "hypothesis generation"]
    source: "https://github.com/AcademicSkills/deep-innovator-guide"
---

# Deep Innovator Guide

A skill for systematic idea generation and scientific discovery in academic research. Combines structured creativity techniques with computational methods to help researchers identify novel research directions, generate testable hypotheses, and find unexpected connections across disciplines.

## Overview

Scientific innovation rarely happens through pure serendipity. Research on scientific breakthroughs consistently shows that novel ideas emerge at the intersection of existing knowledge domains, from systematic exploration of anomalies, or through the creative recombination of known concepts. This skill provides structured methods for each of these innovation pathways, making the ideation process more systematic without sacrificing creativity.

The skill is designed for researchers at any career stage who feel stuck in incremental thinking, who want to explore new research directions, or who need to generate a portfolio of potential research questions for a grant proposal or thesis prospectus. It draws on techniques from design thinking, TRIZ (Theory of Inventive Problem Solving), bibliometric innovation detection, and computational creativity research.

## Structured Ideation Methods

### Method 1: Cross-Domain Analogy Mining

The most frequently cited source of scientific breakthroughs is the transfer of ideas from one domain to another. This method systematizes that process.

```
Step 1: Define your problem abstractly
  Concrete: "How can we detect early-stage Alzheimer's from speech patterns?"
  Abstract: "How to detect gradual degradation of a complex system from
             its output signals?"

Step 2: Identify analogous domains
  - Manufacturing: detecting machine wear from vibration patterns
  - Ecology: detecting ecosystem decline from biodiversity metrics
  - Software: detecting code quality degradation from commit patterns
  - Music: detecting performer fatigue from playing characteristics

Step 3: Study solutions in analogous domains
  - Manufacturing uses wavelet analysis on vibration frequency shifts
  - Ecology uses species abundance distribution curves
  - Software uses entropy measures on code change patterns

Step 4: Transfer and adapt
  Idea: Apply wavelet decomposition to speech prosody features to detect
        frequency-domain shifts that precede clinical Alzheimer's diagnosis.
```

### Method 2: Contradiction Resolution (TRIZ-Inspired)

```python
def identify_research_contradictions(domain_knowledge: dict) -> list:
    """
    Identify contradictions in current knowledge that could lead to
    innovative research questions.

    Types of contradictions:
    1. Technical: Improving A makes B worse
    2. Physical: System needs property X and not-X simultaneously
    3. Empirical: Study A finds effect, Study B finds opposite
    """
    contradictions = []

    # Type 1: Technical contradictions
    # "Increasing model accuracy requires more data, but more data
    #  increases privacy risk"
    # Resolution principle: SEPARATION (separate the contradictory
    #  requirements in time, space, or condition)
    # Idea: Federated learning separates data access from model training

    # Type 2: Empirical contradictions
    # "Drug X shows efficacy in lab but not in clinical trials"
    # Resolution principle: INVESTIGATE THE BOUNDARY
    # Idea: What differs between lab and clinical contexts? (dosage,
    #  population heterogeneity, adherence, bioavailability)

    return contradictions
```

### Method 3: Gap Matrix Analysis

Create a matrix crossing two relevant dimensions to identify unexplored combinations:

| | Method A | Method B | Method C | Method D |
|---|---------|---------|---------|---------|
| **Population 1** | Studied | Studied | GAP | Studied |
| **Population 2** | Studied | GAP | GAP | Studied |
| **Population 3** | GAP | GAP | GAP | GAP |
| **Population 4** | Studied | GAP | Studied | GAP |

Each GAP cell represents a potential novel study. Prioritize GAP cells by:
- Theoretical interest (would the finding be surprising or informative?)
- Feasibility (can you access this population and apply this method?)
- Impact (would filling this gap change practice or theory?)

## Computational Innovation Detection

### Bibliometric Novelty Signals

```python
def detect_novelty_signals(papers: list) -> dict:
    """
    Detect signals of emerging innovation in a set of papers.
    """
    signals = {}

    # Signal 1: New keyword combinations
    # Papers that combine keywords from traditionally separate fields
    # indicate cross-disciplinary innovation
    signals['novel_keyword_pairs'] = find_new_keyword_cooccurrences(papers)

    # Signal 2: Citation bridge papers
    # Papers cited by two communities that rarely cite each other
    signals['bridge_papers'] = find_citation_bridges(papers)

    # Signal 3: Accelerating citation curves
    # Recently published papers gaining citations faster than average
    signals['sleeping_beauties'] = find_acceleration_anomalies(papers)

    # Signal 4: Method migration
    # Methods first published in Domain A appearing in Domain B
    signals['method_transfers'] = find_method_migrations(papers)

    # Signal 5: Terminology shifts
    # Old terms being replaced by new ones (signals paradigm change)
    signals['terminology_evolution'] = find_term_replacements(papers)

    return signals
```

### Hypothesis Generation from Data

```
Observation-Driven Hypothesis Generation:

1. ANOMALY DETECTION
   Look for unexpected patterns in existing data:
   - Results that deviate from theoretical predictions
   - Subgroups that behave differently from the main sample
   - Variables that correlate when they "should not"
   Question template: "Why does [anomaly] occur in [context]?"

2. BOUNDARY CONDITIONS
   Test where known effects break down:
   - At what sample size does effect X disappear?
   - In which populations does intervention Y not work?
   - Under what conditions does relationship Z reverse?
   Question template: "Under what conditions does [known effect] not hold?"

3. MECHANISM GAPS
   Identify well-documented effects without known mechanisms:
   - "We know X causes Y but not how"
   - "The mediating pathway is unknown"
   Question template: "What mechanism explains the effect of [X] on [Y]?"

4. SCALE TRANSITIONS
   Phenomena may behave differently at different scales:
   - Lab findings that may not scale to real-world settings
   - Individual-level effects that may not apply at group level
   Question template: "Does [finding at scale A] hold at [scale B]?"
```

## Innovation Portfolio Management

### Balancing Risk and Impact

Maintain a portfolio of research ideas at different risk-reward levels:

| Category | Risk | Potential Impact | Portfolio % | Examples |
|----------|------|-----------------|------------|---------|
| **Incremental** | Low | Moderate | 40-50% | Replicate with new data, extend to new population |
| **Substantial** | Medium | High | 30-40% | New method applied to existing problem |
| **Transformative** | High | Very High | 10-20% | New framework, cross-disciplinary breakthrough |
| **Exploratory** | Very High | Unknown | 5-10% | Speculative, curiosity-driven |

### Idea Evaluation Rubric

Score each idea on a 1-5 scale for each criterion:

| Criterion | Question | Weight |
|-----------|----------|--------|
| Novelty | Has this been done before? | 25% |
| Feasibility | Can I do this with my resources? | 25% |
| Significance | Would the answer change the field? | 25% |
| Fundability | Would an agency fund this? | 15% |
| Personal fit | Does this align with my expertise and interests? | 10% |

```python
def evaluate_research_idea(scores: dict, weights: dict = None) -> dict:
    """
    Evaluate a research idea using the weighted scoring rubric.
    """
    if weights is None:
        weights = {
            'novelty': 0.25, 'feasibility': 0.25, 'significance': 0.25,
            'fundability': 0.15, 'personal_fit': 0.10
        }

    weighted_score = sum(scores[k] * weights[k] for k in scores)
    max_score = 5.0

    return {
        'scores': scores,
        'weighted_total': round(weighted_score, 2),
        'max_possible': max_score,
        'percentage': round(weighted_score / max_score * 100, 1),
        'recommendation': (
            'Strong pursue' if weighted_score >= 4.0 else
            'Worth developing' if weighted_score >= 3.0 else
            'Needs refinement' if weighted_score >= 2.0 else
            'Consider alternatives'
        )
    }
```

## Collaborative Ideation Sessions

### Structured Brainstorming for Research Teams

1. **Individual divergence** (10 min): Each team member silently generates 5-10 ideas.
2. **Round-robin sharing** (15 min): Each person shares one idea at a time, no criticism allowed.
3. **Affinity clustering** (10 min): Group similar ideas together on a whiteboard.
4. **Build and combine** (15 min): Look for ways to merge or strengthen ideas across clusters.
5. **Evaluation** (10 min): Apply the scoring rubric to the top 5 ideas.
6. **Selection** (5 min): Choose 1-2 ideas to develop further with feasibility analysis.

## Best Practices

- Schedule regular ideation time (monthly) rather than waiting for inspiration to strike.
- Keep an "idea notebook" where you record fleeting thoughts before they are lost.
- Read outside your field deliberately. Subscribe to journals in adjacent disciplines.
- When you find an anomaly in your data, resist the urge to explain it away immediately. Investigate it.
- Test ideas cheaply before committing resources. A quick literature search or back-of-the-envelope calculation can eliminate weak ideas early.
- Discuss ideas with people outside your specialty. They bring fresh perspectives and ask different questions.

## References

- Uzzi, B., et al. (2013). Atypical Combinations and Scientific Impact. *Science*, 342(6157), 468-472.
- Foster, J. G., et al. (2015). Tradition and Innovation in Scientists' Research Strategies. *American Sociological Review*, 80(5), 875-908.
- Wang, D., Song, C., & Barabasi, A.-L. (2013). Quantifying Long-Term Scientific Impact. *Science*, 342(6154), 127-132.
