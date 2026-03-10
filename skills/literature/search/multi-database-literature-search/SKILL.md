---
name: multi-database-literature-search
description: "Conduct comprehensive literature searches across multiple academic databases"
metadata:
  openclaw:
    emoji: "🔍"
    category: "literature"
    subcategory: "search"
    keywords: ["multi-database search", "systematic review", "literature search", "academic databases", "cross-database", "search strategy"]
    source: "https://clawhub.ai/jpjy/literature-search"
---

# Multi-Database Literature Search

## Overview

No single database covers all academic literature. A comprehensive search requires querying multiple databases, each with its own coverage, search syntax, and strengths. This guide provides a structured approach to searching across Google Scholar, PubMed, Semantic Scholar, arXiv, IEEE Xplore, ACM Digital Library, and Scopus/Web of Science, with strategies for deduplication and result management.

## Database Coverage Map

| Database | Coverage | Strengths | Free? |
|----------|----------|-----------|-------|
| **Google Scholar** | All disciplines, broadest | Grey literature, books, citations | Yes |
| **Semantic Scholar** | 220M+ papers, all fields | AI-powered relevance, citation context, TLDR | Yes |
| **PubMed** | Biomedical, life sciences | MeSH terms, clinical trials, 36M+ records | Yes |
| **arXiv** | Physics, CS, math, econ, stats | Preprints, latest research, open access | Yes |
| **OpenAlex** | 250M+ works, all fields | Open metadata, citation network, concepts | Yes |
| **Scopus** | All disciplines | Citation metrics, author profiles | Subscription |
| **Web of Science** | All disciplines | Impact factors, citation reports | Subscription |
| **IEEE Xplore** | Engineering, CS | IEEE/IET publications, standards | Partial |
| **ACM DL** | Computer science | ACM proceedings, computing reviews | Partial |
| **SSRN** | Social sciences, economics | Working papers, preprints | Yes |
| **JSTOR** | Humanities, social sciences | Historical archives, journals | Partial |

## Search Strategy Design

### Step 1: Decompose Your Question

```
Research question:
  "How does remote work affect employee productivity in knowledge-intensive firms?"

Concept blocks:
  Block A: remote work | telework | work from home | telecommuting | hybrid work
  Block B: productivity | performance | output | efficiency | effectiveness
  Block C: knowledge work | knowledge-intensive | white collar | professional
```

### Step 2: Build Database-Specific Queries

Each database has different syntax. Translate your concept blocks:

**Google Scholar**:
```
("remote work" OR telework OR "work from home") AND
(productivity OR performance OR output) AND
("knowledge work" OR "knowledge-intensive" OR professional)
```

**PubMed**:
```
("remote work"[Title/Abstract] OR "telework"[Title/Abstract] OR
 "work from home"[Title/Abstract]) AND
("productivity"[Title/Abstract] OR "performance"[Title/Abstract]) AND
("knowledge workers"[Title/Abstract] OR "professional"[Title/Abstract])
```

**Semantic Scholar API**:
```bash
curl "https://api.semanticscholar.org/graph/v1/paper/search?\
query=remote+work+productivity+knowledge+workers&\
year=2019-2026&\
fieldsOfStudy=Economics,Business&\
limit=100&\
fields=title,authors,year,abstract,citationCount,url"
```

**arXiv**:
```
all:"remote work" AND all:productivity AND cat:econ.*
```

### Step 3: Execute Searches Systematically

```markdown
## Search Log Template (PRISMA-compliant)

| # | Database | Date | Query String | Filters | Results | Relevant | Notes |
|---|----------|------|-------------|---------|---------|----------|-------|
| 1 | Google Scholar | 2026-03-10 | [full query] | 2019-2026 | 1,240 | ~80 | Top 200 screened |
| 2 | Semantic Scholar | 2026-03-10 | [full query] | Year ≥ 2019 | 487 | ~45 | API, sorted by relevance |
| 3 | PubMed | 2026-03-10 | [full query] | 5 years | 156 | ~30 | MeSH term: Teleworking |
| 4 | SSRN | 2026-03-10 | [full query] | — | 89 | ~20 | Working papers |
| 5 | Scopus | 2026-03-10 | [full query] | 2019-2026 | 312 | ~55 | Most overlap with GS |
```

## Deduplication

After collecting results from multiple databases, remove duplicates:

```python
import pandas as pd
from fuzzywuzzy import fuzz

def deduplicate_papers(df: pd.DataFrame, title_col: str = "title",
                        threshold: int = 90) -> pd.DataFrame:
    """Remove duplicate papers based on fuzzy title matching."""
    df = df.sort_values("citation_count", ascending=False)
    keep = []
    seen_titles = []

    for _, row in df.iterrows():
        title = row[title_col].lower().strip()
        is_dup = False
        for seen in seen_titles:
            if fuzz.ratio(title, seen) >= threshold:
                is_dup = True
                break
        if not is_dup:
            keep.append(row)
            seen_titles.append(title)

    result = pd.DataFrame(keep)
    print(f"Deduplicated: {len(df)} → {len(result)} ({len(df)-len(result)} duplicates removed)")
    return result

# Usage
all_results = pd.concat([gs_results, s2_results, pubmed_results, scopus_results])
unique = deduplicate_papers(all_results)
```

### DOI-Based Deduplication (More Reliable)

```python
def deduplicate_by_doi(df: pd.DataFrame) -> pd.DataFrame:
    """Primary: DOI match. Fallback: fuzzy title match for missing DOIs."""
    with_doi = df[df["doi"].notna()].drop_duplicates(subset="doi", keep="first")
    without_doi = df[df["doi"].isna()]
    without_doi_deduped = deduplicate_papers(without_doi, threshold=85)
    return pd.concat([with_doi, without_doi_deduped]).reset_index(drop=True)
```

## Screening Workflow

### Title/Abstract Screening

```markdown
After deduplication, screen titles and abstracts:

Include if:
  □ Directly addresses research question
  □ Empirical study with data OR systematic review
  □ Published in peer-reviewed venue OR reputable preprint server
  □ Written in English or Chinese

Exclude if:
  □ Irrelevant population (e.g., manual labor when studying knowledge work)
  □ No empirical component (pure opinion)
  □ Duplicate or superseded version
  □ Cannot access full text (after OA and institutional access attempts)
```

### Citation Chaining

After initial screening, expand coverage:

```
Forward citation (who cited this paper?):
  - Semantic Scholar: "Citations" tab
  - Google Scholar: "Cited by" link
  - Web of Science: "Citing Articles"

Backward citation (what does this paper cite?):
  - Read the reference list of each key paper
  - Identify seminal works and foundational papers

Typically adds 15-30% more relevant papers beyond database searches
```

## Recommended Search Order

For maximum coverage with minimum effort:

```
1. Semantic Scholar (broad coverage, AI-powered ranking, free API)
2. Google Scholar (broadest coverage, catches grey literature)
3. Domain-specific DB (PubMed for biomedical, arXiv for CS/physics, SSRN for social science)
4. Scopus or Web of Science (if institutional access available — adds citation metrics)
5. Citation chaining from top 10 most relevant papers found so far
6. Grey literature: Google, institutional repositories, conference websites
```

## References

- Moher, D., et al. (2009). "PRISMA Statement." *BMJ*, 339, b2535.
- Bramer, W. M., et al. (2017). "De-duplication of database search results." *BMC Medical Research Methodology*, 17(1), 1-9.
- [Semantic Scholar API](https://api.semanticscholar.org/)
- [PubMed Search Guide](https://pubmed.ncbi.nlm.nih.gov/help/)
