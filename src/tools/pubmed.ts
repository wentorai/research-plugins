import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi, OpenClawPluginToolContext } from "openclaw/plugin-sdk";

const EUTILS = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

export function createPubMedTools(
  _ctx: OpenClawPluginToolContext,
  _api: OpenClawPluginApi,
) {
  return [
    {
      name: "search_pubmed",
      description:
        "Search PubMed biomedical literature database. Covers 36M+ citations from MEDLINE, life science journals, and online books.",
      inputSchema: Type.Object({
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
      handler: async (input: {
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

        const searchRes = await fetch(`${EUTILS}/esearch.fcgi?${searchParams}`);
        if (!searchRes.ok)
          return { error: `Search error: ${searchRes.status} ${searchRes.statusText}` };
        const searchData = await searchRes.json();
        const ids: string[] = searchData.esearchresult?.idlist ?? [];

        if (ids.length === 0) return { total_count: searchData.esearchresult?.count ?? 0, articles: [] };

        const summaryParams = new URLSearchParams({
          db: "pubmed",
          id: ids.join(","),
          retmode: "json",
        });
        const summaryRes = await fetch(`${EUTILS}/esummary.fcgi?${summaryParams}`);
        if (!summaryRes.ok)
          return { error: `Summary error: ${summaryRes.status} ${summaryRes.statusText}` };
        const summaryData = await summaryRes.json();

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

        return {
          total_count: parseInt(searchData.esearchresult?.count ?? "0", 10),
          articles,
        };
      },
    },
    {
      name: "get_article",
      description:
        "Get detailed article metadata from PubMed by PMID, including abstract.",
      inputSchema: Type.Object({
        pmid: Type.String({ description: "PubMed ID (numeric string)" }),
      }),
      handler: async (input: { pmid: string }) => {
        const params = new URLSearchParams({
          db: "pubmed",
          id: input.pmid,
          retmode: "xml",
        });
        const res = await fetch(`${EUTILS}/efetch.fcgi?${params}`);
        if (!res.ok) return { error: `API error: ${res.status} ${res.statusText}` };
        const xml = await res.text();

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

        return {
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
        };
      },
    },
  ];
}
