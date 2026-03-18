import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi, OpenClawPluginToolContext } from "openclaw/plugin-sdk";
import { toolResult, trackedFetch, isTrackedError } from "./util.js";

const BASE = "https://doaj.org/api";

export function createDoajTools(
  _ctx: OpenClawPluginToolContext,
  _api: OpenClawPluginApi,
) {
  return [
    {
      name: "search_doaj",
      label: "Search Open Access Articles (DOAJ)",
      description:
        "Search DOAJ for verified open access articles (9M+ articles from 20K+ OA journals). All results are guaranteed open access.",
      parameters: Type.Object({
        query: Type.String({
          description:
            "Search query. Supports field search: bibjson.title:, bibjson.author.name:, bibjson.keywords:, doi:, bibjson.year:. Boolean AND/OR supported.",
        }),
        max_results: Type.Optional(
          Type.Number({ description: "Max results (default 10, max 100)" }),
        ),
        page: Type.Optional(
          Type.Number({ description: "Page number (starts from 1)" }),
        ),
        sort: Type.Optional(
          Type.String({ description: "Sort field, e.g. 'created_date:desc'" }),
        ),
      }),
      execute: async (input: {
        query: string;
        max_results?: number;
        page?: number;
        sort?: string;
      }) => {
        const pageSize = Math.min(input.max_results ?? 10, 100);
        const page = input.page ?? 1;

        let url = `${BASE}/search/articles/${encodeURIComponent(input.query)}?page=${page}&pageSize=${pageSize}`;
        if (input.sort) url += `&sort=${encodeURIComponent(input.sort)}`;

        const tracked = await trackedFetch("doaj", url);
        if (isTrackedError(tracked)) return tracked;
        const data = await tracked.res.json();

        const articles = (data.results ?? []).map(
          (r: Record<string, unknown>) => {
            const bib = r.bibjson as Record<string, unknown> | undefined;
            if (!bib) return { id: r.id };

            const identifiers = bib.identifier as Array<{ type: string; id: string }> | undefined;
            const doi = identifiers?.find((i) => i.type === "doi")?.id;
            const links = bib.link as Array<{ url: string; type: string }> | undefined;
            const journal = bib.journal as Record<string, unknown> | undefined;

            return {
              title: bib.title,
              abstract: bib.abstract,
              authors: (bib.author as Array<{ name: string }> | undefined)
                ?.map((a) => a.name),
              year: bib.year,
              doi,
              journal: journal?.title,
              publisher: journal?.publisher,
              keywords: bib.keywords,
              url: links?.[0]?.url ?? (doi ? `https://doi.org/${doi}` : undefined),
              is_oa: true,
            };
          },
        );

        return toolResult({
          total_results: data.total,
          page,
          articles,
        });
      },
    },
  ];
}
