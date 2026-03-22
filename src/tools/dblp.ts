import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi, OpenClawPluginToolContext } from "openclaw/plugin-sdk";
import { toolResult, trackedFetch, isTrackedError, validParam } from "./util.js";

export function createDblpTools(
  _ctx: OpenClawPluginToolContext,
  _api: OpenClawPluginApi,
) {
  return [
    {
      name: "search_dblp",
      label: "Search CS Papers (dblp)",
      description:
        "Search dblp computer science bibliography (7M+ records). Covers conferences (NeurIPS, ICML, ACL, etc.) and journals. Best for CS venue-specific search.",
      parameters: Type.Object({
        query: Type.String({
          description: "Search query for publications",
        }),
        max_results: Type.Optional(
          Type.Number({ description: "Max results (default 10, max 1000)" }),
        ),
        offset: Type.Optional(
          Type.Number({ description: "Result offset for pagination" }),
        ),
      }),
      execute: async (input: {
        query: string;
        max_results?: number;
        offset?: number;
      }) => {
        const query = validParam(input?.query);
        if (!query) {
          return toolResult({
            error: "query parameter is required and must not be empty.",
          });
        }

        const params = new URLSearchParams({
          q: query,
          format: "json",
          h: String(Math.min(input.max_results ?? 10, 1000)),
        });
        if (input.offset) params.set("f", String(input.offset));

        const tracked = await trackedFetch("dblp", `https://dblp.org/search/publ/api?${params}`);
        if (isTrackedError(tracked)) return tracked;
        const data = await tracked.res.json();

        const hits = data.result?.hits;
        if (!hits) return toolResult({ total_results: 0, papers: [] });

        const papers = (hits.hit ?? []).map(
          (h: Record<string, unknown>) => {
            const info = h.info as Record<string, unknown>;
            if (!info) return {};

            const authorsRaw = info.authors as Record<string, unknown> | undefined;
            let authors: string[] = [];
            if (authorsRaw?.author) {
              const authorList = authorsRaw.author;
              if (Array.isArray(authorList)) {
                authors = authorList.map((a: Record<string, string> | string) =>
                  typeof a === "string" ? a : a.text ?? "",
                );
              } else if (typeof authorList === "object") {
                authors = [(authorList as Record<string, string>).text ?? ""];
              }
            }

            return {
              title: info.title,
              authors,
              venue: info.venue,
              year: info.year ? parseInt(info.year as string, 10) : undefined,
              type: info.type,
              doi: info.doi,
              url: info.ee ?? info.url,
              dblp_url: info.url,
            };
          },
        );

        return toolResult({
          total_results: parseInt(hits["@total"] ?? "0", 10),
          papers,
        });
      },
    },
    {
      name: "search_dblp_author",
      label: "Search Authors (dblp)",
      description:
        "Search dblp for computer science authors and their publication profiles.",
      parameters: Type.Object({
        query: Type.String({ description: "Author name to search" }),
        max_results: Type.Optional(
          Type.Number({ description: "Max results (default 10)" }),
        ),
      }),
      execute: async (input: { query: string; max_results?: number }) => {
        const query = validParam(input?.query);
        if (!query) {
          return toolResult({
            error: "query parameter is required and must not be empty.",
          });
        }

        const params = new URLSearchParams({
          q: query,
          format: "json",
          h: String(Math.min(input.max_results ?? 10, 100)),
        });

        const tracked = await trackedFetch("dblp", `https://dblp.org/search/author/api?${params}`);
        if (isTrackedError(tracked)) return tracked;
        const data = await tracked.res.json();

        const hits = data.result?.hits;
        if (!hits) return toolResult({ total_results: 0, authors: [] });

        const authors = (hits.hit ?? []).map(
          (h: Record<string, unknown>) => {
            const info = h.info as Record<string, unknown>;
            return {
              name: info?.author,
              url: info?.url,
              notes: info?.notes,
            };
          },
        );

        return toolResult({
          total_results: parseInt(hits["@total"] ?? "0", 10),
          authors,
        });
      },
    },
  ];
}
