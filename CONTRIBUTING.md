# Contributing to Research Plugins

## Adding a Skill

1. Choose the correct category and subcategory from the [taxonomy](README.md#taxonomy)
2. Create `skills/{category}/{subcategory}/{skill-name}/SKILL.md`
3. Include required frontmatter:

```yaml
---
name: your-skill-name
description: "Short description (max 80 chars)"
metadata:
  openclaw:
    emoji: "icon"
    category: "literature"
    subcategory: "search"
    keywords: ["keyword1", "keyword2", "keyword3"]
    source: "https://original-source-url"
---
```

4. Write content with at least 3 H2 headings and 1,000+ characters
5. Run validation: `node scripts/validate.ts`
6. Submit a PR

## Quality Requirements

- `name`: kebab-case, no "skill" suffix
- `description`: max 80 characters
- `keywords`: 3-8 items from keyword-index
- Content: 1,000-256,000 characters
- At least 3 `##` headings
- No external image links
- No API keys or secrets in content
- Path must match frontmatter category/subcategory

## Adding an MCP Config

Create a JSON file in `mcp-configs/{category}/`:

```json
{
  "id": "tool-name",
  "name": "Display Name",
  "description": "What it does",
  "category": "reference-mgr",
  "install": { "runtime": "node", "package": "package-name" },
  "config": { "env": {} },
  "tools": [],
  "verified": false,
  "source": "https://github.com/..."
}
```

### MCP `verified` Field

All MCP configs ship with `"verified": false` by default. This field indicates whether
the MCP server has been tested end-to-end in a Research-Claw environment. Contributors
and maintainers may set `"verified": true` after confirming:

1. The `install.package` installs successfully and the server starts
2. At least one tool listed in `tools[]` responds to a valid request
3. The `config.env` variable names match the server's actual expectations

The `verified` field is informational and does not affect plugin loading.

## Adding or Modifying Agent Tools

Agent tools live in `src/tools/*.ts` and are registered via `index.ts`.
Each tool **must** conform to the OpenClaw `AgentTool` interface:

```typescript
{
  name: "tool_name",                          // snake_case identifier
  label: "Human-Readable Label (Source)",     // shown in UI tool lists
  description: "What this tool does...",      // injected into model prompt
  parameters: Type.Object({ ... }),           // @sinclair/typebox schema
  execute: async (input) => {                 // async handler
    // ... do work ...
    return toolResult(data);                  // MUST use toolResult()
  },
}
```

### Common mistakes to avoid

| Mistake | Correct | Notes |
|---------|---------|-------|
| `inputSchema` | `parameters` | OpenClaw reads `tool.parameters.properties` |
| `handler` | `execute` | OpenClaw calls `tool.execute(input)` |
| Missing `label` | Add `label` | Displayed in tool picker UI |
| `return data` | `return toolResult(data)` | Must wrap in `{ content, details }` |

### Return format

All tools must return the standard OpenClaw tool result shape via `toolResult()` from `src/tools/util.ts`:

```typescript
import { toolResult } from "./util.js";

// toolResult(data) returns:
// {
//   content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
//   details: data   // structured data for programmatic access
// }
```

**Never return raw JSON directly** — missing `content` or `details` will cause
OpenClaw to crash or silently drop tool output.

### Checklist for new tools

- [ ] Uses `parameters` (not `inputSchema`)
- [ ] Uses `execute` (not `handler`)
- [ ] Has `label` field
- [ ] Returns via `toolResult()` (includes both `content` and `details`)
- [ ] Imported `toolResult` from `./util.js`
- [ ] Registered in `index.ts` via `api.registerTool()`
- [ ] Error paths also return `toolResult({ error: "..." })`

## Running Validation

```bash
node scripts/validate.ts
```

All skills and MCP configs must pass validation before merge.
