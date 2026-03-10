---
name: open-webui-tools-guide
description: "Academic research tools for Open WebUI chat interface"
metadata:
  openclaw:
    emoji: "🌐"
    category: "tools"
    subcategory: "knowledge-graph"
    keywords: ["Open WebUI", "research tools", "chat interface", "paper search", "academic tools", "LLM UI"]
    source: "https://github.com/Haervwe/open-webui-tools"
---

# Open WebUI Academic Tools Guide

## Overview

A collection of academic research tools designed for Open WebUI, the popular self-hosted LLM chat interface. These tools add paper search, citation lookup, and research capabilities directly into chat conversations — search arXiv, PubMed, and Semantic Scholar; fetch paper details; generate citations; and analyze documents, all within the familiar chat UI.

## Installation

```bash
# In Open WebUI: Admin → Tools → Add Tool
# Import from the tools collection

# Or manually add tool functions
# Copy tool JSON definitions to Open WebUI config
```

## Available Tools

### Paper Search Tool

```python
# Searches arXiv, Semantic Scholar, PubMed
# Usage in chat: "Search for papers on attention mechanisms"

def search_papers(query: str, source: str = "all",
                  max_results: int = 10) -> str:
    """Search academic databases for papers.

    Args:
        query: Search query
        source: "arxiv", "semantic_scholar", "pubmed", or "all"
        max_results: Maximum results to return
    """
    results = []

    if source in ("all", "arxiv"):
        # Search arXiv
        arxiv_results = search_arxiv(query, max_results)
        results.extend(arxiv_results)

    if source in ("all", "semantic_scholar"):
        # Search Semantic Scholar
        s2_results = search_s2(query, max_results)
        results.extend(s2_results)

    return format_results(results)
```

### Citation Generator Tool

```python
# Generate formatted citations from DOI or title
# Usage: "Get BibTeX for DOI 10.48550/arXiv.1706.03762"

def get_citation(identifier: str,
                 style: str = "bibtex") -> str:
    """Get formatted citation for a paper.

    Args:
        identifier: DOI, arXiv ID, or paper title
        style: "bibtex", "apa", "mla", "chicago"
    """
    paper = resolve_paper(identifier)
    return format_citation(paper, style)
```

### Paper Summary Tool

```python
# Fetch and summarize paper abstract + key points
# Usage: "Summarize arxiv:2401.12345"

def summarize_paper(paper_id: str) -> str:
    """Fetch paper metadata and generate summary.

    Args:
        paper_id: arXiv ID, DOI, or Semantic Scholar ID
    """
    paper = fetch_paper_details(paper_id)
    return {
        "title": paper.title,
        "authors": paper.authors,
        "abstract": paper.abstract,
        "year": paper.year,
        "citations": paper.citation_count,
    }
```

## Tool Configuration

```json
{
  "tools": {
    "paper_search": {
      "enabled": true,
      "default_source": "semantic_scholar",
      "max_results": 10,
      "include_abstract": true
    },
    "citation_generator": {
      "enabled": true,
      "default_style": "bibtex"
    },
    "paper_summary": {
      "enabled": true,
      "include_related": true
    }
  }
}
```

## Chat Workflow Examples

```markdown
### Research Discovery
User: "Find recent papers on retrieval-augmented generation"
Bot: [Uses paper_search tool] Here are 10 recent papers on RAG...

### Citation Workflow
User: "Get BibTeX for the BERT paper"
Bot: [Uses citation_generator] @article{devlin2019bert, ...}

### Paper Analysis
User: "Tell me about arxiv:2404.19756"
Bot: [Uses paper_summary] This paper introduces KAN...

### Literature Review
User: "Compare attention mechanisms in the top-5 cited
       transformer papers from 2023"
Bot: [Uses multiple tools] Searching... Here's a comparison...
```

## Use Cases

1. **Chat-based research**: Search papers while chatting with LLM
2. **Quick citations**: Generate BibTeX without leaving chat
3. **Paper discovery**: Find related work through conversation
4. **Team research**: Shared research chat with embedded tools
5. **Teaching**: Interactive paper exploration in classroom

## References

- [open-webui-tools GitHub](https://github.com/Haervwe/open-webui-tools)
- [Open WebUI](https://github.com/open-webui/open-webui)
