---
name: paper-tracking-guide
description: "Track new publications via RSS, alerts, and citation notifications"
metadata:
  openclaw:
    emoji: "🔔"
    category: "literature"
    subcategory: "discovery"
    keywords: ["literature alert", "citation notification", "RSS feed", "new publication tracking", "related papers"]
    source: "N/A"
---

# Paper Tracking Guide

## Overview

Staying current with the literature is one of the most persistent challenges in academic research. With over 5 million new papers published annually across all disciplines, manual browsing of journals and preprint servers is neither scalable nor reliable. Researchers who set up automated tracking systems gain a significant advantage: they discover relevant work earlier, avoid duplicating existing results, and identify collaboration opportunities.

This guide covers five complementary strategies for tracking new publications: RSS feeds from preprint servers and journals, keyword-based alerts from search engines, citation tracking for monitoring who cites your work or key papers, social and community feeds, and AI-powered discovery tools. The goal is to build a personalized monitoring pipeline that delivers relevant papers to you daily with minimal noise.

Each strategy is described with setup instructions, tool recommendations, and configuration tips so you can have a working tracking system within an afternoon.

## RSS Feeds from Preprint Servers

RSS remains the most reliable method for monitoring preprint servers like arXiv, bioRxiv, and SSRN.

### arXiv RSS Setup

arXiv provides RSS feeds for every category and subcategory:

```
# Feed URL format
https://rss.arxiv.org/rss/{category}

# Examples
https://rss.arxiv.org/rss/cs.CL    # Computation and Language
https://rss.arxiv.org/rss/cs.LG    # Machine Learning
https://rss.arxiv.org/rss/stat.ML  # Statistics: Machine Learning
https://rss.arxiv.org/rss/q-bio.GN # Genomics
```

### bioRxiv and medRxiv

```
# bioRxiv new papers by subject
https://connect.biorxiv.org/biorxiv_xml.php?subject=neuroscience

# medRxiv new papers
https://connect.medrxiv.org/medrxiv_xml.php?subject=epidemiology
```

### Recommended RSS Readers

| Reader | Platform | Free Tier | Best Feature |
|--------|----------|-----------|-------------|
| Feedly | Web/Mobile | 100 feeds | AI prioritization |
| Inoreader | Web/Mobile | 150 feeds | Rules & filters |
| Miniflux | Self-hosted | Unlimited | Full control |
| NetNewsWire | macOS/iOS | Unlimited | Native, fast, open-source |
| Feedbin | Web | Paid only | Clean interface |

### Filtering High-Volume Feeds

For categories with 50+ daily papers, set up keyword filters in your RSS reader:

```
# Inoreader rule example
IF title contains "transformer" OR "attention mechanism"
AND title does NOT contain "survey" OR "review"
THEN star AND move to "Priority" folder
```

## Keyword-Based Alerts

### Google Scholar Alerts

1. Go to [scholar.google.com/scholar_alerts](https://scholar.google.com/scholar_alerts)
2. Click "Create alert"
3. Enter a search query using operators:

```
# Specific phrase
"graph neural network" "drug discovery"

# Author tracking
author:"Yoshua Bengio"

# Venue-specific
source:"Nature Machine Intelligence"
```

Tips:
- Create 5-10 focused alerts rather than 1-2 broad ones.
- Use quotation marks for exact phrases.
- Review and refine alerts monthly.

### Semantic Scholar Alerts

Semantic Scholar offers research feed customization:

1. Create an account at [semanticscholar.org](https://www.semanticscholar.org/)
2. Add papers to your library
3. The recommendation engine learns your interests
4. Enable weekly email digest

### PubMed Alerts (Biomedical)

```
# Create a saved search at pubmed.ncbi.nlm.nih.gov
# Example query with MeSH terms
("machine learning"[MeSH] OR "deep learning"[MeSH])
AND "drug discovery"[MeSH]
AND "2024/01/01"[Date - Publication] : "3000"[Date - Publication]

# Set up email alerts: Save search > Create alert > Weekly
```

## Citation Tracking

Citation tracking answers: "Who is building on this foundational paper?"

### Methods

| Method | Coverage | Real-time | Cost |
|--------|----------|-----------|------|
| Google Scholar "Cited by" alerts | Broad | Near real-time | Free |
| Semantic Scholar citation alerts | CS, biomedical | Weekly | Free |
| Web of Science citation reports | Comprehensive | Weekly | Institutional |
| Scopus citation alerts | Comprehensive | Configurable | Institutional |
| ResearchGate notifications | Author-based | Real-time | Free |

### Setting Up Google Scholar Citation Alerts

1. Search for the paper on Google Scholar.
2. Click "Cited by N" below the paper.
3. Click the envelope icon ("Create alert") at the top of the results page.
4. Receive an email whenever a new paper cites the tracked paper.

### Tracking Your Own Citations

1. Create a [Google Scholar Profile](https://scholar.google.com/intl/en/scholar/citations.html).
2. Verify your papers.
3. Enable "New citations to my articles" alerts.
4. Monitor your h-index and i10-index trends.

## AI-Powered Discovery Tools

### Connected Papers

[connectedpapers.com](https://connectedpapers.com/) builds a visual graph of related papers:

1. Enter a seed paper (title, DOI, or URL).
2. The tool generates a similarity graph (not citation graph).
3. Papers that are close together share more conceptual similarity.
4. Use "Prior works" and "Derivative works" views for temporal exploration.

### Elicit

[elicit.com](https://elicit.com/) uses language models to search and summarize papers:

1. Ask a natural-language research question.
2. Elicit finds relevant papers and extracts key findings.
3. Use the "Columns" feature to compare methods, datasets, and results across papers.

### Research Rabbit

[researchrabbit.ai](https://www.researchrabbit.ai/) provides:

- Citation network visualization
- "Similar work" recommendations
- Author network exploration
- Collection-based monitoring with email alerts

## Building Your Daily Pipeline

A recommended daily reading workflow:

```
Morning (15 min):
1. Check RSS reader for new preprints (filtered by keywords)
2. Star 3-5 papers for reading later
3. Quick-scan abstracts of starred papers

Weekly (1 hour):
1. Read 2-3 starred papers in full
2. Add to Zotero with tags and notes
3. Check citation alerts for tracked papers
4. Review AI recommendations (Semantic Scholar, Research Rabbit)

Monthly (30 min):
1. Audit alert quality -- prune noisy alerts, add new ones
2. Update RSS feed subscriptions for evolving interests
3. Share interesting papers with lab group
```

## Best Practices

- **Limit your feeds.** It is better to thoroughly read 5 papers per week than to skim 50.
- **Use a reference manager from day one.** Zotero, Paperpile, or Mendeley -- pick one and use it consistently.
- **Tag papers by project.** When you start writing, you will need to find that paper you read six months ago.
- **Share with your team.** Set up a shared Zotero group or Slack channel for paper recommendations.
- **Track trends, not just individual papers.** Notice when multiple groups independently converge on the same idea.
- **Combine automated and social discovery.** Algorithms miss papers that colleagues recommend.

## References

- [arXiv RSS Feeds](https://info.arxiv.org/help/rss.html) -- Official arXiv RSS documentation
- [Google Scholar Alerts](https://scholar.google.com/scholar_alerts) -- Citation and keyword alerts
- [Semantic Scholar](https://www.semanticscholar.org/) -- AI-powered paper search
- [Connected Papers](https://www.connectedpapers.com/) -- Visual paper exploration
- [Research Rabbit](https://www.researchrabbit.ai/) -- Collection-based paper discovery
