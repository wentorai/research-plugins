---
name: research-paper-orchestrator
description: "Master orchestrator coordinating 10 specialized subagents for papers"
metadata:
  openclaw:
    emoji: "🎼"
    category: "research"
    subcategory: "automation"
    keywords: ["research orchestration", "multi-agent", "automated research", "paper production", "workflow automation", "agent coordination"]
    source: "https://github.com/AcademicSkills/research-paper-orchestrator"
---

# Research Paper Orchestrator

A master orchestrator skill that coordinates up to 10 specialized subagents to produce comprehensive research outputs. Each subagent handles a distinct phase of the research pipeline -- from literature search through data analysis to manuscript drafting -- while the orchestrator manages sequencing, data flow, quality gates, and synthesis across all components.

## Overview

Producing a research paper involves many distinct tasks: searching literature, reading and summarizing papers, analyzing data, generating figures, writing sections, formatting citations, and checking consistency. Each task requires different expertise and tools. The Research Paper Orchestrator decomposes the full research workflow into specialized roles, assigns each to a dedicated subagent, and coordinates their execution through a defined pipeline with quality checkpoints.

This approach mirrors how research teams operate in practice: a PI sets the direction and checks quality, a literature specialist handles the review, a statistician runs the analysis, a writer drafts the prose, and reviewers provide feedback. The orchestrator plays the PI role, ensuring all components align and meet quality standards before advancing to the next phase.

## Orchestrator Architecture

### The 10 Subagent Roles

```yaml
subagents:
  1_planner:
    role: "Research Planner"
    responsibility: "Define research question, scope, methodology, and timeline"
    inputs: ["user topic", "constraints"]
    outputs: ["research_plan.yaml"]

  2_literature_scout:
    role: "Literature Scout"
    responsibility: "Search databases, identify relevant papers, build bibliography"
    inputs: ["research_plan", "search_queries"]
    outputs: ["candidate_papers.json", "search_log.md"]

  3_paper_reader:
    role: "Paper Reader"
    responsibility: "Read and extract structured summaries from selected papers"
    inputs: ["candidate_papers"]
    outputs: ["paper_summaries.json", "evidence_matrix.csv"]

  4_gap_analyzer:
    role: "Gap Analyzer"
    responsibility: "Identify research gaps, contradictions, and opportunities"
    inputs: ["paper_summaries", "evidence_matrix"]
    outputs: ["gap_analysis.md", "positioning_statement.md"]

  5_data_analyst:
    role: "Data Analyst"
    responsibility: "Clean, analyze, and model the research data"
    inputs: ["research_data", "analysis_plan"]
    outputs: ["results.json", "statistical_tests.md"]

  6_figure_generator:
    role: "Figure Generator"
    responsibility: "Create publication-quality figures and tables"
    inputs: ["results", "figure_specifications"]
    outputs: ["figures/", "tables/"]

  7_section_writer:
    role: "Section Writer"
    responsibility: "Draft each manuscript section following academic conventions"
    inputs: ["research_plan", "paper_summaries", "results", "figures"]
    outputs: ["draft_sections/"]

  8_citation_manager:
    role: "Citation Manager"
    responsibility: "Format citations, build bibliography, check reference consistency"
    inputs: ["draft_sections", "paper_summaries"]
    outputs: ["references.bib", "citation_report.md"]

  9_consistency_checker:
    role: "Consistency Checker"
    responsibility: "Verify internal consistency across sections, figures, and claims"
    inputs: ["full_draft"]
    outputs: ["consistency_report.md", "issues.json"]

  10_quality_reviewer:
    role: "Quality Reviewer"
    responsibility: "Final quality assessment against journal standards"
    inputs: ["full_draft", "consistency_report"]
    outputs: ["review_comments.md", "quality_score"]
```

### Pipeline Execution Flow

```
Phase 1: PLANNING
  [1_planner] → research_plan
  Quality Gate: Is the plan specific, feasible, and novel?

Phase 2: LITERATURE
  [2_literature_scout] → candidate_papers
  [3_paper_reader] → paper_summaries, evidence_matrix
  [4_gap_analyzer] → gap_analysis, positioning
  Quality Gate: Is the literature coverage sufficient? Is the gap real?

Phase 3: ANALYSIS
  [5_data_analyst] → results
  [6_figure_generator] → figures, tables
  Quality Gate: Are results statistically sound? Do figures accurately represent data?

Phase 4: WRITING
  [7_section_writer] → draft_sections
  [8_citation_manager] → formatted_references
  Quality Gate: Does each section follow conventions? Are all claims cited?

Phase 5: REVIEW
  [9_consistency_checker] → consistency_report
  [10_quality_reviewer] → review_comments
  Quality Gate: Overall quality score >= threshold?

If any quality gate fails → loop back to the relevant phase.
```

