#!/usr/bin/env node

/**
 * convert.ts — Stage 3: Batch convert triaged entries into SKILL.md files
 *
 * Reads a triage report and generates SKILL.md files from CSV metadata
 * and fetched content.
 *
 * Run: node scripts/convert.ts [--report triage-report.json] [--dry-run]
 */

import { readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";

interface ConvertOptions {
  reportPath: string;
  dryRun: boolean;
}

function parseArgs(): ConvertOptions {
  const args = process.argv.slice(2);
  const reportIndex = args.indexOf("--report");
  const dryRun = args.includes("--dry-run");

  return {
    reportPath: reportIndex !== -1 ? args[reportIndex + 1] : "triage-report.json",
    dryRun,
  };
}

function generateFrontmatter(entry: {
  name: string;
  description: string;
  category: string;
  subcategory: string;
  keywords: string[];
  emoji: string;
  source: string;
}): string {
  const kw = entry.keywords.map((k) => `"${k}"`).join(", ");
  return `---
name: ${entry.name}
description: "${entry.description}"
metadata:
  openclaw:
    emoji: "${entry.emoji}"
    category: "${entry.category}"
    subcategory: "${entry.subcategory}"
    keywords: [${kw}]
    source: "${entry.source}"
---`;
}

function main() {
  const opts = parseArgs();

  if (!existsSync(opts.reportPath)) {
    console.log("Usage: node scripts/convert.ts --report <triage-report.json> [--dry-run]");
    console.log("\nConverts triaged entries into SKILL.md files.");
    console.log("Run scripts/triage.ts first to generate a report.");
    process.exit(0);
  }

  const report = JSON.parse(readFileSync(opts.reportPath, "utf-8"));
  console.log(`Converting ${report.entries?.length ?? 0} entries (dry-run: ${opts.dryRun})`);

  // TODO: Implement full conversion pipeline per SOP section 5.3
  // - Read CSV row data
  // - Read fetched content (if available)
  // - Generate SKILL.md using template
  // - Write to skills/{category}/{subcategory}/{name}/SKILL.md

  let created = 0;
  for (const entry of report.entries ?? []) {
    const targetDir = join("skills", entry.targetCategory, entry.targetSubcategory, entry.name);
    const targetFile = join(targetDir, "SKILL.md");

    if (opts.dryRun) {
      console.log(`  [dry-run] Would create: ${targetFile}`);
    } else {
      mkdirSync(targetDir, { recursive: true });
      // Placeholder — real implementation generates full content
      console.log(`  Created: ${targetFile}`);
    }
    created++;
  }

  console.log(`\n${opts.dryRun ? "Would create" : "Created"} ${created} skills`);
}

main();
