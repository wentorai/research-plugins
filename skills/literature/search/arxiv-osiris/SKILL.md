---
name: arxiv-osiris
description: "Search and download arXiv papers via Python and PowerShell scripts"
metadata:
  openclaw:
    emoji: "🔍"
    category: "literature"
    subcategory: "search"
    keywords: ["arxiv", "paper download", "preprint search", "python script", "powershell", "literature retrieval"]
    source: "https://clawhub.com/kostaskyq/arxiv-osiris"
---

# arXiv Osiris — Paper Search and Download Tool

## Overview

arXiv Osiris provides cross-platform scripts (Python and PowerShell) for searching and downloading scientific papers from arXiv.org. It supports keyword search, category filtering, metadata retrieval, and direct PDF download. Useful for researchers who prefer scripted automation over browser-based arXiv access, particularly for building local paper collections.

## Installation

```bash
# Install the arxiv Python client (required dependency)
pip install arxiv

# Clone the tool (if using from source)
git clone https://github.com/kostaskyq/arxiv-osiris.git
```

## Usage — Python API

### Search for Papers

```python
import arxiv

# Basic keyword search
search = arxiv.Search(
    query="quantum computing error correction",
    max_results=10,
    sort_by=arxiv.SortCriterion.Relevance
)

client = arxiv.Client()
for result in client.results(search):
    print(f"ID:       {result.entry_id}")
    print(f"Title:    {result.title}")
    print(f"Authors:  {', '.join(a.name for a in result.authors)}")
    print(f"Published:{result.published.strftime('%Y-%m-%d')}")
    print(f"PDF:      {result.pdf_url}")
    print(f"Abstract: {result.summary[:200]}...")
    print()
```

### Category-Filtered Search

```python
# Search within specific categories
search = arxiv.Search(
    query="cat:cs.CL AND transformer",
    max_results=20,
    sort_by=arxiv.SortCriterion.SubmittedDate
)

# Multiple categories
search = arxiv.Search(
    query="(cat:cs.AI OR cat:cs.LG) AND reinforcement learning",
    max_results=15
)
```

### Download Papers

```python
import os

search = arxiv.Search(query="attention mechanism", max_results=5)
client = arxiv.Client()
download_dir = os.path.expanduser("~/papers/attention")
os.makedirs(download_dir, exist_ok=True)

for result in client.results(search):
    # Download PDF
    result.download_pdf(dirpath=download_dir)
    print(f"Downloaded: {result.title}")

    # Download source (LaTeX) if available
    result.download_source(dirpath=download_dir)
```

## Usage — PowerShell Script

### Search

```powershell
# Basic search
.\arxiv.ps1 -Action search -Query "machine learning"

# With max results
.\arxiv.ps1 -Action search -Query "neural networks" -MaxResults 10

# Filter by category
.\arxiv.ps1 -Action search -Query "deep learning" -Categories "cs,stat"
```

### Download

```powershell
# Download by arXiv ID
.\arxiv.ps1 -Action download -ArxivId "1706.03762"

# Download to specific directory
.\arxiv.ps1 -Action download -ArxivId "2301.13688" -OutputDir "C:\Papers"
```

## Advanced Queries

The arXiv API supports a rich query syntax:

| Operator | Meaning | Example |
|----------|---------|---------|
| `AND` | Both terms | `"deep learning" AND "drug discovery"` |
| `OR` | Either term | `"GAN" OR "diffusion model"` |
| `ANDNOT` | Exclude term | `"NLP" ANDNOT "translation"` |
| `au:` | Author | `au:"Hinton"` |
| `ti:` | Title contains | `ti:"attention"` |
| `abs:` | Abstract contains | `abs:"protein folding"` |
| `cat:` | Category | `cat:cs.CV` |

### Complex Query Examples

```python
# Papers by a specific author on a specific topic
search = arxiv.Search(query='au:"Yann LeCun" AND ti:"self-supervised"')

# Recent papers in two categories excluding surveys
search = arxiv.Search(
    query='(cat:cs.CL OR cat:cs.AI) AND "large language model" ANDNOT ti:"survey"',
    sort_by=arxiv.SortCriterion.SubmittedDate,
    max_results=50
)
```

## Building a Local Paper Library

```python
import arxiv
import json
import os
from datetime import datetime

def build_library(queries: dict, base_dir: str = "~/papers"):
    """Build organized paper library from multiple search queries."""
    base = os.path.expanduser(base_dir)
    catalog = []
    client = arxiv.Client()

    for topic, query in queries.items():
        topic_dir = os.path.join(base, topic)
        os.makedirs(topic_dir, exist_ok=True)

        search = arxiv.Search(query=query, max_results=20,
                              sort_by=arxiv.SortCriterion.SubmittedDate)

        for paper in client.results(search):
            paper.download_pdf(dirpath=topic_dir)
            catalog.append({
                "id": paper.entry_id,
                "title": paper.title,
                "authors": [a.name for a in paper.authors],
                "published": paper.published.isoformat(),
                "topic": topic,
                "pdf_path": os.path.join(topic_dir, f"{paper.get_short_id()}.pdf")
            })

    # Save catalog
    with open(os.path.join(base, "catalog.json"), "w") as f:
        json.dump(catalog, f, indent=2)
    print(f"Library built: {len(catalog)} papers in {len(queries)} topics")

# Usage
build_library({
    "rag": "cat:cs.CL AND retrieval augmented generation",
    "agents": "cat:cs.AI AND (LLM agent OR tool use)",
    "evaluation": "cat:cs.CL AND (benchmark OR evaluation) AND language model"
})
```

## Rate Limits

- arXiv API: **1 request per 3 seconds** for automated access
- The `arxiv` Python client handles rate limiting automatically
- For large-scale downloads, add explicit delays: `time.sleep(3)`
- Respect [arXiv API Terms of Use](https://info.arxiv.org/help/api/tou.html)

## References

- [arxiv Python Client](https://github.com/lukasschwab/arxiv.py)
- [arXiv API User Manual](https://info.arxiv.org/help/api/user-manual.html)
- [arXiv Category Taxonomy](https://arxiv.org/category_taxonomy)
