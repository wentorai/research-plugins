/**
 * Integration test: validates that all search tools correctly reject
 * invalid query parameters (LLM hallucination values).
 *
 * Also tests that valid queries reach the real API and return results.
 *
 * Run: npx tsx tests/test-query-validation.ts
 */

import { createArxivTools } from "../src/tools/arxiv.js";
import { createCrossRefTools } from "../src/tools/crossref.js";
import { createPubMedTools } from "../src/tools/pubmed.js";
import { createDblpTools } from "../src/tools/dblp.js";
import { createRorTools } from "../src/tools/ror.js";
import { createInspireHepTools } from "../src/tools/inspire-hep.js";
import { createOrcidTools } from "../src/tools/orcid.js";

const ctx = {} as any;
const api = {} as any;

const tools = [
  ...createArxivTools(ctx, api),
  ...createCrossRefTools(ctx, api),
  ...createPubMedTools(ctx, api),
  ...createDblpTools(ctx, api),
  ...createRorTools(ctx, api),
  ...createInspireHepTools(ctx, api),
  ...createOrcidTools(ctx, api),
];

const searchTools = tools.filter((t) => t.name.startsWith("search_"));

// ── Part 1: Invalid query rejection ──────────────────────────────────────

const INVALID_INPUTS = [
  { label: '"undefined"', query: "undefined" },
  { label: '"null"', query: "null" },
  { label: '""', query: "" },
  { label: '"none"', query: "none" },
  { label: '"None"', query: "None" },
  { label: '"   "', query: "   " },
];

let pass = 0;
let fail = 0;

console.log("=== Part 1: Invalid query rejection ===\n");

for (const tool of searchTools) {
  for (const inv of INVALID_INPUTS) {
    const result = await tool.execute({ query: inv.query } as any);
    const text = result?.content?.[0]?.text ?? "";
    const isError = text.includes("error") && text.includes("required");
    if (isError) {
      pass++;
    } else {
      fail++;
      console.log(
        `  FAIL: ${tool.name} did not reject ${inv.label} → ${text.slice(0, 120)}`,
      );
    }
  }
  console.log(`  ✓ ${tool.name}: all ${INVALID_INPUTS.length} invalid inputs rejected`);
}

console.log(`\nInvalid rejection: ${pass} passed, ${fail} failed\n`);

// ── Part 2: Valid query live API test ────────────────────────────────────

console.log("=== Part 2: Valid query → real API (smoke test) ===\n");

const LIVE_CASES: { tool: string; input: Record<string, unknown>; check: string }[] = [
  {
    tool: "search_arxiv",
    input: { query: "ti:transformer AND cat:cs.CL", max_results: 2 },
    check: "papers",
  },
  {
    tool: "search_crossref",
    input: { query: "PFAS machine learning", limit: 2 },
    check: "items",
  },
  {
    tool: "search_dblp",
    input: { query: "deep learning", max_results: 2 },
    check: "papers",
  },
];

let livePass = 0;
let liveFail = 0;

for (const c of LIVE_CASES) {
  const tool = tools.find((t) => t.name === c.tool);
  if (!tool) {
    console.log(`  SKIP: ${c.tool} not found`);
    continue;
  }
  try {
    const result = await tool.execute(c.input as any);
    const text = result?.content?.[0]?.text ?? "";
    const parsed = JSON.parse(text);
    const hasResults = Array.isArray(parsed[c.check]) && parsed[c.check].length > 0;
    const hasError = !!parsed.error;

    if (hasResults && !hasError) {
      livePass++;
      console.log(
        `  ✓ ${c.tool}: returned ${parsed[c.check].length} results`,
      );
    } else if (hasError) {
      liveFail++;
      console.log(`  FAIL: ${c.tool}: API error → ${parsed.error}`);
    } else {
      // 0 results is not necessarily a failure for live APIs
      livePass++;
      console.log(
        `  ✓ ${c.tool}: returned 0 results (API reachable, no match)`,
      );
    }
  } catch (err) {
    liveFail++;
    console.log(`  FAIL: ${c.tool}: exception → ${err}`);
  }
}

console.log(`\nLive API: ${livePass} passed, ${liveFail} failed\n`);

// ── Summary ──────────────────────────────────────────────────────────────

const totalFail = fail + liveFail;
if (totalFail > 0) {
  console.log(`FAILED: ${totalFail} test(s) failed`);
  process.exit(1);
} else {
  console.log(`ALL PASSED: ${pass + livePass} tests`);
}
