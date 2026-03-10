---
name: citation-map-guide
description: "Generate citation world maps from Google Scholar profiles"
metadata:
  openclaw:
    emoji: "🗺️"
    category: "analysis"
    subcategory: "dataviz"
    keywords: ["citation map", "Google Scholar", "geospatial", "academic impact", "visualization", "world map"]
    source: "https://github.com/ChenLiu-1996/CitationMap"
---

# Citation Map Guide

## Overview

CitationMap generates geographical world maps showing where your citations come from, based on Google Scholar data. It geocodes citing authors' affiliations and plots them on an interactive map, revealing the global reach and geographical distribution of your research impact. Useful for CV enhancement, grant applications, and understanding your research's international footprint.

## Installation

```bash
pip install citationmap

# Or from source
git clone https://github.com/ChenLiu-1996/CitationMap.git
cd CitationMap
pip install -e .
```

## Usage

```python
from citationmap import CitationMap

# Generate map from Google Scholar ID
cmap = CitationMap(scholar_id="YOUR_SCHOLAR_ID")

# Fetch citation data
cmap.fetch_citations()

print(f"Total citations: {cmap.total_citations}")
print(f"Unique citing authors: {cmap.unique_authors}")
print(f"Countries represented: {cmap.unique_countries}")

# Generate interactive map
cmap.plot_map(
    output="citation_map.html",
    style="heatmap",       # heatmap, markers, clusters
    color_by="count",      # count, year, paper
)
```

## Map Styles

```python
# Marker map — individual pins per institution
cmap.plot_map(
    output="markers.html",
    style="markers",
    show_labels=True,
    popup_info=["author", "paper", "year"],
)

# Heatmap — density visualization
cmap.plot_map(
    output="heatmap.html",
    style="heatmap",
    radius=30,
    blur=20,
)

# Cluster map — grouped by proximity
cmap.plot_map(
    output="clusters.html",
    style="clusters",
    max_cluster_radius=50,
)

# Static image (for publications/CVs)
cmap.plot_static(
    output="citation_map.png",
    dpi=300,
    projection="robinson",
    figsize=(14, 8),
)
```

## Analysis Features

```python
# Geographic distribution stats
stats = cmap.get_stats()

print("\nTop countries:")
for country, count in stats.top_countries[:10]:
    print(f"  {country}: {count} citations")

print("\nTop institutions:")
for inst, count in stats.top_institutions[:10]:
    print(f"  {inst}: {count} citations")

print("\nContinental distribution:")
for continent, pct in stats.continental_distribution.items():
    print(f"  {continent}: {pct:.1f}%")
```

## Time Evolution

```python
# Animate citation spread over time
cmap.plot_animated(
    output="citation_evolution.html",
    time_field="year",
    interval=1000,  # ms per year
    cumulative=True,
)

# Year-by-year breakdown
for year in range(2020, 2026):
    year_stats = cmap.filter_by_year(year)
    print(f"{year}: {year_stats.count} citations, "
          f"{year_stats.countries} countries")
```

## Paper-Specific Maps

```python
# Map for a specific paper
cmap.plot_map(
    paper_title="Your Specific Paper Title",
    output="paper_citations.html",
    style="markers",
)

# Compare papers
papers = cmap.get_papers()
for paper in papers[:5]:
    print(f"\n{paper.title} ({paper.year})")
    print(f"  Citations: {paper.citation_count}")
    print(f"  Countries: {paper.country_count}")
```

## Export

```python
# Export citation data
cmap.export_csv("citations.csv")
# Columns: citing_author, affiliation, country, lat, lon,
#           citing_paper, cited_paper, year

# Export for GIS software
cmap.export_geojson("citations.geojson")

# Export summary statistics
cmap.export_report("citation_report.md")
```

## Configuration

```python
cmap = CitationMap(
    scholar_id="YOUR_ID",
    config={
        "geocoding_service": "nominatim",  # or "google"
        "cache_dir": ".citationmap_cache",
        "rate_limit": 1.0,  # seconds between API calls
        "affiliation_parsing": "heuristic",  # or "llm"
    },
)
```

## Use Cases

1. **CV enhancement**: Show global research impact visually
2. **Grant applications**: Demonstrate international reach
3. **Department reports**: Aggregate maps for research groups
4. **Collaboration discovery**: Find active citing institutions
5. **Impact assessment**: Geographic diversity of citations

## References

- [CitationMap GitHub](https://github.com/ChenLiu-1996/CitationMap)
- [Google Scholar](https://scholar.google.com/)
- [Folium](https://python-visualization.github.io/folium/) — Map rendering
