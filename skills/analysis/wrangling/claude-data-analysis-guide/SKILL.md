---
name: claude-data-analysis-guide
description: "Claude Code-based conversational data analysis agent"
metadata:
  openclaw:
    emoji: "🔬"
    category: "analysis"
    subcategory: "wrangling"
    keywords: ["Claude Code", "data analysis", "conversational", "pandas", "visualization", "interactive"]
    source: "https://github.com/liangdabiao/claude-data-analysis"
---

# Claude Data Analysis Guide

## Overview

A Claude Code-based data analysis agent that provides conversational data exploration and analysis. Upload datasets and ask questions in natural language — the agent writes and executes Python code for data cleaning, statistical analysis, visualization, and reporting. Leverages Claude Code's ability to read files, run code, and iterate on results.

## Setup

```markdown
### CLAUDE.md Configuration
# Data Analysis Project

## Instructions
- Analyze data files in the data/ directory
- Use pandas, numpy, scipy, matplotlib, seaborn
- Always show data shape and dtypes first
- Include statistical tests where appropriate
- Generate publication-quality figures (300 DPI)
- Save outputs to output/ directory

## Conventions
- Use seaborn for statistical plots
- Report confidence intervals, not just p-values
- Handle missing data explicitly (report, then impute)
- Set random_state=42 for reproducibility
```

## Workflow

```markdown
### Interactive Analysis Loop
1. "Load the experiment data from data/results.csv"
   → Agent reads file, shows shape, dtypes, head()

2. "How many missing values are there?"
   → Agent runs df.isnull().sum(), reports per column

3. "Show the distribution of response time by condition"
   → Agent creates violin plots, reports summary stats

4. "Is there a significant difference between groups?"
   → Agent runs appropriate test (t-test, ANOVA, etc.)

5. "Build a regression model predicting response time"
   → Agent fits model, reports coefficients, R², diagnostics

6. "Create a summary report with all findings"
   → Agent generates markdown report with embedded figures
```

## Common Analysis Patterns

```python
# Data profiling
import pandas as pd
df = pd.read_csv("data/experiment.csv")
print(f"Shape: {df.shape}")
print(f"\nDtypes:\n{df.dtypes}")
print(f"\nMissing:\n{df.isnull().sum()}")
print(f"\nDescribe:\n{df.describe()}")

# Statistical comparison
from scipy import stats
group_a = df[df["condition"] == "A"]["score"]
group_b = df[df["condition"] == "B"]["score"]
t_stat, p_value = stats.ttest_ind(group_a, group_b)
print(f"t={t_stat:.3f}, p={p_value:.4f}")

# Visualization
import seaborn as sns
import matplotlib.pyplot as plt
fig, ax = plt.subplots(figsize=(8, 5))
sns.violinplot(data=df, x="condition", y="score", ax=ax)
plt.savefig("output/comparison.png", dpi=300, bbox_inches="tight")
```

## Use Cases

1. **Experiment analysis**: Interactive analysis of lab data
2. **EDA**: Rapid exploration of unfamiliar datasets
3. **Statistical testing**: Guided hypothesis testing
4. **Report generation**: Analysis reports with figures
5. **Learning**: Interactive data science exploration

## References

- [claude-data-analysis GitHub](https://github.com/liangdabiao/claude-data-analysis)
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
