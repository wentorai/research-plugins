---
name: open-data-scientist-guide
description: "AI agent that performs end-to-end data science workflows"
metadata:
  openclaw:
    emoji: "📊"
    category: "analysis"
    subcategory: "wrangling"
    keywords: ["data science", "automated analysis", "EDA", "feature engineering", "data wrangling", "AI agent"]
    source: "https://github.com/Open-Data-Scientist/open-data-scientist"
---

# Open Data Scientist Guide

## Overview

Open Data Scientist is an AI agent that automates end-to-end data science workflows — from data loading and cleaning through exploratory analysis, feature engineering, modeling, and report generation. It interprets natural language task descriptions, generates and executes Python code, iteratively refines analyses based on results, and produces publication-ready outputs. Designed for researchers who need quick, thorough data analyses without deep programming expertise.

## Workflow Pipeline

```
Dataset + Task Description
         ↓
   Data Profiling (types, distributions, missing values)
         ↓
   Cleaning & Preprocessing (imputation, encoding, scaling)
         ↓
   Exploratory Data Analysis (correlations, distributions, outliers)
         ↓
   Feature Engineering (transforms, interactions, selection)
         ↓
   Modeling (train, evaluate, compare)
         ↓
   Report Generation (figures, tables, interpretation)
```

## Usage

```python
from open_data_scientist import DataScientist

ds = DataScientist(llm_provider="anthropic")

# Natural language task
result = ds.analyze(
    data="experiment_results.csv",
    task="Identify which experimental conditions significantly affect "
         "the response variable. Build a predictive model and report "
         "the most important features.",
)

# Outputs
print(result.summary)           # Text summary of findings
result.save_report("report.html")  # Full HTML report
result.save_figures("figures/")     # All generated plots
```

## Data Profiling

```python
# Automatic data profiling before analysis
profile = ds.profile("dataset.csv")

print(f"Rows: {profile.n_rows}, Columns: {profile.n_cols}")
print(f"Missing values: {profile.missing_summary}")
print(f"Data types: {profile.dtype_summary}")
print(f"Potential issues: {profile.warnings}")

# Column-level details
for col in profile.columns:
    print(f"\n{col.name} ({col.dtype}):")
    print(f"  Unique: {col.n_unique}")
    print(f"  Missing: {col.n_missing} ({col.pct_missing:.1f}%)")
    if col.is_numeric:
        print(f"  Range: [{col.min}, {col.max}]")
        print(f"  Mean: {col.mean:.3f}, Std: {col.std:.3f}")
```

## Exploratory Data Analysis

```python
# Guided EDA
eda_result = ds.explore(
    data="dataset.csv",
    focus="relationships",  # or "distributions", "outliers", "time_trends"
    target_column="outcome",
)

# Generated analyses include:
# - Correlation heatmap
# - Pairwise scatter plots for top correlations
# - Distribution plots per group
# - Statistical tests (t-test, ANOVA, chi-square)
# - Outlier detection (IQR, Z-score)

for finding in eda_result.findings:
    print(f"- {finding.description} (p={finding.p_value:.4f})")
```

## Feature Engineering

```python
# Automatic feature engineering
features = ds.engineer_features(
    data="dataset.csv",
    target="outcome",
    strategies=[
        "polynomial_interactions",  # x1*x2, x1^2
        "datetime_extraction",      # year, month, day_of_week
        "text_embeddings",          # TF-IDF or sentence embeddings
        "binning",                  # numeric to categorical
        "target_encoding",          # category to target mean
    ],
    selection_method="mutual_information",
    max_features=50,
)

print(f"Original features: {features.n_original}")
print(f"Generated features: {features.n_generated}")
print(f"Selected features: {features.n_selected}")
```

## Modeling Pipeline

```python
result = ds.model(
    data="dataset.csv",
    target="outcome",
    task_type="classification",  # or "regression"
    models=["logistic_regression", "random_forest",
            "gradient_boosting", "neural_network"],
    cv_folds=5,
    metric="f1_macro",
)

# Model comparison table
print(result.comparison_table)
# | Model              | F1 Macro | Accuracy | AUC   |
# |--------------------|----------|----------|-------|
# | Gradient Boosting  | 0.847    | 0.862    | 0.921 |
# | Random Forest      | 0.831    | 0.849    | 0.908 |
# | ...                |          |          |       |

# Best model details
best = result.best_model
print(f"Best: {best.name}")
print(f"Feature importance:\n{best.feature_importance.head(10)}")
```

## Report Generation

```python
# Generate publication-ready report
result = ds.analyze(
    data="experiment_results.csv",
    task="Full analysis with statistical tests",
    report_config={
        "format": "html",       # html, pdf, markdown
        "style": "academic",    # academic, business, minimal
        "include_code": True,   # Show generated code
        "figure_dpi": 300,      # Publication quality
    },
)

result.save_report("analysis_report.html")
```

## Configuration

```python
ds = DataScientist(
    llm_provider="anthropic",
    model="claude-sonnet-4-20250514",
    execution_config={
        "timeout": 300,             # Max seconds per code block
        "max_iterations": 10,       # Refinement iterations
        "sandbox": True,            # Isolated execution
    },
    analysis_config={
        "significance_level": 0.05,
        "random_state": 42,
        "test_size": 0.2,
    },
)
```

## Use Cases

1. **Experiment analysis**: Analyze lab or survey data with statistical tests
2. **Dataset exploration**: Quick EDA on unfamiliar datasets
3. **Baseline modeling**: Rapid prototyping of predictive models
4. **Report generation**: Automated analysis reports for publications

## References

- [Open Data Scientist GitHub](https://github.com/Open-Data-Scientist/open-data-scientist)
- [Pandas Profiling](https://github.com/ydataai/ydata-profiling)
