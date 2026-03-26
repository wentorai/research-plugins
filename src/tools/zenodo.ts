import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi, OpenClawPluginToolContext } from "openclaw/plugin-sdk";
import { toolResult, trackedFetch, isTrackedError, validParam } from "./util.js";

const BASE = "https://zenodo.org/api";

export function createZenodoTools(
  _ctx: OpenClawPluginToolContext,
  _api: OpenClawPluginApi,
) {
  return [
    {
      name: "search_zenodo",
      label: "Search Records (Zenodo)",
      description:
        "Search Zenodo for open research data, software, publications, and other research outputs. Covers 3M+ records with DOIs. Uniquely includes datasets, software, presentations, and other non-publication outputs.",
      parameters: Type.Object({
        query: Type.String({ description: "Search query" }),
        type: Type.Optional(
          Type.String({
            description:
              "Resource type filter: 'publication', 'dataset', 'software', 'image', 'video', 'lesson', 'poster', 'presentation'",
          }),
        ),
        size: Type.Optional(
          Type.Number({ description: "Max results (default 10, max 100)" }),
        ),
        sort: Type.Optional(
          Type.String({
            description:
              "Sort by: 'bestmatch' (relevance), 'mostrecent', '-mostrecent' (oldest first)",
          }),
        ),
        access_right: Type.Optional(
          Type.String({
            description: "Access filter: 'open', 'embargoed', 'restricted', 'closed'",
          }),
        ),
      }),
      execute: async (_toolCallId: string, input: {
        query: string;
        type?: string;
        size?: number;
        sort?: string;
        access_right?: string;
      }) => {
        const query = validParam(input?.query);
        if (!query) {
          return toolResult({
            error:
              "query parameter is required and must not be empty. " +
              "Example: search_zenodo({ query: \"climate dataset\" })",
          });
        }
        const params = new URLSearchParams({
          q: query,
          size: String(Math.min(input.size ?? 10, 100)),
        });
        const type = validParam(input.type);
        if (type) params.set("type", type);
        const sort = validParam(input.sort);
        if (sort) params.set("sort", sort);
        const accessRight = validParam(input.access_right);
        if (accessRight) params.set("access_right", accessRight);

        const result = await trackedFetch("zenodo", `${BASE}/records?${params}`, undefined, 10_000);
        if (isTrackedError(result)) return result;
        const data = await result.res.json();

        return toolResult({
          total_results: data.hits?.total,
          source: "zenodo",
          records: data.hits?.hits?.map(
            (h: Record<string, unknown>) => {
              const meta = h.metadata as Record<string, unknown> | undefined;
              const creators = meta?.creators as Array<{ name: string; affiliation?: string }> | undefined;
              const resourceType = meta?.resource_type as Record<string, string> | undefined;
              const license = meta?.license as Record<string, string> | undefined;

              return {
                id: h.id,
                doi: meta?.doi ?? h.doi,
                title: meta?.title ?? h.title,
                authors: creators?.map((c) => c.name),
                year: meta?.publication_date
                  ? String(meta.publication_date).slice(0, 4)
                  : undefined,
                publication_date: meta?.publication_date,
                resource_type: resourceType?.type,
                access_right: meta?.access_right,
                keywords: meta?.keywords,
                license: license?.id,
                description: meta?.description
                  ? String(meta.description).replace(/<[^>]*>/g, "").slice(0, 300)
                  : undefined,
                url: (h.links as Record<string, string>)?.self_html
                  ?? `https://zenodo.org/records/${h.id}`,
                source: "zenodo",
              };
            },
          ),
          _latency_ms: result.latency_ms,
        });
      },
    },
    {
      name: "get_zenodo_record",
      label: "Get Record Details (Zenodo)",
      description:
        "Get full details of a specific Zenodo record by its numeric ID. Returns metadata, files, and download links.",
      parameters: Type.Object({
        record_id: Type.String({
          description: "Zenodo record ID (numeric), e.g. '7042164'",
        }),
      }),
      execute: async (_toolCallId: string, input: { record_id: string }) => {
        if (!input?.record_id) {
          return toolResult({ error: 'record_id parameter is required (e.g., "1234567")' });
        }
        const id = input.record_id.replace(/\D/g, "");
        const result = await trackedFetch("zenodo", `${BASE}/records/${id}`, undefined, 10_000);
        if (isTrackedError(result)) return result;
        const h = await result.res.json();

        const meta = h.metadata as Record<string, unknown> | undefined;
        const creators = meta?.creators as Array<{ name: string; affiliation?: string }> | undefined;
        const resourceType = meta?.resource_type as Record<string, string> | undefined;
        const license = meta?.license as Record<string, string> | undefined;
        const files = h.files as Array<{ key: string; size: number; links?: Record<string, string> }> | undefined;
        const stats = h.stats as Record<string, number> | undefined;

        return toolResult({
          id: h.id,
          doi: meta?.doi ?? h.doi,
          title: meta?.title ?? h.title,
          authors: creators?.map((c) => c.name),
          year: meta?.publication_date
            ? String(meta.publication_date).slice(0, 4)
            : undefined,
          publication_date: meta?.publication_date,
          description: meta?.description
            ? String(meta.description).replace(/<[^>]*>/g, "")
            : undefined,
          resource_type: resourceType?.type,
          access_right: meta?.access_right,
          keywords: meta?.keywords,
          license: license?.id,
          version: meta?.version,
          files: files?.map((f) => ({
            filename: f.key,
            size_bytes: f.size,
            download_url: f.links?.self,
          })),
          stats: stats
            ? {
                downloads: stats.downloads,
                views: stats.views,
              }
            : undefined,
          url: (h.links as Record<string, string>)?.self_html
            ?? `https://zenodo.org/records/${h.id}`,
          source: "zenodo",
          _latency_ms: result.latency_ms,
        });
      },
    },
  ];
}
