---
name: paper-digest-guide
description: "Fetch paper and spawn sub-agents to read citations recursively"
metadata:
  openclaw:
    emoji: "🔗"
    category: "research"
    subcategory: "paper-review"
    keywords: ["citation analysis", "recursive reading", "paper digestion", "citation graph", "reference mining", "snowball search"]
    source: "https://github.com/AcademicSkills/paper-digest-guide"
---

# Paper Digest Guide

A skill for deeply digesting academic papers by recursively following and analyzing their citation networks. Starting from a seed paper, it spawns sub-tasks to read the most important cited references, extracts the intellectual lineage of key claims, and builds a citation-aware knowledge graph that shows how ideas developed and where the research frontier stands.

## Overview

A single paper rarely tells the full story. Key claims rest on cited evidence, methodologies build on prior work, and the significance of findings depends on what came before. The Paper Digest approach addresses this by not just reading a paper but also selectively reading its most important references, and optionally their references, building a multi-level understanding of the intellectual context. This process, often called "citation snowballing" or "reference mining," is one of the most effective ways to deeply understand a research area.

The skill implements a controlled recursive reading strategy with configurable depth (typically 1-2 levels) and breadth (top 5-10 most relevant citations per paper). It produces a citation knowledge graph annotating each reference with its role in the seed paper's argument, along with a synthesis report that traces the evolution of key ideas.

## Citation Digestion Pipeline

### Pipeline Architecture

```
Seed Paper
  │
  ├── Parse references (extract all citations)
  │
  ├── Classify citation role for each reference
  │   ├── Foundational (key theory/framework the paper builds on)
  │   ├── Methodological (method the paper adopts/adapts)
  │   ├── Empirical (prior findings the paper extends)
  │   ├── Contrasting (work the paper disagrees with)
  │   └── Peripheral (background/context, low priority)
  │
  ├── Prioritize: rank by role importance + citation count
  │
  ├── Spawn sub-reads for top-N references
  │   ├── Sub-read 1: [Foundational paper] → structured summary
  │   ├── Sub-read 2: [Key method paper] → structured summary
  │   ├── Sub-read 3: [Contrasting paper] → structured summary
  │   └── ...
  │
  ├── (Optional) Depth 2: repeat for sub-read citations
  │
  └── Synthesize: build citation knowledge graph + narrative
```

### Citation Role Classification

```python
def classify_citation_role(citation_context: str, paper_section: str) -> str:
    """
    Classify the role of a citation based on its context in the paper.

    Args:
        citation_context: The sentence(s) containing the citation
        paper_section: Which section the citation appears in
    """
    # Heuristic classification based on section and language
    role_indicators = {
        'foundational': {
            'sections': ['introduction', 'background', 'related work'],
            'phrases': ['builds on', 'based on', 'following', 'framework of',
                       'theory proposed by', 'seminal work']
        },
        'methodological': {
            'sections': ['methods', 'methodology', 'approach'],
            'phrases': ['we adopt', 'following the approach of', 'using the method',
                       'as proposed by', 'we extend the method']
        },
        'empirical': {
            'sections': ['introduction', 'results', 'discussion'],
            'phrases': ['found that', 'showed that', 'demonstrated',
                       'reported', 'consistent with', 'prior studies']
        },
        'contrasting': {
            'sections': ['introduction', 'related work', 'discussion'],
            'phrases': ['unlike', 'in contrast to', 'however', 'whereas',
                       'disagree', 'limitations of', 'fails to']
        },
        'peripheral': {
            'sections': ['introduction'],
            'phrases': ['for example', 'such as', 'see also', 'e.g.',
                       'for a review see', 'has been studied']
        }
    }

    for role, indicators in role_indicators.items():
        section_match = paper_section.lower() in [s.lower() for s in indicators['sections']]
        phrase_match = any(p in citation_context.lower() for p in indicators['phrases'])
        if section_match and phrase_match:
            return role

    return 'peripheral'  # default
```

## Citation Priority Ranking

### Prioritization Criteria

| Criterion | Weight | Rationale |
|-----------|--------|-----------|
| Citation role: foundational | 5 | Must understand to grasp the paper |
| Citation role: contrasting | 4 | Shows alternative perspectives |
| Citation role: methodological | 4 | Needed to evaluate the approach |
| Citation role: empirical | 3 | Supports key claims |
| Cited multiple times in paper | +2 | Indicates higher importance |
| High citation count (>100) | +1 | Widely recognized work |
| Recent (<3 years old) | +1 | Current state of the art |
| Citation role: peripheral | 1 | Low priority for deep reading |

