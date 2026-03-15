---
name: mcp-server-guide
description: "Index of 150 MCP server configs bundled with research-plugins"
metadata:
  openclaw:
    emoji: "🔌"
    category: "research"
    subcategory: "automation"
    keywords: ["MCP", "model-context-protocol", "mcp-server", "tool-integration", "external-services", "research-automation"]
    source: "wentor-research-plugins"
---

# MCP Server Configurations — Research-Plugins

This plugin bundles 150 ready-to-use MCP (Model Context Protocol) server configurations for academic research workflows. Each config is a JSON file specifying how to install, configure, and connect an external MCP server.

## How to Find MCP Configs

All configs are stored in the `mcp-configs/` directory within the installed plugin:

```
# Typical installed location
~/.openclaw/extensions/node_modules/@wentorai/research-plugins/mcp-configs/

# Structure
mcp-configs/
├── registry.json          # Machine-readable index of all 150 configs
├── academic-db/           # 43 configs — academic databases & APIs
├── reference-mgr/         # 25 configs — citation & reference managers
├── note-knowledge/        # 23 configs — note-taking & knowledge bases
├── data-platform/         # 13 configs — data science & experiment tracking
├── ai-platform/           # 12 configs — LLM orchestration & AI services
├── dev-platform/          # 12 configs — code hosting & development tools
├── browser/               #  8 configs — web automation & research agents
├── communication/         #  4 configs — team messaging (Slack, Discord)
├── cloud-docs/            #  3 configs — cloud document collaboration
├── database/              #  3 configs — database connectors (SQLite, Neo4j)
├── email/                 #  2 configs — email integration (Gmail, IMAP)
└── repository/            #  2 configs — data repositories (HuggingFace)
```

## Config File Format

Each JSON file follows this schema:

```json
{
  "id": "arxiv-search-mcp",
  "name": "arXiv Search MCP",
  "description": "Search and fetch papers from arXiv.org",
  "category": "reference-mgr",
  "install": {
    "runtime": "node",
    "package": "arxiv-search-mcp",
    "command": "npm install -g arxiv-search-mcp"
  },
  "config": {
    "env": {}
  },
  "tools": ["search", "fetch"],
  "verified": false,
  "source": "https://github.com/danimal141/arxiv-search-mcp"
}
```

Key fields:
- **install.command** — shell command to install the MCP server
- **install.runtime** — `node` or `python`
- **config.env** — required environment variables (API keys, tokens)
- **tools** — list of tool names the server exposes
- **verified** — `true` if tested end-to-end in Research-Claw

## How to Use an MCP Server with OpenClaw

### Step 1: Find the config

```bash
# Read the registry for a quick overview
cat ~/.openclaw/extensions/node_modules/@wentorai/research-plugins/mcp-configs/registry.json

# Or browse a specific category
ls ~/.openclaw/extensions/node_modules/@wentorai/research-plugins/mcp-configs/academic-db/
```

### Step 2: Install the server package

```bash
# Node-based server
npm install -g <package-name>

# Python-based server
pip install <package-name>
```

### Step 3: Configure in OpenClaw

Add the MCP server to your `~/.openclaw/openclaw.json`:

```json
{
  "mcpServers": {
    "zotero": {
      "command": "npx",
      "args": ["-y", "mcp-zotero"],
      "env": {
        "ZOTERO_API_KEY": "your-api-key",
        "ZOTERO_USER_ID": "your-user-id"
      }
    }
  }
}
```

### Step 4: Verify

Restart OpenClaw. The MCP server's tools will appear alongside built-in tools. Test with a simple query to confirm connectivity.

## Category Quick Reference

### Academic Databases (43 configs)

Connectors for scholarly search APIs and paper repositories:

| Config | Description | Runtime |
|--------|-------------|---------|
| semantic-scholar-mcp | Semantic Scholar API — papers, authors, citations | node |
| openalex-mcp | OpenAlex API — works, authors, institutions | node |
| arxiv-search-mcp | arXiv paper search and retrieval | node |
| pubmed-mcp | PubMed/MEDLINE biomedical literature | node |
| crossref-mcp | CrossRef DOI resolution and metadata | node |
| ... and 38 more | See `mcp-configs/academic-db/` | — |

### Reference Managers (25 configs)

Connect to citation management tools:

| Config | Description | Env Required |
|--------|-------------|-------------|
| zotero-mcp | Zotero library search, add, annotate | ZOTERO_API_KEY |
| mendeley-mcp | Mendeley library access | MENDELEY_TOKEN |
| google-scholar-mcp | Google Scholar search | — |
| ... and 22 more | See `mcp-configs/reference-mgr/` | — |

### Note & Knowledge Bases (23 configs)

Connect to knowledge management systems:

| Config | Description | Env Required |
|--------|-------------|-------------|
| obsidian-mcp | Obsidian vault read/write | OBSIDIAN_VAULT_PATH |
| notion-mcp | Notion workspace access | NOTION_API_KEY |
| logseq-mcp | Logseq graph access | LOGSEQ_GRAPH_PATH |
| ... and 20 more | See `mcp-configs/note-knowledge/` | — |

### Data & Experiment Platforms (13 configs)

ML experiment tracking and data science tools:

| Config | Description | Env Required |
|--------|-------------|-------------|
| wandb-mcp | Weights & Biases experiment tracking | WANDB_API_KEY |
| jupyter-mcp | Jupyter notebook execution | — |
| kaggle-mcp | Kaggle datasets and competitions | KAGGLE_KEY |
| ... and 10 more | See `mcp-configs/data-platform/` | — |

### Other Categories

- **ai-platform/** (12) — OpenAI, HuggingFace, Replicate connectors
- **dev-platform/** (12) — GitHub, GitLab repository management
- **browser/** (8) — Playwright, Puppeteer, Firecrawl web automation
- **communication/** (4) — Slack, Discord, Telegram messaging
- **cloud-docs/** (3) — Notion, Google Drive, Confluence
- **database/** (3) — SQLite, PostgreSQL, Neo4j connectors
- **email/** (2) — Gmail, IMAP/SMTP integration
- **repository/** (2) — HuggingFace Hub, Dataverse

## Using registry.json Programmatically

The `registry.json` file is a machine-readable index of all configs:

```json
{
  "version": "1.1.0",
  "generated": "2026-03-10",
  "categories": {
    "academic-db": { "count": 43, "configs": [...] },
    "reference-mgr": { "count": 25, "configs": [...] }
  }
}
```

Each entry in `configs[]` has: `id`, `name`, `category`, `file` (relative path to the JSON config).

## Related Skills

- [zotero-mcp-guide](../../writing/citation/zotero-mcp-guide/SKILL.md) — Detailed Zotero MCP setup and workflows
- [paper-search-mcp-guide](../../literature/search/paper-search-mcp-guide/SKILL.md) — Multi-database paper search MCP
- [edumcp-guide](../../domains/education/edumcp-guide/SKILL.md) — Education-focused MCP server

## Important Notes

- MCP configs are **reference templates** — you must install the server package separately
- Some servers require API keys or tokens (check `config.env` in each JSON)
- Prefer the plugin's built-in Agent Tools (search_papers, resolve_doi, etc.) over MCP for academic database queries — they work out of the box without extra installation
- The `verified: false` flag means the config has not been end-to-end tested; check the source repository for current status

## References

- [MCP Specification](https://modelcontextprotocol.io)
- [OpenClaw MCP Documentation](https://docs.openclaw.app)
- [Registry Source](https://github.com/wentorai/research-plugins/tree/main/mcp-configs)
