---
name: empirical-paper-analysis
description: "Systematic framework for analyzing empirical law and economics papers"
metadata:
  openclaw:
    emoji: "⚖️"
    category: "analysis"
    subcategory: "econometrics"
    keywords: ["empirical analysis", "law and economics", "identification strategy", "causal inference", "robustness checks", "research methodology"]
    source: "https://clawhub.ai/zhouziyue233/empirical-paper-analysis-skill"
---

# Empirical Paper Analysis Framework

## Overview

This framework provides a systematic approach to reading, evaluating, and critiquing empirical research papers in law and economics and related social science fields. It covers identification strategy assessment, data evaluation, robustness check analysis, and constructive critique formulation. Use this when reviewing papers for seminars, referee reports, or your own literature reviews.

## The 6-Step Analysis Framework

### Step 1: Identify the Research Question

Extract the core question and decompose it:

```
Template:
- Research Question: [What causal/descriptive claim does the paper make?]
- Unit of analysis: [individual / firm / state / country-year]
- Outcome variable (Y): [What is being explained?]
- Key explanatory variable (X): [What is the treatment or variable of interest?]
- Claimed relationship: [X → Y via what mechanism?]
```

**Red flags**:
- Vague or shifting research question across sections
- Mismatch between stated question and actual regression specification
- Question that is purely correlational framed as causal

### Step 2: Evaluate the Identification Strategy

The identification strategy is how the paper argues for causal interpretation. Map it to a known framework:

| Strategy | Key Assumption | What to Check |
|----------|---------------|---------------|
| **OLS** | No omitted variable bias (E[u\|X]=0) | Control variable completeness, R² sensitivity |
| **IV / 2SLS** | Exclusion restriction (instrument affects Y only through X) | First stage F-stat (>10), instrument validity argument |
| **Difference-in-Differences** | Parallel trends (absent treatment, treated and control would trend similarly) | Pre-treatment parallel trends test, event study plot |
| **Regression Discontinuity** | No manipulation at cutoff, continuity of potential outcomes | McCrary density test, covariate balance at cutoff |
| **Matching / PSM** | Selection on observables (no unobservable confounders) | Balance tables, common support, sensitivity to caliper |
| **Synthetic Control** | Pre-treatment fit quality, no spillovers | RMSPE ratio, placebo tests on donor pool |

**Questions to ask**:
- Is the identification assumption stated explicitly?
- Is there a **falsification test** (placebo treatment, placebo outcome)?
- Could there be **reverse causality**?
- Are there **spillover effects** that violate SUTVA?

### Step 3: Assess the Data

```
Data Evaluation Checklist:
□ Source: Is the data publicly available or proprietary?
□ Sample period: Does it match the question? Any structural breaks?
□ Sample size: Sufficient for the method? Power analysis?
□ Attrition: Is there selective dropout? Attrition tables?
□ Measurement: Are key variables measured directly or proxied?
□ External validity: Is the sample representative of the population of interest?
```

**Common data issues in law and economics**:
- Court case data: selection into litigation (Priest-Klein hypothesis)
- Regulatory data: endogenous timing of policy changes
- Survey data: response bias, recall bias
- Administrative data: measurement captures legal definitions, not economic concepts

### Step 4: Evaluate the Empirical Specification

Examine the main regression equation:

```
Y_it = α + β·X_it + γ·Controls_it + θ_i + λ_t + ε_it

Where:
  Y_it        = outcome for unit i at time t
  X_it        = treatment / variable of interest
  Controls_it = control variables
  θ_i         = unit fixed effects
  λ_t         = time fixed effects
  ε_it        = error term
  β           = coefficient of interest
```

**Check**:
- Is `β` the causal parameter of interest, or just an association?
- Are fixed effects appropriate? (Individual FE removes time-invariant confounders)
- What is the **clustering level** for standard errors? (Should match treatment assignment level)
- Are control variables themselves **bad controls** (post-treatment variables that are affected by X)?

### Step 5: Scrutinize Robustness Checks

A well-executed paper should include several:

