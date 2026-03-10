---
name: foam-agent-guide
description: "Agent for automated knowledge graph building from research notes"
metadata:
  openclaw:
    emoji: "🫧"
    category: "research"
    subcategory: "automation"
    keywords: ["Foam", "knowledge graph", "Zettelkasten", "research notes", "linked notes", "PKM agent"]
    source: "https://github.com/foambubble/foam"
---

# Foam Agent Guide

## Overview

Foam is a personal knowledge management and note-sharing system built on VS Code, inspired by Roam Research. This guide covers using AI agents to automate Foam-based research workflows — extracting concepts from papers, building knowledge graphs, discovering connections between notes, and maintaining a Zettelkasten-style research knowledge base. Particularly useful for researchers managing large literature collections.

## Foam Basics

### Workspace Structure

```
research-foam/
├── .foam/
│   └── config.json          # Foam configuration
├── .vscode/
│   └── settings.json        # VS Code settings
├── inbox/                   # Unprocessed notes
├── literature/              # Paper notes (one per paper)
├── concepts/                # Concept/topic notes
├── projects/                # Project-specific notes
├── daily/                   # Daily research journal
└── README.md                # Graph entry point
```

### Note Format

```markdown
# Attention Mechanism

Tags: #transformer #nlp #deep-learning

## Summary
The attention mechanism allows models to focus on relevant parts
of the input sequence when producing output.

## Key Concepts
- [[self-attention]] computes relationships within a sequence
- [[cross-attention]] relates two different sequences
- [[multi-head-attention]] runs parallel attention functions

## References
- [[vaswani-2017-attention]] — original Transformer paper
- [[bahdanau-2015-attention]] — attention for NMT

## Related
- [[transformer-architecture]]
- [[positional-encoding]]
```

## Automated Note Generation

```python
from foam_agent import FoamAgent

agent = FoamAgent(
    workspace="./research-foam",
    llm_provider="anthropic",
)

# Generate literature note from PDF
note = agent.process_paper(
    pdf_path="papers/vaswani2017attention.pdf",
    template="literature",
)
# Creates: literature/vaswani-2017-attention.md
# - Extracts title, authors, year, venue
# - Summarizes key contributions
# - Identifies main concepts → [[wikilinks]]
# - Adds BibTeX reference

# Batch process papers directory
agent.process_papers_batch(
    input_dir="papers/",
    output_dir="literature/",
    skip_existing=True,
)
```

## Knowledge Graph Building

```python
# Discover connections between notes
connections = agent.discover_connections(
    scope="literature/",
    min_similarity=0.7,
)

for conn in connections:
    print(f"{conn.source} ↔ {conn.target}")
    print(f"  Reason: {conn.reason}")
    print(f"  Similarity: {conn.score:.2f}")

# Auto-insert wikilinks for discovered connections
agent.link_notes(connections, mode="suggest")
# Adds [[suggested-link]] with <!-- foam:auto --> comment

# Build concept map from literature notes
concept_map = agent.build_concept_map(
    scope="literature/",
    min_mentions=3,
)
for concept in concept_map.nodes:
    print(f"{concept.name}: mentioned in {concept.count} papers")
```

## Daily Research Journal

```python
# Generate daily note with research context
agent.create_daily_note(
    include=[
        "recent_papers",        # Papers read recently
        "open_questions",       # Unresolved questions from notes
        "stale_notes",          # Notes not updated in 30+ days
        "orphan_notes",         # Notes with no incoming links
        "suggested_reading",    # Papers related to recent work
    ],
)

# Output: daily/2025-03-10.md
# ## Recently Added
# - [[vaswani-2017-attention]] (added yesterday)
#
# ## Open Questions
# - How does [[rotary-position-embedding]] compare to [[alibi]]?
#
# ## Suggested Reading
# Based on recent notes on [[flash-attention]], consider:
# - "FlashAttention-2: Faster Attention" (Dao, 2023)
```

## Graph Analysis

```python
# Analyze knowledge graph structure
stats = agent.analyze_graph()

print(f"Total notes: {stats.total_notes}")
print(f"Total links: {stats.total_links}")
print(f"Orphan notes: {stats.orphan_count}")
print(f"Most connected: {stats.top_nodes[:5]}")
print(f"Clusters: {stats.cluster_count}")

# Identify research gaps
gaps = agent.find_gaps()
for gap in gaps:
    print(f"Gap: {gap.description}")
    print(f"  Between clusters: {gap.cluster_a} ↔ {gap.cluster_b}")
    print(f"  Suggested topics: {gap.suggested_topics}")
```

## Configuration

```json
{
  "foam.agent": {
    "llm_provider": "anthropic",
    "templates": {
      "literature": "templates/literature.md",
      "concept": "templates/concept.md",
      "daily": "templates/daily.md"
    },
    "auto_link": {
      "enabled": true,
      "min_similarity": 0.75,
      "max_suggestions_per_note": 5
    },
    "graph": {
      "exclude_patterns": ["daily/*", "templates/*"],
      "tag_colors": {
        "transformer": "#3B82F6",
        "nlp": "#10B981"
      }
    }
  }
}
```

## Use Cases

1. **Literature management**: Auto-generate linked notes from papers
2. **Concept mapping**: Build and visualize research concept graphs
3. **Research journaling**: AI-assisted daily research summaries
4. **Gap discovery**: Find under-explored connections between topics
5. **Collaborative wikis**: Shared team research knowledge bases

## References

- [Foam GitHub](https://github.com/foambubble/foam)
- [Foam Documentation](https://foambubble.github.io/foam/)
- [Zettelkasten Method](https://zettelkasten.de/introduction/)
