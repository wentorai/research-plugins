---
name: paperpile-notion-guide
description: "Sync Paperpile references and annotations to Notion"
metadata:
  openclaw:
    emoji: "📋"
    category: "tools"
    subcategory: "knowledge-graph"
    keywords: ["Paperpile", "Notion", "sync", "reference management", "annotations", "integration"]
    source: "https://github.com/gsarti/paperpile-notion"
---

# Paperpile-Notion Integration Guide

## Overview

Paperpile-Notion is a tool that syncs your Paperpile reference library to a Notion database. It exports paper metadata (title, authors, year, DOI, abstract), reading status, labels, and annotations to Notion pages, enabling you to combine reference management with Notion's rich knowledge management features.

## Setup

```bash
# Install from source
git clone https://github.com/gsarti/paperpile-notion.git
cd paperpile-notion
pip install -e .

# Configuration
# 1. Export Paperpile library as BibTeX/JSON
# 2. Create Notion integration and get token
# 3. Create Notion database with required properties
# 4. Run sync script
```

## Notion Database Properties

```markdown
### Required Properties
| Property | Type | Source |
|----------|------|--------|
| Title | Title | Paper title |
| Authors | Rich text | Author names |
| Year | Number | Publication year |
| DOI | URL | Digital Object Identifier |
| Abstract | Rich text | Paper abstract |
| Labels | Multi-select | Paperpile labels/folders |
| Status | Select | Read / Unread / Reading |
| Added | Date | Date added to Paperpile |
| Journal | Rich text | Publication venue |
| Notes | Rich text | Paperpile notes |
```

## Sync Workflow

```python
from paperpile_notion import PaperpileSync

sync = PaperpileSync(
    paperpile_export="library.bib",    # BibTeX export
    notion_database_id="your_db_id",
)

# Full sync
result = sync.run()
print(f"Synced: {result.created} new, "
      f"{result.updated} updated, "
      f"{result.skipped} unchanged")

# Incremental sync (only new/modified)
result = sync.run(incremental=True)
```

## Use Cases

1. **Knowledge management**: Paperpile references in Notion
2. **Reading tracking**: Kanban board for paper reading status
3. **Team collaboration**: Shared reference database in Notion
4. **Research notes**: Rich notes alongside paper metadata
5. **Project organization**: Tag papers by research project

## References

- [paperpile-notion GitHub](https://github.com/gsarti/paperpile-notion)
- [Paperpile](https://paperpile.com/)
- [Notion API](https://developers.notion.com/)
