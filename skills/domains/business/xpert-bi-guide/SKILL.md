---
name: xpert-bi-guide
description: "AI business intelligence agent with NL-to-SQL and dashboards"
metadata:
  openclaw:
    emoji: "📊"
    category: "domains"
    subcategory: "business"
    keywords: ["business intelligence", "NL-to-SQL", "dashboard", "data analysis", "BI agent", "analytics"]
    source: "https://github.com/xpert-ai/xpert"
---

# Xpert BI Agent Guide

## Overview

Xpert is an AI-powered business intelligence agent that converts natural language questions into SQL queries, generates interactive dashboards, and provides data-driven insights. Connects to databases (PostgreSQL, MySQL, BigQuery) and produces visualizations with explanations. Useful for researchers analyzing institutional data and business analytics.

## Features

```markdown
### Core Capabilities
- **NL-to-SQL**: Convert questions to SQL queries
- **Auto-visualization**: Choose appropriate chart types
- **Dashboard generation**: Multi-chart interactive dashboards
- **Insight extraction**: Statistical findings from data
- **Report generation**: Narrative reports with charts

### Supported Databases
- PostgreSQL, MySQL, SQLite
- BigQuery, Snowflake, Redshift
- CSV/Excel files (auto-loaded to SQLite)
```

## Usage

```python
from xpert import XpertBI

bi = XpertBI(
    database_url="postgresql://user:pass@localhost/research_db",
    llm_provider="anthropic",
)

# Natural language query
result = bi.ask(
    "What is the publication trend by department over "
    "the last 5 years?"
)

print(result.sql)       # Generated SQL query
print(result.data)      # Query results as DataFrame
result.chart.save("pub_trend.png")  # Auto-generated chart
print(result.insight)   # "Publications increased 23% overall..."
```

## Dashboard Generation

```python
# Generate multi-chart dashboard
dashboard = bi.create_dashboard(
    title="Research Output Analysis",
    questions=[
        "Publications per year by department",
        "Top 10 authors by citation count",
        "Funding amount vs publication output correlation",
        "Journal distribution of publications",
    ],
)

dashboard.save("research_dashboard.html")
```

## Use Cases

1. **Research analytics**: Analyze publication and citation data
2. **Institutional reporting**: Department-level research metrics
3. **Grant analysis**: Funding patterns and outcomes
4. **Data exploration**: Quick BI on research databases
5. **Teaching**: Demonstrate data analysis concepts

## References

- [Xpert GitHub](https://github.com/xpert-ai/xpert)
