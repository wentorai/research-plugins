#!/usr/bin/env node

/**
 * catalog.ts — Generate catalog.json with unified `items[]` array.
 *
 * Collects 3 artifact types:
 *   - skill      → skills/{cat}/{subcat}/{name}/SKILL.md  (YAML frontmatter)
 *   - curated    → curated/{cat}/README.md
 *   - agent_tool → parsed from index.ts registerTool() calls
 *
 * Run: node --experimental-strip-types scripts/catalog.ts
 */

import { readFileSync, readdirSync, writeFileSync, statSync } from "node:fs";
import { join, relative, basename, dirname } from "node:path";

/* ---- Types ---- */

interface CatalogItem {
  id: string;
  type: "skill" | "curated" | "agent_tool";
  name: string;
  description: string;
  category: string;
  subcategory: string;
  keywords: string[];
  path: string;
  source: string;
  tools?: string[];          // agent_tool: registered tool names
}

/* ---- Helpers ---- */

function collectFiles(dir: string, match: (name: string) => boolean): string[] {
  const files: string[] = [];
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) files.push(...collectFiles(full, match));
      else if (match(entry.name)) files.push(full);
    }
  } catch { /* dir doesn't exist */ }
  return files;
}

/**
 * Parse SKILL.md YAML frontmatter.
 * Handles the nested `metadata.openclaw` structure.
 */
