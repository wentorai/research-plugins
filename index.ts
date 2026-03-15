import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { createSemanticScholarTools } from "./src/tools/semantic-scholar.js";
import { createOpenAlexTools } from "./src/tools/openalex.js";
import { createCrossRefTools } from "./src/tools/crossref.js";
import { createArxivTools } from "./src/tools/arxiv.js";
import { createPubMedTools } from "./src/tools/pubmed.js";
import { createUnpaywallTools } from "./src/tools/unpaywall.js";

export default function activate(api: OpenClawPluginApi) {
  api.registerTool(
    (ctx) => createSemanticScholarTools(ctx, api),
    { names: ["get_paper", "get_citations"] },
  );

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
}