| Robustness Check | Purpose | What to Look For |
|-----------------|---------|-----------------|
| **Alternative specifications** | Drop/add controls | Does β sign/magnitude change? |
| **Alternative samples** | Trim outliers, restrict subgroups | Is result driven by a small subset? |
| **Placebo tests** | Fake treatment date, fake outcome | Should find null results |
| **Alternative clustering** | State vs. county vs. firm | Does significance survive? |
| **Bounding exercises** | Oster (2019) bounds, Altonji ratio | How large would selection on unobservables need to be? |
| **Leave-one-out** | Drop each unit/period | Is result driven by a single observation? |
| **Event study** | Dynamic treatment effects plot | Are pre-treatment coefficients zero? |

**Warning signs**:
- Only showing robustness checks that "work" (selective reporting)
- No sensitivity analysis on key assumptions
- Robustness table hidden in appendix with different significance levels

### Step 6: Formulate Constructive Critique

Structure your critique as:

```markdown
## Summary
[2-3 sentences on what the paper does and finds]

## Strengths
- [Identification strategy strength]
- [Data quality strength]
- [Policy relevance]

## Main Concerns

### Concern 1: [Identification]
- Issue: [What specific assumption is violated or untested?]
- Evidence: [What in the paper supports your concern?]
- Suggestion: [What analysis would address this?]

### Concern 2: [Data/Measurement]
- Issue: ...
- Evidence: ...
- Suggestion: ...

### Concern 3: [Specification]
- Issue: ...
- Evidence: ...
- Suggestion: ...

## Minor Comments
- [Table formatting, typos, unclear notation]
```

## Quick Reference: Common Mistakes

| Mistake | Why It's Wrong | Fix |
|---------|---------------|-----|
| Clustering at wrong level | Understated SEs, inflated t-stats | Cluster at treatment assignment level |
| Bad controls | Including post-treatment variables biases β | Only control for pre-treatment variables |
| Cherry-picked specification | Overfitting to significance | Pre-register or show full specification curve |
| Ignoring multiple testing | Family-wise error rate inflation | Bonferroni or Benjamini-Hochberg correction |
| Log of zero | Undefined, ad hoc fixes (log(Y+1)) introduce bias | IHS transform or Poisson pseudo-MLE |
| Winner's curse | Published effect sizes are biased upward | Check if effect is plausible given prior literature |

## Example: Analyzing a DiD Paper

```
Paper claim: "Adopting e-filing reduces case processing time by 15%"

Step 1: RQ = Does e-filing (X) cause faster case processing (Y)?
Step 2: DiD with staggered adoption across courts
  - Check: parallel trends plot for early vs. late adopters
  - Check: recent DiD literature (de Chaisemartin & D'Haultfoeuille 2020)
    warns that TWFE with staggered treatment can be biased
Step 3: Data from court administrative records (2005-2020)
  - Check: is adoption timing truly exogenous? (Courts with backlogs
    might adopt earlier → selection bias)
Step 4: log(processing_days)_it = β·efiling_it + court_FE + year_FE + ε_it
  - Concern: no controls for court budgets, judge turnover
Step 5: Robustness: event study plot, drop large courts, alternative
  measure of processing time → β stable around -0.15
Step 6: Credible but could be strengthened with:
  - Callaway & Sant'Anna (2021) estimator for staggered DiD
  - Instrument for adoption timing
  - Heterogeneity by court size and case type
```

## References

- Angrist, J. D., & Pischke, J. S. (2009). *Mostly Harmless Econometrics*. Princeton University Press.
- Oster, E. (2019). "Unobservable Selection and Coefficient Stability." *Journal of Business & Economic Statistics*.
- de Chaisemartin, C., & D'Haultfoeuille, X. (2020). "Two-Way Fixed Effects Estimators with Heterogeneous Treatment Effects." *AER*.
- Callaway, B., & Sant'Anna, P. H. (2021). "Difference-in-Differences with Multiple Time Periods." *Journal of Econometrics*.
- [Empirical Legal Studies Resources](https://www.law.northwestern.edu/research-faculty/clbe/events/empiricallegalstudies/)
