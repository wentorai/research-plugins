import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi, OpenClawPluginToolContext } from "openclaw/plugin-sdk";
import { toolResult, trackedFetch, isTrackedError, validEnum, validParam } from "./util.js";

const BASE = "https://inspirehep.net/api";

interface InspireAuthor {
  full_name: string;
  first_name?: string;
  last_name?: string;
}

interface InspireTitle {
  title: string;
  source?: string;
}

interface InspireAbstract {
  value: string;
  source?: string;
}

interface InspireArxivEprint {
  value: string;
  categories?: string[];
}

interface InspireDoi {
  value: string;
}

interface InspirePublicationInfo {
  year?: number;
  journal_title?: string;
  journal_volume?: string;
  page_start?: string;
  page_end?: string;
  artid?: string;
}

function normalizeHit(meta: Record<string, unknown>): Record<string, unknown> {
  const titles = meta.titles as InspireTitle[] | undefined;
  const authors = meta.authors as InspireAuthor[] | undefined;
  const arxivEprints = meta.arxiv_eprints as InspireArxivEprint[] | undefined;
  const dois = meta.dois as InspireDoi[] | undefined;
  const abstracts = meta.abstracts as InspireAbstract[] | undefined;
  const pubInfo = meta.publication_info as InspirePublicationInfo[] | undefined;

  const arxivId = arxivEprints?.[0]?.value;
  const doi = dois?.[0]?.value;

  return {
    title: titles?.[0]?.title,
    authors: authors?.slice(0, 10).map((a) => a.full_name),
    author_count: authors?.length ?? meta.author_count,
    doi,
    arxiv_id: arxivId,
    arxiv_categories: arxivEprints?.[0]?.categories,
    year: pubInfo?.[0]?.year ?? (meta.earliest_date ? String(meta.earliest_date).slice(0, 4) : undefined),
    journal: pubInfo?.[0]?.journal_title,
    journal_volume: pubInfo?.[0]?.journal_volume,
    citation_count: meta.citation_count,
    abstract: abstracts?.[0]?.value,
    url: doi
      ? `https://doi.org/${doi}`
      : arxivId
        ? `https://arxiv.org/abs/${arxivId}`
        : undefined,
    inspire_url: meta.control_number
      ? `https://inspirehep.net/literature/${meta.control_number}`
      : undefined,
    source: "inspire_hep",
  };
}

export function createInspireHepTools(
  _ctx: OpenClawPluginToolContext,
  _api: OpenClawPluginApi,
) {
  return [
    {
      name: "search_inspire",
      label: "Search Papers (INSPIRE-HEP)",
      description:
        "Search INSPIRE-HEP for high-energy physics literature. The primary database for particle physics, astrophysics, and related fields. Covers 1.5M+ records with citation tracking.",
      parameters: Type.Object({
        query: Type.String({
          description:
            "Search query. Supports SPIRES-style: 'find a einstein and t relativity', or keywords like 'higgs boson'. Field search: a (author), t (title), j (journal), eprint (arXiv ID).",
        }),
        size: Type.Optional(
          Type.Number({ description: "Max results (default 10, max 100)" }),
        ),
        sort: Type.Optional(
          Type.String({
            description:
              "Sort by: 'mostrecent' (newest), 'mostcited', 'bestmatch' (relevance)",
          }),
        ),
      }),
      execute: async (_toolCallId: string, input: { query: string; size?: number; sort?: string }) => {
        const query = validParam(input?.query);
        if (!query) {
          return toolResult({
            error: "query parameter is required and must not be empty.",
          });
        }

        const sort = validEnum(input.sort, ["mostrecent", "mostcited", "bestmatch"] as const, "bestmatch");
        const params = new URLSearchParams({
          q: query,
          size: String(Math.min(input.size ?? 10, 100)),
          sort,
        });

        const result = await trackedFetch(
          "inspire_hep",
          `${BASE}/literature?${params}`,
          undefined,
          10_000,
        );
        if (isTrackedError(result)) return result;
        const data = await result.res.json();

        return toolResult({
          total_results: data.hits?.total,
          source: "inspire_hep",
          papers: data.hits?.hits?.map(
            (h: Record<string, unknown>) =>
              normalizeHit(h.metadata as Record<string, unknown>),
          ),
          _latency_ms: result.latency_ms,
        });
      },
    },
    {
      name: "get_inspire_paper",
      label: "Get Paper Details (INSPIRE-HEP)",
      description:
        "Get detailed information about a specific paper from INSPIRE-HEP by arXiv ID or DOI.",
      parameters: Type.Object({
        identifier: Type.String({
          description:
            "Paper identifier: arXiv ID (e.g. '1207.7214') or DOI (e.g. '10.1016/j.physletb.2012.08.020')",
        }),
      }),
      execute: async (_toolCallId: string, input: { identifier: string }) => {
        if (!input?.identifier) {
          return toolResult({ error: 'identifier parameter is required (arXiv ID e.g. "1207.7214" or DOI e.g. "10.1016/j.physletb.2012.08.020")' });
        }
        // Determine if it's a DOI or arXiv ID
        const id = input.identifier.trim();
        let url: string;
        if (id.startsWith("10.")) {
          url = `${BASE}/doi/${encodeURIComponent(id)}`;
        } else {
          // arXiv ID — strip any "arXiv:" prefix
          const arxivId = id.replace(/^arXiv:/i, "");
          url = `${BASE}/arxiv/${encodeURIComponent(arxivId)}`;
        }

        const result = await trackedFetch("inspire_hep", url, undefined, 10_000);
        if (isTrackedError(result)) return result;
        const data = await result.res.json();

        const meta = data.metadata as Record<string, unknown> | undefined;
        if (!meta) return toolResult({ error: "Paper not found", source: "inspire_hep" });

        return toolResult({
          ...normalizeHit(meta),
          _latency_ms: result.latency_ms,
        });
      },
    },
  ];
}
