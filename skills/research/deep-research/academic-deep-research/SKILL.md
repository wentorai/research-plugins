---
name: academic-deep-research
description: "Multi-cycle exhaustive investigation framework for academic topics"
metadata:
  openclaw:
    emoji: "🔬"
    category: "research"
    subcategory: "deep-research"
    keywords: ["deep research", "exhaustive search", "multi-cycle investigation", "literature synthesis", "comprehensive review"]
    source: "https://github.com/AcademicSkills/academic-deep-research"
---

# Academic Deep Research

A structured multi-cycle investigation framework designed for exhaustive academic research. Unlike single-pass literature searches, this skill implements iterative deepening: each cycle expands the search scope, refines the query based on discovered themes, and synthesizes findings into an increasingly comprehensive knowledge map.

## Overview

Traditional literature searches follow a linear process: define keywords, search databases, screen results, extract data, synthesize. This approach works well for scoping reviews but often misses important connections across subfields, fails to surface grey literature, and stops too early when the obvious sources have been found. Academic Deep Research addresses these limitations through a multi-cycle approach where each cycle builds on the findings of the previous one, progressively expanding the search frontier.

The framework is inspired by systematic review methodology but optimized for speed and breadth rather than exhaustive recall within a single database. It is particularly useful for interdisciplinary research questions, emerging fields where terminology is not yet standardized, and complex topics where important insights may be scattered across diverse literatures.

## The Multi-Cycle Framework

### Cycle Architecture

```
Cycle 1: BREADTH (Survey Phase)
  Purpose: Map the landscape, identify major themes and key authors
  Sources: Google Scholar, Semantic Scholar, review articles
  Output: Theme taxonomy, key author list, terminology inventory
  Duration: 2-4 hours

Cycle 2: DEPTH (Focused Phase)
  Purpose: Deep-dive into each identified theme
  Sources: Discipline-specific databases (PubMed, IEEE, SSRN, etc.)
  Output: Annotated bibliography, evidence matrix, gap identification
  Duration: 4-8 hours

Cycle 3: CONNECTIONS (Synthesis Phase)
  Purpose: Find cross-theme relationships, contradictions, and gaps
  Sources: Citation networks, author collaboration networks
  Output: Conceptual framework, research gap map, contradiction log
  Duration: 2-4 hours

Cycle 4: FRONTIERS (Currency Phase)
  Purpose: Capture the latest work and preprints
  Sources: arXiv, bioRxiv, conference proceedings, working papers
  Output: Trend analysis, emerging methods, future directions
  Duration: 1-2 hours
```

### Cycle Execution Protocol

```python
class ResearchCycle:
    """
    Execute a single cycle of the deep research framework.
    """
    def __init__(self, cycle_number: int, focus: str, prior_findings: dict = None):
        self.cycle = cycle_number
        self.focus = focus  # 'breadth', 'depth', 'connections', 'frontiers'
        self.prior = prior_findings or {}
        self.findings = []
        self.new_queries = []
        self.gaps = []

    def generate_queries(self, base_topic: str) -> list:
        """
        Generate search queries adapted to the cycle's focus.
        """
        if self.focus == 'breadth':
            return [
                f'"{base_topic}" review',
                f'"{base_topic}" survey',
                f'"{base_topic}" systematic review',
                f'"{base_topic}" meta-analysis',
                f'"{base_topic}" overview OR tutorial',
            ]
        elif self.focus == 'depth':
            # Use themes discovered in Cycle 1
            themes = self.prior.get('themes', [])
            return [f'"{base_topic}" AND "{theme}"' for theme in themes]
        elif self.focus == 'connections':
            # Cross-theme queries
            themes = self.prior.get('themes', [])
            queries = []
            for i, t1 in enumerate(themes):
                for t2 in themes[i+1:]:
                    queries.append(f'"{t1}" AND "{t2}"')
            return queries
        elif self.focus == 'frontiers':
            return [
                f'"{base_topic}" 2025 OR 2026',
                f'"{base_topic}" preprint',
                f'"{base_topic}" forthcoming OR "in press"',
            ]
        return []

    def evaluate_saturation(self) -> bool:
        """
        Determine if additional searching is likely to yield new information.
        Saturation is reached when >80% of new results are already in the corpus.
        """
        if not self.findings:
            return False
        new_unique = sum(1 for f in self.findings if not f.get('seen_before'))
        total = len(self.findings)
        novelty_rate = new_unique / total if total > 0 else 1.0
        return novelty_rate < 0.20  # Saturated when <20% new
```

