---
name: osf-api
description: "Manage open science projects and preprints via the OSF REST API"
metadata:
  openclaw:
    emoji: "🔓"
    category: "literature"
    subcategory: "fulltext"
    keywords: ["OSF", "Open Science Framework", "preprints", "open data", "reproducibility", "preregistration"]
    source: "https://osf.io/"
---

# OSF (Open Science Framework) API

## Overview

The Open Science Framework by the Center for Open Science provides infrastructure for the entire research lifecycle — project management, file storage, preprint hosting, and registrations. The API enables search, project creation, file management, and preprint discovery across OSF Preprints, PsyArXiv, SocArXiv, and 25+ community preprint servers. Free, no auth for read access.

## Authentication

Public read access requires no authentication. For creating or modifying resources, generate a personal access token at https://osf.io/settings/tokens.

```bash
# Public access (no auth needed)
curl "https://api.osf.io/v2/nodes/?filter[title]=reproducibility"

# Authenticated access for write operations
export OSF_TOKEN=$OSF_TOKEN
curl -H "Authorization: Bearer $OSF_TOKEN" \
  "https://api.osf.io/v2/users/me/"
```

## API Endpoints

### Base URL

```
https://api.osf.io/v2
```

### Search

```bash
# Search across all OSF content
curl "https://api.osf.io/v2/search/?q=replication+crisis&page[size]=20"

# Search preprints
curl "https://api.osf.io/v2/preprints/?filter[q]=machine+learning&page[size]=20"

# Filter by preprint provider
curl "https://api.osf.io/v2/preprints/?filter[provider]=psyarxiv&filter[q]=cognitive+bias"

# Search registrations (pre-registered studies)
curl "https://api.osf.io/v2/registrations/?filter[q]=randomized+controlled+trial"
```

### Projects

```bash
# Get public projects
curl "https://api.osf.io/v2/nodes/?filter[public]=true&filter[q]=neuroimaging"

# Get project details
curl "https://api.osf.io/v2/nodes/{node_id}/"

# Get project files
curl "https://api.osf.io/v2/nodes/{node_id}/files/"

# Get project contributors
curl "https://api.osf.io/v2/nodes/{node_id}/contributors/"
```

### Preprint Providers

| Provider | Filter | Disciplines |
|----------|--------|-------------|
| OSF Preprints | `osf` | Multidisciplinary |
| PsyArXiv | `psyarxiv` | Psychology |
| SocArXiv | `socarxiv` | Social sciences |
| EarthArXiv | `eartharxiv` | Earth sciences |
| BioHackrXiv | `biohackrxiv` | Bioinformatics |
| engrXiv | `engrxiv` | Engineering |
| MedArXiv | `medarxiv` | Medical sciences |
| NutriXiv | `nutrixiv` | Nutrition |

### Query Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `filter[q]` | Text search | `filter[q]=open+data` |
| `filter[provider]` | Preprint server | `filter[provider]=psyarxiv` |
| `filter[subjects]` | Subject filter | Subject taxonomy ID |
| `filter[date_created]` | Date filter | `filter[date_created][gte]=2024-01-01` |
| `page[size]` | Results per page (max 100) | `page[size]=50` |
| `page` | Page number | `page=2` |

## Response Structure (Preprint)

```json
{
  "data": [
    {
      "id": "abc12",
      "type": "preprints",
      "attributes": {
        "title": "Replication of the Ego Depletion Effect",
        "description": "We attempted to replicate...",
        "date_created": "2024-06-15T10:00:00Z",
        "date_published": "2024-06-16T08:00:00Z",
        "doi": "10.31234/osf.io/abc12",
        "is_published": true,
        "subjects": [["Social and Behavioral Sciences", "Psychology"]],
        "tags": ["replication", "ego depletion"]
      },
      "relationships": {
        "contributors": {"links": {"related": {"href": "..."}}},
        "primary_file": {"links": {"related": {"href": "..."}}}
      }
    }
  ]
}
```

## Python Usage

