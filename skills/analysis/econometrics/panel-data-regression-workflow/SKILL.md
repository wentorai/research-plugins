---
name: panel-data-regression-workflow
description: "Reproducible panel data regression workflow in Python and Stata"
metadata:
  openclaw:
    emoji: "📊"
    category: "analysis"
    subcategory: "econometrics"
    keywords: ["panel data", "fixed effects", "regression workflow", "python econometrics", "stata", "reproducible research"]
    source: "https://skillsmp.com/skills/panel-data-regression-analyst"
---

# Panel Data Regression Workflow

## Overview

Panel data (longitudinal data) tracks multiple entities over time, enabling researchers to control for unobserved heterogeneity. This guide provides a complete, reproducible workflow for panel data regression — from data preparation through estimation to reporting — in both Python and Stata. It covers fixed effects, random effects, model selection, and diagnostics.

## Step 1: Data Structure and Setup

### Panel Data Format

Panel data should be in **long format** with one row per entity-time observation:

| entity_id | year | outcome | treatment | control_1 | control_2 |
|-----------|------|---------|-----------|-----------|-----------|
| firm_001 | 2018 | 45.2 | 0 | 12.3 | 0.8 |
| firm_001 | 2019 | 48.7 | 0 | 13.1 | 0.9 |
| firm_001 | 2020 | 52.1 | 1 | 14.0 | 0.7 |
| firm_002 | 2018 | 31.0 | 0 | 8.5 | 1.2 |
| ... | ... | ... | ... | ... | ... |

### Python Setup

```python
import pandas as pd
import numpy as np
from linearmodels.panel import PanelOLS, RandomEffects, BetweenOLS, compare
import statsmodels.api as sm

# Load and set panel structure
df = pd.read_csv("panel_data.csv")
df = df.set_index(["entity_id", "year"])

# Check balance
balance = df.groupby("entity_id").size()
print(f"Balanced: {balance.nunique() == 1}")
print(f"Entities: {df.index.get_level_values(0).nunique()}")
print(f"Periods: {df.index.get_level_values(1).nunique()}")
print(f"Observations: {len(df)}")
```

### Stata Setup

```stata
* Declare panel structure
xtset entity_id year

* Check balance
xtdescribe
xtsum outcome treatment control_1 control_2
```

## Step 2: Exploratory Panel Analysis

### Within and Between Variation

```python
# Decompose variation
entity_means = df.groupby("entity_id")["outcome"].transform("mean")
time_means = df.groupby("year")["outcome"].transform("mean")
grand_mean = df["outcome"].mean()

df["within_var"] = df["outcome"] - entity_means
df["between_var"] = entity_means - grand_mean

print(f"Total variance:   {df['outcome'].var():.4f}")
print(f"Within variance:  {df['within_var'].var():.4f}")
print(f"Between variance: {df['between_var'].var():.4f}")
```

```stata
* Stata: within/between decomposition
xtsum outcome treatment control_1 control_2
* Reports Overall, Between, and Within standard deviations
```

### Visual Diagnostics

```python
import matplotlib.pyplot as plt

# Entity-specific time trends (spaghetti plot)
fig, ax = plt.subplots(figsize=(10, 6))
for entity, group in df.groupby("entity_id"):
    ax.plot(group.index.get_level_values("year"), group["outcome"],
            alpha=0.3, color="steelblue")
ax.set_xlabel("Year")
ax.set_ylabel("Outcome")
ax.set_title("Entity-Level Outcome Trajectories")
plt.tight_layout()
plt.savefig("panel_trajectories.png", dpi=150)
```

## Step 3: Estimation

### Fixed Effects (Within Estimator)

Controls for all time-invariant unobserved entity characteristics:

```python
# Python: Entity fixed effects
model_fe = PanelOLS(
    df["outcome"],
    df[["treatment", "control_1", "control_2"]],
    entity_effects=True,
    time_effects=True,  # two-way FE
    check_rank=True
)
result_fe = model_fe.fit(cov_type="clustered", cluster_entity=True)
print(result_fe.summary)
```

```stata
* Stata: Entity + time fixed effects with clustered SEs
xtreg outcome treatment control_1 control_2 i.year, fe cluster(entity_id)

* Or using reghdfe (absorbs high-dimensional FE efficiently)
reghdfe outcome treatment control_1 control_2, absorb(entity_id year) cluster(entity_id)
```

