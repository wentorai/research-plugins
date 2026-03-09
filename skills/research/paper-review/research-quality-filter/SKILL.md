---
name: research-quality-filter
description: "Filter and assess research paper quality using structured criteria"
metadata:
  openclaw:
    emoji: "🏷️"
    category: "research"
    subcategory: "paper-review"
    keywords: ["quality assessment", "paper filtering", "evidence grading", "critical appraisal", "study quality", "screening"]
    source: "https://github.com/AcademicSkills/research-quality-filter"
---

# Research Quality Filter

A skill for systematically filtering and assessing the quality of research papers using structured appraisal criteria. Designed for researchers conducting literature reviews, systematic reviews, or evidence syntheses who need to triage large sets of candidate papers and evaluate the methodological rigor of included studies.

## Overview

When conducting any form of literature review, researchers face two sequential challenges: first, reducing a large set of search results to a manageable set of relevant papers (screening), and second, assessing the methodological quality of those papers to determine how much weight to give their findings (appraisal). Both tasks are time-consuming and prone to inconsistency when performed ad hoc.

This skill provides structured tools for both stages. For screening, it implements a two-pass protocol (title/abstract screening followed by full-text screening) with explicit inclusion/exclusion criteria. For quality appraisal, it provides instrument-specific checklists adapted from established frameworks (CASP, Newcastle-Ottawa, JBI, GRADE) that produce numerical quality scores and standardized assessments.

## Screening Protocol

### Two-Pass Screening

```
Pass 1: Title and Abstract Screening
  For each paper, apply inclusion/exclusion criteria:

  INCLUDE if ALL of the following are met:
    □ Addresses the research question (at least tangentially)
    □ Published in a peer-reviewed venue (or recognized preprint server)
    □ Written in an included language (typically English)
    □ Published within the date range of interest
    □ Reports original research OR is a systematic review

  EXCLUDE if ANY of the following are met:
    □ Clearly off-topic (different population, intervention, or outcome)
    □ Wrong study type (e.g., editorial, letter, commentary if not included)
    □ Duplicate of another included paper
    □ Published in a known predatory journal
    □ Retracted

  Mark as UNCERTAIN if:
    □ Relevance cannot be determined from title/abstract alone

  Decision: INCLUDE | EXCLUDE | UNCERTAIN → move uncertain to Pass 2

Pass 2: Full-Text Screening
  Read full text of INCLUDE and UNCERTAIN papers.
  Apply the same criteria with additional checks:
    □ Methods are described sufficiently
    □ Outcome of interest is actually measured/reported
    □ Sample/population matches inclusion criteria
```

### Screening Tracker

```python
import pandas as pd

def create_screening_tracker(papers: list, criteria: dict) -> pd.DataFrame:
    """
    Create a structured screening tracker for a set of candidate papers.
    """
    tracker = pd.DataFrame(papers)

    # Add screening columns
    tracker['pass1_decision'] = ''       # include / exclude / uncertain
    tracker['pass1_reason'] = ''         # reason for exclusion
    tracker['pass1_screener'] = ''       # who screened
    tracker['pass2_decision'] = ''       # include / exclude (for pass2 candidates)
    tracker['pass2_reason'] = ''
    tracker['quality_score'] = None      # assigned after appraisal

    return tracker

def calculate_screening_agreement(screener_a: list, screener_b: list) -> dict:
    """
    Calculate inter-rater agreement for dual screening.
    """
    from sklearn.metrics import cohen_kappa_score
    kappa = cohen_kappa_score(screener_a, screener_b)
    agreement_pct = sum(a == b for a, b in zip(screener_a, screener_b)) / len(screener_a) * 100

    return {
        'cohens_kappa': round(kappa, 3),
        'percent_agreement': round(agreement_pct, 1),
        'interpretation': (
            'almost perfect' if kappa > 0.81 else
            'substantial' if kappa > 0.61 else
            'moderate' if kappa > 0.41 else
            'fair' if kappa > 0.21 else 'poor'
        ),
        'disagreements': sum(a != b for a, b in zip(screener_a, screener_b))
    }
```

## Quality Appraisal Instruments

### Selecting the Right Tool

| Study Design | Appraisal Tool | Items |
|-------------|---------------|-------|
| Randomized controlled trial | Cochrane Risk of Bias (RoB 2) | 5 domains |
| Cohort study | Newcastle-Ottawa Scale (NOS) | 8 items |
| Case-control study | Newcastle-Ottawa Scale (NOS) | 8 items |
| Cross-sectional | JBI Checklist for Analytical Cross-Sectional | 8 items |
| Qualitative study | CASP Qualitative Checklist | 10 items |
| Systematic review | AMSTAR 2 | 16 items |
| Diagnostic accuracy | QUADAS-2 | 4 domains |
| Mixed methods | MMAT | 5 criteria per component |

### Generic Quality Assessment

