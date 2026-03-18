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
import { createZenodoTools } from "./src/tools/zenodo.js";
import { createOrcidTools } from "./src/tools/orcid.js";
import { createInspireHepTools } from "./src/tools/inspire-hep.js";
import { createHalTools } from "./src/tools/hal.js";
import { createOsfPreprintsTools } from "./src/tools/osf-preprints.js";
import { createDataCiteTools } from "./src/tools/datacite.js";
import { createRorTools } from "./src/tools/ror.js";
// ChemRxiv: REMOVED — blocked by Cloudflare WAF, returns HTML challenge instead of JSON

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

  // --- Phase 2: Domain-specific tools ---

  api.registerTool(
    (ctx) => createZenodoTools(ctx, api),
    { names: ["search_zenodo", "get_zenodo_record"] },
  );

  api.registerTool(
    (ctx) => createOrcidTools(ctx, api),
    { names: ["search_orcid", "get_orcid_works"] },
  );

  api.registerTool(
    (ctx) => createInspireHepTools(ctx, api),
    { names: ["search_inspire", "get_inspire_paper"] },
  );

  api.registerTool(
    (ctx) => createHalTools(ctx, api),
    { names: ["search_hal"] },
  );

  api.registerTool(
    (ctx) => createOsfPreprintsTools(ctx, api),
    { names: ["search_osf_preprints"] },
  );

  // --- Phase 3: Infrastructure tools ---

  api.registerTool(
    (ctx) => createDataCiteTools(ctx, api),
    { names: ["search_datacite", "resolve_datacite_doi"] },
  );

  api.registerTool(
    (ctx) => createRorTools(ctx, api),
    { names: ["search_ror"] },
  );

  // ChemRxiv: blocked by Cloudflare — moved to Layer 2 (Browser RPA)
}
