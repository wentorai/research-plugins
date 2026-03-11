---
name: pasa-paper-search-guide
description: "Advanced paper search agent powered by LLMs for literature discovery"
version: 1.0.0
author: wentor-community
source: https://github.com/pasa-agent/pasa
metadata:
  openclaw:
    category: "literature"
    subcategory: "search"
    keywords:
      - paper-search
      - literature-discovery
      - semantic-search
      - citation-graph
      - academic-databases
      - query-expansion
---

# PASA Paper Search Guide

A skill for conducting advanced academic paper searches using LLM-powered query expansion, semantic ranking, and citation-graph exploration. Based on the PASA project (2K stars), this skill transforms simple research questions into comprehensive, systematic literature discovery workflows.

## Overview

Finding relevant papers is the foundation of all academic research, yet traditional keyword searches miss semantically related work, and manual citation chasing is time-consuming. PASA addresses this by combining LLM-driven query understanding with multi-source search and intelligent result ranking. The agent acts as a search co-pilot, helping researchers cast a wide net and then systematically narrow results to the most relevant papers.

This skill is designed for researchers at any career stage who want to go beyond simple database searches and build thorough, reproducible literature collections for reviews, grant proposals, or new research directions.

## Search Strategy Design

Before executing any search, the agent helps researchers design a comprehensive strategy:

**Query Formulation**
- Decompose the research question into key concepts and their relationships
- Identify primary terms, synonyms, and related terminology for each concept
- Consider field-specific jargon and cross-disciplinary terminology differences
- Build Boolean query strings combining concepts with AND/OR operators
- Generate semantic search queries in natural language for embedding-based retrieval

**Source Selection**
- Identify appropriate databases for the research domain (Semantic Scholar, OpenAlex, PubMed, IEEE Xplore, ACL Anthology, arXiv, SSRN)
- Consider preprint servers alongside peer-reviewed databases
- Include grey literature sources when appropriate (dissertations, reports, conference proceedings)
- Plan for cross-database deduplication
- Document the search date and database coverage dates

**Scope Definition**
- Set date range filters based on the research question
- Define inclusion and exclusion criteria before searching
- Specify language restrictions and justify them
- Determine minimum quality thresholds (peer-review status, impact metrics)
- Plan the stopping rule (saturation, maximum count, date boundary)

## Execution Workflow

The search execution follows a systematic multi-phase approach:

**Phase 1: Broad Sweep**
- Execute the designed queries across all selected databases
- Collect metadata (title, authors, abstract, venue, year, citation count)
- Record the number of results per query per database
- Remove exact duplicates using DOI and title matching
- Generate initial statistics (total results, date distribution, venue distribution)

**Phase 2: Semantic Ranking**
- Encode the research question and all abstracts into embedding space
- Rank results by semantic similarity to the core research question
- Identify clusters of thematically similar papers
- Flag highly cited papers that appear in multiple query results
- Surface unexpected but potentially relevant papers from the long tail

**Phase 3: Citation Expansion**
- For the top-ranked papers, retrieve their reference lists
- For the top-ranked papers, retrieve papers that cite them
- Apply the same relevance ranking to newly discovered papers
- Identify "hub" papers that connect multiple research threads
- Detect seminal works that appear frequently in citation chains

**Phase 4: Snowball Refinement**
- Check if newly discovered papers introduce terminology not in original queries
- If so, formulate additional queries with the new terms
- Repeat until reaching saturation (no significant new papers discovered)
- Document the complete search trail for reproducibility

## Result Analysis

After search completion, the agent assists with analyzing the collected papers:

**Bibliometric Overview**
- Publication year distribution showing research activity trends
- Venue distribution identifying key journals and conferences
- Author co-occurrence networks highlighting prolific researchers
- Geographic distribution of research institutions
- Citation network statistics (density, clustering coefficient)

**Thematic Mapping**
- Cluster papers by topic using abstract embeddings
- Generate descriptive labels for each cluster
- Identify emerging themes with recent publication dates and low citation counts
- Map established themes with high citation density
- Highlight cross-cluster papers that bridge different research streams

**Gap Identification**
- Compare the thematic map against the original research question
- Identify aspects of the question with sparse literature coverage
- Note methodological approaches that are underrepresented
- Flag populations or contexts that have been understudied
- Suggest how identified gaps might shape the research direction

## PRISMA Compliance

For systematic reviews, the skill supports PRISMA-compliant reporting:

- Generate PRISMA flow diagrams with counts at each stage
- Document reasons for exclusion at each screening phase
- Track inter-rater agreement for screening decisions
- Produce exportable search documentation for supplementary materials
- Support both traditional and updated PRISMA 2020 guidelines

## Integration with Research-Claw

This skill connects seamlessly with the Research-Claw ecosystem:

- Export discovered papers to reference management tools (Zotero, BibTeX)
- Feed search results to the paper-to-agent skill for deep analysis
- Connect with writing skills for automated literature review drafting
- Store search strategies as reproducible templates for future use
- Share curated paper collections with collaborators via the platform

## Practical Tips

- Start broad and narrow incrementally rather than beginning with narrow searches
- Always search at least two independent databases to avoid source bias
- Record every query variation and its result count for the search audit trail
- Use citation-based expansion to discover older foundational works
- Check the references of the most recent relevant review articles
- Set calendar reminders to re-run searches periodically for living reviews
