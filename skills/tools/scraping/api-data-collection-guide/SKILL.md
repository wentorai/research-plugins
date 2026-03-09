---
name: api-data-collection-guide
description: "API-based data collection and web scraping for research"
metadata:
  openclaw:
    emoji: "spider"
    category: "tools"
    subcategory: "scraping"
    keywords: ["API data collection", "web search strategies", "data extraction", "web scraping"]
    source: "wentor-research-plugins"
---

# API Data Collection Guide

Collect research data from web APIs and structured sources using Python, with proper rate limiting, error handling, pagination, and ethical considerations.

## API vs. Web Scraping

| Approach | When to Use | Reliability | Legal Risk |
|----------|------------|-------------|------------|
| Official API | API exists and provides needed data | High | Low (within TOS) |
| Unofficial API | Browser dev tools reveal JSON endpoints | Medium | Medium |
| Web scraping | No API available, data is publicly accessible | Low (pages change) | Medium-High |
| Bulk data download | Provider offers data dumps | High | Low |

**Always prefer official APIs over scraping**. Check for APIs first at: ProgrammableWeb, RapidAPI, or the data provider's developer documentation.

## RESTful API Fundamentals

### HTTP Methods

| Method | Purpose | Example |
|--------|---------|---------|
| GET | Retrieve data | `GET /api/papers?q=machine+learning` |
| POST | Create or submit data | `POST /api/annotations` |
| PUT | Update existing data | `PUT /api/papers/123` |
| DELETE | Remove data | `DELETE /api/papers/123` |

### Common Response Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Process response |
| 201 | Created | Resource created successfully |
| 400 | Bad request | Fix query parameters |
| 401 | Unauthorized | Check API key |
| 403 | Forbidden | Access denied; check permissions |
| 404 | Not found | Resource does not exist |
| 429 | Rate limited | Wait and retry with backoff |
| 500 | Server error | Retry later |

## Python API Client Template

```python
import requests
import time
import json
import logging
from pathlib import Path
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class APIClient:
    """Reusable API client with rate limiting, retries, and caching."""

    def __init__(self, base_url, api_key=None, rate_limit=1.0, max_retries=3):
        self.base_url = base_url.rstrip("/")
        self.session = requests.Session()
        if api_key:
            self.session.headers["Authorization"] = f"Bearer {api_key}"
        self.session.headers["User-Agent"] = "ResearchCollector/1.0 (academic research)"
        self.rate_limit = rate_limit  # seconds between requests
        self.max_retries = max_retries
        self.last_request_time = 0
        self.cache_dir = Path("./cache")
        self.cache_dir.mkdir(exist_ok=True)

    def _rate_limit_wait(self):
        """Enforce minimum time between requests."""
        elapsed = time.time() - self.last_request_time
        if elapsed < self.rate_limit:
            time.sleep(self.rate_limit - elapsed)
        self.last_request_time = time.time()

    def _get_cache_key(self, endpoint, params):
        """Generate a cache key from the request."""
        import hashlib
        key_string = f"{endpoint}_{json.dumps(params, sort_keys=True)}"
        return hashlib.md5(key_string.encode()).hexdigest()

    def get(self, endpoint, params=None, use_cache=True):
        """Make a GET request with rate limiting, retries, and caching."""
        cache_key = self._get_cache_key(endpoint, params or {})
        cache_file = self.cache_dir / f"{cache_key}.json"

        # Check cache
        if use_cache and cache_file.exists():
            logger.debug(f"Cache hit: {endpoint}")
            return json.loads(cache_file.read_text())

        url = f"{self.base_url}/{endpoint.lstrip('/')}"

        for attempt in range(self.max_retries):
            self._rate_limit_wait()
            try:
                response = self.session.get(url, params=params, timeout=30)

                if response.status_code == 200:
                    data = response.json()
                    # Save to cache
                    cache_file.write_text(json.dumps(data))
                    return data

                elif response.status_code == 429:
                    retry_after = int(response.headers.get("Retry-After", 60))
                    logger.warning(f"Rate limited. Waiting {retry_after}s...")
                    time.sleep(retry_after)

                elif response.status_code >= 500:
                    logger.warning(f"Server error {response.status_code}. Retry {attempt+1}/{self.max_retries}")
                    time.sleep(2 ** attempt)  # Exponential backoff

                else:
                    logger.error(f"Request failed: {response.status_code} {response.text[:200]}")
                    return None

            except requests.exceptions.RequestException as e:
                logger.error(f"Request exception: {e}")
                time.sleep(2 ** attempt)

        logger.error(f"Max retries exceeded for {endpoint}")
        return None

    def paginate(self, endpoint, params=None, page_key="page",
                 results_key="results", max_pages=100):
        """Automatically paginate through all results."""
        params = params or {}
        all_results = []
        page = 1

        while page <= max_pages:
            params[page_key] = page
            data = self.get(endpoint, params)

            if not data or not data.get(results_key):
                break

            results = data[results_key]
            all_results.extend(results)
            logger.info(f"Page {page}: {len(results)} results (total: {len(all_results)})")

            # Check if more pages exist
            if len(results) < params.get("per_page", params.get("limit", 20)):
                break

            page += 1

        return all_results
```

