---
name: citation-assistant-skill
description: "Claude Code skill for citation workflow via Semantic Scholar"
metadata:
  openclaw:
    emoji: "📎"
    category: "writing"
    subcategory: "citation"
    keywords: ["citation assistant", "Semantic Scholar", "Claude Code skill", "reference lookup", "academic citation"]
    source: "https://github.com/ZhangNy301/citation-assistant"
---

# Citation Assistant Skill Guide

## Overview

Citation Assistant is a Claude Code skill that integrates Semantic Scholar API into the coding workflow for instant paper lookup, citation formatting, and reference management. Search for papers by title or keyword, get formatted BibTeX entries, find related works, and insert citations — all without leaving the terminal. Designed for researchers writing papers in LaTeX or Markdown.

## Installation

```bash
# Add as Claude Code skill
# Copy SKILL.md to your Claude Code skills directory
# Or install via OpenClaw:
openclaw skills install citation-assistant
```

## Core Features

### Paper Search

```python
import requests

S2_API = "https://api.semanticscholar.org/graph/v1"

def search_papers(query, limit=5):
    """Search Semantic Scholar for papers."""
    resp = requests.get(
        f"{S2_API}/paper/search",
        params={
            "query": query,
            "limit": limit,
            "fields": "title,authors,year,citationCount,"
                      "externalIds,abstract,venue",
        },
    )
    return resp.json().get("data", [])

papers = search_papers("attention mechanism transformer")
for p in papers:
    authors = ", ".join(a["name"] for a in p["authors"][:3])
    print(f"[{p['year']}] {p['title']}")
    print(f"  {authors} — Citations: {p['citationCount']}")
    print(f"  DOI: {p.get('externalIds', {}).get('DOI', 'N/A')}")
```

### BibTeX Generation

```python
def get_bibtex(paper_id):
    """Get BibTeX for a Semantic Scholar paper."""
    resp = requests.get(
        f"{S2_API}/paper/{paper_id}",
        params={
            "fields": "title,authors,year,venue,externalIds,"
                      "journal,publicationTypes",
        },
    )
    paper = resp.json()

    # Generate citation key
    first_author = paper["authors"][0]["name"].split()[-1].lower()
    key = f"{first_author}{paper['year']}"

    # Build BibTeX
    authors_str = " and ".join(a["name"] for a in paper["authors"])
    doi = paper.get("externalIds", {}).get("DOI", "")

    bibtex = f"""@article{{{key},
  title = {{{paper['title']}}},
  author = {{{authors_str}}},
  year = {{{paper['year']}}},
  journal = {{{paper.get('venue', '')}}},
  doi = {{{doi}}},
}}"""
    return bibtex

# Example
bibtex = get_bibtex("204e3073870fae3d05bcbc2f6a8e263d9b72e776")
print(bibtex)
```

### Citation Context

```python
def get_citation_context(paper_id, limit=10):
    """Get papers that cite this work with context."""
    resp = requests.get(
        f"{S2_API}/paper/{paper_id}/citations",
        params={
            "fields": "title,year,contexts,intents",
            "limit": limit,
        },
    )
    citations = resp.json().get("data", [])

    for cit in citations:
        paper = cit["citingPaper"]
        print(f"\n{paper['title']} ({paper.get('year', '?')})")
        for ctx in cit.get("contexts", [])[:2]:
            print(f"  Context: ...{ctx[:100]}...")
        print(f"  Intent: {cit.get('intents', ['unknown'])}")

get_citation_context("204e3073870fae3d05bcbc2f6a8e263d9b72e776")
```

### Related Paper Discovery

```python
def find_related(paper_id, limit=10):
    """Find papers related to a given paper."""
    resp = requests.get(
        f"{S2_API}/paper/{paper_id}/recommendations",
        params={
            "fields": "title,authors,year,citationCount",
            "limit": limit,
        },
    )
    return resp.json().get("recommendedPapers", [])

related = find_related("204e3073870fae3d05bcbc2f6a8e263d9b72e776")
for p in related:
    print(f"[{p['year']}] {p['title']} ({p['citationCount']} cites)")
```

## Workflow Integration

```markdown
### LaTeX Workflow
1. Search: "Find papers on transformer efficiency"
2. Select relevant papers from results
3. Generate BibTeX entries → append to references.bib
4. Insert \cite{key} in your .tex file

### Markdown Workflow
1. Search for papers while writing
2. Get formatted citation (APA, MLA, etc.)
3. Insert inline: (Author, Year) or [1]
4. Generate reference list at document end
```

## Batch Operations

```python
def build_bibliography(queries, output_file="refs.bib"):
    """Build BibTeX file from multiple search queries."""
    all_bibtex = []
    seen_ids = set()

    for query in queries:
        papers = search_papers(query, limit=3)
        for paper in papers:
            pid = paper.get("paperId")
            if pid and pid not in seen_ids:
                seen_ids.add(pid)
                bibtex = get_bibtex(pid)
                all_bibtex.append(bibtex)

    with open(output_file, "w") as f:
        f.write("\n\n".join(all_bibtex))
    print(f"Wrote {len(all_bibtex)} entries to {output_file}")

build_bibliography([
    "attention mechanism",
    "transformer architecture",
    "BERT pre-training",
])
```

## Use Cases

1. **Paper writing**: Look up and format citations inline
2. **Literature review**: Discover related papers from seed papers
3. **Reference management**: Build BibTeX files from searches
4. **Citation analysis**: Explore how papers cite each other
5. **Quick lookup**: Find DOI, venue, citation count for any paper

## References

- [Citation Assistant GitHub](https://github.com/ZhangNy301/citation-assistant)
- [Semantic Scholar API](https://api.semanticscholar.org/)
