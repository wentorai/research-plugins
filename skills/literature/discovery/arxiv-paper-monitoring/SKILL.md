---
name: arxiv-paper-monitoring
description: "Set up automated monitoring for new arXiv papers in your research area"
metadata:
  openclaw:
    emoji: "👀"
    category: "literature"
    subcategory: "discovery"
    keywords: ["arxiv monitoring", "paper alerts", "research tracking", "new papers", "literature monitoring", "RSS feeds"]
    source: "https://clawhub.ai/arxiv-watcher"
---

# arXiv Paper Monitoring

## Overview

Staying current with new preprints in your field is critical for active researchers. This guide covers multiple approaches to monitoring arXiv for new papers: RSS feeds, email alerts, API-based scripts, and third-party services. Choose based on your needs: passive monitoring (RSS/email) for broad awareness, or active filtering (scripts) for high-precision tracking.

## Method 1: arXiv RSS Feeds

The simplest approach. arXiv provides RSS feeds for every category:

```
Feed URL pattern:
  https://rss.arxiv.org/rss/{category}

Examples:
  https://rss.arxiv.org/rss/cs.CL     — Computation and Language
  https://rss.arxiv.org/rss/cs.AI     — Artificial Intelligence
  https://rss.arxiv.org/rss/stat.ML   — Machine Learning (Statistics)
  https://rss.arxiv.org/rss/q-fin.ST  — Statistical Finance
  https://rss.arxiv.org/rss/econ.EM   — Econometrics
```

**Setup in an RSS reader** (Feedly, Inoreader, NetNewsWire):
1. Add the feed URL for each category you follow
2. Create a folder "arXiv" to group feeds
3. Check daily — new papers appear Monday-Friday

## Method 2: arXiv Email Alerts

```
1. Go to https://arxiv.org/help/subscribe
2. Create/login to your arXiv account
3. Navigate to "Email Notifications" in settings
4. Select categories to subscribe to
5. Choose frequency: daily digest
```

## Method 3: Python Monitoring Script

For custom filtering with keyword matching:

```python
import arxiv
import json
from datetime import datetime, timedelta
from pathlib import Path

class ArxivMonitor:
    """Monitor arXiv for new papers matching your research interests."""

    def __init__(self, config_path: str = "monitor_config.json"):
        with open(config_path) as f:
            self.config = json.load(f)
        self.seen_file = Path("seen_papers.json")
        self.seen = json.loads(self.seen_file.read_text()) if self.seen_file.exists() else []

    def check_new_papers(self) -> list:
        """Fetch and filter new papers based on config."""
        results = []
        client = arxiv.Client()

        for track in self.config["tracks"]:
            query = self._build_query(track)
            search = arxiv.Search(
                query=query,
                max_results=track.get("max_results", 50),
                sort_by=arxiv.SortCriterion.SubmittedDate
            )

            for paper in client.results(search):
                paper_id = paper.entry_id.split("/")[-1]
                if paper_id in self.seen:
                    continue

                # Keyword matching in title + abstract
                text = f"{paper.title} {paper.summary}".lower()
                if self._matches_keywords(text, track.get("keywords", [])):
                    results.append({
                        "id": paper_id,
                        "title": paper.title,
                        "authors": [a.name for a in paper.authors[:5]],
                        "abstract": paper.summary[:500],
                        "url": paper.entry_id,
                        "pdf": paper.pdf_url,
                        "published": paper.published.isoformat(),
                        "track": track["name"],
                        "categories": paper.categories
                    })
                    self.seen.append(paper_id)

        # Save seen list
        self.seen_file.write_text(json.dumps(self.seen[-5000:]))  # keep last 5000
        return results

    def _build_query(self, track: dict) -> str:
        cats = " OR ".join(f"cat:{c}" for c in track.get("categories", []))
        return f"({cats})" if cats else track.get("query", "")

    def _matches_keywords(self, text: str, keywords: list) -> bool:
        if not keywords:
            return True  # no filter = include all
        return any(kw.lower() in text for kw in keywords)

    def format_digest(self, papers: list) -> str:
        """Format papers as a readable digest."""
        if not papers:
            return "No new papers matching your criteria today."

        lines = [f"# arXiv Digest — {datetime.now().strftime('%Y-%m-%d')}",
                 f"**{len(papers)} new papers found**\n"]

        for track_name in set(p["track"] for p in papers):
            track_papers = [p for p in papers if p["track"] == track_name]
            lines.append(f"\n## {track_name} ({len(track_papers)} papers)\n")
            for p in track_papers:
                authors = ", ".join(p["authors"][:3])
                if len(p["authors"]) > 3:
                    authors += " et al."
                lines.append(f"### [{p['title']}]({p['url']})")
                lines.append(f"*{authors}* — {p['published'][:10]}")
                lines.append(f"> {p['abstract'][:200]}...\n")

        return "\n".join(lines)
```

