---
name: quantitative-methods-guide
description: "Design and execute statistical analyses with regression modeling"
metadata:
  openclaw:
    emoji: "📈"
    category: "analysis"
    subcategory: "statistics"
    keywords: ["regression analysis", "quantitative methods", "research design", "statistical modeling", "OLS", "logistic regression"]
    source: "https://github.com/AcademicSkills/quantitative-methods-guide"
---

# Quantitative Methods Guide

A skill for designing and executing rigorous quantitative analyses in academic research. Covers the full pipeline from research question formulation through variable operationalization, model specification, estimation, diagnostics, and interpretation, with emphasis on regression modeling as the workhorse of empirical research.

## Overview

Quantitative methods form the foundation of empirical research across the social sciences, health sciences, economics, education, and many STEM fields. This skill provides a structured approach to the entire quantitative analysis workflow, ensuring that researchers make methodologically sound choices at each stage. It treats regression analysis as the central tool, covering ordinary least squares (OLS), logistic regression, Poisson regression, and multilevel models, while also addressing the broader issues of research design, measurement, and causal inference that determine whether regression results are meaningful.

The skill is designed for graduate students and researchers who have basic statistics knowledge but need guidance on applying methods correctly in their own research contexts.

## Research Design and Variable Specification

### From Question to Model

```
Research Question: "Does mentoring frequency affect publication output among
                    junior faculty, controlling for department size and funding?"

Step 1: Identify variables
  - Outcome (Y): publication_count (count data)
  - Predictor (X1): mentoring_hours_per_month (continuous)
  - Controls: department_size (continuous), total_funding (continuous)
  - Potential moderator: career_stage (categorical: assistant/associate)

Step 2: Choose model family
  - Count outcome → Poisson or Negative Binomial regression
  - Check for overdispersion before deciding

Step 3: Specify the model
  publications ~ mentoring_hours + department_size + log(funding) + career_stage
  Optional: publications ~ mentoring_hours * career_stage + controls (interaction)
```

### Variable Types and Measurement

| Variable Type | Examples | Modeling Considerations |
|--------------|----------|----------------------|
| Continuous | Income, GPA, temperature | Check distribution, consider transformations |
| Binary | Pass/fail, treatment/control | Logistic regression |
| Count | Publications, citations, events | Poisson or negative binomial |
| Ordinal | Likert scales, rankings | Ordinal logistic or treat as continuous if 5+ levels |
| Nominal | Department, country, method | Dummy coding (k-1 indicators) |
| Time-to-event | Months until graduation | Survival analysis |

## Regression Analysis

### Ordinary Least Squares (OLS)

```python
import statsmodels.formula.api as smf
import pandas as pd

def run_ols_analysis(df: pd.DataFrame, formula: str) -> dict:
    """
    Fit an OLS regression model with full diagnostics.

    Args:
        df: DataFrame with all variables
        formula: Patsy formula (e.g., 'y ~ x1 + x2 + C(group)')
    """
    model = smf.ols(formula=formula, data=df).fit(cov_type='HC3')  # robust SE

    results = {
        'coefficients': model.params.to_dict(),
        'std_errors': model.bse.to_dict(),
        'p_values': model.pvalues.to_dict(),
        'conf_int': model.conf_int().to_dict(),
        'r_squared': model.rsquared,
        'adj_r_squared': model.rsquared_adj,
        'f_statistic': model.fvalue,
        'f_pvalue': model.f_pvalue,
        'n_obs': int(model.nobs),
        'aic': model.aic,
        'bic': model.bic
    }
    return results

# Example usage:
# results = run_ols_analysis(df, 'gpa ~ study_hours + sleep_hours + C(major)')
```

### Logistic Regression

```python
def run_logistic_analysis(df: pd.DataFrame, formula: str) -> dict:
    """
    Fit a logistic regression for binary outcomes.
    Reports odds ratios alongside coefficients.
    """
    model = smf.logit(formula=formula, data=df).fit(disp=False)

    import numpy as np
    results = {
        'coefficients': model.params.to_dict(),
        'odds_ratios': np.exp(model.params).to_dict(),
        'p_values': model.pvalues.to_dict(),
        'conf_int_OR': np.exp(model.conf_int()).to_dict(),
        'pseudo_r_squared': model.prsquared,
        'log_likelihood': model.llf,
        'aic': model.aic,
        'n_obs': int(model.nobs)
    }
    return results
```

