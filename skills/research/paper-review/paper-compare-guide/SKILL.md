---
name: paper-compare-guide
description: "Compare research papers side-by-side on methodology and findings"
metadata:
  openclaw:
    emoji: "⚖️"
    category: "research"
    subcategory: "paper-review"
    keywords: ["paper comparison", "side-by-side analysis", "methodology comparison", "research synthesis", "critical analysis"]
    source: "https://github.com/AcademicSkills/paper-compare-guide"
---

# Paper Compare Guide

A skill for conducting structured side-by-side comparisons of research papers. Extracts and aligns key dimensions across papers including research questions, methodologies, datasets, results, and conclusions, producing comparison matrices and synthesis narratives that highlight agreements, contradictions, and complementary contributions.

## Overview

Comparing multiple papers on the same topic is a fundamental task in academic research, required for literature reviews, related work sections, research gap identification, and method selection. However, ad hoc comparisons often miss important dimensions or apply inconsistent criteria across papers. This skill provides a systematic framework that ensures comprehensive, fair comparisons by defining comparison dimensions upfront and extracting standardized data from each paper.

The approach works for comparing 2-10 papers and produces two types of output: a structured comparison matrix (tabular, suitable for inclusion in papers) and a narrative synthesis (prose, suitable for literature review sections). It handles comparisons across papers that address the same question with different methods, papers that use the same method on different data, and papers that reach conflicting conclusions about the same phenomenon.

## Comparison Framework

### Defining Comparison Dimensions

Before reading the papers, define the dimensions you will compare:

```python
COMPARISON_DIMENSIONS = {
    'basic': {
        'title': str,
        'authors': list,
        'year': int,
        'venue': str,
        'citation_count': int,
    },
    'research_design': {
        'research_question': str,
        'hypothesis': str,
        'study_type': str,  # RCT, observational, simulation, etc.
        'theoretical_framework': str,
    },
    'methodology': {
        'data_source': str,
        'sample_size': str,
        'sampling_method': str,
        'variables': {
            'independent': list,
            'dependent': list,
            'control': list,
        },
        'analysis_method': str,
        'tools_used': list,
    },
    'results': {
        'main_finding': str,
        'effect_size': str,
        'statistical_significance': str,
        'secondary_findings': list,
    },
    'quality': {
        'strengths': list,
        'limitations': list,
        'reproducibility': str,  # high, medium, low
        'generalizability': str,
    }
}
```

### Extraction Protocol

For each paper, systematically extract data for every dimension:

```
Paper A: Smith et al. (2024)
  research_question: "Does intervention X improve outcome Y in population Z?"
  study_type: "Randomized controlled trial"
  sample_size: "n=200 (100 treatment, 100 control)"
  analysis_method: "Mixed-effects logistic regression"
  main_finding: "Intervention X improved Y by 23% (OR=1.45, 95% CI [1.12, 1.88])"
  limitations: ["Single-site study", "Short follow-up (6 months)"]

Paper B: Jones et al. (2025)
  research_question: "What is the effect of intervention X on outcome Y?"
  study_type: "Quasi-experimental (pre-post with control group)"
  sample_size: "n=350 (200 treatment, 150 control)"
  analysis_method: "Difference-in-differences regression"
  main_finding: "Intervention X improved Y by 18% (beta=0.18, p<0.01)"
  limitations: ["Non-random assignment", "Potential selection bias"]
```

## Comparison Matrix Generation

### Tabular Comparison

| Dimension | Smith et al. (2024) | Jones et al. (2025) | Chen et al. (2025) |
|-----------|-------------------|-------------------|--------------------|
| **Study type** | RCT | Quasi-experimental | Observational cohort |
| **Sample size** | n=200 | n=350 | n=1,200 |
| **Population** | University students | Working adults | General population |
| **Intervention** | X (standardized) | X (adapted version) | X (self-selected) |
| **Primary outcome** | Y (binary) | Y (continuous) | Y (composite score) |
| **Main effect** | OR=1.45 | beta=0.18 | HR=1.32 |
| **Significant?** | Yes (p=.003) | Yes (p<.01) | Yes (p=.02) |
| **Follow-up** | 6 months | 12 months | 24 months |
| **Key limitation** | Single-site | Non-random | Self-selection |
| **Code available** | Yes (GitHub) | No | Data only (Zenodo) |

### Automated Matrix Builder

