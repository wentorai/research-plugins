import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi, OpenClawPluginToolContext } from "openclaw/plugin-sdk";
import { toolResult, trackedFetch, isTrackedError, validEnum, validParam } from "./util.js";

const BASE = "https://export.arxiv.org/api/query";

/**
 * Parse arXiv Atom XML response into structured paper objects.
 *
 * Uses regex-based extraction (arXiv returns Atom 1.0 XML).
 * Handles edge cases: namespace prefixes, missing fields, HTML error pages.
 */
function parseArxivXml(xml: string): Record<string, unknown>[] {
  // Guard: if arXiv returned an error page (HTML) or empty response
  if (!xml || !xml.includes("<entry>")) return [];

  const entries: Record<string, unknown>[] = [];

  // Use regex to extract <entry>...</entry> blocks robustly
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let entryMatch: RegExpExecArray | null;

  while ((entryMatch = entryRegex.exec(xml)) !== null) {
    const block = entryMatch[1];

    const getText = (tag: string): string => {
      // Match tags with or without namespace prefixes and attributes
      const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
      return m ? m[1].trim() : "";
    };

    const getAll = (tag: string): string[] => {
      const results: string[] = [];
      const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "g");
      let m: RegExpExecArray | null;
      while ((m = re.exec(block)) !== null) results.push(m[1].trim());
      return results;
    };

    const getAttr = (tag: string, attr: string): string[] => {
      const results: string[] = [];
      const re = new RegExp(`<${tag}[^>]*?${attr}="([^"]*)"[^>]*/?>`, "g");
      let m: RegExpExecArray | null;
      while ((m = re.exec(block)) !== null) {
        if (m[1]) results.push(m[1]);
      }
      return results;
    };

    const rawId = getText("id");
    if (!rawId) continue; // skip malformed entries

    const arxivId = rawId
      .replace(/https?:\/\/arxiv\.org\/abs\//, "")
      .replace(/v\d+$/, "");

    const title = getText("title").replace(/\s+/g, " ");
    if (!title) continue; // skip entries without title

    entries.push({
      arxiv_id: arxivId,
      title,
      summary: getText("summary").replace(/\s+/g, " "),
      authors: getAll("name"),
      published: getText("published"),
      updated: getText("updated"),
      categories: getAttr("category", "term"),
      pdf_url: `https://arxiv.org/pdf/${arxivId}`,
      abs_url: `https://arxiv.org/abs/${arxivId}`,
      doi: getText("arxiv:doi") || undefined,
      comment: getText("arxiv:comment") || undefined,
    });
  }

  return entries;
}

export function createArxivTools(
  _ctx: OpenClawPluginToolContext,
  _api: OpenClawPluginApi,
) {
  return [
    {
      name: "search_arxiv",
      label: "Search Papers (arXiv)",
      description:
        "Search arXiv preprint repository. Covers physics, math, CS, biology, quantitative finance, statistics, and more. All results are open access.",
      parameters: Type.Object({
        query: Type.String({
          description:
            "Search query. Supports field prefixes: ti: (title), au: (author), abs: (abstract), cat: (category). E.g. 'ti:transformer AND cat:cs.CL'",
        }),
        max_results: Type.Optional(
          Type.Number({ description: "Max results (default 10, max 50)" }),
        ),
        sort_by: Type.Optional(
          Type.String({
            description:
              "Sort by: 'relevance', 'lastUpdatedDate', 'submittedDate'",
          }),
        ),
        sort_order: Type.Optional(
          Type.String({ description: "Sort order: 'ascending' or 'descending'" }),
        ),
      }),
      execute: async (_toolCallId: string, input: {
        query: string;
        max_results?: number;
        sort_by?: string;
        sort_order?: string;
      }) => {
        const query = validParam(input?.query);
        if (!query) {
          return toolResult({
            error:
              "query parameter is required and must not be empty. " +
              "Use the tool parameter 'query' (not 'search_query'). " +
              "Example: search_arxiv({ query: \"ti:transformer AND cat:cs.CL\" })",
          });
        }

        const SORT_BY = ["relevance", "lastUpdatedDate", "submittedDate"] as const;
        const SORT_ORDER = ["ascending", "descending"] as const;

        const params = new URLSearchParams({
          search_query: query,
          max_results: String(Math.min(input.max_results ?? 10, 50)),
          sortBy: validEnum(input.sort_by, SORT_BY, "relevance"),
          sortOrder: validEnum(input.sort_order, SORT_ORDER, "descending"),
        });

        const tracked = await trackedFetch("arxiv", `${BASE}?${params}`, undefined, 15_000);
        if (isTrackedError(tracked)) return tracked;
        const xml = await tracked.res.text();

        // Check if response is actually XML (not HTML error page)
        if (!xml.includes("<feed")) {
          return toolResult({
            error: "arXiv returned non-XML response (possibly rate-limited or error page)",
            _source_health: { source: "arxiv", latency_ms: tracked.latency_ms },
          });
        }

        const totalMatch = xml.match(
          /<opensearch:totalResults[^>]*>(\d+)<\/opensearch:totalResults>/,
        );
        const total = totalMatch ? parseInt(totalMatch[1], 10) : 0;

        return toolResult({
          total_results: total,
          papers: parseArxivXml(xml),
          _source_health: { source: "arxiv", latency_ms: tracked.latency_ms },
        });
      },
    },
    {
      name: "get_arxiv_paper",
      label: "Get Paper Details (arXiv)",
      description:
        "Get detailed information about a specific arXiv paper by its ID.",
      parameters: Type.Object({
        arxiv_id: Type.String({
          description: "arXiv paper ID, e.g. '2301.00001' or '2301.00001v2'",
        }),
      }),
      execute: async (_toolCallId: string, input: { arxiv_id: string }) => {
        if (!input?.arxiv_id) {
          return toolResult({ error: 'arxiv_id parameter is required (e.g., "2301.00001" or "2301.00001v2")' });
        }
        const id = input.arxiv_id.replace("arXiv:", "").replace(/https?:\/\/arxiv\.org\/abs\//, "");
        const params = new URLSearchParams({ id_list: id });

        const tracked = await trackedFetch("arxiv", `${BASE}?${params}`, undefined, 15_000);
        if (isTrackedError(tracked)) return tracked;
        const xml = await tracked.res.text();

        if (!xml.includes("<feed")) {
          return toolResult({
            error: "arXiv returned non-XML response",
            _source_health: { source: "arxiv", latency_ms: tracked.latency_ms },
          });
        }

        const papers = parseArxivXml(xml);
        if (papers.length === 0) {
          return toolResult({
            error: `Paper not found: ${id}`,
            _source_health: { source: "arxiv", latency_ms: tracked.latency_ms },
          });
        }
        return toolResult({
          ...papers[0],
          _source_health: { source: "arxiv", latency_ms: tracked.latency_ms },
        });
      },
    },
  ];
}
