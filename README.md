<div align="center">

<img src="assets/logo.png" width="160" alt="科研龙虾 · Research-Claw" />

# 给 AI Agent 装上一整套科研大脑

**433 个学术技能 · 34 个学术数据库工具 · 覆盖科研全流程**

一行命令,让你的 AI 助手学会查文献、写综述、跑回归、管引文、写基金——
[科研龙虾 (Research-Claw)](https://github.com/wentorai/Research-Claw) 的内置技能库,同时兼容 40+ 主流 Agent 框架。

[![npm](https://img.shields.io/npm/v/@wentorai/research-plugins?style=flat-square&color=EF4444&logo=npm)](https://www.npmjs.com/package/@wentorai/research-plugins)
[![License](https://img.shields.io/badge/license-MIT-3B82F6?style=flat-square)](LICENSE)
[![Skills](https://img.shields.io/badge/skills-433-EF4444?style=flat-square)](catalog.json)
[![Tools](https://img.shields.io/badge/API_tools-34-3B82F6?style=flat-square)](#智能体工具34-个)
[![Frameworks](https://img.shields.io/badge/兼容框架-40+-22C55E?style=flat-square)](#兼容性)

[🌐 wentor.ai](https://wentor.ai) · [🇬🇧 English](README.en.md) · [🦞 Research-Claw](https://github.com/wentorai/Research-Claw) · [🪲 反馈问题](https://github.com/wentorai/research-plugins/issues)

</div>

---

## 为什么需要它

通用大模型能聊科研,但不会**真的查库、真的取全文、真的跑稳健性检验**——它没有学术数据库的入口,也不懂每个研究环节的规范做法。

`research-plugins` 把这两块补齐:

- **34 个工具**直连 18 个免费学术数据库(OpenAlex、CrossRef、PubMed、arXiv……),让 Agent 真正去检索、解析 DOI、追引文、找开放获取全文;
- **433 个技能**(结构化 SKILL.md 指南)教 Agent 每个环节的正确做法——从 DID/IV 因果推断,到系统综述、审稿意见回复、LaTeX 排版、基金预算。

装上之后,你的 Agent 不再是"会聊科研的聊天机器人",而是**能动手干活的科研助理**。

---

## 它能帮你做什么

以下都是装好后可以直接对 Agent 说的话(每个场景背后都有对应的真实技能/工具在支撑):

> **「找一下近三年关于因果推断的高引论文,优先能免费下载的。」**
> Agent 用 `search_openalex` 按引用量排序 → 逐篇调 `find_oa_version` 查开放获取版本 → 返回带 PDF 链接的清单。

> **「我要做一篇系统综述,帮我把检索、筛选、提取的流程跑起来。」**
> Agent 按 `systematic-review-guide` 制定 PRISMA 流程 → 多库联搜去重 → 用 `get_epmc_citations` 做引文滚雪球 → 输出可复现的检索记录。

> **「这份面板数据,帮我做个固定效应回归并加上稳健性检验。」**
> Agent 调用 `panel-data-guide` + `causal-inference-guide` 写出 Stata/Python 代码 → 按 `robustness-checks` 补齐安慰剂检验、聚类标准误等。

> **「审稿人提了三条意见,帮我起草一份逐条回复。」**
> Agent 按学术写作技能拆解每条意见 → 区分"已修改 / 已澄清 / 礼貌反驳" → 生成结构规范、语气得体的 rebuttal。

> **「把我 Zotero 里这批文献整理成带引用的综述初稿。」**
> Agent 用 `resolve_doi` / `search_crossref` 补全元数据 → 按引文管理与写作技能组织结构 → 输出带规范参考文献的初稿。

> **「我要申请 NSF 基金,帮我搭一个 proposal 框架和预算表。」**
> Agent 按 `grant-writing-guide` + `nsf-grant-guide` 搭章节框架 → 用 `grant-budget-guide` 生成预算 → 可查 `nsf-award-api-guide` 参考同类已资助项目。

---

## 快速开始

### 安装(Research-Claw / OpenClaw 用户)

```bash
openclaw plugins install @wentorai/research-plugins
```

插件安装到 `~/.openclaw/extensions/`,重启 gateway 后**自动加载全部技能 + 工具**,开箱即用。

### 安装(Claude Code / Cursor / Windsurf / OpenCode 等)

```bash
npx skills add wentorai/research-plugins
```

> 此方式仅安装 SKILL.md 技能文件(不含 API 工具),适用于 40+ 支持 skills 协议的 Agent 框架。

### 卸载

```bash
# OpenClaw / Research-Claw — 删除插件目录即可
rm -rf ~/.openclaw/extensions/research-plugins

# npx skills — 删除技能目录即可
rm -rf .skills/wentorai/research-plugins
```

> **pnpm 项目注意**:请勿将本包作为 `pnpm` 依赖、并通过 `plugins.load.paths` 从 `node_modules` 加载。pnpm 的硬链接机制会被 OpenClaw 安全校验拒绝(`unsafe plugin manifest path`)。请始终使用 `openclaw plugins install`。

---

## 包含什么

### 学术技能(433 个)

覆盖科研全流程的结构化 SKILL.md 指南,Agent 按需自动加载:

| 类别 | 技能数 | 覆盖范围 |
|:--|:--|:--|
| **文献** (literature) | 80 | 多库联搜 · 引文追踪 · 全文获取 · 开放获取 · 文献雷达 |
| **研究方法** (research) | 52 | 系统综述 · 深度研究 · 实验设计 · 审稿 · 基金申请 · 自动化 |
| **数据分析** (analysis) | 44 | 因果推断 · 计量经济 · 统计建模 · 数据清洗 · 可视化 |
| **学术写作** (writing) | 62 | 论文各章节 · LaTeX · 参考文献 · 引文管理 · 模板 · 润色 |
| **学科领域** (domains) | 147 | 16 个学科:AI/ML · 生物医学 · 经济 · 法学 · 化学 · 物理 等 |
| **效率工具** (tools) | 48 | 流程图 · PDF 解析 · 知识图谱 · OCR · 爬虫 · 代码执行 |

技能采用**渐进式加载**:6 个类别入口 → 40 个子分类索引 → 433 个具体技能。Agent 按需逐层加载,绝不一次性把全部内容塞进上下文。

### 智能体工具(34 个)

直连 18 个免费学术数据库 API 的 TypeScript 工具,作为 OpenClaw 插件自动注册:

| 模块 | 工具 | 数据源 |
|:--|:--|:--|
| `openalex` | `search_openalex` · `get_work` · `get_author_openalex` | OpenAlex (2.5 亿+ 作品) |
| `crossref` | `resolve_doi` · `search_crossref` | CrossRef (1.5 亿+ DOI) |
| `arxiv` | `search_arxiv` · `get_arxiv_paper` | arXiv |
| `pubmed` | `search_pubmed` · `get_article` | PubMed / NCBI |
| `unpaywall` | `find_oa_version` | Unpaywall (开放获取) |
| `europe-pmc` | `search_europe_pmc` · `get_epmc_citations` · `get_epmc_references` | Europe PMC (3300 万+) |
| `opencitations` | `get_citations_open` · `get_references_open` · `get_citation_count` | OpenCitations (20 亿+ 引用) |
| `dblp` | `search_dblp` · `search_dblp_author` | DBLP (700 万+ CS 文献) |
| `doaj` | `search_doaj` | DOAJ (900 万+ OA 文章) |
| `biorxiv` | `search_biorxiv` · `search_medrxiv` · `get_preprint_by_doi` | bioRxiv / medRxiv |
| `openaire` | `search_openaire` | OpenAIRE (1.7 亿+,支持 EU 资助筛选) |
| `zenodo` | `search_zenodo` · `get_zenodo_record` | Zenodo |
| `orcid` | `search_orcid` · `get_orcid_works` | ORCID |
| `inspire-hep` | `search_inspire` · `get_inspire_paper` | INSPIRE-HEP (高能物理) |
| `hal` | `search_hal` | HAL (法国开放档案) |
| `osf-preprints` | `search_osf_preprints` | OSF Preprints |
| `datacite` | `search_datacite` · `resolve_datacite_doi` | DataCite (数据集 DOI) |
| `ror` | `search_ror` | ROR (研究机构) |

> 全部基于**免费**学术 API,无需付费订阅、无需 API Key 即可开箱使用。

### 精选资源(6 套)

每个技能类别都配有一份手工精选的优质资源清单,带分门别类的推荐说明,见 [`curated/`](curated/) 目录——可作为发现工具、查找方法的快速入口。

---

## 兼容性

`research-plugins` 同时服务两类用户:

- **科研龙虾 / OpenClaw**:作为完整插件加载(技能 + 34 个 API 工具),通过 `openclaw plugins install`。
- **其他 40+ Agent 框架**(Claude Code、Cursor、Windsurf、OpenCode 等支持 skills 协议的工具):仅加载 SKILL.md 技能,通过 `npx skills add`。

无论哪种方式,技能都遵循 Agent Skills 开放规范,即插即用。

---

## 架构

```
@wentorai/research-plugins
├── skills/                    ← 433 SKILL.md (6 类别 × 40 子分类)
│   ├── literature/            ← 文献检索/追踪/获取
│   ├── research/              ← 研究方法/综述/审稿/基金
│   ├── analysis/              ← 数据分析/因果推断/可视化
│   ├── writing/               ← 学术写作/引用/LaTeX
│   ├── domains/               ← 16 学科领域
│   └── tools/                 ← 效率工具/图表/OCR
├── src/tools/                 ← 34 API 工具 (18 模块)
├── curated/                   ← 6 套精选资源清单
├── catalog.json               ← 全量索引 (457 条目)
├── index.ts                   ← 插件入口 (OpenClaw Plugin SDK)
└── openclaw.plugin.json       ← 插件清单
```

---

## 社区致谢

本项目对互联网上公开可用的学术资源进行了遴选、整理和增强。

- **技能** 基于成熟研究方法、公开 API 文档和广泛使用的学术工作流编写。凡内容源自特定开源项目的,SKILL.md frontmatter 中 `source` 字段标注了原始链接。
- **精选列表** 汇集社区资源链接,仅供发现和参考。

所有原创内容以 [MIT 许可证](LICENSE) 发布。引用的第三方项目保留各自许可证。

---

## 贡献

欢迎补充技能与资源,请查阅 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可证

[MIT](LICENSE) — Copyright (c) 2026 Wentor AI