### Random Effects (GLS)

Assumes unobserved effects are uncorrelated with regressors:

```python
# Python: Random effects
model_re = RandomEffects(
    df["outcome"],
    df[["treatment", "control_1", "control_2"]]
)
result_re = model_re.fit(cov_type="clustered", cluster_entity=True)
print(result_re.summary)
```

```stata
* Stata: Random effects
xtreg outcome treatment control_1 control_2, re cluster(entity_id)
```

## Step 4: Model Selection

### Hausman Test (FE vs RE)

```python
# Python: manual Hausman test
from scipy import stats

b_fe = result_fe.params
b_re = result_re.params
common = b_fe.index.intersection(b_re.index)

diff = b_fe[common] - b_re[common]
cov_diff = result_fe.cov[common].loc[common] - result_re.cov[common].loc[common]

hausman_stat = float(diff @ np.linalg.inv(cov_diff) @ diff)
p_value = 1 - stats.chi2.cdf(hausman_stat, df=len(common))
print(f"Hausman statistic: {hausman_stat:.4f}")
print(f"p-value: {p_value:.4f}")
print(f"Decision: {'Fixed Effects' if p_value < 0.05 else 'Random Effects'}")
```

```stata
* Stata: Hausman test
quietly xtreg outcome treatment control_1 control_2, fe
estimates store fe
quietly xtreg outcome treatment control_1 control_2, re
estimates store re
hausman fe re
```

**Interpretation**: p < 0.05 → FE preferred (RE assumption violated). In practice, most applied researchers default to FE for causal inference.

### Decision Framework

```
1. Is the key variable time-varying?
   No → Cannot use FE (within estimator eliminates it)
        Use RE, Correlated RE, or Between estimator
   Yes → Continue

2. Hausman test significant?
   Yes → Use Fixed Effects
   No → RE is more efficient, but FE is still consistent
        (many researchers use FE regardless for robustness)

3. Time effects needed?
   Check: testparm i.year (Stata) or joint F-test
   Significant → Include time FE (two-way)

4. Clustering level?
   Cluster at the entity level (or higher if treatment varies at group level)
```

## Step 5: Diagnostics

```python
# Serial correlation test (Wooldridge)
# H₀: No first-order autocorrelation
from linearmodels.panel import PanelOLS
# Estimate first-differenced model and test residual autocorrelation

# Heteroscedasticity (Modified Wald test)
# If using clustered SEs, heteroscedasticity is already addressed

# Cross-sectional dependence (Pesaran CD test)
# Important for macro panels (country-level data)
```

```stata
* Stata: Wooldridge test for serial correlation
xtserial outcome treatment control_1 control_2

* Modified Wald test for heteroscedasticity in FE
xttest3

* Pesaran CD test for cross-sectional dependence
xtcd outcome treatment control_1 control_2
```

## Step 6: Reporting

### Publication Table

```python
# Python: compare multiple specifications
from linearmodels.panel import compare

comparison = compare({
    "OLS": result_ols,
    "FE": result_fe,
    "FE + Time": result_fe_time,
    "RE": result_re
})
print(comparison.summary)
```

```stata
* Stata: publication-quality table
eststo clear
eststo: reg outcome treatment control_1 control_2, cluster(entity_id)
eststo: xtreg outcome treatment control_1 control_2, fe cluster(entity_id)
eststo: reghdfe outcome treatment control_1 control_2, absorb(entity_id year) cluster(entity_id)
eststo: xtreg outcome treatment control_1 control_2, re cluster(entity_id)

esttab, se star(* 0.10 ** 0.05 *** 0.01) ///
    title("Panel Regression Results") label ///
    mtitles("OLS" "FE" "Two-way FE" "RE") ///
    scalars("r2 R-squared" "N Observations")
```

## References

- Wooldridge, J. M. (2010). *Econometric Analysis of Cross Section and Panel Data* (2nd ed.). MIT Press.
- Cameron, A. C., & Trivedi, P. K. (2005). *Microeconometrics*. Cambridge University Press.
- [linearmodels Python Package](https://bashtage.github.io/linearmodels/)
- [reghdfe Stata Package](http://scorreia.com/software/reghdfe/)
