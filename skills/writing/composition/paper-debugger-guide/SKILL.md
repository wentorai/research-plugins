---
name: paper-debugger-guide
description: "Multi-agent system for academic writing review and improvement"
version: 1.0.0
author: wentor-community
source: https://github.com/PaperDebugger/paperdebugger
metadata:
  openclaw:
    category: "writing"
    subcategory: "composition"
    keywords:
      - paper-review
      - academic-writing
      - multi-agent
      - writing-feedback
      - peer-review
      - manuscript-revision
---

# Paper Debugger Guide

A skill for using a plugin-based multi-agent system to review, debug, and improve academic manuscripts before submission. Based on PaperDebugger (1K stars), this skill provides structured workflows for catching logical errors, methodological weaknesses, presentation issues, and formatting problems in research papers.

## Overview

Just as software developers debug code before shipping, researchers should systematically debug their papers before submission. PaperDebugger applies this philosophy by deploying multiple specialized review agents, each focused on a different dimension of paper quality: logical consistency, methodological rigor, clarity of presentation, statistical validity, and formatting compliance.

The result is a pre-submission review process that catches issues human reviewers commonly flag, giving researchers the opportunity to address them proactively and increase their chances of acceptance.

## Review Agent Roles

The system deploys these specialized agents:

**Logic Agent**
- Checks that conclusions follow from presented evidence
- Identifies unsupported claims and logical gaps
- Verifies that the abstract accurately reflects the paper's content
- Ensures consistency between the introduction's promises and the discussion's delivery
- Flags circular reasoning and tautological statements

**Methods Agent**
- Evaluates whether the methodology is appropriate for the research questions
- Checks for missing methodological details needed for replication
- Identifies potential confounding variables not addressed
- Verifies that the sample size and study design support the intended analyses
- Assesses whether limitations are adequately acknowledged

**Clarity Agent**
- Identifies sentences that are overly complex or ambiguous
- Flags jargon used without definition on first occurrence
- Checks paragraph structure for topic sentences and logical flow
- Identifies redundant content that could be consolidated
- Evaluates whether figures and tables are self-explanatory with captions

**Statistics Agent**
- Verifies that reported statistics match the described analyses
- Checks for common errors (wrong degrees of freedom, inconsistent n values)
- Flags p-values reported without effect sizes or confidence intervals
- Identifies multiple comparison issues without appropriate corrections
- Validates that data visualization accurately represents the underlying data

**Format Agent**
- Checks compliance with target journal formatting guidelines
- Verifies reference formatting consistency
- Validates figure and table numbering and cross-references
- Checks adherence to word count limits per section
- Ensures required sections are present (data availability, conflict of interest, etc.)

## Review Workflow

The complete debugging workflow proceeds through these stages:

**Stage 1: Structural Scan**
- Parse the manuscript into its constituent sections
- Verify all expected sections are present and properly ordered
- Check section lengths against typical proportions and journal requirements
- Identify orphaned references (cited but not in bibliography, or vice versa)
- Flag missing elements (acknowledgments, supplementary references, appendices)

**Stage 2: Deep Review**
- Each specialized agent reviews the full manuscript independently
- Agents generate issue reports with severity levels (critical, major, minor, suggestion)
- Issues include specific locations (section, paragraph, sentence) and explanations
- Each issue includes a suggested fix or improvement direction
- Agents flag areas outside their expertise for human judgment

**Stage 3: Cross-Agent Synthesis**
- Merge findings from all agents into a unified report
- Resolve conflicting recommendations between agents
- Prioritize issues by severity and effort to address
- Group related issues that can be addressed together
- Generate a revision checklist ordered by priority

**Stage 4: Revision Support**
- For each identified issue, provide specific revision suggestions
- Generate alternative phrasings for clarity issues
- Suggest additional analyses or robustness checks for methodology issues
- Draft missing sections (limitations, future work) based on paper content
- Help restructure paragraphs or sections when flow issues are identified

## Common Issue Categories

Based on analysis of reviewer feedback patterns, these are the most frequently caught issues:

**High-Priority Issues**
- Overclaiming: conclusions stronger than the evidence supports
- Missing baselines: experimental comparisons without appropriate controls
- Selective reporting: presenting only favorable results
- Methodology gaps: insufficient detail for replication
- Statistical errors: incorrect test selection or reporting

**Medium-Priority Issues**
- Introduction-conclusion misalignment
- Inconsistent terminology throughout the paper
- Figures that duplicate information already in tables
- Literature review missing key recent papers in the field
- Vague contribution statements

**Low-Priority Issues**
- Minor grammatical errors
- Inconsistent formatting of numbers and units
- Reference style inconsistencies
- Caption formatting variations
- Whitespace and layout irregularities

## Integration with Research-Claw

This skill connects with the broader Research-Claw writing workflow:

- Run paper debugging after drafting with composition skills
- Feed identified methodology issues to the analysis skill for verification
- Use literature search skills to find missing references
- Connect with LaTeX skills for formatting compliance fixes
- Store review reports alongside manuscript versions for revision tracking

## Best Practices

- Run the full debugging suite at least one week before the submission deadline
- Address critical and major issues first, then iterate on minor issues
- Have a human co-author review the agent-generated suggestions before implementing
- Use the debugging report as a conversation starter with collaborators
- Re-run the suite after major revisions to check for newly introduced issues
- Keep a log of common issues across papers to identify personal writing patterns
