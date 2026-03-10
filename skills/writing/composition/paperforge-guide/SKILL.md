---
name: paperforge-guide
description: "AI-assisted academic paper drafting and structuring tool"
metadata:
  openclaw:
    emoji: "🔨"
    category: "writing"
    subcategory: "composition"
    keywords: ["paper writing", "academic drafting", "paper generation", "manuscript", "structured writing", "AI writing"]
    source: "https://github.com/paperforge/paperforge"
---

# PaperForge Guide

## Overview

PaperForge is an AI-assisted academic paper drafting tool that helps researchers structure, draft, and refine manuscripts. It generates section-by-section drafts from outlines and notes, ensures consistent academic tone, manages citation integration, and provides iterative refinement. Designed to accelerate the writing process while keeping researchers in control of content and argumentation.

## Writing Pipeline

```
Research Notes + Outline
         ↓
   Structure Planning (sections, flow, arguments)
         ↓
   Section Drafting (introduction → conclusion)
         ↓
   Citation Integration (inline refs from .bib)
         ↓
   Consistency Check (terminology, notation, tone)
         ↓
   Revision Suggestions (clarity, flow, gaps)
         ↓
   Final Manuscript
```

## Usage

```python
from paperforge import PaperForge

forge = PaperForge(llm_provider="anthropic")

# Draft from outline and notes
manuscript = forge.draft(
    title="Efficient Attention Mechanisms for Long Documents",
    outline={
        "introduction": "Transformers limited by quadratic attention. "
                        "Need sub-quadratic alternatives for long docs.",
        "related_work": "Linear attention, sparse attention, "
                        "low-rank approximations.",
        "method": "Our approach: learned sparse patterns + "
                  "sliding window hybrid.",
        "experiments": "Long Range Arena benchmark + document "
                       "classification tasks.",
        "conclusion": "2x speedup, comparable accuracy.",
    },
    notes_dir="./research_notes/",
    bibliography="references.bib",
)

manuscript.save("draft.tex")
```

## Section-by-Section Drafting

```python
# Draft individual sections with context
intro = forge.draft_section(
    section="introduction",
    key_points=[
        "Transformer attention is O(n^2) in sequence length",
        "Long documents (>4096 tokens) are common in practice",
        "Existing solutions trade quality for efficiency",
        "Our contribution: learned sparse patterns",
    ],
    style="narrative",      # narrative, technical, concise
    target_length=800,      # approximate word count
    bibliography="refs.bib",
)

print(intro.text)
print(f"Citations used: {intro.citations}")
```

## Outline Generation

```python
# Generate outline from abstract or notes
outline = forge.generate_outline(
    abstract="We propose a novel attention mechanism that combines "
             "learned sparse patterns with sliding window attention "
             "to achieve sub-quadratic complexity while maintaining "
             "accuracy on long document tasks.",
    paper_type="conference",  # conference, journal, workshop
    target_venue="NeurIPS",
)

for section in outline.sections:
    print(f"\n## {section.title}")
    for point in section.key_points:
        print(f"  - {point}")
    print(f"  Target length: {section.target_words} words")
```

## Citation Integration

```python
# Automatic citation placement
section_with_cites = forge.integrate_citations(
    text=draft_text,
    bibliography="references.bib",
    style="authoryear",  # or "numeric"
    strategy="relevant",  # place citations where claims need support
)

# Citation suggestions for unsupported claims
suggestions = forge.suggest_citations(
    text=draft_text,
    bibliography="references.bib",
)
for s in suggestions:
    print(f"Claim: '{s.claim[:60]}...'")
    print(f"  Suggested: {s.suggested_refs}")
```

## Revision and Refinement

```python
# Get revision suggestions
revisions = forge.review(
    manuscript="draft.tex",
    checks=[
        "clarity",           # Unclear sentences
        "consistency",       # Terminology and notation
        "flow",              # Logical transitions
        "redundancy",        # Repeated content
        "claim_support",     # Unsupported claims
        "passive_voice",     # Overuse of passive
    ],
)

for rev in revisions:
    print(f"[{rev.category}] Line {rev.line}: {rev.suggestion}")
    print(f"  Original: {rev.original}")
    print(f"  Suggested: {rev.revised}")

# Apply selected revisions
manuscript = forge.apply_revisions(
    "draft.tex",
    revisions=[r for r in revisions if r.category == "clarity"],
)
```

## Template Support

```python
# Write to specific venue templates
manuscript = forge.draft(
    outline=outline,
    template="neurips2025",  # or "icml", "acl", "ieee", "arxiv"
    formatting={
        "max_pages": 9,       # Excluding references
        "abstract_words": 200,
        "font": "times",
    },
)

# Available templates
templates = forge.list_templates()
# ["neurips2025", "icml2025", "acl2025", "ieee_conference",
#  "arxiv_preprint", "elegantpaper", "springer_lncs"]
```

## Configuration

```python
forge = PaperForge(
    llm_provider="anthropic",
    model="claude-sonnet-4-20250514",
    writing_config={
        "tone": "formal_academic",
        "person": "first_plural",    # "we propose..."
        "tense": "present",          # for methods/results
        "hedging": "moderate",       # "may", "suggests", "appears"
    },
    citation_config={
        "style": "natbib",
        "max_refs_per_claim": 3,
    },
)
```

## Use Cases

1. **First drafts**: Generate initial manuscript from structured notes
2. **Section expansion**: Flesh out outline into full sections
3. **Revision assistance**: Systematic review for clarity and consistency
4. **Template conversion**: Reformat between venue styles
5. **Citation management**: Automated placement and gap detection

## References

- [PaperForge GitHub](https://github.com/paperforge/paperforge)
- [LaTeX Templates](https://www.latextemplates.com/)
