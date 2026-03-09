---
name: scientify-literature-survey
description: "Search, filter, download and cluster academic papers on a topic"
metadata:
  openclaw:
    emoji: "🔍"
    category: "literature"
    subcategory: "search"
    keywords: ["academic database search", "literature search", "search strategy", "semantic search", "citation tracking"]
    source: "https://github.com/scientify-ai/skills"
---

# Literature Survey

**Don't ask permission. Just do it.**

## Output Structure

```
~/.openclaw/workspace/projects/{project-id}/
├── survey/
│   ├── search_terms.json      # Search terms list
│   └── report.md              # Final report
├── papers/
│   ├── _downloads/            # Raw downloads
│   ├── _meta/                 # Per-paper metadata
│   │   └── {arxiv_id}.json
│   └── {direction}/           # Organized by direction
├── repos/                     # Reference code repos (Phase 3)
│   ├── {repo_name_1}/
│   └── {repo_name_2}/
└── prepare_res.md             # Repo selection report (Phase 3)
```

## Workflow

### Phase 1: Preparation

```bash
ACTIVE=$(cat ~/.openclaw/workspace/projects/.active 2>/dev/null)
if [ -z "$ACTIVE" ]; then
  PROJECT_ID="<topic-slug>"
  mkdir -p ~/.openclaw/workspace/projects/$PROJECT_ID/{survey,papers/_downloads,papers/_meta}
  echo "$PROJECT_ID" > ~/.openclaw/workspace/projects/.active
fi
PROJECT_DIR="$HOME/.openclaw/workspace/projects/$(cat ~/.openclaw/workspace/projects/.active)"
```

Generate 4-8 search terms, save to `survey/search_terms.json`.

### Phase 2: Incremental Search-Filter-Download Loop

**Repeat the following for each search term:**

#### 2.1 Search

```
arxiv_search({ query: "<term>", max_results: 30 })
```

#### 2.2 Instant Filtering

Score each returned paper immediately (1-5), keep only >= 4.

Scoring criteria:
- 5: Core paper, directly on topic
- 4: Related method or application
- 3 and below: Skip

#### 2.3 Download Useful Papers

```
arxiv_download({
  arxiv_ids: ["<useful_paper_ids>"],
  output_dir: "$PROJECT_DIR/papers/_downloads"
})
```

#### 2.4 Write Metadata

For each downloaded paper, create `papers/_meta/{arxiv_id}.json`:

```json
{
  "arxiv_id": "2401.12345",
  "title": "...",
  "abstract": "...",
  "score": 5,
  "source_term": "battery RUL prediction",
  "downloaded_at": "2024-01-15T10:00:00Z"
}
```

**Complete one search term before proceeding to the next.** This prevents context pollution from large search results.

### Phase 3: GitHub Code Search & Reference Repo Selection

**Goal**: Provide reference implementations for downstream skills.

#### 3.1 Select High-Scoring Papers

Read metadata from `papers/_meta/` for papers scoring >= 4, select **Top 5** most relevant.

#### 3.2 Search Reference Repos

For each selected paper, search GitHub with keyword combinations:
- Paper title + "code" / "implementation"
- Core method name + author name
- Dataset name + task name from paper

Use `github_search` tool:
```javascript
github_search({
  query: "{paper_title} implementation",
  max_results: 10,
  sort: "stars",
  language: "python"
})
```

#### 3.3 Filter & Clone

Evaluate repos by:
- Star count (recommend >100)
- Code quality (has README, requirements.txt, clear structure)
- Paper match (README references paper / implements its method)

Select **3-5** most relevant repos, clone to `repos/`:

```bash
mkdir -p "$PROJECT_DIR/repos"
cd "$PROJECT_DIR/repos"
git clone --depth 1 <repo_url>
```

#### 3.4 Write Selection Report

Create `$PROJECT_DIR/prepare_res.md`:

```markdown
# Reference Repo Selection

| Repo | Paper | Stars | Reason |
|------|-------|-------|--------|
| repos/{repo_name} | {paper_title} (arxiv:{id}) | {N} | {reason} |

## Key Files per Repo

### {repo_name}
- **Model**: `model/` or `models/`
- **Training**: `train.py` or `main.py`
- **Data loading**: `data/` or `dataset.py`
- **Core file**: `{path}` - {description}
```

**If no repos found**, note "No reference repos available" in `prepare_res.md`.

### Phase 4: Classification

After all search terms and code searches are complete:

#### 4.1 Read All Metadata

```bash
ls $PROJECT_DIR/papers/_meta/
```

Read all `.json` files, aggregate paper list.

#### 4.2 Cluster Analysis

Based on paper titles, abstracts, and source terms, identify 3-6 research directions.

#### 4.3 Create Folders and Move

```bash
mkdir -p "$PROJECT_DIR/papers/data-driven"
mv "$PROJECT_DIR/papers/_downloads/2401.12345" "$PROJECT_DIR/papers/data-driven/"
```

### Phase 5: Generate Report

Create `survey/report.md`:
- Survey summary (search terms count, papers count, directions count)
- Overview of each research direction
- Top 10 papers
- **Reference repo summary** (cite prepare_res.md)
- Recommended reading order

## Key Design Principles

| Principle | Description |
|-----------|-------------|
| **Incremental processing** | Each search term independently completes search->filter->download->metadata, avoiding context bloat |
| **Metadata-driven** | Classification based on `_meta/*.json`, not large in-memory lists |
| **Folders as categories** | Clustering results reflected by `papers/{direction}/` structure |

## Tools

| Tool | Purpose |
|------|---------|
| `arxiv_search` | Search papers (no side effects) |
| `arxiv_download` | Download .tex/.pdf (requires absolute path) |
