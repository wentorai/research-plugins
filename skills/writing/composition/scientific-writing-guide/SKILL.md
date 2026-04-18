---
name: scientific-writing-guide
description: "Curated tools and techniques for scientific writing beyond LaTeX"
metadata:
  openclaw:
    emoji: "🖊"
    category: "writing"
    subcategory: "composition"
    keywords: ["scientific writing", "academic writing", "writing tools", "manuscript preparation", "AI writing workflow", "prose quality"]
    source: "https://github.com/writing-resources/awesome-scientific-writing"
---

# Scientific Writing Guide

## Overview

Scientific writing is a specialized skill that demands clarity, precision, and adherence to disciplinary conventions. Whether you are drafting a journal article, conference paper, or grant proposal, the quality of your prose directly influences how reviewers and readers perceive your research.

This guide distills best practices from the awesome-scientific-writing community (920+ stars) and supplements them with actionable techniques for structuring papers, writing compelling titles and abstracts, choosing the right authoring tools, and polishing manuscripts to publication quality. The focus is on practical, tool-agnostic advice that works across STEM and social-science disciplines.

Modern scientific writing extends well beyond LaTeX. Markdown-based workflows (Pandoc, Quarto, Jupyter Book), collaborative platforms (Overleaf, HackMD), and reference managers (Zotero, Paperpile) have reshaped how researchers draft and publish. This skill helps you navigate these options and adopt a workflow that fits your team.

## Structuring a Research Paper

A well-structured paper guides the reader from problem to contribution with minimal friction. The standard IMRaD (Introduction, Methods, Results, and Discussion) skeleton remains the default for empirical work, but variations exist for theoretical, review, and systems papers.

### The IMRaD Skeleton

| Section | Purpose | Typical Length |
|---------|---------|---------------|
| Title | Concise summary of contribution | 8-15 words |
| Abstract | Self-contained overview | 150-300 words |
| Introduction | Context, gap, contribution | 1-2 pages |
| Related Work | Position within the field | 1-2 pages |
| Methods | Reproducible description | 2-4 pages |
| Results | Empirical findings | 2-3 pages |
| Discussion | Interpretation and limitations | 1-2 pages |
| Conclusion | Takeaways and future work | 0.5-1 page |

### Step-by-Step Drafting Process

1. **Outline first.** Write one sentence per section summarizing its core message.
2. **Draft figures and tables early.** These anchor your results and drive the narrative.
3. **Write Methods before Results.** Describing what you did is easier than interpreting outcomes.
4. **Draft the Introduction last.** By then you know exactly what contribution to advertise.
5. **Iterate on the Abstract.** It is the single most-read part of any paper.

## Writing Titles and Abstracts

### Titles

A strong title is specific, informative, and free of jargon abbreviations. Compare:

- Weak: "A Study of Neural Networks for NLP"
- Strong: "Attention Is All You Need: Replacing Recurrence with Self-Attention for Sequence Transduction"

Rules of thumb:

- Include the method and the domain.
- Avoid questions unless the answer is surprising.
- Keep it under 15 words for most venues.

### Abstracts

Use the four-sentence abstract formula:

1. **Context** -- What is the broad problem area?
2. **Gap** -- What specific problem remains unsolved?
3. **Approach** -- What did you do?
4. **Result** -- What did you find, and why does it matter?

Example template:

```
[Domain] faces the challenge of [problem]. Existing approaches [limitation].
We propose [method], which [key innovation]. Experiments on [benchmarks]
show that [method] achieves [metric improvements], demonstrating [significance].
```

## Authoring Tools and Workflows

### Markdown + Pandoc Pipeline

For researchers who prefer plain text and version control:

```bash
# Convert Markdown to PDF via LaTeX
pandoc paper.md \
  --citeproc \
  --bibliography refs.bib \
  --csl ieee.csl \
  --pdf-engine=xelatex \
  -o paper.pdf

# Convert to DOCX for collaborators
pandoc paper.md \
  --citeproc \
  --bibliography refs.bib \
  -o paper.docx
```

### Quarto for Reproducible Documents

Quarto extends R Markdown to Python, Julia, and Observable JS:

```yaml
# _quarto.yml
project:
  type: manuscript

manuscript:
  article: paper.qmd

format:
  html: default
  pdf:
    template: elsevier.tex
```

### Tool Comparison

| Tool | Best For | Collaboration | Version Control |
|------|----------|---------------|-----------------|
| Overleaf | LaTeX teams | Real-time | Git integration |
| Quarto | Code + prose | Git | Native |
| Google Docs | Non-technical coauthors | Real-time | Suggest mode |
| Typst | Fast typesetting | Git | Native |

## Grammar and Style Tools

**Automated Checking**
- LanguageTool: open-source grammar, style, and spell checker with academic English support
- Vale: prose linter that enforces writing style guides (Microsoft, Google, academic custom)
- textlint: pluggable text linting framework with rules for technical writing
- write-good: naive linter for English prose focusing on common writing issues
- proselint: linter for prose that checks for jargon, cliches, and logical errors