## Evidence Matrix Construction

### Structuring Findings Across Studies

| Study | Method | Sample | Key Finding | Effect Size | Relevance |
|-------|--------|--------|-------------|-------------|-----------|
| Author (Year) | RCT | n=200 | Treatment improved X by 15% | d=0.45 | High |
| Author (Year) | Survey | n=1500 | Factor Y predicts Z (beta=0.3) | R2=0.12 | Medium |
| Author (Year) | Qualitative | n=30 | Three themes emerged | N/A | High |

### Tracking Contradictions

```
Contradiction Log:
1. Study A (2023) finds positive effect of X on Y (d=0.4, n=200)
   Study B (2024) finds null effect (d=0.02, n=500)
   Possible explanations:
     - Different populations (students vs. professionals)
     - Different operationalization of X
     - Study A may have publication bias
   Resolution needed: moderator analysis or direct replication
```

## Knowledge Map Generation

### From Findings to Conceptual Framework

After completing all cycles, synthesize findings into a knowledge map:

1. **Core concepts**: The fundamental constructs in the field.
2. **Established relationships**: Well-replicated findings supported by multiple studies.
3. **Contested relationships**: Findings with conflicting evidence.
4. **Unexplored areas**: Logical research questions that no study has addressed.
5. **Methodological gaps**: Approaches not yet applied to the topic.

```
Knowledge Map: [Topic]

  Established:
    A → B (strong evidence, 12 studies, meta-analytic d=0.5)
    C moderates A → B (4 studies)

  Contested:
    D → E (3 positive, 2 null, 1 negative; likely moderator)

  Unexplored:
    F → B (theoretically plausible, no empirical studies)
    A → B in context G (only studied in context H)

  Methodological Gaps:
    No longitudinal studies of A → B
    No experimental manipulation of C
```

## Output Deliverables

Each deep research session produces:

1. **Executive summary** (500 words): Key findings, gaps, and recommended next steps.
2. **Annotated bibliography** (20-100 entries): Each source with a 2-3 sentence summary and relevance rating.
3. **Evidence matrix**: Tabular comparison of studies on key dimensions.
4. **Knowledge map**: Visual or structured representation of the field's state.
5. **Research gap inventory**: Prioritized list of unanswered questions.
6. **Search audit trail**: All queries, databases, dates, and result counts for reproducibility.

## Best Practices

- Start with Cycle 1 even if you think you know the field well. Survey-level searching often reveals adjacent literatures you did not know existed.
- Keep a running terminology inventory. The same concept may be called different things across subfields.
- Do not skip the contradiction log. Contested findings often point to the most productive research opportunities.
- Set a time budget for each cycle. Diminishing returns set in; use the saturation check to know when to move on.
- Save all search results with timestamps for PRISMA-style reporting if needed later.

## References

- Arksey, H. & O'Malley, L. (2005). Scoping Studies: Towards a Methodological Framework. *International Journal of Social Research Methodology*, 8(1), 19-32.
- Greenhalgh, T. & Peacock, R. (2005). Effectiveness and Efficiency of Search Methods in Systematic Reviews. *BMJ*, 331(7524), 1064-1065.
- Wohlin, C. (2014). Guidelines for Snowballing in Systematic Literature Studies. *EASE 2014*.