## Quality Gates

### Gate Definitions

```python
QUALITY_GATES = {
    'planning': {
        'checks': [
            'Research question is specific and testable',
            'Scope is achievable within stated constraints',
            'Methodology matches the research question',
            'Timeline is realistic'
        ],
        'threshold': 4,  # All checks must pass
        'fallback': 'Return to planner with feedback'
    },
    'literature': {
        'checks': [
            'Minimum 20 relevant papers identified',
            'Coverage spans last 5 years',
            'Multiple databases searched',
            'Gap analysis identifies a clear contribution',
            'No critical papers obviously missing'
        ],
        'threshold': 4,  # At least 4 of 5 must pass
        'fallback': 'Expand search with additional queries'
    },
    'analysis': {
        'checks': [
            'Statistical assumptions verified',
            'Results are reproducible (seed set)',
            'Effect sizes reported alongside p-values',
            'Figures match reported statistics',
            'Sensitivity analysis performed'
        ],
        'threshold': 5,  # All must pass
        'fallback': 'Data analyst revises analysis'
    },
    'writing': {
        'checks': [
            'All sections present and complete',
            'Every factual claim has a citation',
            'No plagiarized passages',
            'Consistent terminology throughout',
            'Abstract accurately reflects content'
        ],
        'threshold': 5,
        'fallback': 'Section writer revises with specific feedback'
    },
    'review': {
        'checks': [
            'No internal contradictions found',
            'Figures referenced correctly in text',
            'References complete and formatted',
            'Meets target journal formatting requirements',
            'Overall quality score >= 7/10'
        ],
        'threshold': 5,
        'fallback': 'Loop back to relevant earlier phase'
    }
}
```

## Coordination Protocol

### Inter-Agent Communication

```python
class OrchestratorMessage:
    """
    Standard message format for communication between orchestrator and subagents.
    """
    def __init__(self, sender: str, receiver: str, msg_type: str, payload: dict):
        self.sender = sender       # e.g., "orchestrator", "data_analyst"
        self.receiver = receiver   # e.g., "figure_generator"
        self.msg_type = msg_type   # "task", "result", "feedback", "query"
        self.payload = payload     # task-specific data
        self.timestamp = None
        self.status = "pending"    # pending, in_progress, completed, failed

# Example: Orchestrator assigns task to data analyst
msg = OrchestratorMessage(
    sender="orchestrator",
    receiver="data_analyst",
    msg_type="task",
    payload={
        "action": "run_analysis",
        "data_path": "data/experiment_results.csv",
        "analysis_plan": "analysis_plan.yaml",
        "output_format": "json",
        "deadline": "phase_3_end"
    }
)
```

### Progress Tracking Dashboard

| Phase | Subagent | Status | Output | Quality Gate |
|-------|----------|--------|--------|-------------|
| Planning | Planner | Completed | research_plan.yaml | PASSED |
| Literature | Scout | Completed | 45 papers found | - |
| Literature | Reader | Completed | 28 papers summarized | - |
| Literature | Gap Analyzer | Completed | gap_analysis.md | PASSED |
| Analysis | Data Analyst | In Progress | 60% complete | - |
| Analysis | Figure Gen | Pending | waiting for results | - |
| Writing | Section Writer | Pending | - | - |
| Writing | Citation Mgr | Pending | - | - |
| Review | Consistency | Pending | - | - |
| Review | Quality Rev | Pending | - | - |

## Error Handling and Recovery

When a subagent fails or a quality gate is not met:

1. **Isolate the failure**: Determine which specific check failed and why.
2. **Provide targeted feedback**: Send the subagent specific, actionable instructions for revision.
3. **Limit retries**: Maximum 3 attempts per subagent before escalating to user.
4. **Preserve progress**: Never discard completed upstream work when re-running a downstream phase.
5. **Log everything**: Record all attempts, feedback, and revisions for debugging and improvement.

## Best Practices

- Run the pipeline end-to-end on a small scope first (e.g., 5 papers, 1 analysis) before scaling up.
- Human-in-the-loop at quality gates produces much better results than fully automated runs.
- The planner subagent is the most critical; invest extra time in the research plan.
- Allow the consistency checker to flag issues even if the quality reviewer has not yet run.
- Save intermediate outputs at each phase for debugging and incremental refinement.
- The orchestrator should not perform research tasks itself; its role is coordination and quality control.

## References

- Gu, J., et al. (2024). Agent Workflow Memory for Multi-Agent Systems. *arXiv:2409.07429*.
- Wu, Q., et al. (2023). AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation. *arXiv:2308.08155*.
- Hong, S., et al. (2023). MetaGPT: Meta Programming for Multi-Agent Collaborative Framework. *ICLR 2024*.
