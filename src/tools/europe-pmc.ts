import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi, OpenClawPluginToolContext } from "openclaw/plugin-sdk";
import { toolResult, trackedFetch, isTrackedError } from "./util.js";

const BASE = "https://www.ebi.ac.uk/europepmc/webservices/rest";

export function createEuropePmcTools(
  _ctx: OpenClawPluginToolContext,
  _api: OpenClawPluginApi,
) {
  return [
    {
      name: "search_europe_pmc",
      label: "Search Articles (Europe PMC)",
      description:
        "Search Europe PMC biomedical literature. Covers 33M+ articles including full PubMed, with open access full text, citation counts, and MeSH terms.",
      parameters: Type.Object({
        query: Type.String({
          description:
            "Search query. Supports field tags: TITLE:, AUTH:, JOURNAL:, DOI:, and boolean AND/OR/NOT.",
        }),
        max_results: Type.Optional(
          Type.Number({ description: "Max results (default 10, max 1000)" }),
        ),
        sort: Type.Optional(
          Type.String({
            description: "Sort by: 'RELEVANCE', 'DATE_DESC', 'CITED'",
          }),
        ),
        cursor: Type.Optional(
          Type.String({ description: "Pagination cursor (use value from previous response)" }),
        ),
      }),
      execute: async (input: {
        query: string;
        max_results?: number;
        sort?: string;
        cursor?: string;
      }) => {
        const params = new URLSearchParams({
          query: input.query,
          format: "json",
          pageSize: String(Math.min(input.max_results ?? 10, 1000)),
          resultType: "core",
        });
        if (input.sort) params.set("sort", input.sort);
        params.set("cursorMark", input.cursor ?? "*");

        const tracked = await trackedFetch("europe_pmc", `${BASE}/search?${params}`);
        if (isTrackedError(tracked)) return tracked;
        const data = await tracked.res.json();

        const results = (data.resultList?.result ?? []).map(
          (r: Record<string, unknown>) => ({
            pmid: r.pmid,
            pmcid: r.pmcid,
            doi: r.doi,
            title: r.title,
            authors: r.authorString,
            journal: (r.journalInfo as Record<string, unknown>)?.journal
              ? ((r.journalInfo as Record<string, unknown>).journal as Record<string, unknown>)?.title
              : undefined,
            year: r.pubYear,
            abstract: r.abstractText,
            is_oa: r.isOpenAccess === "Y",
            cited_by_count: r.citedByCount,
            source: r.source,
            url: r.doi ? `https://doi.org/${r.doi}` : `https://europepmc.org/article/${r.source}/${r.id}`,
          }),
        );

        return toolResult({
          total_results: data.hitCount,
          next_cursor: data.nextCursorMark,
          articles: results,
          _source_health: { source: "europe_pmc", latency_ms: tracked.latency_ms },
        });
      },
    },
    {
      name: "get_epmc_citations",
      label: "Get Citations (Europe PMC)",
      description:
        "Get papers that cite a given article. Forward citation tracking for biomedical literature.",
      parameters: Type.Object({
        pmid: Type.String({
          description: "PubMed ID of the article",
        }),
        max_results: Type.Optional(
          Type.Number({ description: "Max citations to return (default 25)" }),
        ),
        page: Type.Optional(Type.Number({ description: "Page number (default 1)" })),
      }),
      execute: async (input: { pmid: string; max_results?: number; page?: number }) => {
        const params = new URLSearchParams({
          format: "json",
          pageSize: String(input.max_results ?? 25),
          page: String(input.page ?? 1),
        });
        const tracked = await trackedFetch("europe_pmc", `${BASE}/MED/${input.pmid}/citations?${params}`);
        if (isTrackedError(tracked)) return tracked;
        const data = await tracked.res.json();

        return toolResult({
          total_citations: data.hitCount,
          citations: (data.citationList?.citation ?? []).map(
            (c: Record<string, unknown>) => ({
              pmid: c.id,
              source: c.source,
              title: c.title,
              authors: c.authorString,
              journal: c.journalAbbreviation,
              year: c.pubYear,
              cited_by_count: c.citedByCount,
            }),
          ),
          _source_health: { source: "europe_pmc", latency_ms: tracked.latency_ms },
        });
      },
    },
    {
      name: "get_epmc_references",
      label: "Get References (Europe PMC)",
      description:
        "Get the reference list of a paper. Shows what a paper cites.",
      parameters: Type.Object({
        pmid: Type.String({ description: "PubMed ID of the article" }),
        max_results: Type.Optional(
          Type.Number({ description: "Max references to return (default 25)" }),
        ),
      }),
      execute: async (input: { pmid: string; max_results?: number }) => {
        const params = new URLSearchParams({
          format: "json",
          pageSize: String(input.max_results ?? 25),
        });
        const tracked = await trackedFetch("europe_pmc", `${BASE}/MED/${input.pmid}/references?${params}`);
        if (isTrackedError(tracked)) return tracked;
        const data = await tracked.res.json();

        return toolResult({
          total_references: data.hitCount,
          references: (data.referenceList?.reference ?? []).map(
            (r: Record<string, unknown>) => ({
              pmid: r.id,
              source: r.source,
              title: r.title,
              authors: r.authorString,
              journal: r.journalAbbreviation,
              year: r.pubYear,
              order: r.citedOrder,
            }),
          ),
          _source_health: { source: "europe_pmc", latency_ms: tracked.latency_ms },
        });
      },
    },
  ];
}
