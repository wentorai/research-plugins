#!/usr/bin/env node

/**
 * generate-indexes.ts — Generate subcategory index SKILL.md files
 *
 * Reads catalog.json and generates one index SKILL.md per subcategory directory.
 * These indexes are discovered by OpenClaw's 1-level scan when plugin.json
 * declares category-level paths (e.g., "./skills/analysis").
 *
 * Run: node --experimental-strip-types scripts/generate-indexes.ts
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT_DIR = join(import.meta.dirname ?? ".", "..");
const CATALOG_PATH = join(ROOT_DIR, "catalog.json");
const SKILLS_DIR = join(ROOT_DIR, "skills");

// ── Subcategory descriptions ─────────────────────────────────────────
// Format: "Trigger: ... Design: ..."
// These are injected into the SKILL.md description field and appear
// directly in the LLM's system prompt as the sole matching surface.

const SUBCATEGORY_META: Record<string, { trigger: string; design: string }> = {
  // analysis
  "analysis/dataviz": {
    trigger: "charts, plots, figures, publication-quality graphics",
    design: "one skill per tool with code templates and academic formatting conventions",
  },
  "analysis/econometrics": {
    trigger: "causal analysis, regression models, treatment effects, panel data",
    design: "method-centric guides with R/Python code and diagnostic tests",
  },
  "analysis/statistics": {
    trigger: "statistical tests, Bayesian analysis, hypothesis testing, sampling",
    design: "method guides covering assumptions, code, and result interpretation",
  },
  "analysis/wrangling": {
    trigger: "messy data, format conversion, missing values, data reshaping",
    design: "pipeline-oriented recipes for common data cleaning and transformation tasks",
  },

  // domains
  "domains/ai-ml": {
    trigger: "ML experiments, model training, deep learning, NLP, computer vision",
    design: "covers frameworks, benchmarks, paper reproduction, and AI research workflows",
  },
  "domains/biomedical": {
    trigger: "medical research, clinical trials, genomics, bioinformatics",
    design: "domain databases, wet-lab/dry-lab methods, and ethical compliance guides",
  },
  "domains/business": {
    trigger: "business strategy, market analysis, competitive intelligence",
    design: "analytical frameworks and methods for management and innovation research",
  },
  "domains/chemistry": {
    trigger: "chemical structure analysis, reaction prediction, molecular modeling",
    design: "computational chemistry tools and cheminformatics workflows",
  },
  "domains/cs": {
    trigger: "algorithms, systems research, software engineering, security papers",
    design: "theory, complexity analysis, code-centric research, and security methods",
  },
  "domains/ecology": {
    trigger: "biodiversity surveys, species data, environmental monitoring",
    design: "field data collection, spatial analysis, and conservation biology workflows",
  },
  "domains/economics": {
    trigger: "economic modeling, policy analysis, macroeconomic data, FRED",
    design: "theory plus empirical methods with standard economics databases",
  },
  "domains/education": {
    trigger: "pedagogical research, course design, learning analytics, assessment",
    design: "evidence-based teaching methods and educational measurement tools",
  },
  "domains/finance": {
    trigger: "financial modeling, market data, risk analysis, quantitative finance",
    design: "data sources, quantitative methods, and regulatory frameworks",
  },
  "domains/geoscience": {
    trigger: "earth science data, GIS, remote sensing, climate modeling",
    design: "geospatial tools, satellite data processing, and environmental models",
  },
  "domains/humanities": {
    trigger: "textual analysis, archival research, digital humanities, philosophy",
    design: "digital tools and qualitative methods for humanities scholarship",
  },
  "domains/law": {
    trigger: "legal research, case law analysis, regulatory compliance",
    design: "legal databases, citation networks, and judicial analytics tools",
  },
  "domains/math": {
    trigger: "mathematical proofs, theorem proving, numerical methods, linear algebra",
    design: "formal verification tools and computational mathematics guides",
  },
  "domains/pharma": {
    trigger: "drug discovery, pharmacology, clinical trial design, regulatory filing",
    design: "end-to-end pipeline from target identification to clinical trials",
  },
  "domains/physics": {
    trigger: "physics simulations, astronomical data, computational physics",
    design: "domain databases (NASA ADS, arXiv) and simulation tool guides",
  },
  "domains/social-science": {
    trigger: "survey research, social networks, psychology, behavioral studies",
    design: "quantitative and qualitative methods for social science research",
  },

  // literature
  "literature/discovery": {
    trigger: "finding new relevant papers, tracking citations, staying current",
    design: "automated monitoring, recommendation engines, and alert setup guides",
  },
  "literature/fulltext": {
    trigger: "accessing paper PDFs, bulk downloading, open access, text mining",
    design: "legal full-text retrieval from open repositories, archives, and preprint servers",
  },
  "literature/metadata": {
    trigger: "DOI resolution, citation metrics, author disambiguation, bibliometrics",
    design: "metadata APIs and bibliometric analysis tools for scholarly records",
  },
  "literature/search": {
    trigger: "finding papers, search strategies, querying academic databases",
    design: "one skill per database/tool with API details, query syntax, and rate limits",
  },

  // research
  "research/automation": {
    trigger: "automating experiments, tracking results, reproducible pipelines",
    design: "ML experiment management, workflow orchestration, and lab automation tools",
  },
  "research/deep-research": {
    trigger: "systematic reviews, multi-source synthesis, comprehensive literature surveys",
    design: "multi-step research protocols with quality assessment and evidence grading",
  },
  "research/funding": {
    trigger: "grant applications, funding search, budget planning, data repositories",
    design: "funder-specific guides with eligibility, submission requirements, and timelines",
  },
  "research/methodology": {
    trigger: "study design, methodology selection, scientific reasoning, mentoring",
    design: "rigorous methods frameworks covering qualitative, quantitative, and mixed approaches",
  },
  "research/paper-review": {
    trigger: "reviewing manuscripts, comparing papers, quality assessment",
    design: "systematic review criteria, evaluation rubrics, and automated review tools",
  },

  // tools
  "tools/code-exec": {
    trigger: "running code, interactive notebooks, Jupyter, Colab, sandboxed execution",
    design: "execution environment guides with setup instructions and best practices",
  },
  "tools/diagram": {
    trigger: "creating diagrams, flowcharts, architecture visuals, LaTeX drawings",
    design: "tool-specific guides (Mermaid, Excalidraw, TikZ) with academic conventions",
  },
  "tools/document": {
    trigger: "extracting text from PDFs, parsing references, document Q&A",
    design: "parsing pipelines (GROBID, marker) and structured extraction tools",
  },
  "tools/knowledge-graph": {
    trigger: "building knowledge graphs, connecting concepts, ontology design",
    design: "graph construction, traversal, and visualization for research knowledge",
  },
  "tools/ocr-translate": {
    trigger: "scanning documents, recognizing formulas, translating academic papers",
    design: "specialized OCR (LaTeX, handwriting) and translation for scholarly content",
  },
  "tools/scraping": {
    trigger: "collecting web data, finding datasets, API access for research",
    design: "ethical scraping methods with rate limiting and data quality checks",
  },

  // writing
  "writing/citation": {
    trigger: "managing references, formatting citations, BibTeX, bibliographies",
    design: "reference manager integrations and citation style guides (APA, IEEE, etc.)",
  },
  "writing/composition": {
    trigger: "writing paper sections, structuring arguments, academic prose",
    design: "section-by-section guides (abstract, intro, methods, discussion) with templates",
  },
  "writing/latex": {
    trigger: "LaTeX typesetting, formatting papers, mathematical notation, Beamer",
    design: "template-based guides with package recommendations and compilation tips",
  },
  "writing/polish": {
    trigger: "polishing drafts, academic tone, proofreading, translation",
    design: "style checkers and editing workflows for clear, concise academic English",
  },
  "writing/templates": {
    trigger: "starting a new paper, formatting for submission, venue-specific layouts",
    design: "ready-to-use templates for arXiv preprint, conferences, thesis, and posters",
  },
};

// ── Human-readable subcategory titles ────────────────────────────────

const SUBCATEGORY_TITLES: Record<string, string> = {
  dataviz: "Data Visualization",
  econometrics: "Econometrics",
  statistics: "Statistical Analysis",
  wrangling: "Data Wrangling",
  "ai-ml": "AI & Machine Learning",
  biomedical: "Biomedical Research",
  business: "Business Research",
  chemistry: "Chemistry",
  cs: "Computer Science",
  ecology: "Ecology & Environmental Science",
  economics: "Economics",
  education: "Education Research",
  finance: "Finance",
  geoscience: "Geoscience & Climate",
  humanities: "Humanities",
  law: "Legal Research",
  math: "Mathematics",
  pharma: "Pharmaceutical Research",
  physics: "Physics & Astrophysics",
  "social-science": "Social Science",
  discovery: "Paper Discovery",
  fulltext: "Full-Text Access",
  metadata: "Metadata & Bibliometrics",
  search: "Database Search",
  automation: "Research Automation",
  "deep-research": "Deep Research & Systematic Reviews",
  funding: "Grants & Funding",
  methodology: "Research Methodology",
  "paper-review": "Peer Review",
  "code-exec": "Code Execution",
  diagram: "Diagrams & Visuals",
  document: "Document Processing",
  "knowledge-graph": "Knowledge Graphs",
  "ocr-translate": "OCR & Translation",
  scraping: "Web Scraping & Data Collection",
  citation: "Citation Management",
  composition: "Academic Writing",
  latex: "LaTeX",
  polish: "Editing & Proofreading",
  templates: "Paper Templates",
};

// ── Types ────────────────────────────────────────────────────────────

interface CatalogItem {
  id: string;
  type: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  keywords: string[];
  path: string;
  source: string;
}

interface Catalog {
  version: string;
  generated: string;
  stats: { skills: number };
  items: CatalogItem[];
}

// ── Main ─────────────────────────────────────────────────────────────

function main() {
  // Read catalog
  const catalog: Catalog = JSON.parse(readFileSync(CATALOG_PATH, "utf-8"));
  // Filter out index skills (name ends with "-skills") to avoid self-referencing
  const skills = catalog.items.filter(
    (i) => i.type === "skill" && !i.name.endsWith("-skills"),
  );

  // Group by category/subcategory
  const groups = new Map<string, CatalogItem[]>();
  for (const skill of skills) {
    const key = `${skill.category}/${skill.subcategory}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(skill);
  }

  console.log(`Generating index SKILL.md files for ${groups.size} subcategories\n`);

  let generated = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const [key, items] of [...groups.entries()].sort()) {
    const [category, subcategory] = key.split("/");
    const subcatDir = join(SKILLS_DIR, category, subcategory);

    // Verify directory exists
    if (!existsSync(subcatDir)) {
      errors.push(`Directory not found: ${key}`);
      continue;
    }

    // Verify all cataloged skills have directories
    for (const item of items) {
      const skillDir = join(ROOT_DIR, item.path);
      if (!existsSync(skillDir)) {
        errors.push(`Skill directory not found: ${item.path}`);
      }
    }

    const meta = SUBCATEGORY_META[key];
    if (!meta) {
      errors.push(`No description metadata for: ${key}`);
      continue;
    }

    const title = SUBCATEGORY_TITLES[subcategory] ?? subcategory;
    const count = items.length;

    // Build description (appears in LLM prompt as <description>)
    // Keep concise — no skill name examples (the index table has them).
    // Budget: aim for <200 chars to conserve prompt token space.
    const description =
      `${count} ${title.toLowerCase()} skills. ` +
      `Trigger: ${meta.trigger}. ` +
      `Design: ${meta.design}.`;

    // Sort items alphabetically
    items.sort((a, b) => a.name.localeCompare(b.name));

    // Build SKILL.md content
    const lines: string[] = [
      "---",
      `name: ${subcategory}-skills`,
      `description: "${description.replace(/"/g, '\\"')}"`,
      "---",
      "",
      `# ${title} \u2014 ${count} Skills`,
      "",
      `Select the skill matching the user's need, then \`read\` its SKILL.md.`,
      "",
      "| Skill | Description |",
      "|-------|-------------|",
    ];

    for (const item of items) {
      lines.push(
        `| [${item.name}](./${item.name}/SKILL.md) | ${item.description} |`,
      );
    }

    lines.push(""); // trailing newline

    const indexPath = join(subcatDir, "SKILL.md");
    writeFileSync(indexPath, lines.join("\n"), "utf-8");
    generated++;

    console.log(`  ${key.padEnd(30)} ${count.toString().padStart(3)} skills -> SKILL.md`);
  }

  console.log(`\nGenerated: ${generated} index files`);
  if (skipped > 0) console.log(`Skipped: ${skipped}`);

  if (errors.length > 0) {
    console.log(`\nErrors (${errors.length}):`);
    for (const err of errors) {
      console.log(`  - ${err}`);
    }
    process.exit(1);
  }

  // Cross-check: verify no name conflicts with existing skills
  const indexNames = new Set<string>();
  for (const [key] of groups) {
    const subcategory = key.split("/")[1];
    indexNames.add(`${subcategory}-skills`);
  }

  const conflicting = skills.filter((s) => indexNames.has(s.name));
  if (conflicting.length > 0) {
    console.log(`\nWARNING: Name conflicts between index and skill files:`);
    for (const c of conflicting) {
      console.log(`  - ${c.name} (${c.path})`);
    }
    process.exit(1);
  }

  console.log("\nAll index files generated successfully.");
}

main();
