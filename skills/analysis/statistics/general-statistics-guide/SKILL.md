---
name: general-statistics-guide
description: "Conceptual foundations of statistical inference for empirical research"
metadata:
  openclaw:
    emoji: "📈"
    category: "analysis"
    subcategory: "statistics"
    keywords: ["statistical inference", "hypothesis testing", "probability", "regression", "confidence intervals", "statistical thinking"]
    source: "https://clawhub.com/ivangdavila/statistics"
---

# Statistical Foundations for Empirical Research

## Overview

This guide builds statistical intuition from probability fundamentals through inferential methods to practical application in research. It is language-agnostic (not tied to R, Python, or Stata) and focuses on the concepts, assumptions, and interpretation of statistical methods commonly used in empirical papers. Use it as a reference when designing studies, choosing tests, or interpreting results.

## Probability Foundations

### Key Distributions

| Distribution | When to Use | Parameters | Example |
|-------------|-------------|-----------|---------|
| **Normal** | Continuous, symmetric data; CLT applications | μ (mean), σ (std) | Height, test scores |
| **Binomial** | Count of successes in n trials | n (trials), p (probability) | Survey yes/no responses |
| **Poisson** | Count of rare events in fixed interval | λ (rate) | Paper citations per year |
| **t-distribution** | Small sample means (n < 30) | df (degrees of freedom) | Pilot study comparisons |
| **Chi-squared** | Goodness of fit, contingency tables | df | Category frequency tests |
| **F-distribution** | Ratio of variances, ANOVA | df₁, df₂ | Comparing model fits |

### Central Limit Theorem

The sample mean $\bar{X}$ of n independent observations approaches a normal distribution as n increases, regardless of the population distribution:

```
If X₁, X₂, ..., Xₙ are i.i.d. with mean μ and variance σ²:
  √n(X̄ - μ) / σ → N(0, 1) as n → ∞

Practical rule: n ≥ 30 is usually sufficient
Exception: heavily skewed distributions may need n ≥ 100
```

This is why most inferential statistics (confidence intervals, t-tests, regression) work even when the underlying data is not normally distributed.

## Descriptive Statistics

### Measures of Central Tendency

| Measure | Formula | When to Use | Sensitive to Outliers? |
|---------|---------|-------------|----------------------|
| Mean | Σxᵢ / n | Symmetric distributions | Yes |
| Median | Middle value when sorted | Skewed distributions, ordinal data | No |
| Mode | Most frequent value | Categorical data, multimodal distributions | No |

### Measures of Spread

| Measure | Interpretation | When to Report |
|---------|---------------|----------------|
| Standard deviation (σ) | Average distance from mean | With the mean |
| IQR (Q3 - Q1) | Spread of middle 50% | With the median |
| Range (max - min) | Total spread | Rarely (sensitive to outliers) |
| Coefficient of variation (σ/μ) | Relative spread | Comparing variability across scales |

## Hypothesis Testing

### The Testing Framework

```
1. State hypotheses:
   H₀: null hypothesis (no effect, no difference)
   H₁: alternative hypothesis (there is an effect)

2. Choose significance level: α = 0.05 (conventional)

3. Compute test statistic from data

4. Compare to critical value or compute p-value

5. Decision:
   p < α → Reject H₀ (statistically significant)
   p ≥ α → Fail to reject H₀ (not significant)
```

### Common Errors

| | H₀ is True | H₀ is False |
|---|---|---|
| **Reject H₀** | Type I Error (α) | Correct (Power = 1 - β) |
| **Fail to Reject H₀** | Correct | Type II Error (β) |

**Practical interpretation**:
- Type I (false positive): Claiming a drug works when it doesn't
- Type II (false negative): Missing a real drug effect
- Power: Probability of detecting a real effect (target ≥ 0.80)

### Choosing the Right Test

