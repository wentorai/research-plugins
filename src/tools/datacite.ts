import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi, OpenClawPluginToolContext } from "openclaw/plugin-sdk";
import { toolResult, trackedFetch, isTrackedError, validParam } from "./util.js";

const BASE = "https://api.datacite.org";

export function createDataCiteTools(
  _ctx: OpenClawPluginToolContext,
  _api: OpenClawPluginApi,
) {
  return [
    {
      name: "search_datacite",
      label: "Search Datasets & DOIs (DataCite)",
      description:
        "Search DataCite for datasets, software, and other research outputs (50M+ DOIs). Covers Zenodo, Figshare, Dryad, and 2000+ repositories. Best for finding datasets, software, and non-journal outputs.",
      parameters: Type.Object({
        query: Type.String({
          description: "Search query for datasets, software, or other research outputs",
        }),
        max_results: Type.Optional(
          Type.Number({ description: "Max results (default 10, max 100)" }),
        ),
        resource_type: Type.Optional(
          Type.String({
            description:
              "Filter by type: 'Dataset', 'Software', 'Text', 'Collection', 'Audiovisual', 'Image', etc.",
          }),
        ),
        from_year: Type.Optional(
          Type.Number({ description: "Published from this year onward" }),
        ),
      }),
      execute: async (_toolCallId: string, input: {
        query: string;
        max_results?: number;
        resource_type?: string;
        from_year?: number;
      }) => {
        const query = validParam(input?.query);
        if (!query) {
          return toolResult({
            error:
              "query parameter is required and must not be empty. " +
              "Example: search_datacite({ query: \"climate dataset\" })",
          });
        }
        const pageSize = Math.min(input?.max_results ?? 10, 100);
        const params = new URLSearchParams({
          query,
          "page[size]": String(pageSize),
        });
        const resourceType = validParam(input.resource_type);
        if (resourceType) {
          params.set("resource-type-id", resourceType.toLowerCase());
        }
        if (input?.from_year) {
          params.set("query", `${query} AND publicationYear:[${input.from_year} TO *]`);
        }

        const tracked = await trackedFetch("datacite", `${BASE}/dois?${params}`, undefined, 15_000);
        if (isTrackedError(tracked)) return tracked;
        const data = await tracked.res.json();

        const items = (data.data ?? []).map(
          (item: Record<string, unknown>) => {
            const attrs = item.attributes as Record<string, unknown> | undefined;
            if (!attrs) return { id: item.id };

            const titles = attrs.titles as Array<{ title: string }> | undefined;
            const creators = attrs.creators as Array<{
              name: string;
              nameType?: string;
              givenName?: string;
              familyName?: string;
            }> | undefined;
            const types = attrs.types as Record<string, string> | undefined;
            const descriptions = attrs.descriptions as Array<{
              description: string;
              descriptionType: string;
            }> | undefined;
            const dates = attrs.dates as Array<{
              date: string;
              dateType: string;
            }> | undefined;

            const issuedDate = dates?.find((d) => d.dateType === "Issued")?.date;

            return {
              doi: attrs.doi,
              title: titles?.[0]?.title,
              creators: creators?.slice(0, 5).map((c) =>
                c.givenName && c.familyName
                  ? `${c.givenName} ${c.familyName}`
                  : c.name,
              ),
              publisher: attrs.publisher,
              publication_year: attrs.publicationYear,
              resource_type: types?.resourceTypeGeneral,
              description: descriptions?.find(
                (d) => d.descriptionType === "Abstract",
              )?.description,
              url: attrs.url,
              issued_date: issuedDate,
              citation_count: attrs.citationCount,
              view_count: attrs.viewCount,
              download_count: attrs.downloadCount,
            };
          },
        );

        return toolResult({
          total_results: data.meta?.total,
          items,
          _source_health: { source: "datacite", latency_ms: tracked.latency_ms },
        });
      },
    },
    {
      name: "resolve_datacite_doi",
      label: "Resolve DOI (DataCite)",
      description:
        "Resolve a DataCite DOI to get full metadata. Best for DOIs from Zenodo, Figshare, Dryad, and other data repositories (10.5281/*, 10.6084/*, etc.).",
      parameters: Type.Object({
        doi: Type.String({
          description: "DOI to resolve, e.g. '10.5281/zenodo.1234567'",
        }),
      }),
      execute: async (_toolCallId: string, input: { doi: string }) => {
        if (!input?.doi) {
          return toolResult({ error: 'doi parameter is required (e.g., "10.5281/zenodo.1234567")' });
        }
        const doi = input.doi.replace(/^https?:\/\/doi\.org\//, "");

        const tracked = await trackedFetch(
          "datacite",
          `${BASE}/dois/${encodeURIComponent(doi)}`,
          undefined,
          15_000,
        );
        if (isTrackedError(tracked)) return tracked;
        const data = await tracked.res.json();

        const attrs = data.data?.attributes as Record<string, unknown> | undefined;
        if (!attrs) return toolResult({ error: "DOI not found or no attributes" });

        const titles = attrs.titles as Array<{ title: string }> | undefined;
        const creators = attrs.creators as Array<{
          name: string;
          givenName?: string;
          familyName?: string;
        }> | undefined;
        const types = attrs.types as Record<string, string> | undefined;
        const descriptions = attrs.descriptions as Array<{
          description: string;
          descriptionType: string;
        }> | undefined;
        const dates = attrs.dates as Array<{
          date: string;
          dateType: string;
        }> | undefined;
        const rights = attrs.rightsList as Array<{
          rights: string;
          rightsUri?: string;
          rightsIdentifier?: string;
        }> | undefined;
        const subjects = attrs.subjects as Array<{
          subject: string;
        }> | undefined;

        return toolResult({
          doi: attrs.doi,
          title: titles?.[0]?.title,
          creators: creators?.map((c) =>
            c.givenName && c.familyName
              ? `${c.givenName} ${c.familyName}`
              : c.name,
          ),
          publisher: attrs.publisher,
          publication_year: attrs.publicationYear,
          resource_type: types?.resourceTypeGeneral,
          resource_type_specific: types?.resourceType || undefined,
          description: descriptions?.find(
            (d) => d.descriptionType === "Abstract",
          )?.description,
          url: attrs.url,
          dates: dates?.map((d) => ({ date: d.date, type: d.dateType })),
          license: rights?.[0]?.rightsIdentifier ?? rights?.[0]?.rights,
          license_url: rights?.[0]?.rightsUri,
          subjects: subjects?.map((s) => s.subject),
          citation_count: attrs.citationCount,
          view_count: attrs.viewCount,
          download_count: attrs.downloadCount,
          version: attrs.version,
          _source_health: { source: "datacite", latency_ms: tracked.latency_ms },
        });
      },
    },
  ];
}
