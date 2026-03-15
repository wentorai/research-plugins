---
name: citation-chaining-guide
description: "Forward and backward citation chaining techniques for literature search"
metadata:
  openclaw:
    emoji: "🔗"
    category: "literature"
    subcategory: "search"
    keywords: ["citation tracking", "advanced search", "search strategy", "literature search"]
    source: "wentor-research-plugins"
---

# Citation Chaining Guide

Master forward and backward citation chaining to systematically discover relevant literature by following the threads of scholarly communication.

## What Is Citation Chaining?

Citation chaining (also called citation tracking, pearl growing, or snowball searching) exploits the connections between papers through their references and citations. Starting from one or more "seed" papers, you trace connections in two directions:

- **Backward chaining**: Examine the reference list of a paper to find older, foundational works it builds upon.
- **Forward chaining**: Find newer papers that have cited the seed paper, discovering subsequent developments.

This approach is especially powerful when keyword searches fail (e.g., when terminology varies across subfields or when concepts predate standardized vocabulary).

## Step-by-Step Workflow

### Step 1: Identify Seed Papers

Select 3-5 highly relevant papers that are central to your research question. Good seed papers are:

- Frequently cited review articles or seminal original research
- Papers whose methodology or framework aligns closely with your work
- Recent papers in top venues for your field

### Step 2: Backward Chaining (Reference Mining)

Examine the reference list of each seed paper and identify which cited works are relevant.

```python
import requests

def get_references(paper_id, limit=100):
    """Get all references of a paper via Semantic Scholar."""
    url = f"https://api.semanticscholar.org/graph/v1/paper/{paper_id}/references"
    response = requests.get(url, params={
        "fields": "title,year,citationCount,externalIds,abstract",
        "limit": limit
    })
    refs = response.json().get("data", [])
    return [r["citedPaper"] for r in refs if r["citedPaper"].get("title")]

# Get references of a seed paper
seed_doi = "DOI:10.1038/s41586-021-03819-2"
references = get_references(seed_doi)

# Sort by citation count to find the most influential foundations
references.sort(key=lambda p: p.get("citationCount", 0), reverse=True)
for ref in references[:15]:
    print(f"[{ref.get('year', '?')}] {ref['title']} ({ref.get('citationCount', 0)} citations)")
```

### Step 3: Forward Chaining (Citation Tracking)

Find all papers that have cited your seed paper.

```python
def get_citations(paper_id, limit=200):
    """Get papers citing a given paper via Semantic Scholar."""
    url = f"https://api.semanticscholar.org/graph/v1/paper/{paper_id}/citations"
    all_citations = []
    offset = 0
    while offset < limit:
        response = requests.get(url, params={
            "fields": "title,year,citationCount,externalIds,abstract",
            "limit": min(100, limit - offset),
            "offset": offset
        })
        data = response.json().get("data", [])
        if not data:
            break
        all_citations.extend([c["citingPaper"] for c in data if c["citingPaper"].get("title")])
        offset += len(data)
    return all_citations

citations = get_citations(seed_doi)
# Filter for recent, well-cited papers
recent_impactful = [c for c in citations if c.get("year", 0) >= 2022 and c.get("citationCount", 0) >= 5]
recent_impactful.sort(key=lambda p: p.get("citationCount", 0), reverse=True)
```

### Step 4: Co-Citation and Bibliographic Coupling

Two advanced techniques extend basic citation chaining:

| Technique | Definition | What It Reveals |
|-----------|-----------|-----------------|
| **Co-citation** | Two papers are frequently cited together by the same set of subsequent papers | Conceptual proximity: these works form a shared intellectual foundation |
| **Bibliographic coupling** | Two papers share many of the same references | Methodological or topical similarity at the time of writing |

```python
def find_co_cited_papers(paper_ids, min_co_citation_count=3):
    """Find papers frequently co-cited with the given papers."""
    from collections import Counter
    reference_counts = Counter()

    for pid in paper_ids:
        refs = get_references(pid)
        for ref in refs:
            ref_id = ref.get("paperId")
            if ref_id and ref_id not in paper_ids:
                reference_counts[ref_id] += 1

    # Papers cited by multiple seeds are co-cited candidates
    co_cited = [(pid, count) for pid, count in reference_counts.items()
                if count >= min_co_citation_count]
    co_cited.sort(key=lambda x: x[1], reverse=True)
    return co_cited
```

### Step 5: Iterative Expansion

Repeat the process with the most relevant papers discovered in each round:

1. **Round 1**: Start with 3-5 seed papers
2. **Round 2**: Run backward + forward chaining on seeds, identify 10-15 new relevant papers
3. **Round 3**: Run chaining on the new papers from Round 2
4. **Saturation**: Stop when new rounds yield diminishing returns (i.e., the same papers keep appearing)

## Tools for Citation Chaining

| Tool | Method | Cost |
|------|--------|------|
| Google Scholar "Cited by" | Forward chaining | Free |
| Web of Science "Cited References" / "Times Cited" | Both directions | Subscription |
| Scopus "References" / "Cited by" | Both directions | Subscription |
| Semantic Scholar API | Programmatic, both directions | Free |
| Connected Papers (connectedpapers.com) | Visual co-citation graph | Free (limited) |
| Litmaps (litmaps.com) | Visual citation network | Free tier |
| CoCites (cocites.com) | Co-citation analysis | Free |
| Citation Gecko | Seed-based discovery | Free |

## Common Pitfalls

- **Citation bias**: Highly cited papers are not always the best or most relevant. Pay attention to less-cited but methodologically sound papers.
- **Recency bias**: Forward chaining favors recent papers with fewer citations. Allow time for citation accumulation or use Mendeley readership as a proxy.
- **Field boundaries**: Citation chains tend to stay within disciplinary silos. Combine with keyword searches in adjacent-field databases to break out.
- **Incomplete coverage**: No single database indexes all citations. Cross-check with at least two sources (e.g., Semantic Scholar + Google Scholar).
