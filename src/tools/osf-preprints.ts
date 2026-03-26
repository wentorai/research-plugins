import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi, OpenClawPluginToolContext } from "openclaw/plugin-sdk";
import { toolResult, trackedFetch, isTrackedError, validParam } from "./util.js";

const BASE = "https://api.osf.io/v2";

export function createOsfPreprintsTools(
  _ctx: OpenClawPluginToolContext,
  _api: OpenClawPluginApi,
) {
  return [
    {
      name: "search_osf_preprints",
      label: "Search Preprints (OSF)",
      description:
        "Search OSF Preprints, an aggregator covering 180K+ preprints across multiple providers including SocArXiv, PsyArXiv, EarthArXiv, EngrXiv, and NutriXiv. Covers social sciences, psychology, earth sciences, engineering, and more.",
      parameters: Type.Object({
        provider: Type.Optional(
          Type.String({
            description:
              "Preprint provider filter: 'osf', 'socarxiv', 'psyarxiv', 'engrxiv', 'eartharxiv', 'nutrixiv'. Omit for all providers.",
          }),
        ),
        size: Type.Optional(
          Type.Number({ description: "Max results (default 10, max 100)" }),
        ),
        page: Type.Optional(
          Type.Number({ description: "Page number (default 1)" }),
        ),
      }),
      execute: async (_toolCallId: string, input: {
        provider?: string;
        size?: number;
        page?: number;
      }) => {
        const params = new URLSearchParams({
          "page[size]": String(Math.min(input?.size ?? 10, 100)),
        });
        const provider = validParam(input?.provider);
        if (provider) params.set("filter[provider]", provider);
        if (input?.page) params.set("page", String(input.page));

        const result = await trackedFetch(
          "osf_preprints",
          `${BASE}/preprints/?${params}`,
          {
            headers: {
              Accept: "application/vnd.api+json",
            },
          },
          20_000,
        );
        if (isTrackedError(result)) return result;
        const data = await result.res.json();

        const items = data.data as Array<Record<string, unknown>> | undefined;
        const linksMeta = (data.links as Record<string, unknown>)?.meta as Record<string, unknown> | undefined;

        return toolResult({
          total_results: linksMeta?.total,
          page: input?.page ?? 1,
          source: "osf_preprints",
          preprints: (items ?? []).map((item) => {
            const attrs = item.attributes as Record<string, unknown> | undefined;
            const relationships = item.relationships as Record<string, unknown> | undefined;
            const providerData = (
              relationships?.provider as Record<string, unknown> | undefined
            )?.data as Record<string, string> | undefined;
            const subjects = attrs?.subjects as Array<Array<{ id: string; text: string }>> | undefined;

            // Flatten nested subject arrays
            const subjectNames = subjects
              ?.flat()
              .map((s) => s.text)
              .filter(Boolean);

            return {
              id: item.id,
              title: attrs?.title,
              description: attrs?.description
                ? String(attrs.description).slice(0, 500)
                : undefined,
              doi: attrs?.doi ?? undefined,
              date_created: attrs?.date_created,
              date_published: attrs?.date_published,
              year: attrs?.date_published
                ? String(attrs.date_published).slice(0, 4)
                : attrs?.date_created
                  ? String(attrs.date_created).slice(0, 4)
                  : undefined,
              provider: providerData?.id,
              tags: attrs?.tags,
              subjects: subjectNames,
              is_published: attrs?.is_published,
              authors: undefined as string[] | undefined, // OSF preprint list does not embed contributor names
              url: `https://osf.io/preprints/${providerData?.id ?? "osf"}/${String(item.id).replace(/_v\d+$/, "")}`,
              source: "osf_preprints",
            };
          }),
          _latency_ms: result.latency_ms,
        });
      },
    },
  ];
}
