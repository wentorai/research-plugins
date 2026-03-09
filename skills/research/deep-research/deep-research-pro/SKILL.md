---
name: deep-research-pro
description: "Multi-source deep research agent with verification and synthesis"
metadata:
  openclaw:
    emoji: "🕵️"
    category: "research"
    subcategory: "deep-research"
    keywords: ["deep research", "multi-source", "source verification", "research agent", "evidence synthesis", "fact checking"]
    source: "https://github.com/AcademicSkills/deep-research-pro"
---

# Deep Research Pro

A professional-grade deep research methodology that coordinates multi-source information gathering, cross-reference verification, and structured synthesis. Designed for research tasks that require high confidence in factual accuracy, comprehensive coverage, and traceable evidence chains.

## Overview

Deep Research Pro implements an agent-based methodology where the research process is decomposed into specialized phases: query decomposition, parallel source gathering, cross-reference verification, contradiction resolution, and structured synthesis. Unlike simple search-and-summarize approaches, this skill emphasizes source triangulation, evidence grading, and explicit uncertainty marking.

The methodology is particularly valuable for literature reviews, technology assessments, policy analyses, and any research task where decision-makers need to trust the completeness and accuracy of the findings. Every claim in the final output is linked to at least one verified source, with confidence levels assigned based on the quality and agreement of the evidence.

## Research Agent Architecture

### Phase 1: Query Decomposition

```python
def decompose_research_query(query: str) -> dict:
    """
    Break a complex research question into atomic sub-questions
    that can be independently investigated.

    Example:
      Input: "What is the current state of quantum computing for
              drug discovery, and which companies are leading?"

      Output: {
        'sub_questions': [
          'What quantum computing methods are used in drug discovery?',
          'What are the computational advantages over classical methods?',
          'Which companies are actively working on quantum drug discovery?',
          'What drugs or molecules have been studied using quantum methods?',
          'What are the current limitations and timeline to practical use?'
        ],
        'cross_cutting_themes': [
          'Cost-benefit vs classical computing',
          'Regulatory considerations',
          'Academic vs industry progress'
        ],
        'source_strategy': {
          'academic': ['PubMed', 'arXiv', 'Google Scholar'],
          'industry': ['company websites', 'press releases', 'patent databases'],
          'grey': ['government reports', 'consulting firm analyses']
        }
      }
    """
    pass  # Implemented by the agent's reasoning
```

### Phase 2: Parallel Source Gathering

For each sub-question, gather evidence from multiple independent source types:

| Source Type | Examples | Strengths | Limitations |
|------------|---------|-----------|-------------|
| **Peer-reviewed** | Journal articles, conference papers | Rigorous review | Publication lag |
| **Preprints** | arXiv, bioRxiv, SSRN | Current | Not peer-reviewed |
| **Institutional** | WHO, NIH, government agencies | Authoritative | May be conservative |
| **Industry** | Company blogs, press releases | Current, practical | Biased toward own products |
| **News/Media** | Science journalism, trade publications | Accessible | May oversimplify |
| **Expert opinion** | Interviews, blog posts, talks | Nuanced | Subjective |

### Phase 3: Source Verification