## Academic API Examples

### OpenAlex (Open Scholarly Metadata)

```python
# OpenAlex: free, comprehensive, no authentication required
client = APIClient("https://api.openalex.org", rate_limit=0.1)

# Search for works
results = client.get("works", params={
    "filter": "title.search:transformer attention mechanism",
    "sort": "cited_by_count:desc",
    "per_page": 25
})

for work in results.get("results", []):
    print(f"[{work.get('publication_year')}] {work.get('title')}")
    print(f"  Citations: {work.get('cited_by_count')}")
    print(f"  DOI: {work.get('doi')}")
```

### CrossRef (DOI Metadata)

```python
client = APIClient("https://api.crossref.org", rate_limit=0.05)
client.session.headers["User-Agent"] = "ResearchClaw/1.0 (mailto:researcher@university.edu)"

# Search for works
results = client.get("works", params={
    "query": "machine learning drug discovery",
    "rows": 20,
    "sort": "relevance",
    "order": "desc"
})

for item in results.get("message", {}).get("items", []):
    title = item.get("title", ["N/A"])[0]
    doi = item.get("DOI", "N/A")
    cited = item.get("is-referenced-by-count", 0)
    print(f"  {title} | DOI: {doi} | Cited: {cited}")
```

### GitHub API (Code and Repositories)

```python
# GitHub API for finding research code repositories
client = APIClient("https://api.github.com", api_key=os.environ["GITHUB_TOKEN"], rate_limit=0.75)

# Search repositories
results = client.get("search/repositories", params={
    "q": "topic:machine-learning language:python stars:>100",
    "sort": "stars",
    "order": "desc",
    "per_page": 30
})

for repo in results.get("items", []):
    print(f"{repo['full_name']} ({repo['stargazers_count']} stars)")
    print(f"  {repo.get('description', 'No description')[:80]}")
```

## Web Scraping (When APIs Are Unavailable)

```python
import requests
from bs4 import BeautifulSoup
import time

def scrape_conference_proceedings(url, delay=2.0):
    """Scrape paper titles and authors from a conference page."""
    headers = {
        "User-Agent": "Mozilla/5.0 (Research Bot; academic research only)"
    }

    response = requests.get(url, headers=headers)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    papers = []
    for article in soup.find_all("div", class_="paper-entry"):
        title = article.find("h3")
        authors = article.find("span", class_="authors")
        abstract = article.find("p", class_="abstract")

        papers.append({
            "title": title.text.strip() if title else "N/A",
            "authors": authors.text.strip() if authors else "N/A",
            "abstract": abstract.text.strip() if abstract else "N/A"
        })

    time.sleep(delay)  # Be polite
    return papers
```

## Data Storage and Management

```python
import pandas as pd
import sqlite3

def save_to_sqlite(data, db_path="research_data.db", table_name="papers"):
    """Save collected data to SQLite database."""
    df = pd.DataFrame(data)
    conn = sqlite3.connect(db_path)
    df.to_sql(table_name, conn, if_exists="append", index=False)
    conn.close()
    logger.info(f"Saved {len(df)} records to {db_path}:{table_name}")

def save_incremental_json(data, output_file="collected_data.jsonl"):
    """Append data as JSON Lines (one JSON object per line)."""
    with open(output_file, "a") as f:
        for record in data:
            f.write(json.dumps(record) + "\n")
```

## Ethical and Legal Considerations

| Principle | Description |
|-----------|-------------|
| **Respect robots.txt** | Check `robots.txt` before scraping any site |
| **Rate limiting** | Never exceed 1 request/second unless the API permits more |
| **Identify yourself** | Use a descriptive User-Agent with contact email |
| **Terms of Service** | Read and follow the API/website TOS |
| **Data minimization** | Only collect data you actually need |
| **Privacy** | Do not scrape personal data without consent |
| **Acknowledge sources** | Cite data sources in publications |
| **IRB review** | Consult your IRB if collecting human-related data |

## Troubleshooting Common Issues

| Problem | Cause | Solution |
|---------|-------|----------|
| 403 Forbidden | Missing or incorrect authentication | Check API key, update User-Agent |
| Timeout errors | Slow server or large response | Increase timeout, reduce page size |
| Inconsistent data | API schema changed | Version-lock API endpoints, validate schema |
| Missing fields | Optional fields are null | Use `.get()` with defaults, handle None |
| Encoding errors | Non-UTF8 characters | Set `response.encoding = "utf-8"`, use `errors="replace"` |
| IP blocking | Too many requests | Use exponential backoff, rotate IPs (with caution) |
