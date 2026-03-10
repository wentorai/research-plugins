---
name: legal-research-methods
description: "Systematic legal research methods for case law, statutes, and regulations"
metadata:
  openclaw:
    emoji: "⚖️"
    category: "domains"
    subcategory: "law"
    keywords: ["legal research", "case law", "statute analysis", "legal databases", "regulatory analysis", "legal methodology"]
    source: "https://clawhub.ai/legal-research"
---

# Legal Research Methods

## Overview

Legal research involves finding and analyzing primary legal authorities (case law, statutes, regulations) and secondary sources (treatises, law reviews, restatements) to answer legal questions. This guide covers systematic research methodologies, major free and commercial databases, citation practices, and analysis frameworks used in both legal practice and law and economics scholarship.

## Legal Source Hierarchy

| Authority | Type | Weight | Examples |
|-----------|------|--------|---------|
| **Constitutional provisions** | Primary, mandatory | Highest | U.S. Constitution, Basic Law |
| **Statutes / Legislation** | Primary, mandatory | Very high | USC (federal), state codes |
| **Administrative regulations** | Primary, mandatory | High | CFR (federal), agency rules |
| **Case law (binding)** | Primary, mandatory | High | Supreme Court, circuit court (same circuit) |
| **Case law (persuasive)** | Primary, persuasive | Moderate | Other circuits, state courts, foreign courts |
| **Legislative history** | Secondary, persuasive | Moderate | Committee reports, floor debates |
| **Treatises** | Secondary, persuasive | Moderate | Prosser on Torts, Corbin on Contracts |
| **Law review articles** | Secondary, persuasive | Low-Moderate | Peer commentary, novel arguments |
| **Restatements** | Secondary, persuasive | Moderate | ALI Restatements (Torts, Contracts) |
| **Legal encyclopedias** | Secondary, reference | Low | Am Jur 2d, CJS |

## Free Legal Databases

| Database | Coverage | URL | Best For |
|----------|----------|-----|---------|
| **Google Scholar** (Case Law) | US federal + state opinions | scholar.google.com | Quick case search, citation checking |
| **CourtListener** | 8M+ opinions, PACER filings | courtlistener.com | Federal litigation, RECAP archive |
| **Caselaw Access Project** | 6.9M US cases (Harvard Law) | case.law | Historical research, bulk analysis |
| **Congress.gov** | Federal bills and laws | congress.gov | Legislative history |
| **GovInfo** | CFR, Federal Register, USC | govinfo.gov | Regulations, statutory text |
| **Cornell LII** | USC, CFR, Supreme Court | law.cornell.edu | Statutory lookup, Wex definitions |
| **Justia** | Federal + state cases, codes | justia.com | Free comprehensive search |
| **SSRN** | Working papers | ssrn.com | Legal scholarship preprints |
| **HeinOnline** | Law reviews (institutional) | heinonline.org | Historical law journals |

## Research Methodology

### The IRAC Framework

For analyzing legal questions:

```
Issue:       What is the legal question?
Rule:        What law (statute, case, regulation) governs this issue?
Application: How does the rule apply to the specific facts?
Conclusion:  What is the likely outcome?
```

### Systematic Case Research Process

```markdown
Step 1: Identify the Legal Issue
  - Frame as a specific, answerable question
  - Identify jurisdiction (federal, state, international)
  - Identify area of law (contract, tort, constitutional, regulatory)

Step 2: Find Controlling Statutes
  - Search USC (federal) or state code for relevant provisions
  - Read the full statutory section, not just the key subsection
  - Check for recent amendments (currency)
  - Note any implementing regulations (CFR)

Step 3: Find Leading Cases
  - Start with secondary sources (treatise, ALR annotation) for overview
  - Use headnotes/key numbers to find on-point cases
  - Prioritize: Supreme Court > Circuit Court > District Court
  - Prioritize: Recent > Older (unless seminal)

Step 4: Expand Through Citation Networks
  - Forward: Who cited this case? (Citator / "Cited by")
  - Backward: What does this case cite? (Footnotes)
  - Negative treatment: Was this case overruled or distinguished?

Step 5: Verify Currency (Shepardize/KeyCite)
  - Check if cases are still good law
  - Check for legislative amendments to statutes
  - Check for new regulations affecting the area

Step 6: Synthesize and Analyze
  - Identify the majority rule vs. minority rule
  - Note circuit splits
  - Distinguish binding vs. persuasive authority
  - Identify trends in recent decisions
```