```python
def assess_paper_quality(paper: dict, study_type: str) -> dict:
    """
    Apply a structured quality assessment to a research paper.
    Returns scores on standardized criteria.
    """
    criteria = {
        'research_question': {
            'description': 'Is the research question clearly stated?',
            'options': {'yes': 2, 'partially': 1, 'no': 0},
            'score': None
        },
        'study_design': {
            'description': 'Is the study design appropriate for the question?',
            'options': {'yes': 2, 'partially': 1, 'no': 0},
            'score': None
        },
        'sampling': {
            'description': 'Is the sample adequate and representative?',
            'options': {'yes': 2, 'partially': 1, 'no': 0},
            'score': None
        },
        'measurement': {
            'description': 'Are outcome measures valid and reliable?',
            'options': {'yes': 2, 'partially': 1, 'no': 0},
            'score': None
        },
        'analysis': {
            'description': 'Is the statistical analysis appropriate?',
            'options': {'yes': 2, 'partially': 1, 'no': 0},
            'score': None
        },
        'confounding': {
            'description': 'Are potential confounders addressed?',
            'options': {'yes': 2, 'partially': 1, 'no': 0},
            'score': None
        },
        'results_reporting': {
            'description': 'Are results clearly and completely reported?',
            'options': {'yes': 2, 'partially': 1, 'no': 0},
            'score': None
        },
        'limitations': {
            'description': 'Are limitations honestly discussed?',
            'options': {'yes': 2, 'partially': 1, 'no': 0},
            'score': None
        }
    }

    # Calculate total score
    max_score = len(criteria) * 2
    total = sum(c['score'] for c in criteria.values() if c['score'] is not None)
    pct = total / max_score * 100

    quality_rating = (
        'High' if pct >= 75 else
        'Medium' if pct >= 50 else
        'Low'
    )

    return {
        'criteria': criteria,
        'total_score': total,
        'max_score': max_score,
        'percentage': round(pct, 1),
        'quality_rating': quality_rating
    }
```

## Evidence Grading with GRADE

### GRADE Framework Application

The Grading of Recommendations, Assessment, Development and Evaluation (GRADE) framework rates the overall quality of evidence for each outcome:

| Starting Level | Study Type | Initial Quality |
|---------------|-----------|-----------------|
| High | Randomized trials | +4 |
| Low | Observational studies | +2 |

**Factors that lower quality:**

| Factor | When to Downgrade | Impact |
|--------|------------------|--------|
| Risk of bias | Serious methodological limitations | -1 or -2 |
| Inconsistency | Unexplained heterogeneity across studies | -1 or -2 |
| Indirectness | Population/intervention/outcome mismatch | -1 or -2 |
| Imprecision | Wide confidence intervals, small samples | -1 or -2 |
| Publication bias | Evidence of missing studies | -1 or -2 |

**Factors that raise quality (observational studies only):**

| Factor | When to Upgrade | Impact |
|--------|----------------|--------|
| Large effect | OR > 2 or OR < 0.5 consistently | +1 or +2 |
| Dose-response | Clear gradient observed | +1 |
| Confounders | Would reduce effect (strengthens finding) | +1 |

### Final GRADE Ratings

| Rating | Meaning |
|--------|---------|
| **High** | Very confident the true effect is close to the estimate |
| **Moderate** | Moderately confident; true effect likely close to estimate |
| **Low** | Limited confidence; true effect may differ substantially |
| **Very Low** | Very little confidence; true effect likely substantially different |

## PRISMA Flow Diagram

### Tracking the Filtering Process

```
Identification:
  Records from databases: n = ____
  Records from other sources: n = ____
  Total records: n = ____

Screening:
  Records after duplicates removed: n = ____
  Records screened (title/abstract): n = ____
  Records excluded at screening: n = ____ (reasons: ____)

Eligibility:
  Full-text articles assessed: n = ____
  Full-text articles excluded: n = ____ (reasons: ____)

Included:
  Studies in qualitative synthesis: n = ____
  Studies in quantitative synthesis (meta-analysis): n = ____
```

## Best Practices

- Use dual screening (two independent reviewers) for systematic reviews; calculate inter-rater agreement.
- Document exclusion reasons for every paper excluded at full-text stage.
- Apply the same quality assessment tool consistently across all included studies.
- Do not exclude studies based on quality alone; instead, perform sensitivity analysis with and without low-quality studies.
- Present the PRISMA flow diagram in every systematic review to show the filtering process transparently.
- Record screening decisions in a structured tracker, not in email threads or ad hoc notes.

## References

- Moher, D., et al. (2009). Preferred Reporting Items for Systematic Reviews and Meta-Analyses: The PRISMA Statement. *BMJ*, 339, b2535.
- Schunemann, H. J., et al. (2013). GRADE Handbook. *Cochrane Collaboration*.
- Wells, G. A., et al. (2000). The Newcastle-Ottawa Scale (NOS) for Assessing the Quality of Nonrandomised Studies. *Ottawa Hospital Research Institute*.
