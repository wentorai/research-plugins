# @wentorai/research-plugins

174 academic research skills, 61 MCP configs, 14 agent tools, and 6 curated resource lists for [Research-Claw](https://wentor.ai) and AI coding agents.

## What's Inside

| Component | Count | Description |
|-----------|-------|-------------|
| **Skills** | 174 | SKILL.md files covering literature search, academic writing, data analysis, research methods, 16 domain specialties, and productivity tools |
| **Agent Tools** | 14 | TypeScript tools wrapping Semantic Scholar, OpenAlex, CrossRef, arXiv, PubMed, and Unpaywall APIs |
| **MCP Configs** | 61 | Ready-to-use MCP server configurations for reference managers, knowledge bases, research databases, and AI platforms |
| **Curated Lists** | 6 | Hand-picked resource lists per category |

## Install

### As OpenClaw Plugin

```bash
openclaw plugins install @wentorai/research-plugins
```

### As Skills Collection (any agent)

```bash
npx skills add wentorai/research-plugins
```

### Via pip

```bash
pip install research-plugins
```

## Taxonomy

Skills are organized into 6 categories with 40 subcategories:

- **literature** — Paper search, discovery, full-text access, citation metadata
- **writing** — Composition, polish, LaTeX, templates, citation formats
- **analysis** — Statistics, econometrics, data wrangling, visualization
- **research** — Methodology, deep research, paper review, automation, funding
- **domains** — 16 academic disciplines (CS, AI/ML, biomedical, economics, law, etc.)
- **tools** — Diagrams, document parsing, code execution, scraping, knowledge graphs, OCR

## Configuration

Optional: set a Semantic Scholar API key for higher rate limits:

```json
{
  "plugins": {
    "entries": {
      "research-plugins": {
        "semanticScholarApiKey": "your-key-here"
      }
    }
  }
}
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT
