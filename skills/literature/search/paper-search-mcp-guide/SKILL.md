---
name: paper-search-mcp-guide
description: "MCP server for searching papers across arXiv, PubMed, bioRxiv"
metadata:
  openclaw:
    emoji: "🔍"
    category: "literature"
    subcategory: "search"
    keywords: ["paper search", "MCP", "arXiv", "PubMed", "bioRxiv", "multi-database"]
    source: "https://github.com/openags/paper-search-mcp"
---

# Paper Search MCP Guide

## Overview

Paper Search MCP is an MCP server that provides unified paper search across multiple academic databases — arXiv, PubMed, bioRxiv, and medRxiv. AI agents can search, download, and analyze papers through a single MCP interface. Handles API authentication, rate limiting, and result normalization across different database formats.

## MCP Configuration

```json
{
  "mcpServers": {
    "paper-search": {
      "command": "npx",
      "args": ["@openags/paper-search-mcp"],
      "env": {}
    }
  }
}
```

## Available Tools

```markdown
### search_papers
Search across all databases or specific ones.
- query: Search terms
- source: "arxiv" | "pubmed" | "biorxiv" | "all"
- max_results: Number of results (default 10)
- date_from: Start date filter
- date_to: End date filter

### get_paper
Get full details for a specific paper.
- id: arXiv ID, PMID, or DOI

### download_pdf
Download paper PDF.
- id: Paper identifier
- output_dir: Save location

### get_references
Get references cited by a paper.
- id: Paper identifier

### get_citations
Get papers that cite this paper.
- id: Paper identifier
```

## Usage in Agent Chat

```markdown
### Example Interactions

"Search for recent papers on protein folding"
→ Searches arXiv + PubMed + bioRxiv, returns unified results

"Download the PDF for arxiv:2401.12345"
→ Fetches and saves PDF locally

"What papers cite the AlphaFold2 paper?"
→ Looks up forward citations via Semantic Scholar

"Find PubMed papers on CRISPR therapy from 2024"
→ PubMed-specific search with date filter
```

## Normalized Result Format

```json
{
  "title": "Paper Title",
  "authors": ["Author A", "Author B"],
  "abstract": "Abstract text...",
  "source": "arxiv",
  "id": "2401.12345",
  "doi": "10.48550/arXiv.2401.12345",
  "url": "https://arxiv.org/abs/2401.12345",
  "published": "2024-01-15",
  "categories": ["cs.AI", "cs.CL"]
}
```

## Use Cases

1. **Literature search**: Multi-database paper discovery
2. **Agent research**: Automated paper retrieval for AI agents
3. **PDF collection**: Bulk paper downloading
4. **Citation analysis**: Forward and backward citation chains
5. **Cross-database**: Unified search across arXiv + PubMed + bioRxiv

## References

- [paper-search-mcp GitHub](https://github.com/openags/paper-search-mcp)
- [MCP Specification](https://modelcontextprotocol.io/)
