#!/usr/bin/env node

/**
 * validate.ts — QA validation for research-plugins
 *
 * Checks all skills/**\/*.md and mcp-configs/**\/*.json against quality rules.
 * Run: node scripts/validate.ts
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

// ── Constants ──────────────────────────────────────────────────────────

const VALID_CATEGORIES = [
  "literature",
  "writing",
  "analysis",
  "research",
  "domains",
  "tools",
] as const;

const VALID_SUBCATEGORIES: Record<string, string[]> = {
  literature: ["search", "discovery", "fulltext", "metadata"],
  writing: ["composition", "polish", "latex", "templates", "citation"],
  analysis: ["statistics", "econometrics", "wrangling", "dataviz"],
  research: [
    "methodology",
    "deep-research",
    "paper-review",
    "automation",
    "funding",
  ],
  domains: [
    "cs",
    "ai-ml",
    "biomedical",
    "chemistry",
    "economics",
    "finance",
    "law",
    "social-science",
    "education",
    "physics",
    "ecology",
    "math",
    "humanities",
    "business",
    "pharma",
    "geoscience",
  ],
  tools: [
    "diagram",
    "document",
    "code-exec",
    "scraping",
    "knowledge-graph",
    "ocr-translate",
  ],
};

const ALL_SUBCATEGORIES = Object.values(VALID_SUBCATEGORIES).flat();

const VALID_MCP_CATEGORIES = [
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

const KEBAB_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const SECRET_RE =
  /(?:api[_-]?key|password|secret|token)\s*[:=]\s*['"][^'"]{8,}['"]/i;
const EXTERNAL_IMG_RE = /!\[.*?\]\(https?:\/\//;

// ── Helpers ────────────────────────────────────────────────────────────

interface ValidationError {
  file: string;
  check: string;
  message: string;
}

function parseFrontmatter(content: string): {
  meta: Record<string, unknown> | null;
  body: string;
} {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: null, body: content };

  try {
    // Simple YAML parser for frontmatter (supports nested objects, arrays, strings)
    const meta = parseSimpleYaml(match[1]);
    return { meta, body: match[2] };
  } catch {
    return { meta: null, body: content };
  }
}

function parseSimpleYaml(yaml: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const lines = yaml.split("\n");
  const stack: { indent: number; obj: Record<string, unknown> }[] = [
    { indent: -1, obj: result },
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === "" || line.trim().startsWith("#")) continue;

    const indent = line.search(/\S/);
    const trimmed = line.trim();

    // Pop stack to find parent
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }
    const parent = stack[stack.length - 1].obj;

    // Array item
    if (trimmed.startsWith("- ")) {
      const lastKey = Object.keys(parent).pop();
      if (lastKey && Array.isArray(parent[lastKey])) {
        let val = trimmed.slice(2).trim();
        val = val.replace(/^['"]|['"]$/g, "");
        (parent[lastKey] as unknown[]).push(val);
      }
      continue;
    }

    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) continue;

    const key = trimmed.slice(0, colonIdx).trim();
    let value = trimmed.slice(colonIdx + 1).trim();

    if (value === "") {
      // Check if next line is array or nested object
      const nextLine = lines[i + 1];
      if (nextLine && nextLine.trim().startsWith("- ")) {
        parent[key] = [];
      } else {
        const child: Record<string, unknown> = {};
        parent[key] = child;
        stack.push({ indent, obj: child });
      }
    } else {
      // Remove quotes
      value = value.replace(/^['"]|['"]$/g, "");
      // Parse inline arrays: [a, b, c]
      if (value.startsWith("[") && value.endsWith("]")) {
        const items = value
          .slice(1, -1)
          .split(",")
          .map((s) => s.trim().replace(/^['"]|['"]$/g, ""))
          .filter(Boolean);
        parent[key] = items;
      } else if (value === "true") {
        parent[key] = true;
      } else if (value === "false") {
        parent[key] = false;
      } else if (!isNaN(Number(value)) && value !== "") {
        parent[key] = Number(value);
      } else {
        parent[key] = value;
      }
    }
  }

  return result;
}

function getNestedValue(
  obj: Record<string, unknown>,
  path: string,
): unknown | undefined {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
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
    // Directory doesn't exist
  }
  return files;
}

// ── Skill Validation ──────────────────────────────────────────────────

function validateSkill(filePath: string, rootDir: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const rel = relative(rootDir, filePath);
  const content = readFileSync(filePath, "utf-8");
  const size = Buffer.byteLength(content, "utf-8");

  // Parse frontmatter
  const { meta, body } = parseFrontmatter(content);

  if (!meta) {
    errors.push({
      file: rel,
      check: "frontmatter",
      message: "Missing or invalid YAML frontmatter",
    });
    return errors;
  }

  // name: kebab-case, non-empty
  const name = meta.name as string | undefined;
  if (!name || typeof name !== "string") {
    errors.push({
      file: rel,
      check: "name",
      message: "Missing `name` field",
    });
  } else if (!KEBAB_RE.test(name)) {
    errors.push({
      file: rel,
      check: "name",
      message: `name "${name}" is not kebab-case`,
    });
  }

  // description: non-empty, ≤80 chars
  const description = meta.description as string | undefined;
  if (!description || typeof description !== "string") {
    errors.push({
      file: rel,
      check: "description",
      message: "Missing `description` field",
    });
  } else if (description.length > 80) {
    errors.push({
      file: rel,
      check: "description",
      message: `description is ${description.length} chars (max 80)`,
    });
  }

  // metadata.openclaw.category
  const category = getNestedValue(meta, "metadata.openclaw.category") as
    | string
    | undefined;
  if (!category) {
    errors.push({
      file: rel,
      check: "category",
      message: "Missing metadata.openclaw.category",
    });
  } else if (
    !(VALID_CATEGORIES as readonly string[]).includes(category)
  ) {
    errors.push({
      file: rel,
      check: "category",
      message: `Invalid category "${category}"`,
    });
  }

  // metadata.openclaw.subcategory
  const subcategory = getNestedValue(
    meta,
    "metadata.openclaw.subcategory",
  ) as string | undefined;
  if (!subcategory) {
    errors.push({
      file: rel,
      check: "subcategory",
      message: "Missing metadata.openclaw.subcategory",
    });
  } else if (!ALL_SUBCATEGORIES.includes(subcategory)) {
    errors.push({
      file: rel,
      check: "subcategory",
      message: `Invalid subcategory "${subcategory}"`,
    });
  }

  // Path-metadata consistency
  if (category && subcategory) {
    // Path: skills/{category}/{subcategory}/{name}/SKILL.md
    const parts = rel.split(sep);
    if (parts.length >= 4) {
      const pathCategory = parts[1];
      const pathSubcategory = parts[2];
      if (pathCategory !== category) {
        errors.push({
          file: rel,
          check: "path-consistency",
          message: `Path category "${pathCategory}" != frontmatter category "${category}"`,
        });
      }
      if (pathSubcategory !== subcategory) {
        errors.push({
          file: rel,
          check: "path-consistency",
          message: `Path subcategory "${pathSubcategory}" != frontmatter subcategory "${subcategory}"`,
        });
      }
    }

    // Validate subcategory belongs to category
    if (
      VALID_SUBCATEGORIES[category] &&
      !VALID_SUBCATEGORIES[category].includes(subcategory)
    ) {
      errors.push({
        file: rel,
        check: "category-subcategory",
        message: `Subcategory "${subcategory}" not valid for category "${category}"`,
      });
    }
  }

  // metadata.openclaw.keywords: array, 3-8 items
  const keywords = getNestedValue(meta, "metadata.openclaw.keywords") as
    | string[]
    | undefined;
  if (!keywords || !Array.isArray(keywords)) {
    errors.push({
      file: rel,
      check: "keywords",
      message: "Missing metadata.openclaw.keywords array",
    });
  } else if (keywords.length < 3 || keywords.length > 8) {
    errors.push({
      file: rel,
      check: "keywords",
      message: `keywords has ${keywords.length} items (need 3-8)`,
    });
  }

  // File size: 1,000 chars ≤ content ≤ 256KB
  if (content.length < 1000) {
    errors.push({
      file: rel,
      check: "size",
      message: `Content is ${content.length} chars (min 1,000)`,
    });
  }
  if (size > 256 * 1024) {
    errors.push({
      file: rel,
      check: "size",
      message: `File is ${size} bytes (max 256KB)`,
    });
  }

  // H2 headings: ≥ 3
  const h2Count = (body.match(/^## /gm) || []).length;
  if (h2Count < 3) {
    errors.push({
      file: rel,
      check: "headings",
      message: `Only ${h2Count} H2 headings (min 3)`,
    });
  }

  // Security: no API key / password patterns
  if (SECRET_RE.test(content)) {
    errors.push({
      file: rel,
      check: "security",
      message: "Possible API key or password detected",
    });
  }

  // No external images
  if (EXTERNAL_IMG_RE.test(body)) {
    errors.push({
      file: rel,
      check: "images",
      message: "External image link detected",
    });
  }

  return errors;
}

// ── MCP Config Validation ─────────────────────────────────────────────

function validateMcpConfig(
  filePath: string,
  rootDir: string,
): ValidationError[] {
  const errors: ValidationError[] = [];
  const rel = relative(rootDir, filePath);

  try {
    const content = readFileSync(filePath, "utf-8");
    const config = JSON.parse(content);

    for (const field of ["id", "name", "description", "category"]) {
      if (!config[field] || typeof config[field] !== "string") {
        errors.push({
          file: rel,
          check: `mcp-${field}`,
          message: `Missing required field "${field}"`,
        });
      }
    }

    if (config.category && !VALID_MCP_CATEGORIES.includes(config.category)) {
      errors.push({
        file: rel,
        check: "mcp-category",
        message: `Invalid MCP category "${config.category}"`,
      });
    }

    if (!config.install || typeof config.install !== "object") {
      errors.push({
        file: rel,
        check: "mcp-install",
        message: "Missing install object",
      });
    }

    if (!config.source || typeof config.source !== "string") {
      errors.push({
        file: rel,
        check: "mcp-source",
        message: "Missing source URL",
      });
    }
  } catch (e) {
    errors.push({
      file: rel,
      check: "mcp-json",
      message: `Invalid JSON: ${(e as Error).message}`,
    });
  }

  return errors;
}

// ── Main ──────────────────────────────────────────────────────────────

function main() {
  const rootDir = join(import.meta.dirname ?? ".", "..");
  const skillsDir = join(rootDir, "skills");
  const mcpDir = join(rootDir, "mcp-configs");

  console.log("Research Plugins Validator\n");

  // Collect files
  const skillFiles = collectFiles(skillsDir, "SKILL.md");
  const mcpFiles = collectFiles(mcpDir, ".json").filter(
    (f) => !f.endsWith("registry.json"),
  );

  console.log(`Found ${skillFiles.length} skill files`);
  console.log(`Found ${mcpFiles.length} MCP config files\n`);

  let allErrors: ValidationError[] = [];

  // Validate skills
  const skillNames = new Map<string, string>(); // name → first file path
  for (const file of skillFiles) {
    const errors = validateSkill(file, rootDir);
    allErrors.push(...errors);

    // Collect names for cross-file duplicate check
    const content = readFileSync(file, "utf-8");
    const { meta } = parseFrontmatter(content);
    if (meta && typeof meta.name === "string") {
      const rel = relative(rootDir, file);
      const existing = skillNames.get(meta.name);
      if (existing) {
        allErrors.push({
          file: rel,
          check: "unique-name",
          message: `Duplicate skill name "${meta.name}" (also in ${existing})`,
        });
      } else {
        skillNames.set(meta.name, rel);
      }
    }
  }

  // Validate MCP configs
  const mcpIds = new Map<string, string>();
  for (const file of mcpFiles) {
    const errors = validateMcpConfig(file, rootDir);
    allErrors.push(...errors);

    // Cross-file duplicate id check
    try {
      const content = readFileSync(file, "utf-8");
      const config = JSON.parse(content);
      if (typeof config.id === "string") {
        const rel = relative(rootDir, file);
        const existing = mcpIds.get(config.id);
        if (existing) {
          allErrors.push({
            file: rel,
            check: "unique-id",
            message: `Duplicate MCP id "${config.id}" (also in ${existing})`,
          });
        } else {
          mcpIds.set(config.id, rel);
        }
      }
    } catch { /* parse errors already caught by validateMcpConfig */ }
  }

  // Report
  if (allErrors.length === 0) {
    console.log("All checks passed!");
  } else {
    console.log(`${allErrors.length} error(s) found:\n`);
    for (const err of allErrors) {
      console.log(`  [${err.check}] ${err.file}`);
      console.log(`    ${err.message}\n`);
    }
    process.exit(1);
  }

  // Coverage report
  const coveredSubcategories = new Set<string>();
  for (const file of skillFiles) {
    const parts = relative(rootDir, file).split(sep);
    if (parts.length >= 4) {
      coveredSubcategories.add(`${parts[1]}/${parts[2]}`);
    }
  }
  console.log(
    `\nSubcategory coverage: ${coveredSubcategories.size}/${ALL_SUBCATEGORIES.length}`,
  );
  if (coveredSubcategories.size > 0) {
    console.log("Covered:", [...coveredSubcategories].sort().join(", "));
  }
}

main();
