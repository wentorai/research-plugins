#!/usr/bin/env node

/**
 * sync-registry.ts — Sync MCP registry.json with physical config files
 *
 * Scans mcp-configs/ subdirectories for JSON config files and rebuilds
 * mcp-configs/registry.json to match.
 *
 * Run: node scripts/sync-registry.ts
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const VALID_CATEGORIES = [
  "reference-mgr",
  "note-knowledge",
  "communication",
  "email",
  "cloud-docs",
  "ai-platform",
  "data-platform",
  "dev-platform",
  "repository",
  "academic-db",
  "browser",
  "database",
];

interface McpConfigEntry {
  id: string;
  name: string;
  description: string;
  category: string;
  path: string;
}

function collectJsonFiles(dir: string): string[] {
  const files: string[] = [];
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...collectJsonFiles(fullPath));
      } else if (entry.name.endsWith(".json") && entry.name !== "registry.json") {
        files.push(fullPath);
      }
    }
  } catch {
    // ignore
  }
  return files;
}

function main() {
  const rootDir = join(import.meta.dirname ?? ".", "..");
  const mcpDir = join(rootDir, "mcp-configs");
  const configFiles = collectJsonFiles(mcpDir);

  const configs: McpConfigEntry[] = [];
  const errors: string[] = [];

  for (const file of configFiles) {
    try {
      const content = JSON.parse(readFileSync(file, "utf-8"));
      if (!content.id || !content.name || !content.category) {
        errors.push(`${file}: missing required fields (id, name, category)`);
        continue;
      }
      if (!VALID_CATEGORIES.includes(content.category)) {
        errors.push(`${file}: invalid category "${content.category}"`);
        continue;
      }
      configs.push({
        id: content.id,
        name: content.name,
        description: content.description || "",
        category: content.category,
        path: file.replace(rootDir + "/", ""),
      });
    } catch (e) {
      errors.push(`${file}: ${(e as Error).message}`);
    }
  }

  if (errors.length > 0) {
    console.error(`${errors.length} error(s):`);
    errors.forEach((e) => console.error(`  ${e}`));
  }

  // Sort by category then id
  configs.sort((a, b) => a.category.localeCompare(b.category) || a.id.localeCompare(b.id));

  const registry = {
    version: "1.0.0",
    generated: new Date().toISOString(),
    categories: VALID_CATEGORIES,
    configs,
  };

  const outPath = join(mcpDir, "registry.json");
  writeFileSync(outPath, JSON.stringify(registry, null, 2) + "\n");
  console.log(`Synced registry: ${configs.length} configs across ${new Set(configs.map((c) => c.category)).size} categories`);
}

main();