### Boolean Search Syntax for Legal Databases

```
Westlaw:  "due process" /s "property right" & date(aft 2020)
Lexis:    "due process" w/s "property right" AND date aft 2020
Google Scholar: "due process" "property right" (with case law checkbox)
CourtListener: "due process" AND "property right" filed_after:2020-01-01
```

| Operator | Westlaw | Lexis | Google Scholar |
|----------|---------|-------|---------------|
| AND | & | AND | (implicit) |
| OR | (space) | OR | OR |
| NOT | but not | AND NOT | - (minus) |
| Phrase | "exact phrase" | "exact phrase" | "exact phrase" |
| Within sentence | /s | w/s | N/A |
| Within paragraph | /p | w/p | N/A |
| Proximity | /n (within n words) | w/n | N/A |

## Empirical Legal Research

For law and economics / quantitative legal studies:

### Common Data Sources

| Source | Coverage | Format | Research Use |
|--------|----------|--------|-------------|
| **Federal Judicial Center** | Federal court statistics | CSV | Case processing times, judicial behavior |
| **PACER / RECAP** | Federal docket data | PDF/XML | Litigation patterns, filing trends |
| **Caselaw Access Project API** | 6.9M case opinions | JSON API | Text analysis, citation networks |
| **SEC EDGAR** | Corporate filings | XBRL/HTML | Securities regulation, corporate governance |
| **BLS / Census** | Economic data | CSV | Regulatory impact analysis |

### Citation Network Analysis

```python
# Using CourtListener API for citation analysis
import requests

BASE_URL = "https://www.courtlistener.com/api/rest/v3"

def get_case_citations(case_id: str) -> dict:
    """Get citing and cited cases for a given opinion."""
    # Get case details
    resp = requests.get(f"{BASE_URL}/opinions/{case_id}/",
                        params={"fields": "citations,citing"})
    return resp.json()

def build_citation_network(seed_case: str, depth: int = 2):
    """Build citation network from a seed case."""
    network = {"nodes": set(), "edges": []}
    queue = [(seed_case, 0)]

    while queue:
        case_id, level = queue.pop(0)
        if level >= depth or case_id in network["nodes"]:
            continue
        network["nodes"].add(case_id)
        data = get_case_citations(case_id)
        for cited in data.get("citations", []):
            network["edges"].append((case_id, cited))
            queue.append((cited, level + 1))

    return network
```

## Legal Citation Format (Bluebook)

```
Cases:
  Brown v. Board of Education, 347 U.S. 483 (1954).
  [Case Name], [Volume] [Reporter] [Page] ([Court] [Year]).

Statutes:
  42 U.S.C. § 1983 (2018).
  [Title] [Code] § [Section] ([Year]).

Law Reviews:
  Cass R. Sunstein, On the Expressive Function of Law, 144 U. Pa. L. Rev. 2021 (1996).
  [Author], [Title], [Volume] [Journal] [Page] ([Year]).

Regulations:
  17 C.F.R. § 240.10b-5 (2023).
  [Title] C.F.R. § [Section] ([Year]).
```

## References

- [CourtListener API](https://www.courtlistener.com/help/api/)
- [Caselaw Access Project](https://case.law/)
- [Cornell Legal Information Institute](https://www.law.cornell.edu/)
- [The Bluebook: A Uniform System of Citation](https://www.legalbluebook.com/)
- Epstein, L., & Martin, A. D. (2014). *An Introduction to Empirical Legal Research*. Oxford UP.
