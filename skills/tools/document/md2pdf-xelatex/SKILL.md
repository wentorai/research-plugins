---
name: md2pdf-xelatex
description: "Convert Markdown to publication-ready PDF with LaTeX math and CJK support"
metadata:
  openclaw:
    emoji: "📄"
    category: "tools"
    subcategory: "document"
    keywords: ["markdown to pdf", "xelatex", "document conversion", "CJK support", "math rendering", "pandoc"]
    source: "https://clawhub.ai/huaruoji/md2pdf-xelatex"
---

# Markdown to PDF Conversion with XeLaTeX

## Overview

Converting Markdown documents to publication-quality PDF is a common research workflow need. This guide covers using Pandoc with XeLaTeX as the PDF engine, which provides full Unicode support (including CJK characters), LaTeX math rendering, custom fonts, and professional typography. This is the recommended approach when your document contains mathematical formulas, non-Latin scripts, or requires precise typographic control.

## Prerequisites

### Installation

```bash
# macOS
brew install pandoc
brew install --cask mactex  # or: brew install --cask basictex (smaller)

# Ubuntu/Debian
sudo apt install pandoc texlive-xetex texlive-fonts-recommended texlive-lang-cjk

# Windows (via Chocolatey)
choco install pandoc miktex

# Verify installation
pandoc --version
xelatex --version
```

### CJK Font Setup

For Chinese/Japanese/Korean documents, install appropriate fonts:

```bash
# macOS — system fonts usually sufficient (PingFang, Hiragino)
# Ubuntu — install Noto CJK
sudo apt install fonts-noto-cjk fonts-noto-cjk-extra

# Verify available CJK fonts
fc-list :lang=zh family | sort | uniq
```

## Basic Conversion

### Simple Markdown to PDF

```bash
# Default conversion (pdflatex engine)
pandoc input.md -o output.pdf

# With XeLaTeX engine (required for Unicode/CJK)
pandoc input.md -o output.pdf --pdf-engine=xelatex

# With custom font
pandoc input.md -o output.pdf --pdf-engine=xelatex \
  -V mainfont="Times New Roman" \
  -V monofont="Fira Code"
```

### CJK Document

```bash
# Chinese document with proper font
pandoc input.md -o output.pdf --pdf-engine=xelatex \
  -V mainfont="Noto Serif CJK SC" \
  -V CJKmainfont="Noto Serif CJK SC" \
  -V monofont="Noto Sans Mono CJK SC" \
  -V geometry:margin=2.5cm
```

### Document with Math

Markdown with LaTeX math renders natively:

```markdown
The quadratic formula is:

$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

Inline math works too: $E = mc^2$.
```

```bash
pandoc math_doc.md -o output.pdf --pdf-engine=xelatex
```

## Advanced Configuration

### YAML Front Matter

Add a YAML header to your Markdown for fine-grained control:

```yaml
---
title: "Research Report Title"
author: "Author Name"
date: "2026-03-10"
documentclass: article
fontsize: 11pt
geometry: margin=2.5cm
mainfont: "Libertinus Serif"
CJKmainfont: "Noto Serif CJK SC"
monofont: "Fira Code"
linestretch: 1.25
header-includes:
  - \usepackage{amsmath}
  - \usepackage{booktabs}
  - \usepackage{hyperref}
  - \usepackage{fancyhdr}
  - \pagestyle{fancy}
---
```

### Custom LaTeX Template

For full control, create a custom Pandoc template:

```bash
# Export default template as starting point
pandoc -D latex > custom-template.tex

# Use custom template
pandoc input.md -o output.pdf --pdf-engine=xelatex \
  --template=custom-template.tex
```

### Table of Contents and Numbering

```bash
# Add table of contents
pandoc input.md -o output.pdf --pdf-engine=xelatex --toc

# Number sections
pandoc input.md -o output.pdf --pdf-engine=xelatex --toc -N

# TOC depth (default 3)
pandoc input.md -o output.pdf --pdf-engine=xelatex --toc --toc-depth=2
```

### Syntax-Highlighted Code Blocks

```bash
# List available highlight styles
pandoc --list-highlight-styles

# Use a specific style
pandoc input.md -o output.pdf --pdf-engine=xelatex \
  --highlight-style=tango
```

### Bibliography and Citations

```bash
# With BibTeX bibliography
pandoc input.md -o output.pdf --pdf-engine=xelatex \
  --citeproc --bibliography=references.bib \
  --csl=ieee.csl
```

In the Markdown file, cite as `[@smith2024]` or `@smith2024`.

## Batch Conversion Script

```bash
#!/bin/bash
# Convert all .md files in current directory to PDF

FONT_MAIN="Libertinus Serif"
FONT_CJK="Noto Serif CJK SC"
FONT_MONO="Fira Code"

for f in *.md; do
    echo "Converting: $f"
    pandoc "$f" -o "${f%.md}.pdf" \
        --pdf-engine=xelatex \
        -V mainfont="$FONT_MAIN" \
        -V CJKmainfont="$FONT_CJK" \
        -V monofont="$FONT_MONO" \
        -V geometry:margin=2.5cm \
        -V fontsize=11pt \
        --toc -N \
        --highlight-style=tango
done
echo "Done. Converted $(ls *.pdf | wc -l) files."
```

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|---------|
| CJK characters show as boxes | Missing CJK font | Install `fonts-noto-cjk` and set `CJKmainfont` |
| `! LaTeX Error: File 'xxx.sty' not found` | Missing LaTeX package | `tlmgr install xxx` or install full texlive |
| Math formulas not rendering | Using pdflatex engine | Switch to `--pdf-engine=xelatex` |
| Emoji not displaying | Font missing emoji glyphs | Add `-V mainfont="Noto Color Emoji"` as fallback |
| PDF too large | Embedded bitmap images | Convert images to vector (SVG→PDF) before inclusion |
| Line breaks in CJK text | Pandoc treats newlines as spaces | Use `\newline` or blank lines between paragraphs |

## References

- [Pandoc User's Guide](https://pandoc.org/MANUAL.html)
- [XeLaTeX on Overleaf](https://www.overleaf.com/learn/latex/XeLaTeX)
- [Noto CJK Fonts](https://github.com/googlefonts/noto-cjk)
- [Pandoc Templates](https://pandoc.org/MANUAL.html#templates)
