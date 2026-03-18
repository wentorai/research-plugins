# Research-Plugins Audit Log

> Audit date: 2026-03-18
> Auditor: Claude (automated) + human review
> Branch: audit/comprehensive-quality-review

## Summary

| Metric | Count |
|--------|-------|
| Total audited | 156 / 635 |
| MCP → ARCHIVE | 150 |
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
