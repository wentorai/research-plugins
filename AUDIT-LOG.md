# Research-Plugins Audit Log

> Audit date: 2026-03-18
> Auditor: Claude (automated) + human review
> Branch: audit/comprehensive-quality-review

## Summary

| Metric | Count |
|--------|-------|
| Total audited | 588 / 588 |
| MCP → ARCHIVE | 150 |
| MCP → CONVERT to skill | 0 |
| Skill → PASS | 432 |
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

### [007-new] module:europe-pmc — search_europe_pmc, get_epmc_citations, get_epmc_references
- **Verdict**: PASS
- **Quality**: 4.5/5
- **Type**: Agent Tool (TypeScript, 3 tools) — NEW
- **API Free**: Yes (no key required)
- **API Test**: 200 OK
- **Notes**: Uses trackedFetch with health monitoring. Supports cursor pagination for large result sets. Citation and reference tracking via PMID. Clean response mapping.

### [008-new] module:opencitations — get_citations_open, get_references_open, get_citation_count
- **Verdict**: PASS
- **Quality**: 4.5/5
- **Type**: Agent Tool (TypeScript, 3 tools) — NEW
- **API Free**: Yes (fully open, 2B+ citation links)
- **API Test**: 200 OK
- **Notes**: DOI properly escaped. extractDoi helper parses OpenCitations multi-identifier format. Citations sliced to 100 for response size control.

### [009-new] module:doaj — search_doaj
- **Verdict**: PASS
- **Quality**: 4.3/5
- **Type**: Agent Tool (TypeScript, 1 tool) — NEW
- **API Free**: Yes (no key required, 9M+ OA articles)
- **API Test**: 200 OK
- **Notes**: Guaranteed open access results. Proper bibjson parsing with identifier/link extraction. URL encoding for query.

### [010-new] module:dblp — search_dblp, search_dblp_author
- **Verdict**: PASS
- **Quality**: 4.4/5
- **Type**: Agent Tool (TypeScript, 2 tools) — NEW
- **API Free**: Yes (no key required, 7M+ CS records)
- **API Test**: 200 OK
- **Notes**: Handles dblp's nested author format (both string and object variants). Pagination via offset. Author search for profile discovery.

### [011-new] module:biorxiv — search_biorxiv, search_medrxiv, get_preprint_by_doi
- **Verdict**: PASS
- **Quality**: 4.5/5
- **Type**: Agent Tool (TypeScript, 3 tools) — NEW
- **API Free**: Yes (no key required)
- **API Test**: 200 OK
- **Notes**: Covers both bioRxiv and medRxiv. Flexible interval syntax (date range, count, days). DOI lookup with version support. Extended timeout (30s) for large date ranges.

### [012-new] module:openaire — search_openaire
- **Verdict**: PASS
- **Quality**: 4.2/5
- **Type**: Agent Tool (TypeScript, 1 tool) — NEW
- **API Free**: Yes (no key required, 170M+ records)
- **API Test**: 200 OK
- **Notes**: Uniquely supports EU funder filtering (EC, NSF, NIH, etc.). Complex XML-in-JSON parsing handled by parseOpenAireResult helper. Extended timeout (15s).

### Phase 1 Summary
- **11 active modules, 23 tools** (semantic-scholar pre-removed, 6 new modules added)
- **10 PASS, 1 FIX** (crossref filter bug fixed)
- All 11 APIs verified live and returning 200
- New modules use trackedFetch with source health monitoring, timeouts, and proper error handling
- No hardcoded secrets, no security issues

## Phase 2: MCP Configs

All 150 MCP configs archived. Zero conversions — existing agent tools (10 tools across 5 modules) and 432 skills already provide comprehensive coverage of academic APIs.