```python
import pandas as pd

def build_comparison_matrix(papers: list, dimensions: list) -> pd.DataFrame:
    """
    Build a comparison matrix from extracted paper data.

    Args:
        papers: List of dicts, each containing extracted dimensions
        dimensions: List of dimension keys to include in the matrix
    """
    matrix = {}
    for paper in papers:
        label = f"{paper['authors'][0].split()[-1]} et al. ({paper['year']})"
        matrix[label] = {}
        for dim in dimensions:
            value = paper.get(dim, 'Not reported')
            if isinstance(value, list):
                value = '; '.join(str(v) for v in value)
            matrix[label][dim] = value

    df = pd.DataFrame(matrix).T
    return df
```

## Synthesis Narratives

### Agreement Synthesis

When papers agree on a finding:

```
Template:
"Multiple studies converge on the finding that [finding]. [Author A] (year)
demonstrated this using [method A] with [sample A], finding [specific result].
This was corroborated by [Author B] (year) using [different method/sample],
who reported [similar result]. The consistency across [different methods/
populations/contexts] strengthens confidence in this finding."
```

### Contradiction Synthesis

When papers disagree:

```
Template:
"The evidence on [topic] is mixed. [Author A] (year) found [finding A]
using [method], while [Author B] (year) reported [contradictory finding B].
Several factors may explain this discrepancy: (1) [methodological difference],
(2) [population difference], (3) [measurement difference]. Further research
using [suggested approach] is needed to resolve this inconsistency."
```

### Complementary Synthesis

When papers address different aspects of the same topic:

```
Template:
"The studies contribute complementary evidence on [topic]. [Author A] (year)
addressed [aspect 1] by [method], establishing that [finding]. Building on
this, [Author B] (year) examined [aspect 2] and found [finding]. Together,
these studies suggest that [integrated conclusion], though [gap] remains
unaddressed."
```

## Advanced Comparison Techniques

### Methodological Quality Comparison

Apply a standardized quality assessment tool to all papers:

| Quality Criterion | Paper A | Paper B | Paper C |
|------------------|---------|---------|---------|
| Clear research question | Yes | Yes | Partially |
| Appropriate design | Yes | Mostly | Yes |
| Adequate sample size | No (underpowered) | Yes | Yes |
| Valid measurement | Yes | Yes | Questionable |
| Controls for confounders | Yes | Partially | No |
| Appropriate analysis | Yes | Yes | Yes |
| Effect size reported | Yes | No | Yes |
| Limitations discussed | Yes | Yes | Minimal |
| **Overall quality** | **High** | **Medium** | **Medium** |

### Visualizing Paper Relationships

```
Conceptual Map:

  Smith (2024) ──agrees──→ Jones (2025)
       │                        │
       │                        │
   extends                  contradicts
       │                        │
       ↓                        ↓
  Lee (2023)              Chen (2025)
       │
   replicates
       │
       ↓
  Park (2022) [foundational study]
```

## Output Formats

The comparison can be output in several formats depending on the use case:

1. **Comparison table**: For inclusion in a paper's related work section or supplementary materials.
2. **Narrative synthesis**: For the body of a literature review chapter.
3. **Gap analysis**: For identifying your own research contribution.
4. **Presentation slide**: A single-slide summary for lab meetings or conference talks.
5. **Decision matrix**: For choosing which method to adopt in your own research.

## Best Practices

- Define comparison dimensions before reading the papers to avoid post hoc cherry-picking.
- Compare no more than 8-10 papers in a single matrix; beyond that, group papers by theme.
- Always note when a dimension is "not reported" rather than leaving it blank.
- Be fair: apply the same critical lens to all papers, including those you agree with.
- When results conflict, investigate whether the conflict is real (different findings) or apparent (different operationalizations of the same concept).
- Include both quantitative comparisons (effect sizes, sample sizes) and qualitative assessments (strengths, limitations).

## References

- Snyder, H. (2019). Literature Review as a Research Methodology. *Journal of Business Research*, 104, 333-339.
- Templier, M. & Pare, G. (2015). A Framework for Guiding and Evaluating Literature Reviews. *Communications of the AIS*, 37, 112-137.
- Webster, J. & Watson, R. T. (2002). Analyzing the Past to Prepare for the Future: Writing a Literature Review. *MIS Quarterly*, 26(2), xiii-xxiii.
