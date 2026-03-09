---
name: deep-research-work
description: "Combine web search, content analysis, and source verification"
metadata:
  openclaw:
    emoji: "🌐"
    category: "research"
    subcategory: "deep-research"
    keywords: ["web research", "content analysis", "source verification", "information extraction", "research workflow", "web scraping"]
    source: "https://github.com/AcademicSkills/deep-research-work"
---

# Deep Research Work

A practical deep research workflow that combines web search, structured content analysis, and systematic source verification to produce comprehensive, trustworthy research outputs. Optimized for researchers who need to rapidly synthesize information from diverse online sources while maintaining academic standards of evidence quality.

## Overview

Academic research increasingly requires synthesizing information from beyond traditional journal databases: government datasets, technical documentation, industry reports, software repositories, news coverage, and expert commentary. Deep Research Work provides an operational workflow for conducting this kind of multi-source research efficiently while maintaining rigor. It covers search strategy formulation, content extraction, structured note-taking, source credibility assessment, and synthesis into coherent research narratives.

The workflow is designed to be completed in a single focused session (2-8 hours) and produces a structured research document with full source attribution. It is particularly useful for rapid literature scans, technology landscape assessments, policy research, and interdisciplinary investigations where no single database covers the full scope.

## Search Strategy Design

### Query Expansion Technique

```python
def generate_search_queries(topic: str, context: dict) -> list:
    """
    Generate a comprehensive set of search queries using
    systematic query expansion.

    Expansion strategies:
    1. Synonym expansion: use alternative terminology
    2. Scope expansion: broaden/narrow the topic
    3. Perspective expansion: different stakeholder views
    4. Temporal expansion: historical and forward-looking
    5. Geographic expansion: regional variations
    """
    base_queries = [topic]

    # Synonym expansion
    synonyms = context.get('synonyms', [])
    for syn in synonyms:
        base_queries.append(syn)

    # Scope expansion
    broader = context.get('broader_topic', '')
    narrower = context.get('sub_topics', [])
    if broader:
        base_queries.append(f"{broader} {topic}")
    for sub in narrower:
        base_queries.append(f"{topic} {sub}")

    # Perspective expansion
    perspectives = ['benefits', 'risks', 'challenges', 'future',
                    'criticism', 'comparison', 'case study']
    for p in perspectives:
        base_queries.append(f"{topic} {p}")

    # Source-type targeting
    source_types = ['systematic review', 'meta-analysis', 'white paper',
                    'technical report', 'dataset', 'open source']
    for st in source_types:
        base_queries.append(f"{topic} {st}")

    return list(set(base_queries))
```

### Database Selection Matrix

| Source Type | Best Databases | When to Use |
|------------|---------------|-------------|
| Peer-reviewed articles | Google Scholar, Semantic Scholar, PubMed | Core academic evidence |
| Preprints | arXiv, bioRxiv, SSRN, medRxiv | Cutting-edge, pre-review findings |
| Government/institutional | Data.gov, WHO, OECD, national statistics | Official data, policy context |
| Technical documentation | GitHub, ReadTheDocs, official docs | Software, tools, methods |
| Industry reports | McKinsey, Gartner, CB Insights | Market context, trends |
| Patent databases | Google Patents, USPTO, Espacenet | Innovation landscape |
| News and media | Google News, specialized trade press | Current events, context |

## Content Extraction and Note-Taking

### Structured Extraction Template

For each source reviewed, extract the following:

```yaml
source_entry:
  id: "S001"
  url: "https://..."
  title: "Title of the Source"
  authors: ["Author A", "Author B"]
  date: "2025-06"
  type: "journal_article"  # or preprint, report, blog, etc.

  extraction:
    main_claim: "One sentence summarizing the key claim or finding"
    evidence_type: "empirical"  # empirical, theoretical, anecdotal, opinion
    methodology: "Randomized controlled trial, n=500"
    key_data_points:
      - "Finding 1: X increased by 23% (p < 0.01)"
      - "Finding 2: No significant effect on Y"
    limitations_noted: "Small sample from single institution"
    relevant_quotes:
      - page: 12
        text: "Our results suggest that..."

  assessment:
    credibility: "high"  # high, medium, low
    relevance: "high"    # high, medium, low
    novelty: "medium"    # high, medium, low
    bias_concerns: "Funded by industry; potential conflict of interest"
```

### Progressive Summarization

Apply a layered note-taking approach:

1. **Layer 1 - Capture**: Save the full source with metadata (URL, date, authors).
2. **Layer 2 - Bold**: Highlight the most important passages (key findings, methods, conclusions).
3. **Layer 3 - Highlight**: From the bolded text, mark the essential takeaways for your research question.
4. **Layer 4 - Summary**: Write a 2-3 sentence summary in your own words.
5. **Layer 5 - Remix**: Connect the finding to your other sources and your research question.

## Source Verification Protocol

### Credibility Assessment Checklist

For each source, evaluate:

- [ ] **Authority**: Who is the author/organization? What are their credentials?
- [ ] **Accuracy**: Are claims supported by evidence? Can you verify the data?
- [ ] **Currency**: When was it published? Is the information still valid?
- [ ] **Coverage**: Does it address your question sufficiently?
- [ ] **Objectivity**: Is there apparent bias? Who funded the work?
- [ ] **Corroboration**: Do other independent sources support the same claims?

### Red Flags for Low-Quality Sources

| Red Flag | Action |
|----------|--------|
| No author attribution | Downgrade credibility; seek alternative source |
| No date published | Treat as potentially outdated |
| Extraordinary claims without evidence | Require independent corroboration |
| Known predatory journal | Exclude from primary evidence |
| Single anonymous blog post | Use only as lead to find primary sources |
| Circular citations | Trace back to the original source |

## Synthesis Workflow

### From Notes to Narrative

```
Step 1: Cluster
  Group extracted notes by theme or sub-question.
  Use tags from your extraction template.

Step 2: Compare
  Within each cluster, compare findings across sources.
  Note agreements, contradictions, and gaps.

Step 3: Evaluate
  Weight evidence by source credibility and recency.
  Higher-quality sources take precedence when sources conflict.

Step 4: Narrate
  Write a synthesis paragraph for each cluster that:
  - States the overall finding
  - Cites the supporting sources
  - Notes any caveats or contradictions
  - Identifies remaining gaps

Step 5: Integrate
  Connect clusters into a coherent narrative.
  Highlight cross-cutting themes and implications.
```

### Output Quality Checklist

Before finalizing your research output:

- [ ] Every factual claim has at least one source citation
- [ ] Contradictory evidence is explicitly acknowledged
- [ ] Source quality is visible (not all sources treated equally)
- [ ] Gaps in knowledge are clearly identified
- [ ] The search methodology is documented for reproducibility
- [ ] Dates of all searches are recorded
- [ ] The output answers the original research question

## Best Practices

- Set a time limit before starting. Research can expand indefinitely without constraints.
- Use a reference manager (Zotero, Mendeley) from the start, even for informal research.
- Save web pages as PDF or archive snapshots (Wayback Machine) to prevent link rot.
- Distinguish between primary sources (original data/study) and secondary sources (reporting on the study).
- When a source cites a finding, always try to trace back to the original source.
- Document negative results: sources searched that did not yield relevant information.

## References

- Booth, A., Sutton, A., & Papaioannou, D. (2016). *Systematic Approaches to a Successful Literature Review* (2nd ed.). Sage.
- Forte, T. (2022). *Building a Second Brain*. Atria Books.
- Machi, L. A. & McEvoy, B. T. (2016). *The Literature Review* (3rd ed.). Corwin Press.
