import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi, OpenClawPluginToolContext } from "openclaw/plugin-sdk";
import { toolResult, trackedFetch, isTrackedError, validParam } from "./util.js";

const BASE = "https://api.crossref.org";

export function createCrossRefTools(
  _ctx: OpenClawPluginToolContext,
  _api: OpenClawPluginApi,
) {
  const headers: Record<string, string> = {
    "User-Agent": "ResearchPlugins/1.0 (https://wentor.ai; mailto:dev@wentor.ai)",
  };

  return [
    {
      name: "resolve_doi",
      label: "Resolve DOI (CrossRef)",
      description:
        "Resolve a DOI to get full bibliographic metadata from CrossRef (title, authors, journal, dates, references).",
      parameters: Type.Object({
        doi: Type.String({
          description: "DOI to resolve, e.g. '10.1038/nature12373'",
        }),
      }),
      execute: async (input: { doi: string }) => {
        if (!input?.doi) {
          return toolResult({ error: 'doi parameter is required (e.g., "10.1038/nature12373")' });
        }
        const doi = input.doi.replace(/^https?:\/\/doi\.org\//, "");
        const tracked = await trackedFetch("crossref", `${BASE}/works/${encodeURIComponent(doi)}`, { headers });
        if (isTrackedError(tracked)) return tracked;
        const data = await tracked.res.json();
        const w = data.message;
        return toolResult({
          doi: w.DOI,
          title: w.title?.[0],
          authors: w.author?.map(
            (a: Record<string, string>) => `${a.given ?? ""} ${a.family ?? ""}`.trim(),
          ),
          container_title: w["container-title"]?.[0],
          published_date: w.published?.["date-parts"]?.[0]?.join("-"),
          type: w.type,
          is_referenced_by_count: w["is-referenced-by-count"],
          references_count: w["references-count"],
          issn: w.ISSN,
          url: w.URL,
          abstract: w.abstract,
          license: w.license?.[0]?.URL,
          _source_health: { source: "crossref", latency_ms: tracked.latency_ms },
        });
      },
    },
    {
      name: "search_crossref",
      label: "Search Works (CrossRef)",
      description:
        "Search CrossRef for scholarly works. Covers 150M+ DOIs across ALL publishers and disciplines. Supports journal/ISSN filtering, year range, work type, and citation-count sorting. Best general-purpose academic search tool.",
      parameters: Type.Object({
        query: Type.String({ description: "Search query (keywords)" }),
        journal: Type.Optional(
          Type.String({
            description:
              "Journal name filter (container-title). E.g. 'Nature', 'American Economic Review', 'The Lancet'",
          }),
        ),
        issn: Type.Optional(
          Type.String({
            description: "Journal ISSN filter. E.g. '0028-0836' for Nature, '0002-8282' for AER",
          }),
        ),
        from_year: Type.Optional(
          Type.Number({ description: "Published from this year onward (inclusive)" }),
        ),
        until_year: Type.Optional(
          Type.Number({ description: "Published until this year (inclusive)" }),
        ),
        type: Type.Optional(
          Type.String({
            description:
              "Work type: 'journal-article', 'book-chapter', 'proceedings-article', 'posted-content' (preprint), 'dissertation'",
          }),
        ),
        has_abstract: Type.Optional(
          Type.Boolean({ description: "Only results with abstracts" }),
        ),
        sort: Type.Optional(
          Type.String({
            description:
              "Sort by: 'relevance' (default), 'published' (newest first), 'is-referenced-by-count' (most cited)",
          }),
        ),
        limit: Type.Optional(
          Type.Number({ description: "Max results (default 10, max 100)" }),
        ),
      }),
      execute: async (input: {
        query: string;
        journal?: string;
        issn?: string;
        from_year?: number;
        until_year?: number;
        type?: string;
        has_abstract?: boolean;
        sort?: string;
        limit?: number;
      }) => {
        const params = new URLSearchParams({
          query: input.query,
          rows: String(Math.min(input.limit ?? 10, 100)),
        });

        // Build filter chain
        const filters: string[] = [];
        if (input.from_year) filters.push(`from-pub-date:${input.from_year}`);
        if (input.until_year) filters.push(`until-pub-date:${input.until_year}`);
        if (input.type) filters.push(`type:${input.type}`);
        if (input.has_abstract) filters.push("has-abstract:true");
        if (input.issn) filters.push(`issn:${input.issn}`);
        if (filters.length > 0) params.set("filter", filters.join(","));

        // Journal name as query.container-title (separate from filter)
        const journal = validParam(input.journal);
        if (journal) params.set("query.container-title", journal);

        const sort = validParam(input.sort);
        if (sort) {
          params.set("sort", sort);
          params.set("order", "desc");
        }

        const tracked = await trackedFetch("crossref", `${BASE}/works?${params}`, { headers });
        if (isTrackedError(tracked)) return tracked;
        const data = await tracked.res.json();

        return toolResult({
          total_results: data.message?.["total-results"],
          items: data.message?.items?.map((w: Record<string, unknown>) => ({
            doi: w.DOI,
            title: (w.title as string[])?.[0],
            authors: (w.author as Record<string, string>[])
              ?.slice(0, 5)
              .map((a) => `${a.given ?? ""} ${a.family ?? ""}`.trim()),
            container_title: (w["container-title"] as string[])?.[0],
            published:
              (w.published as Record<string, unknown>)?.["date-parts"],
            type: w.type,
            cited_by: w["is-referenced-by-count"],
            abstract: typeof w.abstract === "string"
              ? (w.abstract as string).replace(/<[^>]*>/g, "").slice(0, 300)
              : undefined,
          })),
          _source_health: { source: "crossref", latency_ms: tracked.latency_ms },
        });
      },
    },
  ];
}
