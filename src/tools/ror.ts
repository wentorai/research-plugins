import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi, OpenClawPluginToolContext } from "openclaw/plugin-sdk";
import { toolResult, trackedFetch, isTrackedError, validParam } from "./util.js";

const BASE = "https://api.ror.org/v2";

export function createRorTools(
  _ctx: OpenClawPluginToolContext,
  _api: OpenClawPluginApi,
) {
  return [
    {
      name: "search_ror",
      label: "Search Research Organizations (ROR)",
      description:
        "Search the Research Organization Registry (ROR) for institutions, universities, labs, and funders. Returns canonical identifiers, locations, types, and links. Useful for affiliation disambiguation and finding institution metadata.",
      parameters: Type.Object({
        query: Type.String({
          description: "Organization name or acronym to search, e.g. 'MIT', 'Max Planck', 'CNRS'",
        }),
        max_results: Type.Optional(
          Type.Number({ description: "Max results (default 10, max 50)" }),
        ),
      }),
      execute: async (_toolCallId: string, input: { query: string; max_results?: number }) => {
        const query = validParam(input?.query);
        if (!query) {
          return toolResult({
            error: "query parameter is required and must not be empty.",
          });
        }

        const params = new URLSearchParams({
          query,
        });

        const tracked = await trackedFetch("ror", `${BASE}/organizations?${params}`, undefined, 10_000);
        if (isTrackedError(tracked)) return tracked;
        const data = await tracked.res.json();

        const maxResults = Math.min(input.max_results ?? 10, 50);
        const items = (data.items ?? []).slice(0, maxResults).map(
          (org: Record<string, unknown>) => {
            const names = org.names as Array<{
              value: string;
              types: string[];
              lang: string | null;
            }> | undefined;
            const locations = org.locations as Array<{
              geonames_details: {
                name: string;
                country_name: string;
                country_code: string;
                country_subdivision_name?: string;
                lat: number;
                lng: number;
              };
            }> | undefined;
            const links = org.links as Array<{
              type: string;
              value: string;
            }> | undefined;
            const externalIds = org.external_ids as Array<{
              type: string;
              all: string[];
              preferred: string | null;
            }> | undefined;

            // Extract the display name (ror_display type preferred, then first label)
            const displayName = names?.find(
              (n) => n.types.includes("ror_display"),
            )?.value;
            const acronym = names?.find(
              (n) => n.types.includes("acronym"),
            )?.value;
            const aliases = names
              ?.filter((n) => n.types.includes("alias"))
              .map((n) => n.value);
            const labels = names
              ?.filter((n) => n.types.includes("label") && !n.types.includes("ror_display"))
              .map((n) => ({ name: n.value, lang: n.lang }));

            const location = locations?.[0]?.geonames_details;
            const website = links?.find((l) => l.type === "website")?.value;
            const wikipedia = links?.find((l) => l.type === "wikipedia")?.value;

            // Extract GRID and other IDs
            const gridId = externalIds?.find((e) => e.type === "grid")?.preferred;
            const wikidataId = externalIds?.find((e) => e.type === "wikidata")?.preferred;

            return {
              ror_id: org.id,
              name: displayName ?? names?.[0]?.value,
              acronym,
              aliases: aliases?.length ? aliases : undefined,
              labels: labels?.length ? labels : undefined,
              types: org.types,
              status: org.status,
              established: org.established,
              location: location
                ? {
                    city: location.name,
                    country: location.country_name,
                    country_code: location.country_code,
                    region: location.country_subdivision_name,
                  }
                : undefined,
              website,
              wikipedia,
              domains: org.domains,
              grid_id: gridId,
              wikidata_id: wikidataId,
            };
          },
        );

        return toolResult({
          total_results: data.number_of_results,
          organizations: items,
          _source_health: { source: "ror", latency_ms: tracked.latency_ms },
        });
      },
    },
  ];
}
