---
name: pywayne-statistics-guide
description: "37+ statistical testing methods for rigorous hypothesis testing"
metadata:
  openclaw:
    emoji: "📐"
    category: "analysis"
    subcategory: "statistics"
    keywords: ["hypothesis testing", "statistical tests", "p-value", "parametric tests", "nonparametric tests", "effect size", "multiple comparisons"]
    source: "https://github.com/AcademicSkills/pywayne-statistics-guide"
---

# PyWayne Statistics Guide

A comprehensive reference for 37+ statistical testing methods covering parametric, nonparametric, and resampling-based hypothesis tests. Provides decision trees for test selection, implementation in Python (scipy, statsmodels, pingouin), effect size calculation, and proper reporting standards for academic publications.

## Overview

Hypothesis testing remains the backbone of quantitative research across the sciences, social sciences, and engineering. However, selecting the appropriate test for a given research question, data structure, and assumption profile is a persistent challenge, especially for researchers outside statistics. This skill provides a structured decision framework that maps research questions to the correct statistical test, verifies assumptions, computes test statistics and effect sizes, and formats results for publication.

All 37+ tests are organized by the type of comparison (one-sample, two-sample, k-sample, association, agreement) and whether parametric assumptions are met. Each test entry includes when to use it, assumptions to verify, the Python implementation, and the correct APA-style reporting format.

## Test Selection Decision Tree

### Step 1: Identify the Research Question Type

| Question Type | Examples |
|--------------|----------|
| **One-sample** | Is this sample mean different from a known value? |
| **Two-sample (independent)** | Do treatment and control groups differ? |
| **Two-sample (paired)** | Do pre-test and post-test scores differ? |
| **K-sample (independent)** | Do 3+ groups differ on an outcome? |
| **K-sample (repeated)** | Do measurements differ across 3+ time points? |
| **Association** | Is variable X related to variable Y? |
| **Agreement** | Do two raters/methods agree? |

### Step 2: Check Data Type and Assumptions

```
Is the outcome variable continuous?
├── Yes → Are the data normally distributed?
│   ├── Yes → Are variances equal (for group comparisons)?
│   │   ├── Yes → Use PARAMETRIC test
│   │   └── No → Use Welch's correction or nonparametric
│   └── No → Use NONPARAMETRIC test
└── No → Is it ordinal or nominal?
    ├── Ordinal → Use rank-based NONPARAMETRIC test
    └── Nominal → Use CHI-SQUARE or exact test
```

## Parametric Tests

### Two-Sample Tests

```python
from scipy import stats
import pingouin as pg
import numpy as np

def two_sample_comparison(group_a, group_b, paired=False):
    """
    Perform the appropriate two-sample test with assumption checks.
    """
    results = {}

    # Assumption: Normality
    _, p_norm_a = stats.shapiro(group_a)
    _, p_norm_b = stats.shapiro(group_b)
    normal = p_norm_a > 0.05 and p_norm_b > 0.05

    if paired:
        if normal:
            # Paired t-test
            t, p = stats.ttest_rel(group_a, group_b)
            d = pg.compute_effsize(group_a, group_b, paired=True, eftype='cohen')
            results = {'test': 'paired t-test', 't': t, 'p': p, 'cohens_d': d}
        else:
            # Wilcoxon signed-rank
            w, p = stats.wilcoxon(group_a, group_b)
            r = w / (len(group_a) * (len(group_a) + 1) / 2)
            results = {'test': 'Wilcoxon signed-rank', 'W': w, 'p': p, 'rank_biserial': r}
    else:
        if normal:
            # Check equal variances
            _, p_levene = stats.levene(group_a, group_b)
            if p_levene > 0.05:
                t, p = stats.ttest_ind(group_a, group_b)
                results = {'test': 'independent t-test', 't': t, 'p': p}
            else:
                t, p = stats.ttest_ind(group_a, group_b, equal_var=False)
                results = {'test': "Welch's t-test", 't': t, 'p': p}
            d = pg.compute_effsize(group_a, group_b, eftype='cohen')
            results['cohens_d'] = d
        else:
            # Mann-Whitney U
            u, p = stats.mannwhitneyu(group_a, group_b, alternative='two-sided')
            results = {'test': 'Mann-Whitney U', 'U': u, 'p': p}

    return results
```

### K-Sample Tests (ANOVA Family)

