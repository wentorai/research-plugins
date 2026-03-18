import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi, OpenClawPluginToolContext } from "openclaw/plugin-sdk";
import { toolResult, trackedFetch, isTrackedError } from "./util.js";

const EUTILS = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

export function createPubMedTools(
  _ctx: OpenClawPluginToolContext,
  _api: OpenClawPluginApi,
) {
  return [
    {
      name: "search_pubmed",
      label: "Search Articles (PubMed)",
      description:
        "Search PubMed biomedical literature database. Covers 36M+ citations from MEDLINE, life science journals, and online books.",
      parameters: Type.Object({
        query: Type.String({
          description:
            "PubMed search query. Supports MeSH terms and field tags, e.g. 'CRISPR[Title] AND 2024[PDAT]'",
        }),
        max_results: Type.Optional(
          Type.Number({ description: "Max results (default 10, max 100)" }),
        ),
        sort: Type.Optional(
          Type.String({
            description: "Sort by: 'relevance' or 'pub_date'",
          }),
        ),
        min_date: Type.Optional(
          Type.String({ description: "Min publication date (YYYY/MM/DD)" }),
        ),
        max_date: Type.Optional(
          Type.String({ description: "Max publication date (YYYY/MM/DD)" }),
        ),
      }),
      execute: async (input: {
        query: string;
        max_results?: number;
        sort?: string;
        min_date?: string;
        max_date?: string;
      }) => {
        const searchParams = new URLSearchParams({
          db: "pubmed",
          term: input.query,
          retmax: String(Math.min(input.max_results ?? 10, 100)),
          retmode: "json",
          sort: input.sort ?? "relevance",
          usehistory: "y",
        });
        if (input.min_date) searchParams.set("mindate", input.min_date);
        if (input.max_date) searchParams.set("maxdate", input.max_date);
        if (input.min_date || input.max_date) searchParams.set("datetype", "pdat");

        const searchTracked = await trackedFetch("pubmed", `${EUTILS}/esearch.fcgi?${searchParams}`);
        if (isTrackedError(searchTracked)) return searchTracked;
        const searchData = await searchTracked.res.json();
        const ids: string[] = searchData.esearchresult?.idlist ?? [];

        if (ids.length === 0) {
          return toolResult({
            total_count: searchData.esearchresult?.count ?? 0,
            articles: [],
            _source_health: { source: "pubmed", latency_ms: searchTracked.latency_ms },
          });
        }

        const summaryParams = new URLSearchParams({
          db: "pubmed",
          id: ids.join(","),
          retmode: "json",
        });
        const summaryTracked = await trackedFetch("pubmed", `${EUTILS}/esummary.fcgi?${summaryParams}`);
        if (isTrackedError(summaryTracked)) return summaryTracked;
        const summaryData = await summaryTracked.res.json();

        const articles = ids.map((id) => {
          const doc = summaryData.result?.[id];
          if (!doc) return { pmid: id };
          return {
            pmid: id,
            title: doc.title,
            authors: doc.authors
              ?.slice(0, 5)
              .map((a: Record<string, string>) => a.name),
            source: doc.source,
            pub_date: doc.pubdate,
            doi: doc.elocationid?.replace("doi: ", ""),
            pmc: doc.articleids?.find(
              (a: Record<string, string>) => a.idtype === "pmc",
            )?.value,
          };
        });

        return toolResult({
          total_count: parseInt(searchData.esearchresult?.count ?? "0", 10),
          articles,
          _source_health: { source: "pubmed", latency_ms: summaryTracked.latency_ms },
        });
      },
    },
    {
      name: "get_article",
      label: "Get Article Details (PubMed)",
      description:
        "Get detailed article metadata from PubMed by PMID, including abstract.",
      parameters: Type.Object({
        pmid: Type.String({ description: "PubMed ID (numeric string)" }),
      }),
      execute: async (input: { pmid: string }) => {
        if (!input?.pmid) {
          return toolResult({ error: 'pmid parameter is required (numeric PubMed ID, e.g., "33116299")' });
        }
        const params = new URLSearchParams({
          db: "pubmed",
          id: input.pmid,
          retmode: "xml",
        });
        const tracked = await trackedFetch("pubmed", `${EUTILS}/efetch.fcgi?${params}`);
        if (isTrackedError(tracked)) return tracked;
        const xml = await tracked.res.text();

        const getText = (tag: string) => {
          const m = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
          return m ? m[1].trim() : "";
        };

        const getAbstract = () => {
          const m = xml.match(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g);
          if (!m) return "";
          return m
            .map((s) => s.replace(/<\/?AbstractText[^>]*>/g, "").trim())
            .join(" ");
        };

        const getAuthors = () => {
          const authors: string[] = [];
          const re = /<Author[^>]*>[\s\S]*?<LastName>([\s\S]*?)<\/LastName>[\s\S]*?<ForeName>([\s\S]*?)<\/ForeName>[\s\S]*?<\/Author>/g;
          let m;
          while ((m = re.exec(xml)) !== null) {
            authors.push(`${m[2].trim()} ${m[1].trim()}`);
          }
          return authors;
        };

        const getMesh = () => {
          const terms: string[] = [];
          const re = /<DescriptorName[^>]*>([\s\S]*?)<\/DescriptorName>/g;
          let m;
          while ((m = re.exec(xml)) !== null) terms.push(m[1].trim());
          return terms;
        };

        const doi =
          xml.match(/<ArticleId IdType="doi">([\s\S]*?)<\/ArticleId>/)?.[1]?.trim() ??
          "";
        const pmc =
          xml.match(/<ArticleId IdType="pmc">([\s\S]*?)<\/ArticleId>/)?.[1]?.trim() ??
          "";

        return toolResult({
          pmid: input.pmid,
          title: getText("ArticleTitle"),
          abstract: getAbstract(),
          authors: getAuthors(),
          journal: getText("Title"),
          pub_date: `${getText("Year")}-${getText("Month")}`,
          doi,
          pmc,
          mesh_terms: getMesh(),
          url: `https://pubmed.ncbi.nlm.nih.gov/${input.pmid}/`,
          _source_health: { source: "pubmed", latency_ms: tracked.latency_ms },
        });
      },
    },
  ];
}
