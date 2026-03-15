import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi, OpenClawPluginToolContext } from "openclaw/plugin-sdk";
import { toolResult } from "./util.js";

const BASE = "https://api.semanticscholar.org/graph/v1";

export function createSemanticScholarTools(
  ctx: OpenClawPluginToolContext,
  api: OpenClawPluginApi,
) {
  const apiKey =
    ctx.config?.get?.("plugins.entries.research-plugins.semanticScholarApiKey") ?? "";

  const headers: Record<string, string> = apiKey ? { "x-api-key": apiKey } : {};

  return [
    {
      name: "get_paper",
      label: "Get Paper Details (Semantic Scholar)",
      description:
        "Get detailed information about a specific paper by its Semantic Scholar ID, DOI, or ArXiv ID.",
      parameters: Type.Object({
        paper_id: Type.String({
          description:
            "Paper identifier: Semantic Scholar ID, DOI (e.g. '10.1234/...'), or ArXiv ID (e.g. 'arXiv:2301.00001')",
        }),
      }),
      execute: async (input: { paper_id: string }) => {
        const fields =
          "title,abstract,authors,year,citationCount,referenceCount,tldr,url,venue,isOpenAccess,openAccessPdf,fieldsOfStudy,publicationDate";
        const res = await fetch(
          `${BASE}/paper/${encodeURIComponent(input.paper_id)}?fields=${fields}`,
          { headers },
        );
        if (!res.ok) return toolResult({ error: `API error: ${res.status} ${res.statusText}` });
        return toolResult(await res.json());
      },
    },
    {
      name: "get_citations",
      label: "Get Citations (Semantic Scholar)",
      description:
        "Get papers that cite a given paper. Useful for forward citation tracking.",
      parameters: Type.Object({
        paper_id: Type.String({ description: "Paper identifier (S2 ID, DOI, or ArXiv ID)" }),
        limit: Type.Optional(
          Type.Number({ description: "Max citations to return (default 20, max 100)" }),
        ),
        offset: Type.Optional(
          Type.Number({ description: "Pagination offset" }),
        ),
      }),
      execute: async (input: { paper_id: string; limit?: number; offset?: number }) => {
        const fields = "title,authors,year,citationCount,url,abstract";
        const limit = Math.min(input.limit ?? 20, 100);
        const offset = input.offset ?? 0;
        const res = await fetch(
          `${BASE}/paper/${encodeURIComponent(input.paper_id)}/citations?fields=${fields}&limit=${limit}&offset=${offset}`,
          { headers },
        );
        if (!res.ok) return toolResult({ error: `API error: ${res.status} ${res.statusText}` });
        return toolResult(await res.json());
      },
    },
  ];
}