| Test | Use Case | Assumptions |
|------|----------|-------------|
| One-way ANOVA | 3+ independent groups, continuous outcome | Normality, homoscedasticity |
| Welch's ANOVA | 3+ groups, unequal variances | Normality |
| Repeated measures ANOVA | 3+ related measurements | Normality, sphericity |
| Two-way ANOVA | Two factors, continuous outcome | Normality, homoscedasticity |
| ANCOVA | Group comparison controlling for covariate | Normality, homogeneity of slopes |
| MANOVA | Multiple dependent variables | Multivariate normality |

```python
def k_sample_test(groups: list, method: str = 'auto'):
    """Run the appropriate k-sample comparison."""
    # Check normality for all groups
    all_normal = all(stats.shapiro(g)[1] > 0.05 for g in groups)

    if all_normal:
        # Check homogeneity of variance
        _, p_levene = stats.levene(*groups)
        if p_levene > 0.05:
            f, p = stats.f_oneway(*groups)
            return {'test': 'one-way ANOVA', 'F': f, 'p': p}
        else:
            # Welch's ANOVA via pingouin
            return {'test': "Welch's ANOVA", 'note': 'Use pg.welch_anova()'}
    else:
        h, p = stats.kruskal(*groups)
        return {'test': 'Kruskal-Wallis H', 'H': h, 'p': p}
```

## Nonparametric Tests Reference

| Parametric Test | Nonparametric Alternative | When to Use |
|----------------|--------------------------|-------------|
| One-sample t-test | Wilcoxon signed-rank | Non-normal single sample |
| Independent t-test | Mann-Whitney U | Non-normal, 2 independent groups |
| Paired t-test | Wilcoxon signed-rank | Non-normal, paired data |
| One-way ANOVA | Kruskal-Wallis H | Non-normal, 3+ groups |
| Repeated measures ANOVA | Friedman test | Non-normal, 3+ related measures |
| Pearson correlation | Spearman rho / Kendall tau | Non-linear or ordinal association |

## Multiple Comparisons Correction

When performing multiple hypothesis tests, control the family-wise error rate:

```python
from statsmodels.stats.multitest import multipletests

def correct_multiple_tests(p_values: list, method: str = 'fdr_bh') -> dict:
    """
    Apply multiple comparisons correction.

    Methods:
        'bonferroni': Conservative, controls FWER
        'holm': Less conservative than Bonferroni, controls FWER
        'fdr_bh': Benjamini-Hochberg, controls FDR (recommended default)
        'fdr_by': Benjamini-Yekutieli, conservative FDR control
    """
    reject, corrected_p, _, _ = multipletests(p_values, method=method)
    return {
        'method': method,
        'original_p': p_values,
        'corrected_p': corrected_p.tolist(),
        'reject': reject.tolist(),
        'n_significant': int(reject.sum())
    }
```

## Effect Size Reference

| Test | Effect Size | Small | Medium | Large |
|------|------------|-------|--------|-------|
| t-test | Cohen's d | 0.2 | 0.5 | 0.8 |
| ANOVA | Eta-squared | 0.01 | 0.06 | 0.14 |
| Correlation | r | 0.1 | 0.3 | 0.5 |
| Chi-square | Cramér's V | 0.1 | 0.3 | 0.5 |
| Mann-Whitney | Rank-biserial r | 0.1 | 0.3 | 0.5 |

## APA Reporting Examples

- **t-test**: "An independent samples t-test revealed a significant difference, t(58) = 2.45, p = .017, d = 0.63."
- **ANOVA**: "A one-way ANOVA showed a significant main effect of condition, F(2, 87) = 4.12, p = .020, eta-squared = 0.09."
- **Mann-Whitney**: "A Mann-Whitney U test indicated that scores were significantly higher in the treatment group, U = 245, p = .003, r = 0.42."
- **Chi-square**: "A chi-square test of independence revealed a significant association, X2(2, N = 150) = 8.34, p = .015, V = 0.24."

## References

- Cohen, J. (1988). *Statistical Power Analysis for the Behavioral Sciences* (2nd ed.). Routledge.
- Vallat, R. (2018). Pingouin: Statistics in Python. *JOSS*, 3(31), 1026.
- Lakens, D. (2013). Calculating and Reporting Effect Sizes. *Frontiers in Psychology*, 4, 863.