```python
def rank_citations(citations: list) -> list:
    """
    Rank citations by priority for recursive reading.
    Returns sorted list with top candidates first.
    """
    role_weights = {
        'foundational': 5, 'contrasting': 4, 'methodological': 4,
        'empirical': 3, 'peripheral': 1
    }

    for c in citations:
        score = role_weights.get(c['role'], 1)
        if c.get('times_cited_in_paper', 1) > 1:
            score += 2
        if c.get('global_citations', 0) > 100:
            score += 1
        if c.get('year', 0) >= 2023:
            score += 1
        c['priority_score'] = score

    return sorted(citations, key=lambda x: x['priority_score'], reverse=True)
```

## Recursive Reading Configuration

### Depth and Breadth Control

```yaml
digest_config:
  # Depth: how many levels of citations to follow
  max_depth: 2      # 1 = direct citations only, 2 = citations of citations

  # Breadth: how many citations to read at each level
  top_n_per_level:
    depth_1: 8      # Read top 8 references from seed paper
    depth_2: 3      # Read top 3 references from each depth-1 paper

  # Focus: which citation roles to prioritize
  priority_roles: ["foundational", "methodological", "contrasting"]

  # Read depth for sub-papers
  sub_read_depth: "pass_2"  # pass_1 (survey), pass_2 (comprehension), pass_3 (critical)

  # Termination conditions
  max_total_papers: 30       # Hard cap on total papers read
  stop_on_saturation: true   # Stop when no new concepts are found
```

### Estimated Time and Output

| Depth | Breadth | Papers Read | Time Estimate | Output Size |
|-------|---------|-------------|---------------|-------------|
| 1 | Top 5 | ~6 | 1-2 hours | 3-5 page report |
| 1 | Top 10 | ~11 | 2-4 hours | 5-8 page report |
| 2 | Top 8 + Top 3 | ~30 | 4-8 hours | 10-15 page report |

## Citation Knowledge Graph

### Building the Graph

```python
def build_citation_graph(seed_paper: dict, digested_papers: list) -> dict:
    """
    Build a knowledge graph from the digested papers.
    Nodes are papers, edges are citation relationships with roles.
    """
    graph = {
        'nodes': [],
        'edges': [],
        'clusters': {}
    }

    # Add seed paper as root node
    graph['nodes'].append({
        'id': seed_paper['doi'],
        'label': f"{seed_paper['first_author']} ({seed_paper['year']})",
        'type': 'seed',
        'summary': seed_paper['main_finding']
    })

    # Add digested papers and their relationships
    for paper in digested_papers:
        graph['nodes'].append({
            'id': paper['doi'],
            'label': f"{paper['first_author']} ({paper['year']})",
            'type': 'reference',
            'role': paper['citation_role'],
            'depth': paper['depth_level'],
            'summary': paper['main_finding']
        })
        graph['edges'].append({
            'source': paper['cited_by_doi'],
            'target': paper['doi'],
            'role': paper['citation_role'],
            'context': paper['citation_context']
        })

    return graph
```

### Interpreting the Graph

The resulting knowledge graph reveals:

- **Intellectual lineage**: The chain of foundational works that led to the seed paper.
- **Methodological genealogy**: Which methods were inherited and from where.
- **Debate structure**: Papers on opposing sides of a disagreement, traced through contrasting citations.
- **Convergence points**: Papers cited by multiple branches, indicating central concepts.
- **Research frontier**: Recent papers at the leaves of the graph, indicating current directions.

## Best Practices

- Start with depth 1 and increase only if the topic requires deeper historical context.
- Prioritize contrasting citations; they provide the most critical perspective on the seed paper.
- When a citation cannot be accessed (paywall, unavailable), note it as a gap rather than skipping silently.
- Use the citation knowledge graph to identify your own paper's position in the literature.
- Save the full graph for reuse; it can seed future literature reviews on related topics.
- Cross-check that the seed paper's characterization of cited work is accurate by reading the originals.

## References

- Wohlin, C. (2014). Guidelines for Snowballing in Systematic Literature Studies. *EASE 2014*.
- Greenhalgh, T. & Peacock, R. (2005). Effectiveness and Efficiency of Search Methods. *BMJ*, 331, 1064-1065.
- Chen, C. (2006). CiteSpace II: Detecting and Visualizing Emerging Trends and Transient Patterns. *JASIST*, 57(3), 359-377.