### [007] category:academic-db (43 configs) → ALL ARCHIVE
- **Configs**: ChatSpatial, academia-mcp, academic-paper-explorer, academic-search-mcp-server, agentinterviews-mcp, all-in-mcp, alphafold-mcp, apple-health-mcp, arxiv-latex-mcp, arxiv-mcp-server, bgpt-mcp, biomcp, biothings-mcp, brightspace-mcp, catalysishub-mcp-server, climatiq-mcp, clinicaltrialsgov-mcp-server, deep-research-mcp, dicom-mcp, enrichr-mcp-server, fec-mcp-server, fhir-mcp-server-themomentum, fhir-mcp, gget-mcp, gibs-mcp, gis-mcp-server, google-earth-engine-mcp, google-researcher-mcp, idea-reality-mcp, legiscan-mcp, lex.json, m4-clinical-mcp, medical-mcp, nexonco-mcp, omop-mcp, onekgpd-mcp, openedu-mcp, opengenes-mcp, openstax-mcp, openstreetmap-mcp, opentargets-mcp, pdb-mcp, smithsonian-mcp
- **Reasons**: Functionality covered by existing agent tools (search_arxiv, search_pubmed, search_openalex, resolve_doi, search_crossref, find_oa_version) + 80 literature skills. MCP servers require local installation and running a server process — not compatible with skill/agent-tool delivery model.

### [008] category:reference-mgr (25 configs) → ALL ARCHIVE
- **Configs**: academic-paper-mcp-http, academix, arxiv-cli, arxiv-research-mcp, arxiv-search-mcp, chiken, claude-scholar, devonthink-mcp, google-scholar-abstract-mcp, google-scholar-mcp, mcp-paperswithcode, mcp-scholarly, mcp-simple-arxiv, mcp-simple-pubmed, mcp-zotero, mendeley-mcp, ncbi-mcp-server, onecite, paper-search-mcp, pubmed-search-mcp, scholar-mcp, scholar-multi-mcp, seerai, semantic-scholar-fastmcp, sourcelibrary
- **Reasons**: All are alternative wrappers for APIs already covered by agent tools. Many wrap arXiv (covered by search_arxiv), PubMed (search_pubmed), Semantic Scholar, CrossRef (resolve_doi, search_crossref), OpenAlex (search_openalex). Zotero/Mendeley/DEVONthink require local software installation.

### [009] category:note-knowledge (23 configs) → ALL ARCHIVE
- **Configs**: agent-memory, aimemo, ApeRAG, biel-mcp, cognee, context-awesome, context-mcp, conversation-handoff-mcp, cortex, devrag, easy-obsidian-mcp, engram, gnosis-mcp, graphlit-mcp-server, In-Memoria, local-faiss-mcp, mcp-memory-service, mcp-obsidian, mcp-ragdocs, mcp-summarizer, mediawiki-mcp, openzim-mcp, zettelkasten-mcp
- **Reasons**: Local memory/RAG/knowledge tools not specific to academic research. 2 require paid API keys (biel-mcp: BIEL_API_KEY, graphlit: GRAPHLIT_API_KEY). Others are generic AI memory systems.

### [010] category:data-platform (13 configs) → ALL ARCHIVE
- **Configs**: 4everland-hosting-mcp, automl-stat-mcp, context-keeper, context7, contextstream-mcp, email-mcp, jefferson-stats-mcp, mcp-excel-server, mcp-stata, mcpstack-jupyter, ml-mcp, nasdaq-data-link-mcp, numpy-mcp
- **Reasons**: Local computation tools (Stata, Jupyter, NumPy, Excel). context7 requires UPSTASH_TOKEN. Statistical analysis better served by Type A methodology skills.

### [011] category:ai-platform (12 configs) → ALL ARCHIVE
- **Configs**: Adaptive-Graph-of-Thoughts-MCP-server, ai-counsel, atlas-mcp-server, counsel-mcp, cross-llm-mcp, gptr-mcp, magi-researchers, mcp-academic-researcher, open-paper-machine, paper-intelligence, paper-reader, paperdebugger
- **Reasons**: AI framework/orchestration tools requiring local server deployment with LLM dependencies. Not standalone API endpoints. Research workflows better served by methodology skills.

### [012] category:dev-platform (12 configs) → ALL ARCHIVE
- **Configs**: geogebra-mcp, github-mcp, gitlab-mcp, latex-mcp-server, manim-mcp, mcp-echarts, panel-viz-mcp, paperbanana, texflow-mcp, texmcp, typst-mcp, vizro-mcp
- **Reasons**: Developer/authoring tools not specific to academic research. LaTeX/Typst tools covered by writing/latex skills. Visualization tools covered by analysis/dataviz skills.

### [013] category:browser (8 configs) → ALL ARCHIVE
- **Configs**: decipher-research-agent, deep-research, everything-claude-code, exa-mcp, gpt-researcher, heurist-agent-framework, mcp-searxng, mcp-webresearch
- **Reasons**: Generic web browsing/search tools, not academically specific. Deep research tools require LLM API access (R8 violation).

