---
name: openpaper-guide
description: "Open-source tool for organizing and annotating research papers"
metadata:
  openclaw:
    emoji: "📄"
    category: "tools"
    subcategory: "document"
    keywords: ["paper management", "PDF annotation", "research organizer", "paper reader", "document viewer", "open source"]
    source: "https://github.com/nicehash/openpaper"
---

# OpenPaper Guide

## Overview

OpenPaper is an open-source research paper management and annotation tool. It provides PDF viewing with inline annotations, paper organization with tags and collections, metadata extraction, full-text search across your library, and export capabilities. Designed as a lightweight, privacy-focused alternative to commercial reference managers, running entirely locally.

## Installation

```bash
# Install via pip
pip install openpaper

# Or from source
git clone https://github.com/nicehash/openpaper.git
cd openpaper && pip install -e .

# Launch
openpaper
```

## Library Management

```python
from openpaper import Library

library = Library("./my_research_library")

# Add papers
paper = library.add("path/to/paper.pdf")
print(f"Added: {paper.title}")
print(f"Authors: {paper.authors}")
print(f"Year: {paper.year}")

# Bulk import
added = library.import_directory(
    "downloads/papers/",
    recursive=True,
    extract_metadata=True,   # Auto-extract from PDF
    deduplicate=True,         # Skip duplicates by DOI/title
)
print(f"Imported {len(added)} papers, {added.duplicates} skipped")
```

## Organization

```python
# Tags
paper.add_tag("transformer")
paper.add_tag("attention")
paper.add_tag("priority:high")

# Collections
library.create_collection("thesis-chapter-2")
library.add_to_collection("thesis-chapter-2", paper)

# Smart collections (auto-updating filters)
library.create_smart_collection(
    name="Recent NLP",
    filters={
        "tags": ["nlp"],
        "year": {"gte": 2023},
        "read_status": "unread",
    },
)

# List and browse
for p in library.search(tags=["transformer"], year=2024):
    print(f"{p.title} ({p.year}) - {p.read_status}")
```

## Annotations

```python
# Add annotations to papers
paper.annotate(
    page=3,
    type="highlight",
    text="The attention mechanism allows the model to focus...",
    color="yellow",
    note="Key definition of attention",
)

paper.annotate(
    page=5,
    type="comment",
    position=(100, 250),  # x, y coordinates
    note="This contradicts the claim in Smith et al. 2023",
)

# Export annotations
annotations = paper.get_annotations()
for ann in annotations:
    print(f"[p.{ann.page}] {ann.type}: {ann.text[:60]}...")
    if ann.note:
        print(f"  Note: {ann.note}")

# Export to markdown
paper.export_annotations("annotations.md")
```

## Search

```python
# Full-text search across library
results = library.search_fulltext("attention mechanism")
for r in results:
    print(f"{r.title} (relevance: {r.score:.2f})")
    for match in r.matches[:3]:
        print(f"  p.{match.page}: ...{match.context}...")

# Metadata search
results = library.search(
    query="transformer",        # Title/abstract search
    authors="Vaswani",
    year_range=(2020, 2025),
    tags=["nlp"],
)

# Semantic search (if embeddings enabled)
results = library.semantic_search(
    "methods for reducing quadratic complexity of attention",
    top_k=10,
)
```

## Metadata Extraction

```python
# Auto-extract metadata from PDFs
metadata = library.extract_metadata("paper.pdf")
print(f"Title: {metadata.title}")
print(f"Authors: {metadata.authors}")
print(f"Abstract: {metadata.abstract[:200]}...")
print(f"DOI: {metadata.doi}")
print(f"Year: {metadata.year}")
print(f"References: {len(metadata.references)}")

# Enrich with external databases
enriched = library.enrich_metadata(
    paper,
    sources=["crossref", "semantic_scholar"],
)
print(f"Citations: {enriched.citation_count}")
print(f"Venue: {enriched.venue}")
```

## Export

```python
# Export bibliography
library.export_bibtex("references.bib", collection="thesis-chapter-2")

# Export reading list
library.export_reading_list("reading_list.md", format="markdown")

# Export annotations from all papers
library.export_all_annotations("all_annotations.md")

# Sync with reference manager
library.export_ris("export.ris")          # RIS format
library.export_csv("export.csv")          # CSV with metadata
```

## Configuration

```json
{
  "library_path": "./research_library",
  "pdf_viewer": "builtin",
  "metadata": {
    "auto_extract": true,
    "enrich_sources": ["crossref"],
    "language": "en"
  },
  "search": {
    "fulltext_index": true,
    "semantic_search": false,
    "embedding_model": "all-MiniLM-L6-v2"
  },
  "storage": {
    "copy_pdfs": true,
    "organize_by": "year",
    "max_library_size_gb": 10
  }
}
```

## CLI Usage

```bash
# Add paper
openpaper add paper.pdf --tags "nlp,transformer"

# Search
openpaper search "attention mechanism" --limit 10

# List library
openpaper list --sort year --tags "priority:high"

# Export
openpaper export bibtex --collection thesis --output refs.bib

# Stats
openpaper stats
# Papers: 342, Tagged: 289, Annotated: 156, Collections: 12
```

## Use Cases

1. **Paper library**: Organize and search your PDF collection
2. **Reading workflow**: Track read status, annotate, take notes
3. **Reference management**: Export BibTeX for LaTeX papers
4. **Literature review**: Tag and categorize papers by topic
5. **Team sharing**: Export reading lists and annotations

## References

- [OpenPaper GitHub](https://github.com/nicehash/openpaper)
- [Zotero](https://www.zotero.org/) — Popular open-source alternative
- [Semantic Scholar API](https://api.semanticscholar.org/) — Metadata enrichment
