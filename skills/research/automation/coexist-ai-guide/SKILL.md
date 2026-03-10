---
name: coexist-ai-guide
description: "Modular MCP-based research assistant framework"
metadata:
  openclaw:
    emoji: "🧩"
    category: "research"
    subcategory: "automation"
    keywords: ["CoexistAI", "MCP", "research assistant", "modular agents", "academic workflow", "framework"]
    source: "https://github.com/SPThole/CoexistAI"
---

# CoexistAI Research Assistant Guide

## Overview

CoexistAI is a modular research assistant framework built on MCP (Model Context Protocol) that provides composable academic research capabilities. It offers MCP servers for paper search, citation management, data analysis, and writing assistance that can be mixed and matched with any MCP-compatible LLM client. Designed for researchers who want customizable, extensible AI research tooling.

## Architecture

```
LLM Client (Claude Code / Open WebUI / etc.)
      ↓ MCP Protocol
  CoexistAI MCP Servers
  ├── paper-search     (arXiv, S2, PubMed)
  ├── citation-manager (BibTeX, formatting)
  ├── data-analysis    (Python execution)
  ├── writing-assist   (drafting, revision)
  ├── note-taker       (structured notes)
  └── custom modules   (extend as needed)
```

## Installation

```bash
# Install CoexistAI
npm install -g @coexistai/mcp-servers

# Or individual modules
npm install -g @coexistai/paper-search
npm install -g @coexistai/citation-manager
npm install -g @coexistai/data-analysis
```

## MCP Configuration

```json
{
  "mcpServers": {
    "coexist-paper-search": {
      "command": "npx",
      "args": ["@coexistai/paper-search"],
      "env": {}
    },
    "coexist-citation": {
      "command": "npx",
      "args": ["@coexistai/citation-manager"],
      "env": {
        "BIB_FILE": "./references.bib"
      }
    },
    "coexist-analysis": {
      "command": "npx",
      "args": ["@coexistai/data-analysis"],
      "env": {
        "SANDBOX": "true"
      }
    }
  }
}
```

## Module: Paper Search

```markdown
### Available Tools
- `search_papers(query, source, limit)` — Search academic DBs
- `get_paper_details(id)` — Fetch full metadata
- `find_related(id, limit)` — Find related papers
- `get_citations(id)` — List citing papers
- `get_references(id)` — List referenced papers

### Example Usage
"Search for papers on contrastive learning in NLP from 2023"
→ Returns top results with title, authors, abstract, DOI
```

## Module: Citation Manager

```markdown
### Available Tools
- `add_citation(doi)` — Add to .bib file from DOI
- `format_citation(id, style)` — Format in APA/MLA/etc
- `search_bib(query)` — Search existing bibliography
- `check_duplicates()` — Find duplicate entries
- `export_bib(format)` — Export in various formats

### Example Usage
"Add the BERT paper to my bibliography"
→ Fetches metadata, generates BibTeX, appends to refs.bib
```

## Module: Data Analysis

```markdown
### Available Tools
- `run_python(code)` — Execute Python in sandbox
- `analyze_csv(path, task)` — Auto-analyze data file
- `generate_plot(data, type)` — Create visualizations
- `run_statistics(data, test)` — Statistical tests

### Example Usage
"Run a t-test comparing groups A and B in experiment.csv"
→ Loads data, runs scipy.stats.ttest_ind, returns results
```

## Custom Module Development

```typescript
// Create a custom MCP module
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const server = new McpServer({
  name: "my-research-tool",
  version: "1.0.0",
});

server.tool(
  "custom_analysis",
  { description: "Run custom research analysis" },
  async (args) => {
    // Your custom logic
    return { result: "Analysis complete" };
  }
);
```

## Use Cases

1. **Modular research**: Pick-and-choose research capabilities
2. **Custom pipelines**: Build tailored research workflows
3. **Tool integration**: Connect to existing research infrastructure
4. **Team standardization**: Shared MCP modules across lab
5. **Extension**: Add domain-specific research tools

## References

- [CoexistAI GitHub](https://github.com/SPThole/CoexistAI)
- [MCP Specification](https://modelcontextprotocol.io/)