```python
def verify_source(source: dict) -> dict:
    """
    Assess the credibility and reliability of a single source.
    """
    verification = {
        'source_id': source['id'],
        'url': source['url'],
        'checks': {}
    }

    # Check 1: Author credibility
    verification['checks']['author'] = {
        'identifiable': bool(source.get('author')),
        'affiliated': bool(source.get('institution')),
        'h_index_available': bool(source.get('h_index')),
        'domain_expert': source.get('expertise_match', False)
    }

    # Check 2: Publication venue
    verification['checks']['venue'] = {
        'peer_reviewed': source.get('peer_reviewed', False),
        'impact_factor': source.get('impact_factor'),
        'known_predatory': source.get('predatory_flag', False)
    }

    # Check 3: Currency
    verification['checks']['currency'] = {
        'publication_year': source.get('year'),
        'is_recent': source.get('year', 0) >= 2023,
        'superseded': source.get('retracted', False)
    }

    # Check 4: Corroboration
    verification['checks']['corroboration'] = {
        'cited_by_count': source.get('citation_count', 0),
        'independent_confirmation': source.get('replicated', False),
        'consistent_with_consensus': source.get('consensus_aligned', None)
    }

    # Overall confidence score
    score = sum([
        verification['checks']['author']['identifiable'],
        verification['checks']['venue']['peer_reviewed'],
        not verification['checks']['venue']['known_predatory'],
        verification['checks']['currency']['is_recent'],
        verification['checks']['corroboration']['cited_by_count'] > 5
    ]) / 5.0

    verification['confidence'] = round(score, 2)
    verification['grade'] = (
        'A' if score >= 0.8 else
        'B' if score >= 0.6 else
        'C' if score >= 0.4 else 'D'
    )
    return verification
```

## Cross-Reference and Contradiction Resolution

### Triangulation Protocol

For each factual claim in the research output:

1. **Identify the claim**: Extract a specific, testable statement.
2. **Find supporting sources**: At least 2 independent sources.
3. **Check for contradicting sources**: Actively search for disconfirming evidence.
4. **Assess source quality**: Weight evidence by source grade (A > B > C > D).
5. **Assign confidence level**: Based on evidence agreement and quality.

```
Confidence Levels:
  HIGH:   3+ Grade A/B sources agree, no contradictions
  MEDIUM: 2+ sources agree, minor contradictions or lower-quality sources
  LOW:    Single source, or significant contradictions among sources
  UNCERTAIN: Conflicting evidence of similar quality; state both positions
```

### Contradiction Handling

When sources disagree:

1. Check if the disagreement is due to different definitions, timeframes, or contexts.
2. Check if one source has been superseded or corrected.
3. If genuine disagreement exists, present both positions with their evidence.
4. Note the disagreement explicitly: "Source A (Grade B, 2024) reports X, while Source B (Grade A, 2023) reports Y. The discrepancy may be due to [possible explanation]."

## Structured Synthesis Output

### Report Template

```markdown
# Research Report: [Topic]

## Executive Summary
[3-5 sentence overview of key findings with confidence levels]

## Methodology
- Sub-questions investigated: [list]
- Sources consulted: [count by type]
- Date range of sources: [range]
- Verification standard: [triangulation with Grade B+ sources]

## Findings

### Finding 1: [Title]
**Confidence: HIGH**
[Description with inline source references]
Sources: [Source1 (Grade A)], [Source2 (Grade B)], [Source3 (Grade A)]

### Finding 2: [Title]
**Confidence: MEDIUM**
[Description]
Note: [Source4] reports a conflicting finding. See Contradictions section.

## Contradictions and Uncertainties
[Explicit list of unresolved disagreements]

## Gaps in Evidence
[What could not be determined from available sources]

## Source Registry
[Full list of all sources with grades and verification details]
```

## Best Practices

- Always search for disconfirming evidence, not just supporting evidence.
- Never assign HIGH confidence to a claim supported by only one source, regardless of its quality.
- Mark the date of your research prominently; findings may become outdated.
- Distinguish between "no evidence found" and "evidence of absence."
- When synthesizing, prefer systematic reviews and meta-analyses over individual studies.
- Keep the full source registry even if not all sources are cited in the final report.

## References

- Bates, M. J. (1989). The Design of Browsing and Berrypicking Techniques. *Online Review*, 13(5), 407-424.
- Booth, A. (2006). Clear and Present Questions: Formulating Questions for Evidence-Based Practice. *Library Hi Tech*, 24(3), 355-368.
- Grant, M. J. & Booth, A. (2009). A Typology of Reviews. *Health Information and Libraries Journal*, 26(2), 91-108.
