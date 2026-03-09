#!/usr/bin/env node

/**
 * triage.ts — Stage 1: Triage raw materials into actionable items
 *
 * Reads CSV source files, scores each entry, and outputs a prioritized
 * triage report for batch conversion.
 *
 * Run: node scripts/triage.ts [--csv path/to/file.csv] [--type api|skill|content|mcp]
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

interface TriageEntry {
  name: string;
  type: string;
  source: string;
  priority: "high" | "medium" | "low";
  targetCategory: string;
  targetSubcategory: string;
  reason: string;
}

function main() {
  const args = process.argv.slice(2);
  const csvIndex = args.indexOf("--csv");
  const typeIndex = args.indexOf("--type");

  if (csvIndex === -1) {
    console.log("Usage: node scripts/triage.ts --csv <path> --type <api|skill|content|mcp>");
    console.log("\nTriages raw CSV materials into prioritized conversion queue.");
    console.log("Output: triage-report.json in the repo root.");
    process.exit(0);
  }

  const csvPath = args[csvIndex + 1];
  const type = typeIndex !== -1 ? args[typeIndex + 1] : "auto";

  console.log(`Triaging: ${csvPath} (type: ${type})`);

  const content = readFileSync(csvPath, "utf-8");
  const lines = content.split("\n").filter((l) => l.trim());
  const headers = lines[0].split(",").map((h) => h.trim());

  console.log(`Found ${lines.length - 1} entries with columns: ${headers.join(", ")}`);

  // TODO: Implement scoring logic per SOP section 5.1
  // For now, output a summary

  const report = {
    generated: new Date().toISOString(),
    source: csvPath,
    type,
    totalEntries: lines.length - 1,
    headers,
    entries: [] as TriageEntry[],
  };

  const outPath = join(import.meta.dirname ?? ".", "..", "triage-report.json");
  writeFileSync(outPath, JSON.stringify(report, null, 2) + "\n");
  console.log(`Report written to ${outPath}`);
}

main();
