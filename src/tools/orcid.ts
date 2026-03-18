import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi, OpenClawPluginToolContext } from "openclaw/plugin-sdk";
import { toolResult, trackedFetch, isTrackedError } from "./util.js";

const BASE = "https://pub.orcid.org/v3.0";

const HEADERS: Record<string, string> = {
  Accept: "application/json",
};

export function createOrcidTools(
  _ctx: OpenClawPluginToolContext,
  _api: OpenClawPluginApi,
) {
  return [
    {
      name: "search_orcid",
      label: "Search Researchers (ORCID)",
      description:
        "Search the ORCID registry for researchers by name, affiliation, or keyword. Returns ORCID iDs that can be used with get_orcid_works.",
      parameters: Type.Object({
        query: Type.String({
          description:
            "Lucene-style query. Supports fields: family-name, given-names, affiliation-org-name, keyword, orcid, ringgold-org-id. E.g. 'family-name:Smith AND affiliation-org-name:MIT'",
        }),
        limit: Type.Optional(
          Type.Number({ description: "Max results (default 10, max 100)" }),
        ),
      }),
      execute: async (input: { query: string; limit?: number }) => {
        const params = new URLSearchParams({
          q: input.query,
          rows: String(Math.min(input.limit ?? 10, 100)),
        });

        const result = await trackedFetch(
          "orcid",
          `${BASE}/search/?${params}`,
          { headers: HEADERS },
          10_000,
        );
        if (isTrackedError(result)) return result;
        const data = await result.res.json();

        const researchers = (data.result ?? []).map(
          (r: Record<string, unknown>) => {
            const oi = r["orcid-identifier"] as Record<string, string> | undefined;
            return {
              orcid: oi?.path,
              uri: oi?.uri,
              source: "orcid",
            };
          },
        );

        return toolResult({
          total_results: data["num-found"],
          source: "orcid",
          researchers,
          _latency_ms: result.latency_ms,
        });
      },
    },
    {
      name: "get_orcid_works",
      label: "Get Works by ORCID (ORCID)",
      description:
        "Get the publication list for a researcher by their ORCID iD. Returns titles, DOIs, publication years, and work types.",
      parameters: Type.Object({
        orcid: Type.String({
          description: "ORCID iD, e.g. '0000-0002-1825-0097'",
        }),
      }),
      execute: async (input: { orcid: string }) => {
        const orcid = input.orcid.replace(/^https?:\/\/orcid\.org\//, "");

        const result = await trackedFetch(
          "orcid",
          `${BASE}/${encodeURIComponent(orcid)}/works`,
          { headers: HEADERS },
          10_000,
        );
        if (isTrackedError(result)) return result;
        const data = await result.res.json();

        const groups = data.group as Array<Record<string, unknown>> | undefined;

        const works = (groups ?? []).map((g) => {
          const summaries = g["work-summary"] as Array<Record<string, unknown>> | undefined;
          const first = summaries?.[0];
          if (!first) return null;

          // Extract title
          const titleObj = first.title as Record<string, unknown> | undefined;
          const title = (titleObj?.title as Record<string, string> | undefined)?.value;

          // Extract publication date
          const pubDate = first["publication-date"] as Record<string, unknown> | undefined;
          const year = (pubDate?.year as Record<string, string> | undefined)?.value;
          const month = (pubDate?.month as Record<string, string> | undefined)?.value;

          // Extract DOI from external-ids
          const extIds = first["external-ids"] as Record<string, unknown> | undefined;
          const extIdList = extIds?.["external-id"] as Array<Record<string, unknown>> | undefined;
          const doiEntry = extIdList?.find(
            (e) => e["external-id-type"] === "doi" && e["external-id-relationship"] === "self",
          );
          const doi = doiEntry?.["external-id-value"] as string | undefined;

          // Extract journal title
          const journalTitle = first["journal-title"] as Record<string, string> | undefined;

          return {
            title,
            doi,
            year,
            month,
            type: first.type,
            journal: journalTitle?.value,
            url: doi ? `https://doi.org/${doi}` : undefined,
            authors: undefined as string[] | undefined, // ORCID works endpoint does not include author lists
            source: "orcid",
          };
        }).filter(Boolean);

        return toolResult({
          orcid,
          total_works: works.length,
          source: "orcid",
          works,
          _latency_ms: result.latency_ms,
        });
      },
    },
  ];
}
