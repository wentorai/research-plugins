---
name: corvus-research-guide
description: "Multi-agent AI research with semantic search and citation snowballing"
metadata:
  openclaw:
    emoji: "🐦‍⬛"
    category: "research"
    subcategory: "deep-research"
    keywords: ["Corvus", "multi-agent", "semantic search", "citation snowballing", "research synthesis", "AI research"]
    source: "https://github.com/corvus-research/corvus"
---

# Corvus Research Guide

## Overview

Corvus is a multi-agent AI research system that combines semantic search, forward/backward citation snowballing, and synthesis to conduct thorough literature investigations. It iteratively expands search results by following citation chains, identifies research gaps, and generates structured research briefs with full provenance.

## Architecture

### Agent Pipeline

```
Query → Semantic Search Agent
           ↓
     Citation Snowball Agent (forward + backward)
           ↓
     Relevance Filter Agent
           ↓
     Synthesis Agent
           ↓
     Report with Citation Graph
```

### Key Features

1. **Semantic search**: Uses embedding-based search across Semantic Scholar, OpenAlex
2. **Citation snowballing**: Iteratively follows references (backward) and citations (forward) to discover related work
3. **Relevance scoring**: AI-based relevance assessment at each expansion step
4. **Provenance tracking**: Every claim linked to source papers
5. **Gap identification**: Identifies under-explored research areas

## Usage

```python
from corvus import ResearchAgent

agent = ResearchAgent(
    llm_provider="anthropic",
    search_backends=["semantic_scholar", "openalex"],
    max_snowball_depth=2,
)

# Conduct deep research
result = agent.research(
    query="What are the current approaches to continual learning "
          "in large language models?",
    initial_papers=20,
    snowball_per_paper=5,
)

# Access results
print(f"Papers found: {len(result.papers)}")
print(f"Unique clusters: {len(result.clusters)}")
print(f"\nSynthesis:\n{result.synthesis}")

# Export citation graph
result.export_graph("citation_network.gexf")

# Export bibliography
result.export_bibtex("references.bib")
```

### Snowballing Configuration

```python
agent = ResearchAgent(
    snowball_config={
        "max_depth": 3,           # Citation chain depth
        "backward_limit": 10,     # References per paper
        "forward_limit": 10,      # Citations per paper
        "relevance_threshold": 0.7,  # Min relevance to continue
        "year_filter": 2020,      # Only papers from 2020+
    }
)
```

### Research Modes

```python
# Broad survey mode
result = agent.research(query, mode="survey",
                        initial_papers=50)

# Focused deep-dive
result = agent.research(query, mode="focused",
                        initial_papers=10,
                        snowball_depth=3)

# Gap analysis
result = agent.research(query, mode="gap_analysis")
# Returns underexplored subtopics and suggested directions
```

## Output Format

```python
# Structured research brief
brief = result.generate_brief()

# Contains:
# - Research question
# - Methodology (search strategy, databases, snowball depth)
# - Key themes (clustered by topic)
# - Timeline (research evolution over time)
# - Gap analysis (underexplored areas)
# - Bibliography (all papers with citation counts)

brief.save("research_brief.md")
```

## Use Cases

1. **Literature reviews**: Comprehensive coverage via snowballing
2. **Research gap identification**: Find underexplored subtopics
3. **Trend analysis**: Track research evolution through citation chains
4. **Grant proposals**: Quick evidence of research need

## References

- [Corvus GitHub](https://github.com/corvus-research/corvus)
- Wohlin, C. (2014). "Guidelines for snowballing in systematic literature studies." *EASE 2014*.
