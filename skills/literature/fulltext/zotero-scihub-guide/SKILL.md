---
name: zotero-scihub-guide
description: "Zotero plugin for automatic PDF retrieval from Sci-Hub"
metadata:
  openclaw:
    emoji: "🔓"
    category: "literature"
    subcategory: "fulltext"
    keywords: ["Zotero", "Sci-Hub", "PDF download", "open access", "full text", "paper retrieval"]
    source: "https://github.com/ethanwillis/zotero-scihub"
---

# Zotero Sci-Hub Guide

## Overview

Zotero Sci-Hub is a Zotero plugin that automatically fetches PDFs from Sci-Hub when papers cannot be found through standard open-access channels. It integrates seamlessly into Zotero's existing PDF retrieval workflow — when Zotero's built-in retriever fails, the plugin automatically attempts Sci-Hub as a fallback. Useful for researchers at institutions with limited journal subscriptions.

## Installation

```bash
# Download the .xpi file from GitHub releases
# In Zotero 7: Tools → Add-ons → Install Add-on From File

# Manual installation
# 1. Go to https://github.com/ethanwillis/zotero-scihub/releases
# 2. Download zotero-scihub-*.xpi
# 3. In Zotero: Tools → Add-ons → gear icon → Install from file
```

## Configuration

```
# In Zotero: Edit → Preferences → Zotero Sci-Hub

# Settings:
# 1. Sci-Hub URL: Set current working mirror
#    - The plugin ships with default URLs
#    - Update if mirrors change

# 2. Automatic mode:
#    - ON: Try Sci-Hub automatically after Zotero fails
#    - OFF: Only fetch via right-click menu

# 3. DOI sources: Where to look for DOIs
#    - Item DOI field
#    - Item URL field
#    - Item Extra field
```

## Usage Workflow

```markdown
### Automatic PDF Retrieval
1. Add item to Zotero (via browser connector, DOI, or manual)
2. Zotero tries built-in PDF retrieval (Open Access, institutional)
3. If no PDF found → plugin automatically queries Sci-Hub
4. PDF attached to Zotero item

### Manual Retrieval
1. Right-click item(s) in Zotero
2. Select "Fetch PDF from Sci-Hub"
3. Works for single items or batch selection

### Bulk Retrieval
1. Select multiple items (Ctrl+A for all)
2. Right-click → "Fetch PDF from Sci-Hub"
3. Plugin processes items sequentially with rate limiting
```

## Integration with Other Plugins

```markdown
### Recommended Plugin Stack
1. **Zotero Connector** — Browser extension for importing items
2. **Zotero Sci-Hub** — PDF fallback retrieval
3. **ZotFile/ZotMoov** — Organize downloaded PDFs
4. **Zotero Better BibTeX** — Citation key management
5. **Zotero PDF Translate** — Translate retrieved papers

### Workflow
Import item → Auto-fetch PDF → Organize files → Read & annotate
```

## Troubleshooting

```markdown
### Common Issues

**PDF not found:**
- Check if DOI is present in item metadata
- Try updating the Sci-Hub mirror URL
- Some very recent papers may not be available yet

**Connection errors:**
- Current mirror may be down; try alternate URL
- Check network/proxy settings
- Some institutions block Sci-Hub domains

**Duplicate PDFs:**
- Disable automatic mode if using other PDF fetchers
- Check Zotero's duplicate detection settings
```

## Programmatic Alternative

```python
# For building custom PDF retrieval pipelines
import requests

def fetch_paper_by_doi(doi, output_path):
    """Attempt to fetch paper PDF via DOI resolution."""
    # Try Unpaywall first (legal open access)
    unpaywall_url = (
        f"https://api.unpaywall.org/v2/{doi}"
        f"?email=your@email.com"
    )
    resp = requests.get(unpaywall_url)
    if resp.ok:
        data = resp.json()
        if data.get("is_oa") and data.get("best_oa_location"):
            pdf_url = data["best_oa_location"].get("url_for_pdf")
            if pdf_url:
                pdf = requests.get(pdf_url)
                with open(output_path, "wb") as f:
                    f.write(pdf.content)
                return True

    # Try CORE API
    core_url = f"https://api.core.ac.uk/v3/search/works?q=doi:{doi}"
    resp = requests.get(core_url)
    if resp.ok:
        results = resp.json().get("results", [])
        if results and results[0].get("downloadUrl"):
            pdf = requests.get(results[0]["downloadUrl"])
            with open(output_path, "wb") as f:
                f.write(pdf.content)
            return True

    return False
```

## Legal Considerations

```markdown
### Open Access Alternatives
Before using Sci-Hub, check these legal sources:
1. **Unpaywall** — Browser extension for legal OA versions
2. **CORE** — Aggregator of OA research papers
3. **PubMed Central** — Free biomedical literature archive
4. **arXiv/bioRxiv** — Preprint servers
5. **Author websites** — Many post preprints freely
6. **Interlibrary Loan** — Request through your library
7. **Email the author** — Most researchers share on request
```

## Use Cases

1. **PDF retrieval**: Automatic paper downloading for Zotero
2. **Literature collection**: Build reading libraries efficiently
3. **Systematic reviews**: Bulk-fetch papers for review pipelines
4. **Research onboarding**: Quickly gather papers for new topics

## References

- [Zotero Sci-Hub GitHub](https://github.com/ethanwillis/zotero-scihub)
- [Unpaywall](https://unpaywall.org/) — Legal OA alternative
- [CORE](https://core.ac.uk/) — OA aggregator
