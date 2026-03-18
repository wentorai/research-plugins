import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi, OpenClawPluginToolContext } from "openclaw/plugin-sdk";
import { toolResult, trackedFetch, isTrackedError } from "./util.js";

const BASE = "https://api.archives-ouvertes.fr";

/** Default fields to request from HAL Solr API */
const DEFAULT_FIELDS = [
  "title_s",
  "authFullName_s",
  "doiId_s",
  "producedDate_s",
  "uri_s",
  "abstract_s",
  "journalTitle_s",
  "keyword_s",
  "docType_s",
  "halId_s",
].join(",");

export function createHalTools(
  _ctx: OpenClawPluginToolContext,
  _api: OpenClawPluginApi,
) {
  return [
    {
      name: "search_hal",
      label: "Search Publications (HAL)",
      description:
        "Search HAL (Hyper Articles en Ligne), the French open archive for scholarly publications. Covers 4M+ documents with strong coverage of French and European research across all disciplines.",
      parameters: Type.Object({
        query: Type.String({
          description:
            "Search query. Supports Solr syntax: field:value, AND/OR/NOT, quoted phrases.",
        }),
        rows: Type.Optional(
          Type.Number({ description: "Max results (default 10, max 100)" }),
        ),
        sort: Type.Optional(
          Type.String({
            description:
              "Sort: 'producedDate_s desc' (newest), 'producedDate_s asc' (oldest). Default: relevance.",
          }),
        ),
        doc_type: Type.Optional(
          Type.String({
            description:
              "Document type filter: 'ART' (journal article), 'COMM' (conference paper), 'THESE' (thesis), 'COUV' (book chapter), 'OUV' (book), 'REPORT', 'HDR', 'POSTER'",
          }),
        ),
      }),
      execute: async (input: {
        query: string;
        rows?: number;
        sort?: string;
        doc_type?: string;
      }) => {
        let q = input.query;
        if (input.doc_type) {
          q = `(${q}) AND docType_s:${input.doc_type}`;
        }

        const params = new URLSearchParams({
          q,
          fl: DEFAULT_FIELDS,
          rows: String(Math.min(input.rows ?? 10, 100)),
          wt: "json",
        });
        if (input.sort) params.set("sort", input.sort);

        const result = await trackedFetch(
          "hal",
          `${BASE}/search/?${params}`,
          undefined,
          10_000,
        );
        if (isTrackedError(result)) return result;
        const data = await result.res.json();

        const response = data.response as Record<string, unknown> | undefined;
        const docs = response?.docs as Array<Record<string, unknown>> | undefined;

        return toolResult({
          total_results: response?.numFound,
          source: "hal",
          papers: (docs ?? []).map((doc) => {
            // HAL returns title_s and authFullName_s as arrays
            const titles = doc.title_s as string[] | undefined;
            const authors = doc.authFullName_s as string[] | undefined;
            const keywords = doc.keyword_s as string[] | undefined;
            const abstracts = doc.abstract_s as string[] | undefined;
            const doi = doc.doiId_s as string | undefined;

            return {
              title: titles?.[0],
              authors,
              doi,
              year: doc.producedDate_s
                ? String(doc.producedDate_s).slice(0, 4)
                : undefined,
              publication_date: doc.producedDate_s,
              journal: doc.journalTitle_s,
              doc_type: doc.docType_s,
              keywords,
              abstract: abstracts?.[0]
                ? String(abstracts[0]).slice(0, 500)
                : undefined,
              url: (doc.uri_s as string) ?? (doi ? `https://doi.org/${doi}` : undefined),
              hal_id: doc.halId_s,
              source: "hal",
            };
          }),
          _latency_ms: result.latency_ms,
        });
      },
    },
  ];
}
