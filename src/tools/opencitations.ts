import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi, OpenClawPluginToolContext } from "openclaw/plugin-sdk";
import { toolResult, trackedFetch, isTrackedError } from "./util.js";

const BASE = "https://api.opencitations.net";

/**
 * Extract DOI from OpenCitations multi-identifier string.
 * Format: "omid:br/... doi:10.1038/nature12373 openalex:W..."
 */
function extractDoi(multiId: string): string | undefined {
  const match = multiId.match(/doi:(10\.\S+)/);
  return match ? match[1] : undefined;
}

export function createOpenCitationsTools(
  _ctx: OpenClawPluginToolContext,
  _api: OpenClawPluginApi,
) {
  return [
    {
      name: "get_citations_open",
      label: "Get Citations (OpenCitations)",
      description:
        "Get all papers citing a given DOI using OpenCitations (2B+ open citation links). Works across all disciplines.",
      parameters: Type.Object({
        doi: Type.String({
          description: "DOI of the paper, e.g. '10.1038/nature12373'",
        }),
      }),
      execute: async (_toolCallId: string, input: { doi: string }) => {
        if (!input?.doi) {
          return toolResult({ error: 'doi parameter is required (e.g., "10.1038/nature12373")' });
        }
        const doi = input.doi.replace(/^https?:\/\/doi\.org\//, "");
        const tracked = await trackedFetch("opencitations", `${BASE}/index/v2/citations/doi:${encodeURIComponent(doi)}`);
        if (isTrackedError(tracked)) return tracked;
        const data = await tracked.res.json();

        if (!Array.isArray(data)) return toolResult({ error: "Unexpected response format" });

        return toolResult({
          total_citations: data.length,
          citations: data.slice(0, 100).map((c: Record<string, string>) => ({
            citing_doi: extractDoi(c.citing ?? ""),
            cited_doi: extractDoi(c.cited ?? ""),
            creation_date: c.creation,
          })),
          _source_health: { source: "opencitations", latency_ms: tracked.latency_ms },
        });
      },
    },
    {
      name: "get_references_open",
      label: "Get References (OpenCitations)",
      description:
        "Get all references of a paper by DOI. Shows what a paper cites.",
      parameters: Type.Object({
        doi: Type.String({
          description: "DOI of the paper, e.g. '10.1038/nature12373'",
        }),
      }),
      execute: async (_toolCallId: string, input: { doi: string }) => {
        if (!input?.doi) {
          return toolResult({ error: 'doi parameter is required (e.g., "10.1038/nature12373")' });
        }
        const doi = input.doi.replace(/^https?:\/\/doi\.org\//, "");
        const tracked = await trackedFetch("opencitations", `${BASE}/index/v2/references/doi:${encodeURIComponent(doi)}`);
        if (isTrackedError(tracked)) return tracked;
        const data = await tracked.res.json();

        if (!Array.isArray(data)) return toolResult({ error: "Unexpected response format" });

        return toolResult({
          total_references: data.length,
          references: data.slice(0, 100).map((r: Record<string, string>) => ({
            cited_doi: extractDoi(r.cited ?? ""),
            citing_doi: extractDoi(r.citing ?? ""),
            creation_date: r.creation,
          })),
          _source_health: { source: "opencitations", latency_ms: tracked.latency_ms },
        });
      },
    },
    {
      name: "get_citation_count",
      label: "Get Citation Count (OpenCitations)",
      description:
        "Get the total citation count for a DOI from OpenCitations open data.",
      parameters: Type.Object({
        doi: Type.String({
          description: "DOI of the paper, e.g. '10.1038/nature12373'",
        }),
      }),
      execute: async (_toolCallId: string, input: { doi: string }) => {
        if (!input?.doi) {
          return toolResult({ error: 'doi parameter is required (e.g., "10.1038/nature12373")' });
        }
        const doi = input.doi.replace(/^https?:\/\/doi\.org\//, "");
        const tracked = await trackedFetch("opencitations", `${BASE}/index/v2/citation-count/doi:${encodeURIComponent(doi)}`);
        if (isTrackedError(tracked)) return tracked;
        const data = await tracked.res.json();

        const count = Array.isArray(data) && data[0]?.count
          ? parseInt(data[0].count, 10)
          : 0;

        return toolResult({ doi, citation_count: count, _source_health: { source: "opencitations", latency_ms: tracked.latency_ms } });
      },
    },
  ];
}
