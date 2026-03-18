# Archived Items Manifest

> Audit date: 2026-03-18
> Total archived: 150 items (all MCP configs)

## By Category

| Type | Count | Top Reasons |
|------|-------|-------------|
| MCP Configs — academic-db | 43 | Redundant with existing agent tools (search_arxiv, search_pubmed, etc.) |
| MCP Configs — reference-mgr | 25 | Redundant with existing agent tools |
| MCP Configs — note-knowledge | 23 | Not academically specific, generic AI memory tools |
| MCP Configs — data-platform | 13 | Local tools, 1 requires paid token |
| MCP Configs — ai-platform | 12 | Require local LLM server deployment |
| MCP Configs — dev-platform | 12 | Not academically specific |
| MCP Configs — browser | 8 | Generic web tools, not academic |
| MCP Configs — communication | 4 | All require OAuth tokens |
| MCP Configs — cloud-docs | 3 | All require OAuth |
| MCP Configs — database | 3 | All require connection credentials |
| MCP Configs — email | 2 | All require OAuth |
| MCP Configs — repository | 2 | Both require API tokens |
| Skills | 0 | No skills archived — all 432 passed quality review |

## How to Restore

1. Copy from `archived/{type}/{path}` back to original location
2. Run `npm run catalog && npm run validate`
3. Commit