| Question | Data Type | Test | Assumptions |
|----------|-----------|------|-------------|
| Compare 2 means | Continuous, normal | Independent t-test | Equal variance (or Welch's) |
| Compare 2 means (paired) | Continuous, normal | Paired t-test | Paired observations |
| Compare 2 means (non-normal) | Continuous/ordinal | Mann-Whitney U | Independent samples |
| Compare >2 means | Continuous, normal | One-way ANOVA | Equal variance, normality |
| Compare >2 means (non-normal) | Ordinal | Kruskal-Wallis | Independent samples |
| Association (categorical) | Categorical × Categorical | Chi-squared test | Expected count ≥ 5 |
| Correlation | Continuous × Continuous | Pearson r | Linear relationship, bivariate normal |
| Correlation (non-normal) | Ordinal or non-normal | Spearman ρ | Monotonic relationship |

## Regression Analysis

### Linear Regression

```
Y = β₀ + β₁X₁ + β₂X₂ + ... + βₖXₖ + ε

Interpretation:
  β₁ = change in Y for a 1-unit increase in X₁, holding other X's constant
  R² = proportion of variance in Y explained by the model
  Adjusted R² = R² penalized for number of predictors
```

**Key assumptions** (check before trusting results):
1. **Linearity**: Y is a linear function of X's
2. **Independence**: Observations are independent
3. **Homoscedasticity**: Constant variance of residuals
4. **Normality**: Residuals are approximately normal (for inference)
5. **No multicollinearity**: X's are not highly correlated with each other

**Diagnostic checks**:

```
Linearity:        Plot residuals vs. fitted values (no pattern)
Homoscedasticity: Breusch-Pagan test or residual plot (no funnel shape)
Normality:        Q-Q plot of residuals, Shapiro-Wilk test
Multicollinearity: VIF (Variance Inflation Factor) — VIF > 10 is concerning
Influential obs:  Cook's distance — D > 4/n warrants investigation
```

### Logistic Regression

For binary outcomes (0/1):

```
log(p / (1-p)) = β₀ + β₁X₁ + β₂X₂ + ...

Where p = P(Y = 1 | X)

Interpretation:
  exp(β₁) = odds ratio
  exp(β₁) = 1.5 means "a 1-unit increase in X₁ multiplies the odds by 1.5"
  Report: odds ratios with 95% CI
```

## Confidence Intervals

```
Point estimate ± (critical value × standard error)

For a mean: X̄ ± z*(σ/√n)  or  X̄ ± t*(s/√n)

Interpretation (frequentist):
  "If we repeated this study many times, 95% of the resulting intervals
   would contain the true population parameter."

NOT: "There is a 95% probability that the true value is in this interval."
```

## Effect Sizes

p-values tell you IF an effect exists; effect sizes tell you HOW BIG it is.

| Measure | Context | Small | Medium | Large |
|---------|---------|-------|--------|-------|
| Cohen's d | Mean difference | 0.2 | 0.5 | 0.8 |
| Pearson r | Correlation | 0.1 | 0.3 | 0.5 |
| η² (eta-squared) | ANOVA | 0.01 | 0.06 | 0.14 |
| Odds ratio | Logistic regression | 1.5 | 2.5 | 4.3 |
| R² | Regression | 0.02 | 0.13 | 0.26 |

**Always report effect sizes alongside p-values** — a "significant" result with d = 0.05 is trivial in practice.

## Multiple Testing

When testing multiple hypotheses simultaneously, the chance of at least one false positive increases:

```
With α = 0.05 and 20 independent tests:
P(at least one false positive) = 1 - (1 - 0.05)^20 = 0.64

Corrections:
  Bonferroni:         α_adj = α / m  (conservative)
  Benjamini-Hochberg: Controls false discovery rate (FDR) (less conservative)
  Holm-Bonferroni:    Step-down procedure (more powerful than Bonferroni)
```

## Sample Size and Power

Before collecting data, determine the required sample size:

```
Inputs needed:
  1. Desired power (typically 0.80)
  2. Significance level (α = 0.05)
  3. Expected effect size (from pilot study or literature)
  4. Type of test (t-test, ANOVA, regression, etc.)

Rule of thumb for two-sample t-test:
  n per group ≈ 16 / d²  (for 80% power, α = 0.05)
  d = 0.5 → n ≈ 64 per group
  d = 0.2 → n ≈ 400 per group
```

## Common Pitfalls

1. **p-hacking**: Trying many analyses until p < 0.05. Fix: pre-register analyses.
2. **Absence of evidence ≠ evidence of absence**: p > 0.05 does not prove H₀. Consider equivalence tests.
3. **Correlation ≠ causation**: Regression coefficients are causal only with proper identification strategy.
4. **Simpson's paradox**: A trend in subgroups can reverse when combined. Always check stratified analyses.
5. **Overfitting**: Too many predictors relative to sample size. Rule of thumb: n ≥ 10-20 per predictor.

## References

- Agresti, A. (2018). *Statistical Methods for the Social Sciences* (5th ed.). Pearson.
- Wasserstein, R. L., & Lazar, N. A. (2016). "The ASA Statement on p-Values." *The American Statistician*, 70(2), 129-133.
- Cohen, J. (1988). *Statistical Power Analysis for the Behavioral Sciences* (2nd ed.). Routledge.
