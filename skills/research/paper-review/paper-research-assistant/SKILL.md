---
name: paper-research-assistant
description: "Read papers, generate structured reports, find code and datasets"
metadata:
  openclaw:
    emoji: "📄"
    category: "research"
    subcategory: "paper-review"
    keywords: ["paper reading", "research report", "code extraction", "dataset discovery", "paper analysis", "structured summary"]
    source: "https://github.com/AcademicSkills/paper-research-assistant"
---

# Paper Research Assistant

A skill for systematically reading academic papers and generating structured analysis reports. Goes beyond simple summarization by extracting methodology details, identifying associated code repositories and datasets, evaluating reproducibility, and generating actionable summaries suitable for lab meetings, journal clubs, or literature review inclusion.

## Overview

Reading academic papers efficiently is a core skill for researchers, yet many lack a systematic approach. The result is either superficial skimming that misses critical details or time-consuming deep reads of papers that turn out to be marginally relevant. This skill provides a structured reading protocol that adapts its depth to the paper's relevance, extracts standardized metadata, and produces reports that can be shared with collaborators or filed for future reference.

A distinguishing feature is the automated search for associated resources: code repositories, datasets, pre-trained models, and supplementary materials that are often scattered across GitHub, institutional pages, and data repositories. These resources are essential for reproducibility and building upon published work.

## Structured Reading Protocol

### Three-Pass Reading Method

```
Pass 1: SURVEY (5-10 minutes)
  Read: Title, abstract, introduction (last paragraph), section headings,
        figures/tables (captions only), conclusion (first paragraph)
  Decide: Is this paper relevant enough for a deeper read?
  Output: One-paragraph relevance assessment

Pass 2: COMPREHENSION (30-60 minutes)
  Read: Full paper, but skip mathematical derivations and implementation details
  Focus: What problem? What approach? What results? What limitations?
  Mark: Key claims, novel contributions, and points of confusion
  Output: Structured summary (see template below)

Pass 3: CRITICAL ANALYSIS (30-60 minutes, only for highly relevant papers)
  Read: Every detail including proofs, appendices, supplementary materials
  Focus: Are the claims justified? Are there hidden assumptions?
         Could I reproduce this? What would I do differently?
  Output: Critical evaluation with reproducibility assessment
```

### Structured Summary Template

```yaml
paper_summary:
  title: ""
  authors: []
  venue: ""  # journal/conference name
  year: 0
  doi: ""

  classification:
    type: ""  # empirical, theoretical, methodological, review, position
    domain: ""
    subdomain: ""

  core_content:
    problem: |
      What specific problem does this paper address?
      Why is it important?
    approach: |
      What method/framework/model is proposed?
      What is novel about the approach?
    key_results:
      - result: ""
        metric: ""
        value: ""
        baseline_comparison: ""
    limitations:
      - ""
    future_work:
      - ""

  methodology:
    data:
      datasets_used: []
      sample_size: ""
      data_availability: ""  # public, restricted, proprietary
    method:
      type: ""  # experimental, observational, simulation, etc.
      tools: []  # software, libraries, frameworks used
      reproducibility_score: ""  # high, medium, low
    evaluation:
      metrics: []
      baselines: []
      statistical_tests: []

  resources:
    code_repository: ""
    datasets: []
    pretrained_models: []
    supplementary_url: ""
    demo_url: ""

  assessment:
    relevance_to_my_work: ""  # high, medium, low
    quality_rating: ""  # 1-5 scale
    key_takeaway: ""
    follow_up_actions: []
```

## Code and Dataset Discovery

### Finding Associated Resources