### Configuration File

```json
{
  "tracks": [
    {
      "name": "RAG & Retrieval",
      "categories": ["cs.CL", "cs.IR"],
      "keywords": ["retrieval augmented", "RAG", "dense retrieval", "passage retrieval"],
      "max_results": 100
    },
    {
      "name": "LLM Agents",
      "categories": ["cs.AI", "cs.CL"],
      "keywords": ["language model agent", "tool use", "function calling", "agentic"],
      "max_results": 100
    },
    {
      "name": "Causal Inference",
      "categories": ["econ.EM", "stat.ME"],
      "keywords": ["difference-in-differences", "regression discontinuity", "instrumental variable"],
      "max_results": 50
    }
  ]
}
```

### Cron Job Setup

```bash
# Run daily at 8 AM
# crontab -e
0 8 * * 1-5 cd /path/to/monitor && python run_monitor.py >> monitor.log 2>&1
```

```python
# run_monitor.py
from arxiv_monitor import ArxivMonitor

monitor = ArxivMonitor("monitor_config.json")
papers = monitor.check_new_papers()
digest = monitor.format_digest(papers)

# Save digest
with open(f"digests/{datetime.now().strftime('%Y-%m-%d')}.md", "w") as f:
    f.write(digest)

print(f"Found {len(papers)} new papers")
```

## Method 4: Third-Party Services

| Service | Features | Price |
|---------|----------|-------|
| **Semantic Scholar Alerts** | Follow authors, topics, citation alerts | Free |
| **Google Scholar Alerts** | Email when new papers match query | Free |
| **ResearchRabbit** | AI-recommended papers, citation network | Free |
| **Connected Papers** | Visual paper discovery from seed paper | Free |
| **Arxiv Sanity** (Karpathy) | ML-filtered arXiv papers | Free |
| **Papers With Code** | Papers + code repositories | Free |
| **Hugging Face Daily Papers** | Community-curated ML papers | Free |

### Setting Up Google Scholar Alerts

```
1. Go to https://scholar.google.com/scholar_alerts
2. Click "Create alert"
3. Enter search query (e.g., "retrieval augmented generation")
4. Set email frequency: daily or weekly
5. Google will email you when new matching papers appear
```

### Setting Up Semantic Scholar Alerts

```
1. Go to https://www.semanticscholar.org/
2. Create an account
3. Search for a paper or author
4. Click "Alert" → get notified of new citations or related papers
5. Use "Research Feeds" for topic-based monitoring
```

## Best Practices

- **Limit scope**: Monitor 3-5 categories max; use keyword filtering to avoid noise
- **Weekly review**: Even with daily alerts, do a focused weekly review session
- **Triage quickly**: Title scan → abstract scan → full read (80/15/5 ratio)
- **Track what you read**: Log papers in your citation manager immediately
- **Share with your lab**: Post weekly digest to a shared Slack channel or group chat

## References

- [arXiv RSS Feeds](https://info.arxiv.org/help/rss.html)
- [arXiv API Documentation](https://info.arxiv.org/help/api/)
- [Semantic Scholar Research Feeds](https://www.semanticscholar.org/product/research-feeds)
- [Google Scholar Alerts](https://scholar.google.com/scholar_alerts)
