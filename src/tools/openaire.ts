import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi, OpenClawPluginToolContext } from "openclaw/plugin-sdk";
import { toolResult, trackedFetch, isTrackedError, validParam } from "./util.js";

const BASE = "https://api.openaire.eu";

/**
 * Parse OpenAIRE XML response wrapped in JSON.
 * OpenAIRE returns XML by default; with format=json it wraps XML nodes in JSON objects.
 */
function parseOpenAireResult(result: Record<string, unknown>): Record<string, unknown> {
  const metadata = result.metadata as Record<string, unknown> | undefined;
  const oafEntity = metadata?.["oaf:entity"] as Record<string, unknown> | undefined;
  const oafResult = oafEntity?.["oaf:result"] as Record<string, unknown> | undefined;

  if (!oafResult) {
    // Flat JSON format (newer API versions)
    return {
      title: result.title,
      authors: result.authors,
      doi: result.doi,
      url: result.url,
    };
  }

  // Extract title
  const titleRaw = oafResult.title;
  let title = "";
  if (Array.isArray(titleRaw)) {
    const main = titleRaw.find((t: Record<string, string>) => t["@classid"] === "main title");
    title = (main ?? titleRaw[0])?.["$"] ?? "";
  } else if (typeof titleRaw === "object" && titleRaw !== null) {
    title = (titleRaw as Record<string, string>)["$"] ?? "";
  }

  // Extract authors
  const creatorsRaw = oafResult.creator;
  const authors: string[] = [];
  if (Array.isArray(creatorsRaw)) {
    for (const c of creatorsRaw) {
      const name = typeof c === "string" ? c : (c as Record<string, string>)["$"];
      if (name) authors.push(name);
    }
  } else if (creatorsRaw) {
    const name = typeof creatorsRaw === "string" ? creatorsRaw : (creatorsRaw as Record<string, string>)["$"];
    if (name) authors.push(name);
  }

  // Extract DOI and other identifiers
  const pidRaw = oafResult.pid;
  let doi: string | undefined;
  if (Array.isArray(pidRaw)) {
    const doiPid = pidRaw.find((p: Record<string, string>) => p["@classid"] === "doi");
    doi = (doiPid as Record<string, string> | undefined)?.["$"];
  } else if (typeof pidRaw === "object" && pidRaw !== null) {
    if ((pidRaw as Record<string, string>)["@classid"] === "doi") {
      doi = (pidRaw as Record<string, string>)["$"];
    }
  }

  // Extract dates
  const dateRaw = oafResult.dateofacceptance;
  const date = typeof dateRaw === "string" ? dateRaw : (dateRaw as Record<string, string> | undefined)?.["$"];

  // Extract best access right
  const accessRaw = oafResult.bestaccessright;
  const isOa = typeof accessRaw === "object" && accessRaw !== null
    ? (accessRaw as Record<string, string>)["@classid"] === "OPEN"
    : false;

  return {
    title,
    authors,
    doi,
    date,
    is_oa: isOa,
    url: doi ? `https://doi.org/${doi}` : undefined,
  };
}

export function createOpenAireTools(
  _ctx: OpenClawPluginToolContext,
  _api: OpenClawPluginApi,
) {
  return [
    {
      name: "search_openaire",
      label: "Search Publications (OpenAIRE)",
      description:
        "Search OpenAIRE for publications (170M+ records). Uniquely supports filtering by EU funding source (EC, NSF, etc.) and project ID.",
      parameters: Type.Object({
        keywords: Type.String({
          description: "Search keywords",
        }),
        author: Type.Optional(Type.String({ description: "Author name" })),
        doi: Type.Optional(Type.String({ description: "DOI" })),
        from_date: Type.Optional(
          Type.String({ description: "From date (YYYY-MM-DD)" }),
        ),
        to_date: Type.Optional(
          Type.String({ description: "To date (YYYY-MM-DD)" }),
        ),
        oa_only: Type.Optional(
          Type.Boolean({ description: "Only open access results" }),
        ),
        funder: Type.Optional(
          Type.String({
            description: "Funder abbreviation: 'EC' (EU), 'NSF', 'NIH', 'UKRI', 'DFG', etc.",
          }),
        ),
        max_results: Type.Optional(
          Type.Number({ description: "Max results (default 10, max 50)" }),
        ),
      }),
      execute: async (_toolCallId: string, input: {
        keywords: string;
        author?: string;
        doi?: string;
        from_date?: string;
        to_date?: string;
        oa_only?: boolean;
        funder?: string;
        max_results?: number;
      }) => {
        const keywords = validParam(input?.keywords);
        if (!keywords) {
          return toolResult({
            error:
              "keywords parameter is required and must not be empty. " +
              "Example: search_openaire({ keywords: \"machine learning\" })",
          });
        }
        const params = new URLSearchParams({
          keywords,
          format: "json",
          size: String(Math.min(input.max_results ?? 10, 50)),
        });
        const author = validParam(input.author);
        if (author) params.set("author", author);
        const doi = validParam(input.doi);
        if (doi) params.set("doi", doi);
        const fromDate = validParam(input.from_date);
        if (fromDate) params.set("fromDateAccepted", fromDate);
        const toDate = validParam(input.to_date);
        if (toDate) params.set("toDateAccepted", toDate);
        if (input.oa_only) params.set("OA", "true");
        const funder = validParam(input.funder);
        if (funder) params.set("funder", funder);

        const tracked = await trackedFetch("openaire", `${BASE}/search/publications?${params}`, undefined, 15_000);
        if (isTrackedError(tracked)) return tracked;
        const data = await tracked.res.json();

        const response = data.response as Record<string, unknown> | undefined;
        const header = response?.header as Record<string, unknown> | undefined;
        const total = header?.total as Record<string, string> | undefined;
        const results = response?.results as Record<string, unknown> | undefined;
        const resultList = results?.result;

        const papers = (Array.isArray(resultList) ? resultList : []).map(
          (r: Record<string, unknown>) => parseOpenAireResult(r),
        );

        return toolResult({
          total_results: total?.["$"] ? parseInt(total["$"], 10) : papers.length,
          papers,
        });
      },
    },
  ];
}
