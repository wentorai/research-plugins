---
name: opendraft-thesis-guide
description: "AI thesis writer with specialized agents and verified citations"
metadata:
  openclaw:
    emoji: "📖"
    category: "writing"
    subcategory: "composition"
    keywords: ["thesis writing", "AI writer", "multi-agent", "dissertation", "academic writing", "verified citations"]
    source: "https://github.com/federicodeponte/opendraft"
---

# OpenDraft Thesis Writing Guide

## Overview

OpenDraft is an AI-powered thesis and dissertation writing assistant that uses 19 specialized agents to produce long-form academic documents with verified citations. Each agent handles a specific aspect — outline generation, literature integration, argument construction, methodology writing, and citation verification. Produces coherent multi-chapter documents while ensuring all references are real and accessible.

## Agent Architecture

```
User Input (topic, outline, notes)
         ↓
  Orchestrator Agent
  ├── Outline Agent (structure chapters)
  ├── Literature Agent (find relevant papers)
  ├── Introduction Agent (background + motivation)
  ├── Theory Agent (theoretical framework)
  ├── Methodology Agent (research design)
  ├── Analysis Agent (results + discussion)
  ├── Conclusion Agent (summary + future work)
  ├── Citation Agent (verify all references)
  ├── Consistency Agent (terminology + notation)
  ├── Style Agent (academic tone + flow)
  └── Formatting Agent (LaTeX/Markdown output)
         ↓
  Verified Thesis Document
```

## Usage

```python
from opendraft import ThesisWriter

writer = ThesisWriter(
    llm_provider="anthropic",
    citation_backend="semantic_scholar",
)

# Generate thesis from topic and outline
thesis = writer.write(
    title="Efficient Attention Mechanisms for Long-Document "
          "Understanding",
    outline={
        "chapters": [
            {"title": "Introduction",
             "points": ["Motivation", "Research questions",
                        "Contributions"]},
            {"title": "Background",
             "points": ["Transformer architecture",
                        "Attention complexity",
                        "Existing solutions"]},
            {"title": "Methodology",
             "points": ["Proposed approach",
                        "Architecture design",
                        "Training procedure"]},
            {"title": "Experiments",
             "points": ["Datasets", "Baselines", "Results"]},
            {"title": "Discussion",
             "points": ["Analysis", "Limitations",
                        "Future work"]},
            {"title": "Conclusion",
             "points": ["Summary", "Implications"]},
        ],
    },
    notes_dir="./research_notes/",
    bibliography="references.bib",
    target_pages=80,
)

thesis.save("thesis.tex")
thesis.save("thesis.md")
```

## Citation Verification

```python
# All citations are verified against real databases
verification = thesis.citation_report()

print(f"Total citations: {verification.total}")
print(f"Verified (DOI): {verification.verified_doi}")
print(f"Verified (title match): {verification.verified_title}")
print(f"Unverified: {verification.unverified}")

# List unverified citations
for cite in verification.unverified_list:
    print(f"  WARNING: {cite.key} — {cite.reason}")

# All verified references have real DOIs
for cite in verification.verified_list[:5]:
    print(f"  OK: {cite.key} — DOI: {cite.doi}")
```

## Chapter-by-Chapter Writing

```python
# Write individual chapters with full context
chapter = writer.write_chapter(
    chapter_title="Methodology",
    preceding_chapters=["introduction.tex", "background.tex"],
    key_points=[
        "Describe the sparse attention pattern learning algorithm",
        "Formal complexity analysis: O(n * sqrt(n))",
        "Training with progressive sequence length curriculum",
    ],
    target_length=5000,  # words
    include_figures=True,
)

print(chapter.text[:500])
print(f"Citations used: {len(chapter.citations)}")
print(f"Figures generated: {len(chapter.figures)}")
```

## Literature Integration

```python
# Automatically weave citations into text
section = writer.write_with_literature(
    topic="linear attention mechanisms",
    style="survey",    # survey, argumentative, analytical
    max_papers=20,
    recency_bias=0.7,  # Prefer recent papers
)

# Literature agent:
# 1. Searches Semantic Scholar for relevant papers
# 2. Reads abstracts and key findings
# 3. Groups papers by approach/contribution
# 4. Weaves into coherent narrative with citations
```

## Revision and Editing

```python
# Iterative revision
revised = writer.revise(
    manuscript="thesis.tex",
    feedback=[
        "Strengthen the motivation in Chapter 1",
        "Add more quantitative comparisons in Chapter 4",
        "The notation in Chapter 3 is inconsistent with Chapter 2",
    ],
)

# Style check
style_issues = writer.check_style("thesis.tex")
for issue in style_issues:
    print(f"[{issue.type}] Ch.{issue.chapter}, "
          f"p.{issue.paragraph}: {issue.suggestion}")
```

## Configuration

```python
writer = ThesisWriter(
    llm_provider="anthropic",
    model="claude-sonnet-4-20250514",
    writing_config={
        "person": "first_plural",    # "we"
        "tense": "present",
        "formality": "high",
        "hedging": "moderate",
    },
    citation_config={
        "style": "natbib",
        "verify_all": True,
        "min_citations_per_chapter": 10,
    },
    output_config={
        "format": "latex",
        "template": "university_thesis",
        "font": "times",
        "line_spacing": 1.5,
    },
)
```

## Use Cases

1. **Thesis drafting**: Generate first drafts of thesis chapters
2. **Literature review**: AI-assisted literature review sections
3. **Revision assistance**: Iterative feedback-based revision
4. **Citation management**: Verified, real citations throughout
5. **Template generation**: Structured academic document scaffolding

## References

- [OpenDraft GitHub](https://github.com/federicodeponte/opendraft)