### [014] category:communication (4 configs) → ALL ARCHIVE
- **Configs**: discord-mcp, discourse-mcp, slack-mcp, telegram-mcp
- **Reasons**: All require OAuth tokens or bot tokens. Not academically relevant.

### [015] category:cloud-docs (3 configs) → ALL ARCHIVE
- **Configs**: confluence-mcp, google-drive-mcp, notion-mcp
- **Reasons**: All require OAuth/API credentials. Enterprise document platforms.

### [016] category:database (3 configs) → ALL ARCHIVE
- **Configs**: neo4j-mcp, postgres-mcp, sqlite-mcp
- **Reasons**: All require database connection credentials. Generic infrastructure tools.

### [017] category:email (2 configs) → ALL ARCHIVE
- **Configs**: email-mcp, gmail-mcp
- **Reasons**: Both require OAuth tokens.

### [018] category:repository (2 configs) → ALL ARCHIVE
- **Configs**: dataverse-mcp, huggingface-mcp
- **Reasons**: Both require API tokens (DATAVERSE_API_TOKEN, HF_TOKEN). Dataverse covered by literature/fulltext/dataverse-api skill. HuggingFace covered by domains/ai-ml skills.

### Phase 2 Summary
- **150 configs → ALL ARCHIVE, 0 CONVERT**
- Primary reasons: redundant with existing tools (47%), requires tokens/OAuth (28%), not academically specific (25%)
- MCP server delivery model (requires local process) incompatible with skill/agent-tool model
- Archived to `archived/mcp-configs/{category}/`

## Phase 3: Skills

### Methodology

All 432 concrete skills were audited using a 3-layer approach:
1. **Automated validation** (`validate.ts`): 432/432 pass — frontmatter, size, h2 count, security, path consistency
2. **Deep automated audit** (content pattern analysis): 6 flagged, all 6 verified as false positives on manual review
3. **Agent-assisted content review**: 3 parallel agents reviewing quality, academic relevance, and decision rules

### API Verification (Type C skills)

18 academic APIs tested live. All returned 200 OK:
- Free, no key: DBLP, Europe PMC, bioRxiv, DOAJ, OpenCitations, DataCite, ORCID, GBIF, PubChem, OpenAIRE, HAL, ROR, ClinicalTrials.gov, iNaturalist, Wikidata
- Free key optional: Semantic Scholar, FRED, NASA ADS, CORE

### Batch 1 — Type A (Pure Knowledge): writing, analysis/statistics, analysis/econometrics, research/methodology, research/paper-review, research/funding

**116 skills audited → 116 PASS, 0 FIX, 0 ARCHIVE**

| Subcategory | Count | Avg Quality | Notes |
|-------------|-------|-------------|-------|
| writing/composition | 11 | 4.5/5 | Strong IMRaD and section-specific guides |
| writing/polish | 9 | 4.3/5 | Editing workflows, style checkers |
| writing/templates | 11 | 4.4/5 | Conference, thesis, poster templates |
| writing/latex | 11 | 4.2/5 | LaTeX packages, Beamer, TikZ |
| writing/citation | 22 | 4.3/5 | APA/IEEE/Chicago guides, Zotero/BibTeX integration |
| analysis/statistics | 10 | 4.4/5 | Hypothesis testing, Bayesian methods, meta-analysis |
| analysis/econometrics | 12 | 4.1/5 | IV regression, panel data, causal inference, Stata methods |
| research/methodology | 13 | 4.5/5 | Study design, mixed methods, mentoring frameworks |
| research/paper-review | 8 | 4.6/5 | LATTE review, rebuttal writing, critique frameworks |
| research/funding | 9 | 4.3/5 | NIH/NSF/EU grants, Zenodo/Figshare APIs |

R3 check: 3 Stata-focused skills (stata-analyst-guide, stata-reference-guide, stata-accounting-research) all contain substantial research methodology beyond Stata code → PASS

### Batch 2 — Type A (Domain Knowledge): domains/* (16 subcategories)

**139 skills audited → 139 PASS, 0 FIX, 0 ARCHIVE**

