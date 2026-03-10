---
name: contextplus-mcp-guide
description: "Semantic code search MCP with Tree-sitter AST and RAG"
metadata:
  openclaw:
    emoji: "🌳"
    category: "tools"
    subcategory: "code-exec"
    keywords: ["semantic search", "code search", "Tree-sitter", "AST", "MCP", "RAG"]
    source: "https://github.com/ForLoopCodes/contextplus"
---

# ContextPlus MCP Guide

## Overview

ContextPlus is an MCP server that provides semantic code search using Tree-sitter AST parsing and RAG. It indexes codebases by extracting functions, classes, and modules as semantic units, embeds them for vector search, and serves results to any MCP-compatible LLM client. Helps AI agents understand large codebases by retrieving the most relevant code context.

## Installation

```bash
npm install -g @contextplus/mcp-server

# Or run directly
npx @contextplus/mcp-server --workspace ./your-project
```

## MCP Configuration

```json
{
  "mcpServers": {
    "contextplus": {
      "command": "npx",
      "args": ["@contextplus/mcp-server",
               "--workspace", "./project"],
      "env": {
        "EMBEDDING_MODEL": "all-MiniLM-L6-v2",
        "MAX_RESULTS": "10"
      }
    }
  }
}
```

## Features

```markdown
### Semantic Understanding
- **Tree-sitter parsing**: Extract functions, classes, types
- **AST-aware chunking**: Split code at logical boundaries
- **Cross-reference**: Track imports, calls, dependencies
- **Multi-language**: Python, TypeScript, Go, Rust, Java, C++

### Search Capabilities
- Natural language code search ("find auth middleware")
- Symbol search (function/class by name)
- Dependency graph ("what calls this function")
- Semantic similarity (find similar implementations)

### MCP Tools Provided
- `search_code(query)` — Semantic code search
- `get_symbol(name)` — Get symbol definition + usages
- `get_dependencies(file)` — File dependency graph
- `get_context(file, line)` — Surrounding context for a location
```

## Usage Examples

```markdown
### In Claude Code / LLM Chat

"Find all authentication-related functions"
→ Returns: auth middleware, login handler, token validation

"What functions call the database connection pool?"
→ Returns: dependency graph with callers

"Find code similar to this error handling pattern"
→ Returns: semantically similar try/catch blocks
```

## Indexing Configuration

```json
{
  "indexing": {
    "include": ["src/**/*.ts", "lib/**/*.py"],
    "exclude": ["node_modules", "__pycache__", ".git"],
    "languages": ["typescript", "python"],
    "chunk_strategy": "ast",
    "max_chunk_tokens": 500,
    "rebuild_on_change": true
  }
}
```

## Use Cases

1. **Code understanding**: Navigate unfamiliar codebases
2. **Agent context**: Provide relevant code to LLM agents
3. **Code review**: Find related patterns and similar code
4. **Refactoring**: Discover all usages before changing code
5. **Documentation**: Generate docs from code structure

## References

- [ContextPlus GitHub](https://github.com/ForLoopCodes/contextplus)
- [Tree-sitter](https://tree-sitter.github.io/tree-sitter/)
- [MCP Specification](https://modelcontextprotocol.io/)
