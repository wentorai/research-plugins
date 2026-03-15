---
name: semantic-scholar-recs-guide
description: "Using Semantic Scholar recommendations API for paper discovery"
metadata:
  openclaw:
    emoji: "🤖"
    category: "literature"
    subcategory: "discovery"
    keywords: ["related papers", "literature recommendation", "paper discovery", "citation network"]
    source: "wentor-research-plugins"
---

# Semantic Scholar Recommendations Guide

Leverage the Semantic Scholar (S2) API to discover related papers, traverse citation networks, and build comprehensive reading lists programmatically.

## Overview

Semantic Scholar indexes over 200 million academic papers and provides a free, rate-limited API that supports:

- Paper search by title, keyword, or DOI
- Recommendations based on positive and negative seed papers
- Citation and reference graph traversal
- Author profiles and publication histories
- Bulk data access for large-scale analyses

Base URL: `https://api.semanticscholar.org/graph/v1`
Recommendations endpoint: `https://api.semanticscholar.org/recommendations/v1`

## Getting Recommendations from Seed Papers

The recommendations endpoint accepts a list of positive (and optionally negative) paper IDs and returns related papers ranked by relevance.

### Single-Paper Recommendations

```python
import requests

PAPER_ID = "649def34f8be52c8b66281af98ae884c09aef38b"  # SHA or S2 ID

response = requests.get(
    f"https://api.semanticscholar.org/recommendations/v1/papers/forpaper/{PAPER_ID}",
    params={
        "fields": "title,authors,year,citationCount,abstract,externalIds",
        "limit": 20
    },
    headers={"x-api-key": "YOUR_API_KEY"}  # optional, increases rate limit
)

for paper in response.json()["recommendedPapers"]:
    print(f"[{paper['year']}] {paper['title']} (citations: {paper['citationCount']})")
```

### Multi-Paper Recommendations (Positive + Negative Seeds)

```python
import requests

payload = {
    "positivePaperIds": [
        "649def34f8be52c8b66281af98ae884c09aef38b",
        "ARXIV:2005.14165"  # can use arXiv ID prefix
    ],
    "negativePaperIds": [
        "ArXiv:1706.03762"  # exclude attention-is-all-you-need style papers
    ]
}

response = requests.post(
    "https://api.semanticscholar.org/recommendations/v1/papers/",
    json=payload,
    params={"fields": "title,year,citationCount,url,abstract", "limit": 30}
)

results = response.json()["recommendedPapers"]
print(f"Found {len(results)} recommended papers")
```

## Citation Network Traversal

Walk the citation graph to discover foundational and derivative works.

### Forward Citations (Who Cited This Paper?)

```python
paper_id = "649def34f8be52c8b66281af98ae884c09aef38b"

response = requests.get(
    f"https://api.semanticscholar.org/graph/v1/paper/{paper_id}/citations",
    params={
        "fields": "title,year,citationCount,authors",
        "limit": 100,
        "offset": 0
    }
)

citations = response.json()["data"]
# Sort by citation count to find most influential derivative works
citations.sort(key=lambda x: x["citingPaper"]["citationCount"], reverse=True)
for c in citations[:10]:
    p = c["citingPaper"]
    print(f"  [{p['year']}] {p['title']} ({p['citationCount']} cites)")
```

### Backward References (What Did This Paper Cite?)

```python
response = requests.get(
    f"https://api.semanticscholar.org/graph/v1/paper/{paper_id}/references",
    params={"fields": "title,year,citationCount,authors", "limit": 100}
)

refs = response.json()["data"]
refs.sort(key=lambda x: x["citedPaper"]["citationCount"], reverse=True)
```

## Building a Reading List Pipeline

Combine search, recommendations, and citation traversal into a discovery pipeline:

| Step | Method | Purpose |
|------|--------|---------|
| 1. Seed selection | Manual or keyword search | Identify 3-5 highly relevant papers |
| 2. Expand via recs | Multi-paper recommendations | Find thematically related work |
| 3. Forward citation | Citations endpoint | Find recent derivative works |
| 4. Backward citation | References endpoint | Find foundational papers |
| 5. Deduplicate | S2 paper ID matching | Remove duplicates across steps |
| 6. Rank & filter | Sort by year, citations, relevance | Prioritize reading order |

```python
def build_reading_list(seed_ids, max_papers=50):
    """Build a ranked reading list from seed papers."""
    seen = set()
    candidates = []

    # Step 1: Get recommendations
    recs = get_recommendations(seed_ids)
    for paper in recs:
        if paper["paperId"] not in seen:
            seen.add(paper["paperId"])
            candidates.append(paper)

    # Step 2: Get citations of seed papers
    for sid in seed_ids:
        cites = get_citations(sid, limit=50)
        for c in cites:
            pid = c["citingPaper"]["paperId"]
            if pid not in seen:
                seen.add(pid)
                candidates.append(c["citingPaper"])

    # Step 3: Rank by citation count and recency
    candidates.sort(key=lambda p: (p.get("year", 0), p.get("citationCount", 0)), reverse=True)
    return candidates[:max_papers]
```

## Rate Limits and Best Practices

- **Without API key**: 100 requests per 5 minutes
- **With API key**: 1 request/second sustained (request a key at semanticscholar.org/product/api)
- Always include only the fields you need to reduce payload size
- Use `offset` and `limit` for pagination on large result sets
- Cache responses locally to avoid redundant requests
- Use DOI, arXiv ID, or PubMed ID as paper identifiers for cross-system compatibility (prefix with `DOI:`, `ARXIV:`, or `PMID:`)