## Model Diagnostics

### OLS Assumption Checks

Run these diagnostics after fitting any OLS model:

1. **Linearity**: Plot residuals vs. fitted values. Look for no systematic pattern.
2. **Normality of residuals**: Q-Q plot and Shapiro-Wilk test on residuals.
3. **Homoscedasticity**: Breusch-Pagan test (`statsmodels.stats.diagnostic.het_breuschpagan`).
4. **No multicollinearity**: Variance Inflation Factor (VIF) for each predictor.
5. **Independence**: Durbin-Watson statistic for autocorrelation (especially panel/time data).

```python
from statsmodels.stats.outliers_influence import variance_inflation_factor
from statsmodels.stats.diagnostic import het_breuschpagan

def check_ols_assumptions(model, X_matrix) -> dict:
    """
    Run standard OLS diagnostic tests.
    """
    residuals = model.resid
    fitted = model.fittedvalues

    # VIF for multicollinearity
    vif = {X_matrix.columns[i]: variance_inflation_factor(X_matrix.values, i)
           for i in range(X_matrix.shape[1])}
    multicollinearity_flag = any(v > 10 for v in vif.values())

    # Breusch-Pagan for heteroscedasticity
    bp_stat, bp_p, _, _ = het_breuschpagan(residuals, X_matrix)

    from scipy import stats
    _, normality_p = stats.shapiro(residuals[:5000])  # cap at 5000

    return {
        'vif': vif,
        'multicollinearity_problem': multicollinearity_flag,
        'breusch_pagan_p': round(bp_p, 4),
        'heteroscedasticity_problem': bp_p < 0.05,
        'residual_normality_p': round(normality_p, 4),
        'recommendation': 'Use HC3 robust standard errors if heteroscedasticity detected'
    }
```

## Reporting Regression Results

### Standard Regression Table Format

| Variable | Coefficient | SE | t | p | 95% CI |
|----------|-----------|------|------|-------|---------|
| (Intercept) | 2.34 | 0.45 | 5.20 | <.001 | [1.45, 3.23] |
| Mentoring hours | 0.18 | 0.06 | 3.00 | .003 | [0.06, 0.30] |
| Dept. size | -0.02 | 0.01 | -2.00 | .048 | [-0.04, -0.00] |
| Log(Funding) | 0.31 | 0.12 | 2.58 | .011 | [0.07, 0.55] |

Report: N, R-squared, Adjusted R-squared, F-statistic with df and p-value, and the type of standard errors used (e.g., HC3 robust).

### Interpretation Template

"A one-unit increase in [predictor] is associated with a [coefficient] [unit] change in [outcome], holding all other variables constant (b = [coef], SE = [se], p = [p], 95% CI [[lower], [upper]])."

For logistic regression: "A one-unit increase in [predictor] is associated with [OR]-times higher odds of [outcome] (OR = [or], 95% CI [[lower], [upper]], p = [p])."

## Common Pitfalls

- **Omitted variable bias**: Failing to control for confounders that affect both X and Y.
- **Overfitting**: Including too many predictors relative to sample size (rule of thumb: 10-20 observations per predictor).
- **p-hacking**: Running many models and reporting only significant results. Pre-register your analysis plan.
- **Misinterpreting R-squared**: High R-squared does not imply causation; low R-squared does not mean the model is useless.
- **Ignoring assumptions**: Always run diagnostics. Violated assumptions can invalidate standard errors and p-values.

## References

- Wooldridge, J. M. (2019). *Introductory Econometrics* (7th ed.). Cengage.
- Gelman, A. & Hill, J. (2007). *Data Analysis Using Regression and Multilevel/Hierarchical Models*. Cambridge University Press.
- King, G. (1986). How Not to Lie with Statistics. *American Journal of Political Science*, 30(3), 666-687.
