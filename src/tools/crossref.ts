import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi, OpenClawPluginToolContext } from "openclaw/plugin-sdk";

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
      description:
        "Resolve a DOI to get full bibliographic metadata from CrossRef (title, authors, journal, dates, references).",
      inputSchema: Type.Object({
        doi: Type.String({
          description: "DOI to resolve, e.g. '10.1038/nature12373'",
        }),
      }),
      handler: async (input: { doi: string }) => {
        const doi = input.doi.replace(/^https?:\/\/doi\.org\//, "");
        const res = await fetch(`${BASE}/works/${encodeURIComponent(doi)}`, {
          headers,
        });
        if (!res.ok) return { error: `API error: ${res.status} ${res.statusText}` };
        const data = await res.json();
        const w = data.message;
        return {
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
        };
      },
    },
    {
      name: "search_crossref",
      description:
        "Search CrossRef for scholarly works by query. Covers 150M+ DOIs across all publishers.",
      inputSchema: Type.Object({
        query: Type.String({ description: "Search query" }),
        limit: Type.Optional(
          Type.Number({ description: "Max results (default 10, max 100)" }),
        ),
        from_year: Type.Optional(
          Type.Number({ description: "Published from this year onward" }),
        ),
        type: Type.Optional(
          Type.String({
            description:
              "Work type filter: 'journal-article', 'book-chapter', 'proceedings-article', etc.",
          }),
        ),
        sort: Type.Optional(
          Type.String({
            description: "Sort by: 'relevance', 'published', 'is-referenced-by-count'",
          }),
        ),
      }),
      handler: async (input: {
        query: string;
        limit?: number;
        from_year?: number;
        type?: string;
        sort?: string;
      }) => {
        const params = new URLSearchParams({
          query: input.query,
          rows: String(Math.min(input.limit ?? 10, 100)),
        });
        if (input.from_year)
          params.set("filter", `from-pub-date:${input.from_year}`);
        if (input.type)
          params.append("filter", `type:${input.type}`);
        if (input.sort) params.set("sort", input.sort);

        const res = await fetch(`${BASE}/works?${params}`, { headers });
        if (!res.ok) return { error: `API error: ${res.status} ${res.statusText}` };
        const data = await res.json();
        return {
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
          })),
        };
      },
    },
  ];
}
