---
name: repository-harvesting-guide
description: "Harvest papers from institutional and subject repositories at scale"
metadata:
  openclaw:
    emoji: "inbox_tray"
    category: "literature"
    subcategory: "fulltext"
    keywords: ["repository harvesting", "OAI-PMH", "institutional repository", "open access", "metadata harvesting", "preprints"]
    source: "wentor-research-plugins"
---

# Repository Harvesting Guide

A skill for systematically harvesting research papers and metadata from institutional repositories, preprint servers, and open access archives. Covers OAI-PMH protocol, API-based harvesting, and tools for building comprehensive literature datasets.

## Repository Landscape

### Types of Repositories

```
Institutional Repositories (IR):
  - Run by universities to archive their researchers' output
  - Examples: DSpace, EPrints, Fedora-based systems
  - Discovery: OpenDOAR directory (v2.sherpa.ac.uk/opendoar)

Subject Repositories:
  - Discipline-specific archives
  - arXiv (physics, CS, math), bioRxiv, SSRN, RePEc, EarthArXiv

Aggregators:
  - Harvest from many repositories into a single search interface
  - BASE (Bielefeld Academic Search Engine)
  - CORE (core.ac.uk, 200M+ open access articles)
  - OpenAIRE (European research output)
```

## OAI-PMH Harvesting

### Protocol Overview

The Open Archives Initiative Protocol for Metadata Harvesting (OAI-PMH) is the standard protocol for harvesting metadata from repositories. Most institutional repositories support it.

```python
import xml.etree.ElementTree as ET
import urllib.request


def harvest_oai_records(base_url: str, metadata_prefix: str = "oai_dc",
                        set_spec: str = None, from_date: str = None) -> list:
    """
    Harvest metadata records from an OAI-PMH endpoint.

    Args:
        base_url: The OAI-PMH base URL of the repository
        metadata_prefix: Metadata format (oai_dc, datacite, mets, etc.)
        set_spec: Optional set to restrict harvesting
        from_date: Optional date filter (YYYY-MM-DD)
    """
    params = f"?verb=ListRecords&metadataPrefix={metadata_prefix}"
    if set_spec:
        params += f"&set={set_spec}"
    if from_date:
        params += f"&from={from_date}"

    url = base_url + params
    records = []

    while url:
        response = urllib.request.urlopen(url)
        tree = ET.parse(response)
        root = tree.getroot()

        ns = {"oai": "http://www.openarchives.org/OAI/2.0/"}

        for record in root.findall(".//oai:record", ns):
            header = record.find("oai:header", ns)
            identifier = header.find("oai:identifier", ns).text
            datestamp = header.find("oai:datestamp", ns).text
            records.append({
                "identifier": identifier,
                "datestamp": datestamp
            })

        # Handle resumption token for pagination
        token_elem = root.find(".//oai:resumptionToken", ns)
        if token_elem is not None and token_elem.text:
            url = f"{base_url}?verb=ListRecords&resumptionToken={token_elem.text}"
        else:
            url = None

    return records
```

### OAI-PMH Verbs

```
Identify          — Get repository information
ListSets          — List available sets (collections)
ListMetadataFormats — List supported metadata formats
ListIdentifiers   — List record headers (lightweight)
ListRecords        — List full metadata records
GetRecord          — Retrieve a single record by identifier
```

## API-Based Harvesting

### CORE API

```python
import urllib.request
import json
import os


def search_core_api(query: str, limit: int = 100) -> list:
    """
    Search CORE.ac.uk for open access papers.

    Args:
        query: Search query string
        limit: Maximum number of results
    """
    api_key = os.environ["CORE_API_KEY"]
    url = "https://api.core.ac.uk/v3/search/works"
    headers = {"Authorization": f"Bearer {api_key}"}

    params = f"?q={urllib.parse.quote(query)}&limit={limit}"
    req = urllib.request.Request(url + params, headers=headers)
    response = urllib.request.urlopen(req)
    data = json.loads(response.read())

    results = []
    for item in data.get("results", []):
        results.append({
            "title": item.get("title"),
            "doi": item.get("doi"),
            "year": item.get("yearPublished"),
            "download_url": item.get("downloadUrl"),
            "repository": item.get("sourceFulltextUrls", [])
        })

    return results
```

### Crossref and Unpaywall APIs

```python
def find_open_access_version(doi: str) -> dict:
    """
    Check Unpaywall for an open access version of a paper.

    Args:
        doi: The DOI of the paper
    """
    email = os.environ["CONTACT_EMAIL"]
    url = f"https://api.unpaywall.org/v2/{doi}?email={email}"

    req = urllib.request.Request(url)
    response = urllib.request.urlopen(req)
    data = json.loads(response.read())

    best_oa = data.get("best_oa_location", {})

    return {
        "is_oa": data.get("is_oa", False),
        "oa_status": data.get("oa_status"),
        "pdf_url": best_oa.get("url_for_pdf") if best_oa else None,
        "host_type": best_oa.get("host_type") if best_oa else None
    }
```

## Building a Harvesting Pipeline

### Workflow for Systematic Collection

```
1. Identify target repositories
   - Use OpenDOAR to find IRs in your research area
   - List preprint servers relevant to your discipline

2. Test OAI-PMH endpoints
   - Send an Identify request to verify the endpoint is active
   - Check ListMetadataFormats for available schemas

3. Harvest incrementally
   - Use the "from" parameter to harvest only new records
   - Store the last harvest date for each repository
   - Respect rate limits (typically 1 request per second)

4. Deduplicate
   - Match records by DOI when available
   - Use title + author fuzzy matching for records without DOIs
   - Flag duplicates rather than deleting (keep provenance)

5. Store and index
   - Save metadata in a structured format (JSON, SQLite, or CSV)
   - Build a local search index for efficient retrieval
```

## Ethical and Legal Considerations

- Always respect robots.txt and rate limits
- Harvesting metadata is generally permitted; bulk full-text download may require permission
- Check each repository's terms of use
- Use harvested data for research purposes, not commercial redistribution
- Attribute the source repository in any publications using harvested data