```python
import requests

BASE_URL = "https://api.osf.io/v2"


def search_preprints(query: str, provider: str = None,
                     page_size: int = 20) -> list:
    """Search OSF preprints across providers."""
    params = {
        "filter[q]": query,
        "page[size]": page_size,
    }
    if provider:
        params["filter[provider]"] = provider

    resp = requests.get(f"{BASE_URL}/preprints/", params=params)
    resp.raise_for_status()
    data = resp.json()

    results = []
    for item in data.get("data", []):
        attrs = item.get("attributes", {})
        results.append({
            "id": item.get("id"),
            "title": attrs.get("title"),
            "description": (attrs.get("description") or "")[:300],
            "doi": attrs.get("doi"),
            "date": attrs.get("date_published", "")[:10],
            "tags": attrs.get("tags", []),
            "url": f"https://osf.io/{item.get('id')}/",
        })
    return results


def search_registrations(query: str,
                         page_size: int = 20) -> list:
    """Search pre-registered studies on OSF."""
    params = {
        "filter[q]": query,
        "page[size]": page_size,
    }
    resp = requests.get(f"{BASE_URL}/registrations/", params=params)
    resp.raise_for_status()
    data = resp.json()

    results = []
    for item in data.get("data", []):
        attrs = item.get("attributes", {})
        results.append({
            "id": item.get("id"),
            "title": attrs.get("title"),
            "description": (attrs.get("description") or "")[:300],
            "date_registered": attrs.get("date_registered", "")[:10],
            "registration_schema": attrs.get("registration_supplement"),
        })
    return results


def get_project_files(node_id: str) -> list:
    """List files in an OSF project."""
    resp = requests.get(f"{BASE_URL}/nodes/{node_id}/files/")
    resp.raise_for_status()
    data = resp.json()

    providers = []
    for item in data.get("data", []):
        attrs = item.get("attributes", {})
        providers.append({
            "provider": attrs.get("provider"),
            "name": attrs.get("name"),
        })
    return providers


# Example: search psychology preprints
preprints = search_preprints("cognitive load", provider="psyarxiv")
for p in preprints[:5]:
    print(f"[{p['date']}] {p['title']}")
    print(f"  DOI: {p['doi']}")

# Example: find pre-registered clinical trials
regs = search_registrations("randomized placebo")
for r in regs[:5]:
    print(f"[{r['date_registered']}] {r['title']}")
```

## Common Research Patterns

- **Preregistration Review**: Search for preregistered studies in your field to understand how others formulate hypotheses, specify sample sizes, and plan analyses before data collection. Essential for meta-science and methodological research.
- **Preprint Discovery**: Use the preprints endpoint to find the latest unrefereed manuscripts across multiple community servers, getting access to cutting-edge findings before formal publication.
- **Open Data Access**: Retrieve datasets attached to OSF projects for replication attempts, secondary analyses, or meta-analyses. OSF projects often include raw data, analysis scripts, and materials.
- **Collaboration Mapping**: Explore contributors and linked projects to understand research collaboration networks in specific domains.
- **Reproducibility Audits**: Programmatically check whether published studies have associated preregistrations, open data, or open materials on OSF.

## Rate Limits and Best Practices

- **Rate limit**: 100 requests per minute for unauthenticated, higher limits for authenticated requests
- **Pagination**: Use `page` and `page[size]` parameters; default page size is 10
- **JSON:API format**: Responses follow JSON:API specification; data is under the `data` key, relationships are linked
- **Sparse fieldsets**: Use `fields[nodes]=title,date_created` to request only needed fields
- **Embedding**: Use `embed=contributors` to include related resources in a single request
- **Respect the service**: Add delays between rapid sequential requests; use the `links.next` URL for pagination

## References

- [OSF](https://osf.io/)
- [OSF API Documentation](https://developer.osf.io/)
- [OSF Preprints](https://osf.io/preprints/)
- [OSF Registrations (Preregistration)](https://osf.io/registries/)
- [Center for Open Science](https://cos.io/)