```python
def find_paper_resources(title: str, authors: list, doi: str = None) -> dict:
    """
    Search for code, datasets, and other resources associated with a paper.

    Search locations (in priority order):
    1. Paper itself (check "Code Availability" section)
    2. Papers With Code (paperswithcode.com)
    3. GitHub search (title + author name)
    4. Author institutional pages
    5. Zenodo / Figshare (for datasets)
    6. Hugging Face (for models and datasets)
    """
    resources = {
        'code': [],
        'datasets': [],
        'models': [],
        'supplementary': []
    }

    # Strategy 1: Papers With Code
    # Search: https://paperswithcode.com/search?q={title}
    # Returns: code repos, datasets, benchmark results

    # Strategy 2: GitHub search
    # Query: "{title}" OR "{first_author} {key_method_term}"
    # Filter: recently updated, has README, has stars

    # Strategy 3: Zenodo/Figshare
    # Query: DOI or title
    # Filter: type=dataset

    # Strategy 4: Hugging Face
    # Query: paper title or model name
    # Filter: models, datasets

    # Strategy 5: Google search
    # Query: "{title}" (code OR github OR repository)
    # Query: "{title}" (dataset OR data OR download)

    return resources
```

### Reproducibility Assessment

| Factor | Score 3 (High) | Score 2 (Medium) | Score 1 (Low) |
|--------|---------------|-----------------|--------------|
| Code availability | Public repo with instructions | Code available on request | No code |
| Data availability | Public dataset with DOI | Available on request | Proprietary |
| Method description | Sufficient to reimplement | Missing some details | Vague/incomplete |
| Hyperparameters | All reported | Key ones reported | Not reported |
| Environment | Docker/requirements.txt | Software versions listed | Not specified |
| Random seeds | Fixed and reported | Fixed but not reported | Not controlled |

## Report Generation

### Lab Meeting Presentation Format

```markdown
## [Paper Title] - [First Author] et al. ([Year])

### Problem
[2-3 sentences on the problem and why it matters]

### Approach
[3-4 sentences on the method, emphasizing what is novel]

### Key Results
- [Result 1 with specific numbers]
- [Result 2 with specific numbers]
- [Comparison to best baseline]

### Strengths
- [Strength 1]
- [Strength 2]

### Weaknesses / Questions
- [Weakness 1]
- [Question for discussion]

### Relevance to Our Work
[1-2 sentences on how this connects to the lab's research]

### Resources
- Code: [URL or "not available"]
- Data: [URL or "not available"]
```

### Literature Review Entry Format

For inclusion in a systematic literature review, generate:

1. **Bibliographic entry**: Full citation in the target format (APA, Vancouver, etc.).
2. **Data extraction row**: Structured data for the evidence synthesis table.
3. **Quality assessment**: Score on the relevant quality assessment tool (CASP, Newcastle-Ottawa, etc.).
4. **Synthesis note**: How this paper relates to others in the review.

## Batch Processing Workflow

When reading multiple papers on the same topic:

1. **Triage**: Read Pass 1 for all papers. Sort by relevance.
2. **Prioritize**: Full read (Pass 2+3) only for high-relevance papers.
3. **Cross-reference**: After reading all papers, build a comparison matrix.
4. **Synthesize**: Identify points of agreement, disagreement, and gaps.
5. **File**: Store all structured summaries for future retrieval.

## Best Practices

- Always start with Pass 1. Do not commit to a deep read before assessing relevance.
- Read the figures and tables early. In empirical papers, they often tell the core story.
- Note your questions and confusions during reading. These often point to genuine gaps or weaknesses.
- Search for code and datasets before attempting to reproduce results manually.
- When a paper cites a finding as established, trace back to the original source and verify.
- Keep a running log of papers read with one-sentence summaries for quick future reference.

## References

- Keshav, S. (2007). How to Read a Paper. *ACM SIGCOMM Computer Communication Review*, 37(3), 83-84.
- Pautasso, M. (2013). Ten Simple Rules for Writing a Literature Review. *PLoS Computational Biology*, 9(7).
- Raff, E. (2019). A Step Toward Quantifying Independently Reproducible Machine Learning Research. *NeurIPS 2019*.
