import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { createOpenAlexTools } from "./src/tools/openalex.js";
import { createCrossRefTools } from "./src/tools/crossref.js";
import { createArxivTools } from "./src/tools/arxiv.js";
import { createPubMedTools } from "./src/tools/pubmed.js";
import { createUnpaywallTools } from "./src/tools/unpaywall.js";
import { createEuropePmcTools } from "./src/tools/europe-pmc.js";
import { createOpenCitationsTools } from "./src/tools/opencitations.js";
import { createDoajTools } from "./src/tools/doaj.js";
import { createDblpTools } from "./src/tools/dblp.js";
import { createBiorxivTools } from "./src/tools/biorxiv.js";
import { createOpenAireTools } from "./src/tools/openaire.js";

export default function activate(api: OpenClawPluginApi) {
  // --- Existing tools ---

  api.registerTool(
    (ctx) => createOpenAlexTools(ctx, api),
    { names: ["search_openalex", "get_work", "get_author_openalex"] },
  );

  api.registerTool(
    (ctx) => createCrossRefTools(ctx, api),
    { names: ["resolve_doi", "search_crossref"] },
  );

  api.registerTool(
    (ctx) => createArxivTools(ctx, api),
    { names: ["search_arxiv", "get_arxiv_paper"] },
  );

  api.registerTool(
    (ctx) => createPubMedTools(ctx, api),
    { names: ["search_pubmed", "get_article"] },
  );

  api.registerTool(
    (ctx) => createUnpaywallTools(ctx, api),
    { names: ["find_oa_version"] },
  );

  // --- Phase 1: New free API tools ---

  api.registerTool(
    (ctx) => createEuropePmcTools(ctx, api),
    { names: ["search_europe_pmc", "get_epmc_citations", "get_epmc_references"] },
  );

  api.registerTool(
    (ctx) => createOpenCitationsTools(ctx, api),
    { names: ["get_citations_open", "get_references_open", "get_citation_count"] },
  );

  api.registerTool(
    (ctx) => createDoajTools(ctx, api),
    { names: ["search_doaj"] },
  );

  api.registerTool(
    (ctx) => createDblpTools(ctx, api),
    { names: ["search_dblp", "search_dblp_author"] },
  );

  api.registerTool(
    (ctx) => createBiorxivTools(ctx, api),
    { names: ["search_biorxiv", "search_medrxiv", "get_preprint_by_doi"] },
  );

  api.registerTool(
    (ctx) => createOpenAireTools(ctx, api),
    { names: ["search_openaire"] },
  );
}
