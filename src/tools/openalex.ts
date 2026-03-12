import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi, OpenClawPluginToolContext } from "openclaw/plugin-sdk";

const BASE = "https://api.openalex.org";

function toolResult(data: unknown) {
  const text = JSON.stringify(data, null, 2);
  return { content: [{ type: "text" as const, text }] };
}

export function createOpenAlexTools(
  _ctx: OpenClawPluginToolContext,
  _api: OpenClawPluginApi,
) {
  const headers: Record<string, string> = {
    "User-Agent": "ResearchPlugins/1.0 (https://wentor.ai)",
  };

  return [
    {
      name: "search_openalex",
      label: "Search Works (OpenAlex)",
      description:
        "Search academic works via OpenAlex (free, no key required). Covers 250M+ works across all disciplines.",
      parameters: Type.Object({
        query: Type.String({ description: "Search query for works" }),
        limit: Type.Optional(
          Type.Number({ description: "Max results (default 10, max 200)" }),
        ),
        from_year: Type.Optional(
          Type.Number({ description: "Filter works from this year onward" }),
        ),
        to_year: Type.Optional(
          Type.Number({ description: "Filter works up to this year" }),
        ),
        open_access: Type.Optional(
          Type.Boolean({ description: "Only open access works" }),
        ),
        sort_by: Type.Optional(
          Type.String({
            description: "Sort by: 'cited_by_count', 'publication_date', 'relevance_score'",
          }),
        ),
      }),
      execute: async (input: {
        query: string;
        limit?: number;
        from_year?: number;
        to_year?: number;
        open_access?: boolean;
        sort_by?: string;
      }) => {
        const filters: string[] = [];
        if (input.from_year) filters.push(`from_publication_date:${input.from_year}-01-01`);
        if (input.to_year) filters.push(`to_publication_date:${input.to_year}-12-31`);
        if (input.open_access) filters.push("is_oa:true");

        const params = new URLSearchParams({
          search: input.query,
          per_page: String(Math.min(input.limit ?? 10, 200)),
        });
        if (filters.length > 0) params.set("filter", filters.join(","));
        if (input.sort_by) params.set("sort", input.sort_by);

        const res = await fetch(`${BASE}/works?${params}`, { headers });
        if (!res.ok) return toolResult({ error: `API error: ${res.status} ${res.statusText}` });
        const data = await res.json();
        return toolResult({
          total_count: data.meta?.count,
          results: data.results?.map((w: Record<string, unknown>) => ({
            id: w.id,
            doi: w.doi,
            title: w.title,
            publication_date: w.publication_date,
            cited_by_count: w.cited_by_count,
            is_oa: w.open_access && (w.open_access as Record<string, unknown>).is_oa,
            oa_url:
              w.open_access && (w.open_access as Record<string, unknown>).oa_url,
            authors: Array.isArray(w.authorships)
              ? (w.authorships as Record<string, unknown>[]).slice(0, 5).map(
                  (a) => (a.author as Record<string, unknown>)?.display_name,
                )
              : [],
          })),
        });
      },
    },
    {
      name: "get_work",
      label: "Get Work Details (OpenAlex)",
      description:
        "Get full details of a work by its OpenAlex ID, DOI, or other identifier.",
      parameters: Type.Object({
        work_id: Type.String({
          description:
            "Work identifier: OpenAlex ID (e.g. 'W2741809807'), DOI URL, or PMID",
        }),
      }),
      execute: async (input: { work_id: string }) => {
        const id = input.work_id.startsWith("10.")
          ? `https://doi.org/${input.work_id}`
          : input.work_id;
        const res = await fetch(`${BASE}/works/${encodeURIComponent(id)}`, {
          headers,
        });
        if (!res.ok) return toolResult({ error: `API error: ${res.status} ${res.statusText}` });
        const w = await res.json();
        return toolResult({
          id: w.id,
          doi: w.doi,
          title: w.title,
          abstract: w.abstract,
          publication_date: w.publication_date,
          type: w.type,
          cited_by_count: w.cited_by_count,
          is_oa: w.open_access?.is_oa,
          oa_url: w.open_access?.oa_url,
          venue: w.primary_location?.source?.display_name,
          authors: w.authorships?.map(
            (a: Record<string, unknown>) =>
              (a.author as Record<string, unknown>)?.display_name,
          ),
          concepts: w.concepts
            ?.slice(0, 10)
            .map((c: Record<string, unknown>) => c.display_name),
          referenced_works_count: w.referenced_works?.length,
        });
      },
    },
    {
      name: "get_author_openalex",
      label: "Get Author (OpenAlex)",
      description:
        "Get author information from OpenAlex including publications, h-index, and affiliations.",
      parameters: Type.Object({
        author_id: Type.String({
          description:
            "Author identifier: OpenAlex ID (e.g. 'A5023888391'), ORCID, or name search",
        }),
      }),
      execute: async (input: { author_id: string }) => {
        let url: string;
        if (
          input.author_id.startsWith("A") ||
          input.author_id.startsWith("https://")
        ) {
          url = `${BASE}/authors/${encodeURIComponent(input.author_id)}`;
        } else if (input.author_id.includes("-")) {
          url = `${BASE}/authors/orcid:${input.author_id}`;
        } else {
          const params = new URLSearchParams({
            search: input.author_id,
            per_page: "5",
          });
          const res = await fetch(`${BASE}/authors?${params}`, { headers });
          if (!res.ok) return toolResult({ error: `API error: ${res.status} ${res.statusText}` });
          return toolResult(await res.json());
        }

        const res = await fetch(url, { headers });
        if (!res.ok) return toolResult({ error: `API error: ${res.status} ${res.statusText}` });
        const a = await res.json();
        return toolResult({
          id: a.id,
          display_name: a.display_name,
          orcid: a.orcid,
          works_count: a.works_count,
          cited_by_count: a.cited_by_count,
          h_index: a.summary_stats?.h_index,
          i10_index: a.summary_stats?.i10_index,
          affiliations: a.affiliations?.map(
            (af: Record<string, unknown>) =>
              (af.institution as Record<string, unknown>)?.display_name,
          ),
          top_concepts: a.x_concepts
            ?.slice(0, 5)
            .map((c: Record<string, unknown>) => c.display_name),
        });
      },
    },
  ];
}
