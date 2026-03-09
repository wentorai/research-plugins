#!/usr/bin/env node

/**
 * catalog.ts — Generate catalog.json from skills/, mcp-configs/, curated/
 *
 * Run: node scripts/catalog.ts
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

interface SkillEntry {
  name: string;
  description: string;
  category: string;
  subcategory: string;
  keywords: string[];
  path: string;
}

function collectFiles(dir: string, ext: string): string[] {
  const files: string[] = [];
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...collectFiles(fullPath, ext));
      } else if (entry.name.endsWith(ext)) {
        files.push(fullPath);
      }
    }
  } catch {
    // ignore
  }
  return files;
}

function parseFrontmatter(content: string): Record<string, unknown> | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  // Reuse simple YAML parser from validate.ts
  // For catalog, we only need top-level fields
  try {
    const lines = match[1].split("\n");
    const result: Record<string, unknown> = {};
    // Simplified: just extract name and description
    for (const line of lines) {
      const m = line.match(/^(\w+):\s*"?(.+?)"?\s*$/);
      if (m) result[m[1]] = m[2];
    }
    return result;
  } catch {
    return null;
  }
}

function main() {
  const rootDir = join(import.meta.dirname ?? ".", "..");
  const skillFiles = collectFiles(join(rootDir, "skills"), "SKILL.md");
  const mcpFiles = collectFiles(join(rootDir, "mcp-configs"), ".json").filter(
    (f) => !f.endsWith("registry.json"),
  );
  const curatedFiles = collectFiles(join(rootDir, "curated"), ".md");

  const catalog = {
    version: "1.0.0",
    generated: new Date().toISOString(),
    counts: {
      skills: skillFiles.length,
      mcpConfigs: mcpFiles.length,
      curated: curatedFiles.length,
    },
    skills: skillFiles.map((f) => relative(rootDir, f)),
    mcpConfigs: mcpFiles.map((f) => relative(rootDir, f)),
    curated: curatedFiles.map((f) => relative(rootDir, f)),
  };

  const outPath = join(rootDir, "catalog.json");
  writeFileSync(outPath, JSON.stringify(catalog, null, 2) + "\n");
  console.log(`Wrote catalog.json: ${catalog.counts.skills} skills, ${catalog.counts.mcpConfigs} MCP configs, ${catalog.counts.curated} curated lists`);
}

main();
