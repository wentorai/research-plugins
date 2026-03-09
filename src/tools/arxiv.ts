import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi, OpenClawPluginToolContext } from "openclaw/plugin-sdk";

const BASE = "https://export.arxiv.org/api/query";

function parseArxivXml(xml: string) {
  const entries: Record<string, unknown>[] = [];
  const entryBlocks = xml.split("<entry>").slice(1);

  for (const block of entryBlocks) {
    const getText = (tag: string) => {
      const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
      return m ? m[1].trim() : "";
    };

    const getAll = (tag: string) => {
      const results: string[] = [];
      const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "g");
      let m;
      while ((m = re.exec(block)) !== null) results.push(m[1].trim());
      return results;
    };

    const getAttr = (tag: string, attr: string) => {
      const m = block.match(new RegExp(`<${tag}[^>]*${attr}="([^"]*)"[^>]*/?>`, "g"));
      return m
        ? m.map((s) => {
            const am = s.match(new RegExp(`${attr}="([^"]*)"`));
            return am ? am[1] : "";
          })
        : [];
    };

    const id = getText("id");
    const arxivId = id.replace("http://arxiv.org/abs/", "").replace(/v\d+$/, "");

    entries.push({
      arxiv_id: arxivId,
      title: getText("title").replace(/\s+/g, " "),
      summary: getText("summary").replace(/\s+/g, " "),
      authors: getAll("name"),
      published: getText("published"),
      updated: getText("updated"),
      categories: getAttr("category", "term"),
      pdf_url: `https://arxiv.org/pdf/${arxivId}`,
      abs_url: `https://arxiv.org/abs/${arxivId}`,
      doi: getText("arxiv:doi"),
      comment: getText("arxiv:comment"),
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
      description:
        "Search arXiv preprint repository. Covers physics, math, CS, biology, quantitative finance, statistics, and more.",
      inputSchema: Type.Object({
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
      handler: async (input: {
        query: string;
        max_results?: number;
        sort_by?: string;
        sort_order?: string;
      }) => {
        const params = new URLSearchParams({
          search_query: input.query,
          max_results: String(Math.min(input.max_results ?? 10, 50)),
          sortBy: input.sort_by ?? "relevance",
          sortOrder: input.sort_order ?? "descending",
        });

        const res = await fetch(`${BASE}?${params}`);
        if (!res.ok) return { error: `API error: ${res.status} ${res.statusText}` };
        const xml = await res.text();

        const totalMatch = xml.match(
          /<opensearch:totalResults[^>]*>(\d+)<\/opensearch:totalResults>/,
        );
        const total = totalMatch ? parseInt(totalMatch[1], 10) : 0;

        return {
          total_results: total,
          papers: parseArxivXml(xml),
        };
      },
    },
    {
      name: "get_arxiv_paper",
      description:
        "Get detailed information about a specific arXiv paper by its ID.",
      inputSchema: Type.Object({
        arxiv_id: Type.String({
          description: "arXiv paper ID, e.g. '2301.00001' or '2301.00001v2'",
        }),
      }),
      handler: async (input: { arxiv_id: string }) => {
        const id = input.arxiv_id.replace("arXiv:", "");
        const params = new URLSearchParams({ id_list: id });
        const res = await fetch(`${BASE}?${params}`);
        if (!res.ok) return { error: `API error: ${res.status} ${res.statusText}` };
        const xml = await res.text();
        const papers = parseArxivXml(xml);
        if (papers.length === 0) return { error: "Paper not found" };
        return papers[0];
      },
    },
  ];
}