function parseSkillFrontmatter(content: string): Record<string, unknown> | null {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;

  const result: Record<string, unknown> = {};
  let inOpenclaw = false;
  let inKeywords = false;
  const keywords: string[] = [];

  for (const raw of m[1].split("\n")) {
    const line = raw.trimEnd();

    // Top-level scalar fields: name, description
    const top = line.match(/^(\w+):\s*"?(.+?)"?\s*$/);
    if (top && !inOpenclaw) {
      result[top[1]] = top[2];
      continue;
    }

    if (line.trim() === "openclaw:") { inOpenclaw = true; continue; }
    if (line.trim() === "metadata:") continue;

    if (inOpenclaw) {
      // keywords array (inline or multi-line)
      if (line.match(/^\s+keywords:\s*\[/)) {
        const inline = line.match(/\[([^\]]*)\]/);
        if (inline) {
          for (const k of inline[1].split(",")) {
            const cleaned = k.trim().replace(/^["']|["']$/g, "");
            if (cleaned) keywords.push(cleaned);
          }
        } else {
          inKeywords = true;
        }
        continue;
      }
      if (inKeywords) {
        if (line.match(/^\s+-\s/)) {
          keywords.push(line.replace(/^\s+-\s*"?/, "").replace(/"?\s*$/, ""));
          continue;
        }
        if (line.match(/\]/)) { inKeywords = false; continue; }
      }
      // Scalar fields inside openclaw
      const nested = line.match(/^\s+(\w+):\s*"?(.+?)"?\s*$/);
      if (nested) {
        result[nested[1]] = nested[2];
      }
    }
  }

  if (keywords.length > 0) result.keywords = keywords;
  return result;
}

/* ---- Collectors ---- */

function collectSkills(rootDir: string): CatalogItem[] {
  const files = collectFiles(join(rootDir, "skills"), (n) => n === "SKILL.md");
  const items: CatalogItem[] = [];

  for (const f of files) {
    const content = readFileSync(f, "utf-8");
    const fm = parseSkillFrontmatter(content);
    if (!fm) continue;

    const relPath = relative(rootDir, dirname(f));  // skills/analysis/dataviz/name
    const parts = relPath.split("/");               // ["skills","analysis","dataviz","name"]

    // Skip subcategory index files (depth 3: skills/{cat}/{subcat}/SKILL.md)
    // Only include concrete skills (depth 4: skills/{cat}/{subcat}/{name}/SKILL.md)
    if (parts.length < 4) continue;

    items.push({
      id: (fm.name as string) || basename(dirname(f)),
      type: "skill",
      name: (fm.name as string) || basename(dirname(f)),
      description: (fm.description as string) || "",
      category: (fm.category as string) || parts[1] || "",
      subcategory: (fm.subcategory as string) || parts[2] || "",
      keywords: (fm.keywords as string[]) || [],
      path: relPath,
      source: (fm.source as string) || "",
    });
  }

  return items;
}

// MCP config collection removed in v1.4.0 audit (all configs archived)

function collectCurated(rootDir: string): CatalogItem[] {
  const files = collectFiles(join(rootDir, "curated"), (n) => n.endsWith(".md"));
  const items: CatalogItem[] = [];

  for (const f of files) {
    const content = readFileSync(f, "utf-8");
    const relPath = relative(rootDir, f);              // curated/analysis/README.md
    const parts = relPath.split("/");                  // ["curated","analysis","README.md"]
    const category = parts[1] || "";

    // Extract title from first H1 line
    const titleMatch = content.match(/^#\s+(.+)/m);
    const title = titleMatch ? titleMatch[1].trim() : `${category} curated list`;

    // Extract description from blockquote after title
    const descMatch = content.match(/^>\s*(.+)/m);
    const description = descMatch ? descMatch[1].trim() : "";

    items.push({
      id: `curated-${category}`,
      type: "curated",
      name: title,
      description,
      category,
      subcategory: "",
      keywords: [],
      path: relPath,
      source: "",
    });
  }

  return items;
}

function collectAgentTools(rootDir: string): CatalogItem[] {
  // Parse index.ts to extract registerTool calls with tool names
  const indexPath = join(rootDir, "index.ts");
  let indexContent: string;
  try {
    indexContent = readFileSync(indexPath, "utf-8");
  } catch {
    return [];
  }

  const items: CatalogItem[] = [];

  // Match: import { createXxxTools } from "./src/tools/foo.js";
  // Then:  api.registerTool(..., { names: ["a", "b"] });
  const importMap = new Map<string, string>(); // factory name → source file
  for (const m of indexContent.matchAll(
    /import\s+\{\s*(\w+)\s*\}\s*from\s*"\.\/src\/tools\/(.+?)\.js"/g,
  )) {
    importMap.set(m[1], m[2]);
  }

  for (const m of indexContent.matchAll(
    /(\w+)\(ctx.*?\),\s*\{\s*names:\s*\[([^\]]+)\]/g,
  )) {
    const factoryName = m[1];
    const toolNames = m[2]
      .split(",")
      .map((s) => s.trim().replace(/['"]/g, ""))
      .filter(Boolean);

    const sourceFile = importMap.get(factoryName) || factoryName;
    const srcPath = `src/tools/${sourceFile}.ts`;

    // Read source file for description
    let description = "";
    try {
      const src = readFileSync(join(rootDir, srcPath), "utf-8");
      const descMatch = src.match(/\/\*\*\s*\n\s*\*\s*(.+)/);
      if (descMatch) description = descMatch[1].trim();
    } catch { /* skip */ }

    items.push({
      id: `agent-tool-${sourceFile}`,
      type: "agent_tool",
      name: sourceFile.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      description: description || `Agent tools: ${toolNames.join(", ")}`,
      category: "integrations",
      subcategory: "academic-db",
      keywords: toolNames,
      path: srcPath,
      source: `https://github.com/wentorai/research-plugins/blob/main/${srcPath}`,
      tools: toolNames,
    });
  }

  return items;
}

/* ---- Main ---- */

function main() {
  const rootDir = join(import.meta.dirname ?? ".", "..");

  const skills = collectSkills(rootDir);
  const curated = collectCurated(rootDir);
  const agentTools = collectAgentTools(rootDir);

  const items = [...skills, ...curated, ...agentTools];

  const catalog = {
    version: "2.0.0",
    generated: new Date().toISOString().slice(0, 10),
    stats: {
      skills: skills.length,
      agent_tools: agentTools.length,
      curated_lists: curated.length,
      total: items.length,
    },
    items,
  };

  const outPath = join(rootDir, "catalog.json");
  writeFileSync(outPath, JSON.stringify(catalog, null, 2) + "\n");
  console.log(
    `catalog.json: ${skills.length} skills, ` +
    `${curated.length} curated, ${agentTools.length} agent tool groups ` +
    `— ${items.length} total items`,
  );
}

main();
