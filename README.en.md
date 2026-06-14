<div align="center">

<img src="assets/logo.png" width="160" alt="Research-Claw · 科研龙虾" />

# An entire research brain for your AI agent

**433 academic skills · 34 scholarly-database tools · the full research lifecycle**

One command teaches your AI assistant to search the literature, write reviews, run regressions,
manage citations, and draft grants — the built-in skill library of
[Research-Claw](https://github.com/wentorai/Research-Claw), also compatible with 40+ agent frameworks.

[![npm](https://img.shields.io/npm/v/@wentorai/research-plugins?style=flat-square&color=EF4444&logo=npm)](https://www.npmjs.com/package/@wentorai/research-plugins)
[![License](https://img.shields.io/badge/license-MIT-3B82F6?style=flat-square)](LICENSE)
[![Skills](https://img.shields.io/badge/skills-433-EF4444?style=flat-square)](catalog.json)
[![Tools](https://img.shields.io/badge/API_tools-34-3B82F6?style=flat-square)](#agent-tools-34)
[![Frameworks](https://img.shields.io/badge/frameworks-40+-22C55E?style=flat-square)](#compatibility)

[🌐 wentor.ai](https://wentor.ai) · [🇨🇳 中文](README.md) · [🦞 Research-Claw](https://github.com/wentorai/Research-Claw) · [🪲 Issues](https://github.com/wentorai/research-plugins/issues)

</div>

---

## Why you need it

General-purpose LLMs can *talk* about research, but they can't **actually query databases, fetch full text, or run robustness checks** — they have no entry point into scholarly databases and don't know the right way to do each step of a study.

`research-plugins` fills both gaps:

- **34 tools** wire your agent directly into 18 free academic databases (OpenAlex, CrossRef, PubMed, arXiv…) so it really searches, resolves DOIs, traces citations, and finds open-access full text;
- **433 skills** (structured SKILL.md guides) teach the agent the correct way to do each step — from DID/IV causal inference to systematic reviews, reviewer rebuttals, LaTeX typesetting, and grant budgets.

Once installed, your agent stops being a chatbot that *talks* about research and becomes a research assistant that *gets the work done*.

---

## What it can do for you

All of these are things you can say to your agent right after installing — each scenario is backed by real skills/tools:

> **"Find highly-cited papers on causal inference from the last three years, prefer ones I can download for free."**
> The agent runs `search_openalex` sorted by citations → calls `find_oa_version` on each to locate the open-access copy → returns a list with PDF links.

> **"I'm doing a systematic review — set up the search, screening, and extraction workflow."**
> The agent follows `systematic-review-guide` to build a PRISMA flow → multi-database search with dedup → snowballs citations via `get_epmc_citations` → outputs a reproducible search record.

> **"Run a fixed-effects regression on this panel dataset and add robustness checks."**
> The agent uses `panel-data-guide` + `causal-inference-guide` to write the Stata/Python code → adds placebo tests, clustered standard errors, etc. per `robustness-checks`.

> **"The reviewers raised three points — draft a point-by-point response."**
> The agent breaks down each comment with the academic-writing skills → sorts them into "revised / clarified / politely rebutted" → produces a well-structured, appropriately-toned rebuttal.

> **"Turn this batch of Zotero references into a cited literature-review draft."**
> The agent completes metadata via `resolve_doi` / `search_crossref` → organizes structure with the citation-management and writing skills → outputs a draft with a properly formatted bibliography.

> **"I'm applying for an NSF grant — scaffold a proposal outline and a budget table."**
> The agent builds the section outline with `grant-writing-guide` + `nsf-grant-guide` → generates the budget via `grant-budget-guide` → can check `nsf-award-api-guide` for comparable funded projects.

---

## Quick Start

### Install (Research-Claw / OpenClaw)

```bash
openclaw plugins install @wentorai/research-plugins
```

Installs to `~/.openclaw/extensions/`. Restart the gateway and **all skills + tools auto-load** — ready out of the box.

### Install (Claude Code / Cursor / Windsurf / OpenCode, etc.)

```bash
npx skills add wentorai/research-plugins
```

> This installs SKILL.md files only (no API tools). Compatible with 40+ agent frameworks that support the skills protocol.

### Uninstall

```bash
# OpenClaw / Research-Claw — just remove the plugin directory
rm -rf ~/.openclaw/extensions/research-plugins

# npx skills — just remove the skills directory
rm -rf .skills/wentorai/research-plugins
```

> **pnpm projects:** Do not add this as a pnpm dependency and load it from `node_modules` via `plugins.load.paths`. pnpm hardlinks are rejected by OpenClaw's security validator (`unsafe plugin manifest path`). Always use `openclaw plugins install`.

---

## What's Inside

### Academic Skills (433)

Structured SKILL.md guides covering the full research lifecycle, loaded on demand:

| Category | Count | Coverage |
|:--|:--|:--|
| **Literature** | 80 | Multi-database search · Citation tracking · Full-text · Open access · Paper radar |
| **Methodology** | 52 | Systematic review · Deep research · Experimental design · Peer review · Grants · Automation |
| **Data Analysis** | 44 | Causal inference · Econometrics · Statistical modeling · Data wrangling · Visualization |
| **Writing** | 62 | Paper sections · LaTeX · References · Citation management · Templates · Polish |
| **Domains** | 147 | 16 disciplines: AI/ML · Biomedical · Economics · Law · Chemistry · Physics etc. |
| **Tools** | 48 | Diagrams · PDF parsing · Knowledge graphs · OCR · Scraping · Code execution |

Skills use **progressive disclosure**: 6 category entries → 40 subcategory indexes → 433 concrete skills. Agents load layer by layer on demand, never injecting everything into the context at once.

### Agent Tools (34)

TypeScript wrappers for 18 free academic database APIs, auto-registered as OpenClaw plugin tools:

| Module | Tools | Source |
|:--|:--|:--|
| `openalex` | `search_openalex` · `get_work` · `get_author_openalex` | OpenAlex (250M+ works) |
| `crossref` | `resolve_doi` · `search_crossref` | CrossRef (150M+ DOIs) |
| `arxiv` | `search_arxiv` · `get_arxiv_paper` | arXiv |
| `pubmed` | `search_pubmed` · `get_article` | PubMed / NCBI |
| `unpaywall` | `find_oa_version` | Unpaywall (open access) |
| `europe-pmc` | `search_europe_pmc` · `get_epmc_citations` · `get_epmc_references` | Europe PMC (33M+) |
| `opencitations` | `get_citations_open` · `get_references_open` · `get_citation_count` | OpenCitations (2B+ links) |
| `dblp` | `search_dblp` · `search_dblp_author` | DBLP (7M+ CS records) |
| `doaj` | `search_doaj` | DOAJ (9M+ OA articles) |
| `biorxiv` | `search_biorxiv` · `search_medrxiv` · `get_preprint_by_doi` | bioRxiv / medRxiv |
| `openaire` | `search_openaire` | OpenAIRE (170M+, EU funder filter) |
| `zenodo` | `search_zenodo` · `get_zenodo_record` | Zenodo |
| `orcid` | `search_orcid` · `get_orcid_works` | ORCID |
| `inspire-hep` | `search_inspire` · `get_inspire_paper` | INSPIRE-HEP (physics) |
| `hal` | `search_hal` | HAL (French open archive) |
| `osf-preprints` | `search_osf_preprints` | OSF Preprints |
| `datacite` | `search_datacite` · `resolve_datacite_doi` | DataCite (dataset DOIs) |
| `ror` | `search_ror` | ROR (research organizations) |

> All built on **free** academic APIs — no paid subscription, no API key required to get started.

### Curated Resources (6)

Each skill category ships with a hand-picked list of high-quality resources, with categorized recommendations — see the [`curated/`](curated/) directory as a fast entry point for discovering tools and methods.

---

## Compatibility

`research-plugins` serves two kinds of users at once:

- **Research-Claw / OpenClaw**: loaded as a full plugin (skills + 34 API tools) via `openclaw plugins install`.
- **40+ other agent frameworks** (Claude Code, Cursor, Windsurf, OpenCode, and any tool supporting the skills protocol): skills only, via `npx skills add`.

Either way, skills follow the open Agent Skills specification — plug and play.

---

## Architecture

```
@wentorai/research-plugins
├── skills/                    ← 433 SKILL.md (6 categories × 40 subcategories)
│   ├── literature/            ← Search, discovery, full-text, metadata
│   ├── research/              ← Methodology, reviews, peer review, grants
│   ├── analysis/              ← Statistics, causal inference, dataviz
│   ├── writing/               ← Composition, citation, LaTeX, polish
│   ├── domains/               ← 16 academic disciplines
│   └── tools/                 ← Diagrams, documents, scraping, OCR
├── src/tools/                 ← 34 API tools (18 modules)
├── curated/                   ← 6 curated resource lists
├── catalog.json               ← Full index (457 entries)
├── index.ts                   ← Plugin entry (OpenClaw Plugin SDK)
└── openclaw.plugin.json       ← Plugin manifest
```

---

## Community Attribution

This project curates, organizes, and enhances publicly available academic resources.

- **Skills** are authored guides based on established research methodologies, public API docs, and widely-used workflows. Where content derives from specific projects, the `source` field in each SKILL.md frontmatter links to the original.
- **Curated lists** aggregate community resource links for discovery purposes.

All original content is released under the [MIT License](LICENSE). Referenced third-party projects retain their own licenses.

---

## Contributing

Contributions of new skills and resources are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE) — Copyright (c) 2026 Wentor AI
