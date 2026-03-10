---
name: clawphd-guide
description: "Agent for converting papers to diagrams, posters, and videos"
metadata:
  openclaw:
    emoji: "🎬"
    category: "tools"
    subcategory: "diagram"
    keywords: ["paper visualization", "poster generation", "research video", "diagram agent", "visual abstract", "presentation"]
    source: "https://github.com/ZhihaoAIRobotic/ClawPhD"
---

# ClawPhD Guide

## Overview

ClawPhD is an AI agent that converts research papers into visual formats — architecture diagrams, research posters, visual abstracts, and video presentations. It reads paper PDFs, extracts key concepts and results, and generates publication-ready visual materials. Useful for conference presentations, social media dissemination, and research communication.

## Features

```
Paper PDF / LaTeX
      ↓
  Content Extraction Agent
  ├── Key contributions
  ├── Architecture / method
  ├── Results tables and figures
  └── Abstract and conclusions
      ↓
  Visual Generation Agent
  ├── Architecture diagram (SVG/PNG)
  ├── Research poster (A0 PDF)
  ├── Visual abstract (social media)
  ├── Slide deck (Beamer/PPTX)
  └── Video narration (MP4)
```

## Usage

```python
from clawphd import ClawPhD

agent = ClawPhD(llm_provider="anthropic")

# Generate architecture diagram
diagram = agent.generate_diagram(
    paper="paper.pdf",
    style="clean",       # clean, detailed, minimal
    format="svg",
    focus="method",      # method, pipeline, architecture
)
diagram.save("architecture.svg")

# Generate research poster
poster = agent.generate_poster(
    paper="paper.pdf",
    template="academic",   # academic, conference, minimal
    size="A0",
    color_scheme="blue",
)
poster.save("poster.pdf")

# Generate visual abstract
abstract = agent.generate_visual_abstract(
    paper="paper.pdf",
    format="png",
    dimensions=(1200, 630),  # Twitter/LinkedIn optimal
)
abstract.save("visual_abstract.png")
```

## Diagram Styles

```python
# Architecture diagram
diagram = agent.generate_diagram(
    paper="paper.pdf",
    style="clean",
    components={
        "show_data_flow": True,
        "show_dimensions": True,
        "show_loss_functions": False,
        "annotation_level": "medium",
    },
)

# Pipeline diagram
pipeline = agent.generate_diagram(
    paper="paper.pdf",
    focus="pipeline",
    layout="horizontal",  # horizontal, vertical, circular
)

# Comparison diagram
comparison = agent.generate_comparison(
    papers=["paper_a.pdf", "paper_b.pdf"],
    aspects=["architecture", "performance", "complexity"],
)
```

## Poster Generation

```python
# Conference poster with full customization
poster = agent.generate_poster(
    paper="paper.pdf",
    template="neurips",
    sections=[
        "title_block",
        "motivation",
        "method",
        "key_results",
        "conclusions",
        "qr_code",
    ],
    style={
        "font_family": "Helvetica",
        "heading_color": "#2563EB",
        "background": "#FFFFFF",
        "columns": 3,
    },
)
```

## Slide Generation

```python
# Generate presentation slides
slides = agent.generate_slides(
    paper="paper.pdf",
    format="beamer",     # beamer, pptx, reveal_js
    num_slides=15,
    include_speaker_notes=True,
    style="metropolis",  # Beamer theme
)
slides.save("presentation.tex")
```

## Use Cases

1. **Conference posters**: Generate posters from papers
2. **Social media**: Visual abstracts for paper promotion
3. **Presentations**: Quick slide decks from papers
4. **Architecture diagrams**: Clean method visualizations
5. **Teaching**: Visual explanations of research papers

## References

- [ClawPhD GitHub](https://github.com/ZhihaoAIRobotic/ClawPhD)