**Style Guides for Science**
- APA Publication Manual: standard for social sciences
- Chicago Manual of Style: comprehensive general reference
- ACS Style Guide: standard for chemistry publications
- IEEE Editorial Style Manual: standard for engineering and computer science
- Nature's guide for authors: concise scientific style reference

## Reference Management

- Zotero: free, open-source, with extensive plugin ecosystem
- Mendeley: integrated with Elsevier databases, PDF annotation support
- JabRef: open-source, BibTeX-native reference manager
- Paperpile: lightweight, Google Docs and browser integration
- citeproc: processes citations in any of 10,000+ CSL styles
- Better BibTeX for Zotero: enhanced BibTeX export with stable citation keys

## AI-Assisted Drafting Workflow

### Recommended Drafting Order

1. **Methods** -- Most straightforward; describe what you did
2. **Results** -- Present findings; closely tied to your figures and tables
3. **Discussion** -- Interpret results; requires the most original thinking
4. **Introduction** -- Frame the paper; easier to write once you know what you are introducing
5. **Abstract** -- Compress the whole paper; write last
6. **Title** -- Refine based on the actual content

### Prompting Strategy

When using an LLM to draft sections, provide rich context: your outline, detailed notes, target venue, approximate word count, and explicit constraints (e.g., "Do not invent any details not present in my notes"). After generating any section, review for accuracy, completeness, consistency with the rest of the paper, and voice.

### Iterative Revision Prompts

- **Tighten prose**: "Reduce this paragraph by 30% while preserving all key information."
- **Strengthen transitions**: "Add a transition sentence between these two paragraphs that connects [concept A] to [concept B]."
- **Clarify technical content**: "Rewrite this paragraph for a reader who understands [field] but is not familiar with [specific technique]."
- **Hedging calibration**: "Review this paragraph and ensure claims are appropriately hedged based on the strength of the evidence."

### Self-Review Checklist

Before submitting for peer review or to a journal, verify:

- Title is specific and informative
- Abstract contains all four elements (context, gap, approach, result)
- All figures have descriptive captions
- All acronyms defined at first use
- Reference list is complete and correctly formatted
- No placeholder text remains (search for "TODO", "XXX", "TBD")
- Page limits and formatting requirements met
- Author contributions and acknowledgments included
- Supplementary materials organized and referenced

### Common AI Writing Pitfalls

- **Generic hedging**: AI models overuse phrases like "It is worth noting that" and "Interestingly." Remove these.
- **Circular definitions**: AI sometimes defines a term using the term itself. Check all definitions.
- **False confidence**: AI may present uncertain conclusions with unwarranted certainty. Calibrate claims to your evidence.
- **Homogeneous sentence structure**: AI-generated text often falls into repetitive Subject-Verb-Object patterns. Vary your sentence structure.
- **Missing specifics**: AI may write "significant improvement" without the actual numbers. Always insert your real data.

## Common Pitfalls and How to Avoid Them

1. **Passive voice overuse.** "The experiment was conducted" vs. "We conducted the experiment." Active voice is shorter and clearer.
2. **Hedging inflation.** One "may" per paragraph is enough. Stacking "might potentially possibly" weakens your claims.
3. **Undefined acronyms.** Always expand on first use: "Large Language Model (LLM)."
4. **Figure-text mismatch.** Every figure must be referenced in the text, and the text must add interpretation beyond what the figure shows.
5. **Citation dumps.** "[1-15]" without commentary is unhelpful. Group citations by contribution type: "Prior work on X [1,2] addressed Y, while [3,4] focused on Z."

## Best Practices

- **Write every day.** Even 30 minutes of daily writing accumulates faster than weekend marathons.
- **Use a reference manager.** Zotero or Paperpile with browser extensions save hours of manual BibTeX entry.
- **Get feedback early.** Share outlines and rough drafts before polishing prose.
- **Read your paper aloud.** Awkward phrasing becomes obvious when spoken.
- **Check venue requirements before submission.** Page limits, formatting templates, and supplementary material policies vary widely.
- **Use grammar tools as a second pass.** Grammarly, LanguageTool, or Writefull catch errors humans miss, but do not replace human review.

## References

- [awesome-scientific-writing](https://github.com/writing-resources/awesome-scientific-writing) -- Curated list of tools and resources (920+ stars)
- [How to Write a Great Research Paper](https://www.microsoft.com/en-us/research/academic-program/write-great-research-paper/) -- Simon Peyton Jones, Microsoft Research
- [The Science of Scientific Writing](https://www.americanscientist.org/blog/the-long-view/the-science-of-scientific-writing) -- Gopen and Swan, American Scientist
- [Improving Your Scientific Writing](https://lijunsun.github.io/files/ScientificWritingV39.pdf) -- Lijun Sun, McGill University
- [Three Sins of Authors in CS and Math](http://www.cs.cmu.edu/~jrs/sins.html) -- Jonathan Shewchuk, UC Berkeley
