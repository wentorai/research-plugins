---
name: data-visualization-principles
description: "Design principles for creating effective and honest data visualizations"
metadata:
  openclaw:
    emoji: "📊"
    category: "analysis"
    subcategory: "dataviz"
    keywords: ["data visualization", "chart design", "visual encoding", "chart selection", "color theory", "publication figures"]
    source: "https://clawhub.ai/data-visualization"
---

# Data Visualization Design Principles

## Overview

Effective data visualization reveals patterns, communicates findings, and supports evidence-based arguments. Poor visualization obscures or misleads. This guide covers the fundamental principles of visual encoding, chart type selection, color usage, and common pitfalls — applicable to any plotting tool (matplotlib, ggplot2, Stata, Excel, D3.js).

## Visual Encoding Hierarchy

Not all visual channels are created equal. Humans perceive some encodings more accurately than others:

```
Most accurate (use for primary comparisons):
  1. Position on a common scale (bar chart, dot plot)
  2. Position on non-aligned scales (small multiples)
  3. Length (bar chart)
  4. Angle / Slope (line chart trends)

Moderately accurate:
  5. Area (bubble chart — but easily misjudged)
  6. Volume (3D — almost always misleading, avoid)
  7. Color saturation / luminance (heatmap)

Least accurate (use for categorical grouping only):
  8. Color hue (distinguishing categories, not quantities)
  9. Shape (point markers — circle vs. triangle)
  10. Texture / Pattern (rarely useful)
```

**Implication**: Encode your most important comparison as position, not as color or area.

## Chart Selection Guide

| Data Relationship | Best Chart | Avoid |
|-------------------|-----------|-------|
| **Compare values** across categories | Bar chart (horizontal for many categories) | Pie chart (hard to compare slices) |
| **Show distribution** of one variable | Histogram, density plot, box plot | Bar chart of means (hides distribution) |
| **Compare distributions** across groups | Violin plot, ridgeline plot, strip plot | Multiple overlapping histograms |
| **Show trend** over time | Line chart | Bar chart (for continuous time) |
| **Show relationship** between 2 variables | Scatter plot | Line chart (implies ordering) |
| **Show composition** (parts of whole) | Stacked bar (absolute) or 100% bar (relative) | Pie chart, 3D pie chart |
| **Show correlation matrix** | Heatmap with numbers | Scatter matrix (too many panels) |
| **Compare many metrics** per item | Radar chart (sparingly), parallel coordinates | Multiple bar charts |
| **Show geographic patterns** | Choropleth map, dot map | 3D terrain maps |
| **Show network structure** | Node-edge graph, adjacency matrix | Overly dense hairball graphs |

## Design Rules

### Rule 1: Maximize Data-Ink Ratio

Remove everything that doesn't communicate data:

```
Remove:
  ✗ Background grid (or make very light gray)
  ✗ 3D effects on 2D data
  ✗ Decorative elements (clipart, unnecessary icons)
  ✗ Redundant legends (if only one series)
  ✗ Box around the plot (chart junk)

Keep:
  ✓ Data points / bars / lines
  ✓ Axis labels with units
  ✓ Title that states the finding (not just "Figure 1")
  ✓ Direct labels on data (instead of legend when possible)
```

### Rule 2: Start Y-Axis at Zero (for Bar Charts)

```
Bar chart: ALWAYS start at 0 (bars encode length)
Line chart: Starting at 0 is optional (lines encode slope/trend)
Exception: If all values are close (e.g., 98-102), show the relevant range
           but clearly mark the broken axis
```

### Rule 3: Use Informative Titles

```
Bad:  "Figure 3: Results"
Bad:  "Figure 3: Accuracy by Method"
Good: "Figure 3: Our method improves accuracy by 12% over the best baseline"
Best: "Our method (BERT-RAG) achieves 89.2% accuracy, outperforming
       all baselines on the SQuAD benchmark"
```

### Rule 4: Color Usage

```python
# Qualitative palette (categorical data — 2-8 categories)
# Use colorblind-friendly palettes
CATEGORICAL = ['#4477AA', '#EE6677', '#228833', '#CCBB44',
               '#66CCEE', '#AA3377', '#BBBBBB']

# Sequential palette (ordered data — low to high)
# Single hue, varying lightness
# Use: matplotlib "viridis", "plasma", "cividis"

# Diverging palette (data with meaningful center point)
# Two hues diverging from neutral center
# Use: "RdBu" (red-blue), "BrBG" (brown-teal)

# Rules:
# - Maximum 7 colors for categorical data
# - Never use rainbow (perceptually non-uniform)
# - Test in grayscale: can you still distinguish?
# - Red-green colorblindness affects ~8% of men
```

## Publication-Ready Formatting

```python
import matplotlib.pyplot as plt

# Publication-quality defaults
plt.rcParams.update({
    'font.family': 'sans-serif',
    'font.sans-serif': ['Arial', 'Helvetica'],
    'font.size': 10,
    'axes.labelsize': 11,
    'axes.titlesize': 12,
    'xtick.labelsize': 9,
    'ytick.labelsize': 9,
    'legend.fontsize': 9,
    'figure.dpi': 300,
    'savefig.dpi': 300,
    'savefig.bbox': 'tight',
    'axes.spines.top': False,      # Remove top spine
    'axes.spines.right': False,    # Remove right spine
    'lines.linewidth': 1.5,
    'axes.linewidth': 0.8,
})

# Single column figure (journal standard: 85mm ≈ 3.35in)
fig, ax = plt.subplots(figsize=(3.35, 2.5))

# Double column figure (170mm ≈ 6.7in)
fig, axes = plt.subplots(1, 2, figsize=(6.7, 2.5))
```

## Common Mistakes

| Mistake | Why It's Wrong | Fix |
|---------|---------------|-----|
| Pie chart for comparison | Humans are bad at comparing angles | Use bar chart |
| 3D bar chart | 3D perspective distorts bar heights | Use 2D bars |
| Dual y-axes | Misleading — scale choice changes the story | Two separate panels |
| Truncated y-axis on bar chart | Exaggerates differences | Start at 0 |
| Too many colors | Cognitive overload | Max 7 categories; group the rest as "Other" |
| Low resolution figures | Blurry in print | Export at 300 DPI minimum |
| Missing units | "What does the y-axis mean?" | Always label with units |
| Legend far from data | Reader must scan back and forth | Direct label the data |

## References

- Tufte, E. R. (2001). *The Visual Display of Quantitative Information*. Graphics Press.
- Wilke, C. O. (2019). *Fundamentals of Data Visualization*. O'Reilly.
- Rougier, N. P., et al. (2014). "Ten Simple Rules for Better Figures." *PLOS Computational Biology*, 10(9).
- [ColorBrewer 2.0](https://colorbrewer2.org/)
- [Datawrapper Blog](https://blog.datawrapper.de/) — Excellent chart design advice
