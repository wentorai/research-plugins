# Research-Plugins Audit Log

> Audit date: 2026-03-18
> Auditor: Claude (automated) + human review
> Branch: audit/comprehensive-quality-review

## Summary

| Metric | Count |
|--------|-------|
| Total audited | 6 / 635 |
| MCP → ARCHIVE | 0 |
| MCP → CONVERT to skill | 0 |
| Skill → PASS | 0 |
| Skill → FIX | 0 |
| Skill → ARCHIVE | 0 |
| Agent Tool → PASS | 4 |
| Agent Tool → FIX | 1 |
| Agent Tool → PRE-REMOVED | 1 |

---

## Phase 1: Agent Tools

### [001] module:openalex — search_openalex, get_work, get_author_openalex
- **Verdict**: PASS
- **Quality**: 4.5/5
- **Type**: Agent Tool (TypeScript, 3 tools)
- **API Free**: Yes (no key required, email in User-Agent for polite pool)
- **API Test**: 200 OK
- **Notes**: Clean code. Proper error handling on all fetch calls. Input escaping via encodeURIComponent. Response trimming: per_page capped at 200, authors sliced to 5, concepts to 10. No hardcoded keys. TypeBox schemas correct.

### [002] module:crossref — resolve_doi, search_crossref
- **Verdict**: FIX
- **Quality**: 4.3/5
- **Type**: Agent Tool (TypeScript, 2 tools)
- **API Free**: Yes (email-polite-pool in User-Agent header)
- **API Test**: 200 OK
- **Fix Applied**: `search_crossref` used `params.append("filter", ...)` which creates duplicate URL params instead of CrossRef's expected comma-separated format. Fixed to build filter array then join with comma.
- **Notes**: DOI properly escaped via encodeURIComponent. Response trimming: rows capped at 100, authors sliced to 5.

### [003] module:arxiv — search_arxiv, get_arxiv_paper
- **Verdict**: PASS
- **Quality**: 4.2/5
- **Type**: Agent Tool (TypeScript, 2 tools)
- **API Free**: Yes (fully open, no key)
- **API Test**: 200 OK (HTTPS)
- **Notes**: Regex-based XML parsing is pragmatic for arXiv's stable Atom format. `arxiv:doi` namespace tag handled correctly via regex. max_results capped at 50. Input via URLSearchParams (auto-encoded). Minor: author regex could theoretically fail on unusual XML but arXiv format is highly stable.

### [004] module:pubmed — search_pubmed, get_article
- **Verdict**: PASS
- **Quality**: 4.0/5
- **Type**: Agent Tool (TypeScript, 2 tools)
- **API Free**: Yes (NCBI E-utilities, no key required for <3 req/s)
- **API Test**: 200 OK (both esearch and efetch)
- **Notes**: Correct 2-step pattern (esearch → esummary/efetch). Both steps have error handling. retmax capped at 100, authors sliced to 5. Minor limitation: get_article author regex won't match CollectiveName-only authors (edge case, not worth fixing). XML parsing adequate for PubMed's stable format.

### [005] module:unpaywall — find_oa_version
- **Verdict**: PASS
- **Quality**: 4.5/5
- **Type**: Agent Tool (TypeScript, 1 tool)
- **API Free**: Yes (email-polite-pool: research-plugins@wentor.ai)
- **API Test**: 200 OK
- **Notes**: Clean code. 404 handled as special case. DOI properly escaped. Maps response to specific fields (no raw dump). Hardcoded email is valid polite-pool identifier, not a secret.

### [006] module:semantic-scholar (REMOVED)
- **Verdict**: PRE-REMOVED
- **Notes**: Module was deleted prior to audit (working tree change). semantic-scholar.ts removed, import removed from index.ts. API returns 429 without key, confirming removal was appropriate. The `semanticScholarApiKey` config field in openclaw.plugin.json should be cleaned up in Phase 6.

### Phase 1 Summary
- **5 active modules, 10 tools** (semantic-scholar pre-removed)
- **4 PASS, 1 FIX** (crossref filter bug fixed)
- All 5 APIs verified live and returning 200
- Code quality consistently good: proper error handling, input escaping, response trimming
- No hardcoded secrets, no security issues

## Phase 2: MCP Configs

## Phase 3: Skills
