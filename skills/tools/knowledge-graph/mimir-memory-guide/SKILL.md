---
name: mimir-memory-guide
description: "Semantic vector search memory bank for AI agents"
metadata:
  openclaw:
    emoji: "📝"
    category: "tools"
    subcategory: "knowledge-graph"
    keywords: ["agent memory", "vector search", "semantic memory", "MCP", "knowledge persistence", "embedding"]
    source: "https://github.com/orneryd/Mimir"
---

# Mimir Agent Memory Guide

## Overview

Mimir is a semantic memory bank for AI agents that provides persistent, searchable memory via vector embeddings. Agents can store observations, learnings, and context that persists across sessions, and retrieve relevant memories using semantic search. Available as an MCP server for seamless integration with Claude Code, OpenClaw, and other agent frameworks.

## Installation

```bash
# MCP server
npm install -g @mimir/mcp-server

# Python library
pip install mimir-memory
```

## MCP Configuration

```json
{
  "mcpServers": {
    "mimir": {
      "command": "npx",
      "args": ["@mimir/mcp-server"],
      "env": {
        "MEMORY_PATH": "~/.mimir/memories",
        "EMBEDDING_MODEL": "all-MiniLM-L6-v2"
      }
    }
  }
}
```

## Core Operations

```python
from mimir import MemoryBank

bank = MemoryBank(
    path="./agent_memory",
    embedding_model="all-MiniLM-L6-v2",
)

# Store a memory
bank.store(
    content="The project uses FastAPI with PostgreSQL. "
            "Database migrations are managed with Alembic.",
    metadata={
        "type": "project_context",
        "project": "wentor",
        "timestamp": "2025-03-10",
    },
)

# Semantic search
results = bank.search(
    query="How does the database work?",
    top_k=5,
)
for r in results:
    print(f"[{r.score:.3f}] {r.content[:100]}...")

# Delete memory
bank.delete(memory_id=results[0].id)
```

## MCP Tools

```markdown
### Available MCP Tools
- `store_memory(content, metadata)` — Store new memory
- `search_memory(query, limit)` — Semantic search
- `list_memories(filter)` — List by metadata filter
- `delete_memory(id)` — Remove specific memory
- `clear_memories(filter)` — Clear matching memories

### Usage in Agent Chat
"Remember that the API uses JWT tokens with 30-day expiry"
→ Stores as persistent memory

"What do you know about the authentication system?"
→ Searches memories, returns relevant stored context
```

## Memory Types

```python
# Structured memory categories
bank.store(
    content="User prefers dark theme and minimal logging",
    metadata={"type": "preference"},
)

bank.store(
    content="Fixed bug: ECharts CSS vars don't work on Canvas",
    metadata={"type": "lesson_learned", "topic": "echarts"},
)

bank.store(
    content="Deploy script is at deploy/deploy.sh, "
            "requires .credentials file",
    metadata={"type": "project_knowledge"},
)

# Search by type
prefs = bank.search(
    query="user preferences",
    filter={"type": "preference"},
)
```

## Use Cases

1. **Agent memory**: Persistent context across sessions
2. **Project knowledge**: Store and retrieve project facts
3. **Learning accumulation**: Build expertise over time
4. **Preference tracking**: Remember user preferences
5. **Research notes**: Searchable research observations

## References

- [Mimir GitHub](https://github.com/orneryd/Mimir)
- [MCP Specification](https://modelcontextprotocol.io/)
