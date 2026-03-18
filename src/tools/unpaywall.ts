import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi, OpenClawPluginToolContext } from "openclaw/plugin-sdk";
import { toolResult, trackedFetch, isTrackedError } from "./util.js";

const BASE = "https://api.unpaywall.org/v2";

export function createUnpaywallTools(
  _ctx: OpenClawPluginToolContext,
  _api: OpenClawPluginApi,
) {
  const email = "research-plugins@wentor.ai";

  return [
    {
      name: "find_oa_version",
      label: "Find Open Access Version (Unpaywall)",
      description:
        "Find open access versions of a paper by DOI using Unpaywall. Returns free PDF links from repositories, preprint servers, and publisher OA pages.",
      parameters: Type.Object({
        doi: Type.String({
          description: "DOI of the paper, e.g. '10.1038/nature12373'",
        }),
      }),
      execute: async (input: { doi: string }) => {
        const doi = input.doi.replace(/^https?:\/\/doi\.org\//, "");
        const tracked = await trackedFetch(
          "unpaywall",
          `${BASE}/${encodeURIComponent(doi)}?email=${email}`,
        );
        if (isTrackedError(tracked)) {
          // Special handling for 404 (DOI not found)
          if (tracked.details && typeof tracked.details === "object" && "error" in (tracked.details as Record<string, unknown>)) {
            const errMsg = String((tracked.details as Record<string, string>).error);
            if (errMsg.includes("404")) return toolResult({ error: "DOI not found in Unpaywall" });
          }
          return tracked;
        }
        const data = await tracked.res.json();

        const oaLocations = (
          data.oa_locations as Record<string, unknown>[] | undefined
        )?.map((loc) => ({
          url: loc.url,
          url_for_pdf: loc.url_for_pdf,
          host_type: loc.host_type,
          license: loc.license,
          version: loc.version,
        }));

        return toolResult({
          doi: data.doi,
          title: data.title,
          is_oa: data.is_oa,
          oa_status: data.oa_status,
          best_oa_url: data.best_oa_location?.url,
          best_oa_pdf: data.best_oa_location?.url_for_pdf,
          journal: data.journal_name,
          publisher: data.publisher,
          published_date: data.published_date,
          oa_locations: oaLocations,
          _source_health: { source: "unpaywall", latency_ms: tracked.latency_ms },
        });
      },
    },
  ];
}
