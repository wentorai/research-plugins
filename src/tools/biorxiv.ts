import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi, OpenClawPluginToolContext } from "openclaw/plugin-sdk";
import { toolResult, trackedFetch, isTrackedError, validEnum } from "./util.js";

const BASE = "https://api.biorxiv.org";

export function createBiorxivTools(
  _ctx: OpenClawPluginToolContext,
  _api: OpenClawPluginApi,
) {
  return [
    {
      name: "search_biorxiv",
      label: "Search Preprints (bioRxiv)",
      description:
        "Get recent bioRxiv preprints by date range. Covers biology preprints (300K+). Use a date range like '2026-03-01/2026-03-18'. Returns up to 100 preprints per page.",
      parameters: Type.Object({
        interval: Type.String({
          description:
            "Date range in YYYY-MM-DD/YYYY-MM-DD format (e.g. '2026-03-01/2026-03-18'). Use today's date for most recent.",
        }),
        cursor: Type.Optional(
          Type.Number({ description: "Pagination offset (default 0, each page returns up to 100)" }),
        ),
      }),
      execute: async (input: { interval: string; cursor?: number }) => {
        if (!input?.interval) {
          return toolResult({ error: 'interval parameter is required (date range in YYYY-MM-DD/YYYY-MM-DD format, e.g. "2026-03-01/2026-03-18")' });
        }
        // Validate date range format — bioRxiv API only accepts YYYY-MM-DD/YYYY-MM-DD
        if (!/^\d{4}-\d{2}-\d{2}\/\d{4}-\d{2}-\d{2}$/.test(input.interval)) {
          return toolResult({ error: `Invalid interval format "${input.interval}". Must be YYYY-MM-DD/YYYY-MM-DD (e.g. "2026-03-01/2026-03-18")` });
        }
        const cursor = input.cursor ?? 0;
        const tracked = await trackedFetch("biorxiv", `${BASE}/details/biorxiv/${input.interval}/${cursor}/json`, undefined, 30_000);
        if (isTrackedError(tracked)) return tracked;
        const data = await tracked.res.json();

        const meta = data.messages?.[0];
        const papers = (data.collection ?? []).map(
          (p: Record<string, unknown>) => ({
            doi: p.doi,
            title: p.title,
            authors: typeof p.authors === "string"
              ? (p.authors as string).split("; ").filter(Boolean)
              : [],
            abstract: p.abstract,
            date: p.date,
            category: p.category,
            version: p.version,
            license: p.license,
            url: p.doi ? `https://www.biorxiv.org/content/${p.doi}` : undefined,
            pdf_url: p.doi ? `https://www.biorxiv.org/content/${p.doi}v${p.version ?? 1}.full.pdf` : undefined,
            source: "biorxiv",
          }),
        );

        return toolResult({
          total_results: meta?.total ?? papers.length,
          cursor: meta?.cursor,
          papers,
        });
      },
    },
    {
      name: "search_medrxiv",
      label: "Search Preprints (medRxiv)",
      description:
        "Get recent medRxiv preprints by date range. Covers medical/health science preprints (100K+).",
      parameters: Type.Object({
        interval: Type.String({
          description:
            "Date range in YYYY-MM-DD/YYYY-MM-DD format (e.g. '2026-03-01/2026-03-18'). Use today's date for most recent.",
        }),
        cursor: Type.Optional(
          Type.Number({ description: "Pagination offset (default 0)" }),
        ),
      }),
      execute: async (input: { interval: string; cursor?: number }) => {
        if (!input?.interval) {
          return toolResult({ error: 'interval parameter is required (date range in YYYY-MM-DD/YYYY-MM-DD format, e.g. "2026-03-01/2026-03-18")' });
        }
        if (!/^\d{4}-\d{2}-\d{2}\/\d{4}-\d{2}-\d{2}$/.test(input.interval)) {
          return toolResult({ error: `Invalid interval format "${input.interval}". Must be YYYY-MM-DD/YYYY-MM-DD (e.g. "2026-03-01/2026-03-18")` });
        }
        const cursor = input.cursor ?? 0;
        const tracked = await trackedFetch("medrxiv", `${BASE}/details/medrxiv/${input.interval}/${cursor}/json`, undefined, 30_000);
        if (isTrackedError(tracked)) return tracked;
        const data = await tracked.res.json();

        const meta = data.messages?.[0];
        const papers = (data.collection ?? []).map(
          (p: Record<string, unknown>) => ({
            doi: p.doi,
            title: p.title,
            authors: typeof p.authors === "string"
              ? (p.authors as string).split("; ").filter(Boolean)
              : [],
            abstract: p.abstract,
            date: p.date,
            category: p.category,
            version: p.version,
            url: p.doi ? `https://www.medrxiv.org/content/${p.doi}` : undefined,
            pdf_url: p.doi ? `https://www.medrxiv.org/content/${p.doi}v${p.version ?? 1}.full.pdf` : undefined,
            source: "medrxiv",
          }),
        );

        return toolResult({
          total_results: meta?.total ?? papers.length,
          cursor: meta?.cursor,
          papers,
        });
      },
    },
    {
      name: "get_preprint_by_doi",
      label: "Get Preprint by DOI (bioRxiv/medRxiv)",
      description:
        "Get a specific bioRxiv or medRxiv preprint by its DOI.",
      parameters: Type.Object({
        doi: Type.String({ description: "DOI of the preprint (e.g. '10.1101/2024.01.15.575123')" }),
        server: Type.Optional(
          Type.String({ description: "Server: 'biorxiv' or 'medrxiv' (default: biorxiv)" }),
        ),
      }),
      execute: async (input: { doi: string; server?: string }) => {
        if (!input?.doi) {
          return toolResult({ error: 'doi parameter is required (e.g., "10.1101/2024.01.15.575123")' });
        }
        const server = validEnum(input.server, ["biorxiv", "medrxiv"] as const, "biorxiv");
        const doi = input.doi.replace(/^https?:\/\/doi\.org\//, "");
        const tracked = await trackedFetch(server, `${BASE}/details/${server}/${doi}/na/json`, undefined, 15_000);
        if (isTrackedError(tracked)) return tracked;
        const data = await tracked.res.json();
        const papers = data.collection ?? [];
        if (papers.length === 0) return toolResult({ error: "Preprint not found" });

        const p = papers[0] as Record<string, unknown>;
        return toolResult({
          doi: p.doi,
          title: p.title,
          authors: typeof p.authors === "string"
            ? (p.authors as string).split("; ").filter(Boolean)
            : [],
          abstract: p.abstract,
          date: p.date,
          category: p.category,
          version: p.version,
          license: p.license,
          url: `https://www.${server}.org/content/${p.doi}`,
          pdf_url: `https://www.${server}.org/content/${p.doi}v${p.version ?? 1}.full.pdf`,
          source: server,
        });
      },
    },
  ];
}
