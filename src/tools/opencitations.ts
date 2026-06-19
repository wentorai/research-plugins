import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi, OpenClawPluginToolContext } from "openclaw/plugin-sdk";
import { toolResult, trackedFetch, isTrackedError } from "./util.js";

const BASE = "https://api.opencitations.net";

// OpenCitations is slow for highly-cited papers (its API can take >60s for
// papers with tens of thousands of citations). 30s covers the vast majority;
// the default 10s used to time out on common famous papers.
const TIMEOUT_MS = 30_000;

/**
 * Extract DOI from OpenCitations multi-identifier string.
 * Format: "omid:br/... doi:10.1038/nature12373 openalex:W..."
 */
function extractDoi(multiId: string): string | undefined {
  const match = multiId.match(/doi:(10\.\S+)/);
  return match ? match[1] : undefined;
}

/**
 * On a timeout error, attach an actionable hint pointing at a faster path,
 * so the model isn't left with an opaque "source slow" message. Non-timeout
 * errors pass through unchanged.
 */
function withTimeoutHint(
  tracked: ReturnType<typeof toolResult>,
  hint: string,
): ReturnType<typeof toolResult> {
  const d = tracked.details as Record<string, unknown> | undefined;
  if (d && typeof d.error === "string" && /timeout/i.test(d.error)) {
    return toolResult({ ...d, hint });
  }
  return tracked;
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
        const tracked = await trackedFetch("opencitations", `${BASE}/index/v2/citations/doi:${encodeURIComponent(doi)}`, undefined, TIMEOUT_MS);
        if (isTrackedError(tracked)) {
          return withTimeoutHint(tracked, "OpenCitations is slow for highly-cited papers. For citing papers, get_epmc_citations (Europe PMC) is faster; for a quick citation count use get_work or search_openalex (OpenAlex cited_by_count).");
        }
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
        const tracked = await trackedFetch("opencitations", `${BASE}/index/v2/references/doi:${encodeURIComponent(doi)}`, undefined, TIMEOUT_MS);
        if (isTrackedError(tracked)) {
          return withTimeoutHint(tracked, "OpenCitations is slow for papers with many references. get_epmc_references (Europe PMC) or get_work (OpenAlex referenced_works) is faster.");
        }
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
        const tracked = await trackedFetch("opencitations", `${BASE}/index/v2/citation-count/doi:${encodeURIComponent(doi)}`, undefined, TIMEOUT_MS);
        if (isTrackedError(tracked)) {
          return withTimeoutHint(tracked, "OpenCitations is slow for highly-cited papers. For an instant citation count use get_work or search_openalex (OpenAlex cited_by_count).");
        }
        const data = await tracked.res.json();

        const count = Array.isArray(data) && data[0]?.count
          ? parseInt(data[0].count, 10)
          : 0;

        return toolResult({ doi, citation_count: count, _source_health: { source: "opencitations", latency_ms: tracked.latency_ms } });
      },
    },
  ];
}