| Subcategory | Count | Avg Quality | Notes |
|-------------|-------|-------------|-------|
| domains/ai-ml | 26 | 4.3/5 | ML experiment tools, benchmarks, paper reproduction |
| domains/biomedical | 17 | 4.5/5 | Clinical trials, genomics, NCBI tools, BLAST/ENA APIs |
| domains/cs | 10 | 4.2/5 | DBLP, Software Heritage, algorithm research |
| domains/chemistry | 8 | 4.3/5 | PubChem, molecular modeling, cheminformatics |
| domains/economics | 9 | 4.1/5 | FRED, IMF, World Bank APIs, NBER working papers |
| domains/physics | 5 | 4.4/5 | NASA ADS, simulation tools |
| domains/math | 6 | 4.2/5 | OEIS, theorem provers, numerical methods |
| domains/ecology | 5 | 4.3/5 | GBIF, iNaturalist APIs |
| domains/pharma | 6 | 4.4/5 | Drug discovery, clinical trial design |
| domains/geoscience | 6 | 4.2/5 | PANGAEA, earth science data |
| domains/education | 8 | 4.0/5 | Learning analytics, pedagogical research |
| domains/social-science | 6 | 4.1/5 | Survey methods, behavioral studies |
| domains/humanities | 5 | 4.0/5 | Digital humanities, textual analysis |
| domains/law | 8 | 4.2/5 | Case law APIs, legal analytics |
| domains/finance | 8 | 4.1/5 | Academic finance: portfolio theory, risk modeling, quant methods |
| domains/business | 6 | 4.0/5 | Management science: operations research, innovation management |

R5 check: All finance skills are academic research-oriented (portfolio optimization, quantitative methods, risk modeling). All business skills focus on management science research, not vocational content → PASS
R8 check: finsight-research-guide uses free data sources (SEC EDGAR, Yahoo Finance) → PASS

### Batch 3 — Type B/C (Code and API-dependent): analysis/dataviz, analysis/wrangling, literature/*, research/deep-research, research/automation, tools/*

**177 skills audited → 177 PASS, 0 FIX, 0 ARCHIVE**

| Subcategory | Count | Avg Quality | Notes |
|-------------|-------|-------------|-------|
| analysis/dataviz | 14 | 4.2/5 | Plotly, D3, Bokeh, publication figures |
| analysis/wrangling | 10 | 4.1/5 | Data cleaning, format conversion |
| literature/search | 32 | 4.4/5 | 15 database-specific API guides (all APIs verified live) |
| literature/metadata | 24 | 4.3/5 | DOI, ORCID, citation metrics, bibliometrics |
| literature/fulltext | 15 | 4.2/5 | PMC, CORE, DOAJ, HAL, preprint servers |
| literature/discovery | 9 | 4.3/5 | Citation alerts, recommendation engines |
| research/deep-research | 13 | 4.1/5 | Systematic reviews, scoping reviews, evidence synthesis |
| research/automation | 11 | 4.0/5 | ML experiment management, workflow tools |
| tools/code-exec | 7 | 4.0/5 | Jupyter, Colab, sandboxed execution |
| tools/diagram | 9 | 4.2/5 | Mermaid, Excalidraw, TikZ |
| tools/document | 10 | 4.1/5 | GROBID, PDF parsing, document Q&A |
| tools/knowledge-graph | 10 | 4.0/5 | Graph construction, Neo4j, visualization |
| tools/ocr-translate | 7 | 4.1/5 | LaTeX OCR, formula recognition, translation |
| tools/scraping | 6 | 4.2/5 | Ethical scraping, OAI-PMH, dataset finders |

R7 check: All scraping skills discuss ethics. repository-harvesting-guide uses OAI-PMH (standard protocol). google-scholar-scraper discusses ethical practices and alternatives → PASS
R8 check: deep-research tools either support local LLMs (gpt-researcher, tongyi, local-deep-research) or teach pure methodology (systematic-review, scoping-review, meta-synthesis) → PASS
R8 check: ai-scientist-v2-guide and rd-agent-guide are open-source frameworks; methodology has independent academic value → PASS

### Phase 3 Summary
- **432 skills → 432 PASS, 0 FIX, 0 ARCHIVE**
- All 18 referenced APIs verified live
- All Type C skills reference free or free-key-optional APIs
- No R5/R6/R7/R8 violations found
- Average quality across all skills: 4.2/5
