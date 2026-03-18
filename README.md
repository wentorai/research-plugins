# @wentorai/research-plugins

**[English](#english)** | **[中文](#中文)**

---

<a id="english"></a>

## Research Plugins for Research-Claw

An open-source collection of **427 academic research skills**, **34 agent tools** (18 API modules), and **6 curated resource lists** for [Research-Claw](https://wentor.ai) and other AI coding agents.

Built by [Wentor AI](https://wentor.ai) for the global research community.

### What's Inside

| Component | Count | Description |
|-----------|-------|-------------|
| **Skills** | 427 | Practical SKILL.md guides covering literature search, academic writing, data analysis, research methods, 16 domain specialties, and productivity tools |
| **Agent Tools** | 34 | TypeScript API wrappers for 18 academic databases: OpenAlex, CrossRef, arXiv, PubMed, Unpaywall, Europe PMC, OpenCitations, DOAJ, DBLP, bioRxiv/medRxiv, OpenAIRE, Zenodo, ORCID, INSPIRE-HEP, HAL, OSF, DataCite, ROR |
| **Curated Lists** | 6 | Hand-picked resource collections for each skill category |

> **Note:** 150 MCP server configs were archived in the v1.4.0 audit. See `archived/mcp-configs/` for reference.

### Taxonomy

Skills are organized into **6 categories** with **40 subcategories**:

| Category | Subcategories | Skills | Description |
|----------|---------------|--------|-------------|
| **literature** | search, discovery, fulltext, metadata | 79 | Paper search, citation tracking, open access |
| **writing** | composition, polish, latex, templates, citation | 64 | Academic writing, LaTeX, reference management |
| **analysis** | statistics, econometrics, wrangling, dataviz | 46 | Statistical methods, data cleaning, visualization |
| **research** | methodology, deep-research, paper-review, automation, funding | 53 | Research design, systematic reviews, grant writing |
| **domains** | 16 disciplines (CS, AI/ML, biomedical, chemistry, economics, finance, law, physics, math, ecology, etc.) | 137 | Domain-specific research methods and tools |
| **tools** | diagram, document, code-exec, scraping, knowledge-graph, ocr-translate | 48 | Diagrams, PDF parsing, reproducible code, OCR |

### Install

#### As OpenClaw Plugin (Recommended)

```bash
openclaw plugins install @wentorai/research-plugins
```

This installs the plugin to `~/.openclaw/extensions/` where OpenClaw auto-discovers it. Skills and agent tools are loaded automatically.

> **Note for satellite/pnpm projects:** Do not add this package as a `pnpm` dependency and load it from `node_modules` via `plugins.load.paths`. pnpm's content-addressable store uses hardlinks, which OpenClaw's security validator rejects (`unsafe plugin manifest path`). Always use `openclaw plugins install` instead.

#### As Skills Collection (Claude Code, Cursor, Windsurf, OpenCode)

```bash
npx skills add wentorai/research-plugins
```

#### Via npm

```bash
npm install @wentorai/research-plugins
```

### Agent Tools

34 tool functions across 18 academic API modules, registered automatically when used as an OpenClaw plugin. All APIs are free and open:

| Module | Tools | API |
|--------|-------|-----|
| `openalex` | `search_openalex`, `get_work`, `get_author_openalex` | OpenAlex (250M+ works) |
| `crossref` | `resolve_doi`, `search_crossref` | CrossRef (150M+ DOIs) |
| `arxiv` | `search_arxiv`, `get_arxiv_paper` | arXiv |
| `pubmed` | `search_pubmed`, `get_article` | PubMed / NCBI |
| `unpaywall` | `find_oa_version` | Unpaywall |
| `europe-pmc` | `search_europe_pmc`, `get_epmc_citations`, `get_epmc_references` | Europe PMC (33M+) |
| `opencitations` | `get_citations_open`, `get_references_open`, `get_citation_count` | OpenCitations (2B+ links) |
| `doaj` | `search_doaj` | DOAJ (9M+ OA articles) |
| `dblp` | `search_dblp`, `search_dblp_author` | DBLP (7M+ CS records) |
| `biorxiv` | `search_biorxiv`, `search_medrxiv`, `get_preprint_by_doi` | bioRxiv / medRxiv |
| `openaire` | `search_openaire` | OpenAIRE (170M+, EU funder filter) |
| `zenodo` | `search_zenodo`, `get_zenodo_record` | Zenodo |
| `orcid` | `search_orcid`, `get_orcid_works` | ORCID |
| `inspire-hep` | `search_inspire`, `get_inspire_paper` | INSPIRE-HEP (physics) |
| `hal` | `search_hal` | HAL (French open archive) |
| `osf-preprints` | `search_osf_preprints` | OSF Preprints |
| `datacite` | `search_datacite`, `resolve_datacite_doi` | DataCite (dataset DOIs) |
| `ror` | `search_ror` | ROR (research organizations) |

### Community Attribution

This project curates, organizes, and enhances publicly available academic resources from across the open-source ecosystem. We are grateful to the researchers, developers, and open-source communities whose work makes this collection possible.

- **Skills** are authored guides based on established research methodologies, public API documentation, and widely-used academic workflows. Where content is derived from specific open-source projects, the `source` field in each SKILL.md frontmatter links to the original.
- **Curated Lists** aggregate links to community resources and are provided for discovery purposes.

All original content in this repository is released under the [MIT License](LICENSE). Third-party projects referenced retain their own licenses.

### Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on adding skills and curated resources.

### License

[MIT](LICENSE) -- Copyright (c) 2026 Wentor AI

---

<a id="中文"></a>

## Research-Claw 科研插件集

一个开源的学术科研资源集合，包含 **427 个科研技能**、**34 个智能体工具**（18 个 API 模块）和 **6 个精选资源列表**，为 [Research-Claw (科研龙虾)](https://wentor.ai) 及其他 AI 编程助手而构建。

由 [Wentor AI](https://wentor.ai) 为全球科研社区打造。

### 包含内容

| 组件 | 数量 | 说明 |
|------|------|------|
| **技能 (Skills)** | 427 | 涵盖文献检索、学术写作、数据分析、研究方法、16 个学科领域及生产力工具的实用指南 |
| **智能体工具** | 34 | 封装 18 个学术数据库 API 的 TypeScript 工具：OpenAlex、CrossRef、arXiv、PubMed、Unpaywall、Europe PMC、OpenCitations、DOAJ、DBLP、bioRxiv/medRxiv、OpenAIRE、Zenodo、ORCID、INSPIRE-HEP、HAL、OSF、DataCite、ROR |
| **精选列表** | 6 | 按分类整理的优质资源推荐 |

> **注意**：150 个 MCP 服务器配置已在 v1.4.0 审计中归档。参见 `archived/mcp-configs/`。

### 分类体系

技能按 **6 大类别** 和 **40 个子分类** 组织：

| 类别 | 子分类 | 技能数 | 覆盖范围 |
|------|--------|--------|---------|
| **文献 (literature)** | 检索、发现、全文获取、元数据 | 79 | 论文搜索、引文追踪、开放获取 |
| **写作 (writing)** | 写作、润色、LaTeX、模板、引用 | 64 | 学术写作、LaTeX 排版、参考文献管理 |
| **分析 (analysis)** | 统计、计量经济、数据处理、可视化 | 46 | 统计方法、数据清洗、图表制作 |
| **研究 (research)** | 方法论、深度研究、论文评审、自动化、基金 | 53 | 研究设计、系统综述、基金申请 |
| **学科 (domains)** | 16 个学科方向 | 137 | 各学科专属研究方法与工具 |
| **工具 (tools)** | 图表、文档、代码执行、爬虫、知识图谱、OCR | 48 | 流程图、PDF 解析、可复现代码、OCR 翻译 |

### 安装方式

#### 作为 OpenClaw 插件（推荐）

```bash
openclaw plugins install @wentorai/research-plugins
```

插件会安装到 `~/.openclaw/extensions/`，OpenClaw 自动发现并加载所有技能和工具。

> **pnpm 项目注意**：请勿将本包作为 `pnpm` 依赖并通过 `plugins.load.paths` 从 `node_modules` 加载。pnpm 的内容寻址存储使用硬链接 (nlink > 1)，会被 OpenClaw 安全校验拒绝 (`unsafe plugin manifest path`)。请始终使用 `openclaw plugins install`。

#### 作为技能集合 (Claude Code, Cursor, Windsurf, OpenCode)

```bash
npx skills add wentorai/research-plugins
```

#### 通过 npm

```bash
npm install @wentorai/research-plugins
```

### 社区致谢与声明

本项目对互联网上公开可用的学术资源进行了遴选、整理和增强。我们感谢所有使这个集合成为可能的研究者、开发者和开源社区。

- **技能** 是基于成熟研究方法、公开 API 文档和广泛使用的学术工作流编写的实用指南。凡内容源自特定开源项目的，每个 SKILL.md 的 frontmatter 中 `source` 字段均标注了原始链接。
- **精选列表** 汇集社区资源链接，仅供发现和参考之用。

本仓库中的所有原创内容均以 [MIT 许可证](LICENSE) 发布。引用的第三方项目保留其各自的许可证。

### 参与贡献

请查阅 [CONTRIBUTING.md](CONTRIBUTING.md) 了解添加技能和精选资源的指南。

### 许可证

[MIT](LICENSE) -- Copyright (c) 2026 Wentor AI
