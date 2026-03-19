<div align="center">

<img src="assets/logo.png" width="160" alt="Research-Claw · 科研龙虾" />

# @wentorai/research-plugins

**The brain of Research-Claw — 438 academic skills + 34 API tools**

Plug-and-play research capabilities for [Research-Claw](https://github.com/wentorai/Research-Claw) and 40+ AI agent frameworks

[![npm](https://img.shields.io/npm/v/@wentorai/research-plugins?style=flat-square&color=EF4444&logo=npm)](https://www.npmjs.com/package/@wentorai/research-plugins)
[![License](https://img.shields.io/badge/license-MIT-3B82F6?style=flat-square)](LICENSE)
[![Skills](https://img.shields.io/badge/skills-438-EF4444?style=flat-square)](https://www.npmjs.com/package/@wentorai/research-plugins)
[![Tools](https://img.shields.io/badge/API_tools-34-3B82F6?style=flat-square)](#agent-tools-34)

[🌐 wentor.ai](https://wentor.ai) · [🇨🇳 中文](README.md) · [🦞 Research-Claw](https://github.com/wentorai/Research-Claw) · [🪲 Issues](https://github.com/wentorai/research-plugins/issues)

</div>

---

## Quick Start

### Install (Research-Claw / OpenClaw)

```bash
openclaw plugins install @wentorai/research-plugins
```

Installs to `~/.openclaw/extensions/`. Restart the gateway to auto-load all skills + tools.

### Install (Claude Code / Cursor / Windsurf / OpenCode)

```bash
npx skills add wentorai/research-plugins
```

> This installs SKILL.md files only (no API tools). Compatible with 41 agent frameworks supporting the skills protocol.

### Uninstall

```bash
# OpenClaw / Research-Claw — manually remove plugin directory
rm -rf ~/.openclaw/extensions/research-plugins

# npx skills — manually remove skills directory
rm -rf .skills/wentorai/research-plugins
```

> **pnpm projects:** Do not add this as a pnpm dependency and load from `node_modules` via `plugins.load.paths`. pnpm hardlinks are rejected by OpenClaw's security validator. Always use `openclaw plugins install`.

---

## What's Inside

### Academic Skills (438)

Structured SKILL.md guides covering the full research lifecycle, loaded on demand:

| Category | Count | Coverage |
|:--|:--|:--|
| **Literature** | 87 | Multi-database search · Citation tracking · Full-text · Open access |
| **Methodology** | 79 | DID · RDD · IV · Meta-analysis · Systematic review · Grant writing |
| **Data Analysis** | 68 | Python · R · STATA · Visualization · Panel data · Econometrics |
| **Writing** | 74 | Paper sections · LaTeX · References · Rebuttal generation |
| **Domains** | 93 | 16 disciplines: CS · AI/ML · Biomedical · Economics · Law · Physics etc. |
| **Tools** | 51 | Diagrams · PDF parsing · Knowledge graphs · OCR · Scraping |

Skills use **progressive disclosure**: 6 category entries → 40 subcategory indexes → 438 concrete skills. Agents load on demand, never injecting everything at once.

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

### Curated Resources (6)

Hand-picked resource collections for each skill category. See `curated/` directory.

---

## Architecture

```
@wentorai/research-plugins
├── skills/                    ← 438 SKILL.md (6 categories × 40 subcategories)
│   ├── literature/            ← Search, discovery, full-text, metadata
│   ├── writing/               ← Composition, citation, LaTeX, polish
│   ├── analysis/              ← Statistics, econometrics, dataviz
│   ├── research/              ← Methodology, reviews, grants
│   ├── domains/               ← 16 academic disciplines
│   └── tools/                 ← Diagrams, documents, scraping, OCR
├── src/tools/                 ← 34 API tools (18 modules)
├── curated/                   ← 6 curated resource lists
├── catalog.json               ← Full index (462 entries)
├── index.ts                   ← Plugin entry (OpenClaw Plugin SDK)
└── openclaw.plugin.json       ← Plugin manifest
```

**Loading modes:**
- **Research-Claw / OpenClaw**: Full plugin (skills + API tools) via `openclaw plugins install`
- **Other agent frameworks**: SKILL.md files only (no API tools) via `npx skills add`

---

## Community Attribution

This project curates, organizes, and enhances publicly available academic resources.

- **Skills** are authored guides based on established research methodologies, public API docs, and widely-used workflows. Where content derives from specific projects, the `source` field in each SKILL.md frontmatter links to the original.
- **Curated lists** aggregate community resource links for discovery purposes.

All original content is released under the [MIT License](LICENSE). Referenced third-party projects retain their own licenses.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

[MIT](LICENSE) — Copyright (c) 2026 Wentor AI
