#!/usr/bin/env node

/**
 * fix-frontmatter.ts — Fix skills with category/subcategory/keywords outside metadata.openclaw
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function collectFiles(dir: string): string[] {
  const files: string[] = [];
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) files.push(...collectFiles(fullPath));
      else if (entry.name === "SKILL.md") files.push(fullPath);
    }
  } catch {}
  return files;
}

const files = collectFiles("skills");
let fixed = 0;

for (const file of files) {
  const content = readFileSync(file, "utf-8");
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) continue;

  const fm = fmMatch[1];
  const body = fmMatch[2];

  // Check if category is at top level (not indented)
  if (!/^category:/m.test(fm)) continue; // Already correct or no category
  // Make sure it's top-level (not under metadata.openclaw)
  const categoryLine = fm.split("\n").find((l) => /^category:/.test(l));
  if (!categoryLine) continue;

  // Extract fields
  const lines = fm.split("\n");

  let name = "";
  let desc = "";
  let emoji = "";
  let category = "";
  let subcategory = "";
  let source = "";
  const keywords: string[] = [];
  const requiresEnv: string[] = [];

  let inKeywords = false;
  let inRequiresEnv = false;

  for (const line of lines) {
    if (/^name:\s/.test(line)) {
      name = line.replace(/^name:\s*/, "").trim();
    } else if (/^description:\s/.test(line)) {
      desc = line.replace(/^description:\s*/, "").trim().replace(/^"|"$/g, "");
    } else if (/emoji:\s/.test(line)) {
      emoji = line.replace(/.*emoji:\s*/, "").trim().replace(/^"|"$/g, "");
    } else if (/^category:\s/.test(line)) {
      category = line.replace(/^category:\s*/, "").trim().replace(/^"|"$/g, "");
      inKeywords = false;
      inRequiresEnv = false;
    } else if (/^subcategory:\s/.test(line)) {
      subcategory = line
        .replace(/^subcategory:\s*/, "")
        .trim()
        .replace(/^"|"$/g, "");
      inKeywords = false;
      inRequiresEnv = false;
    } else if (/^source:\s/.test(line)) {
      source = line.replace(/^source:\s*/, "").trim().replace(/^"|"$/g, "");
      inKeywords = false;
      inRequiresEnv = false;
    } else if (/^keywords:/.test(line)) {
      inKeywords = true;
      inRequiresEnv = false;
      // Check for inline array
      const inlineMatch = line.match(/keywords:\s*\[(.+)\]/);
      if (inlineMatch) {
        const items = inlineMatch[1]
          .split(",")
          .map((s) => s.trim().replace(/^"|"$/g, ""));
        keywords.push(...items);
        inKeywords = false;
      }
    } else if (inKeywords && /^\s+-\s/.test(line)) {
      keywords.push(
        line
          .trim()
          .replace(/^-\s*/, "")
          .replace(/^"|"$/g, ""),
      );
    } else if (/^\s+env:/.test(line) || /^env:/.test(line)) {
      inRequiresEnv = true;
      inKeywords = false;
    } else if (inRequiresEnv && /^\s+-\s/.test(line)) {
      requiresEnv.push(
        line
          .trim()
          .replace(/^-\s*/, "")
          .replace(/^"|"$/g, ""),
      );
    } else if (/^\S/.test(line) && !/^---/.test(line)) {
      inKeywords = false;
      inRequiresEnv = false;
    }
  }

  if (!category || !subcategory) continue;

  // Truncate desc to 80
  if (desc.length > 80) desc = desc.slice(0, 77) + "...";

  // Ensure emoji has quotes
  if (!emoji) emoji = "📚";

  // Build fixed frontmatter
  const kwStr = keywords.map((k) => `"${k}"`).join(", ");

  let newFm = `---
name: ${name}
description: "${desc}"
metadata:
  openclaw:
    emoji: "${emoji}"
    category: "${category}"
    subcategory: "${subcategory}"
    keywords: [${kwStr}]
    source: "${source}"`;

  if (requiresEnv.length > 0) {
    newFm += `\n    requires:\n      env: [${requiresEnv.map((e) => `"${e}"`).join(", ")}]`;
  }

  newFm += "\n---\n";

  writeFileSync(file, newFm + body);
  fixed++;
}

console.log(`Fixed ${fixed} files`);
