---
name: mermaid-diagrams-guide
description: "Create flowcharts, sequences, and diagrams with Mermaid.js syntax"
metadata:
  openclaw:
    emoji: "art"
    category: "tools"
    subcategory: "diagram"
    keywords: ["Mermaid.js", "diagrams", "flowcharts", "sequence diagrams", "Gantt charts", "markdown diagrams"]
    source: "wentor-research-plugins"
---

# Mermaid Diagrams Guide

A skill for creating diagrams using Mermaid.js syntax, which renders directly in Markdown on GitHub, GitLab, Notion, Obsidian, and many documentation tools. Covers flowcharts, sequence diagrams, class diagrams, Gantt charts, and entity-relationship diagrams for research documentation.

## Flowcharts

### Basic Flowchart Syntax

```mermaid
graph TD
    A[Start: Research Question] --> B{Literature Review}
    B -->|Gap Found| C[Formulate Hypothesis]
    B -->|Well Covered| D[Refine Question]
    D --> B
    C --> E[Design Study]
    E --> F[Collect Data]
    F --> G[Analyze Data]
    G --> H{Results Support Hypothesis?}
    H -->|Yes| I[Write Paper]
    H -->|No| J[Revise Hypothesis]
    J --> E
    I --> K[Submit to Journal]
```

### Node Shapes

```
graph LR
    A[Rectangle]       -- Default shape
    B(Rounded)         -- Rounded rectangle
    C([Stadium])       -- Stadium shape
    D[[Subroutine]]    -- Subroutine
    E[(Database)]      -- Cylinder
    F((Circle))        -- Circle
    G{Diamond}         -- Decision
    H>Asymmetric]      -- Flag shape
    I{{Hexagon}}       -- Hexagon
```

### Direction Options

```
graph TD   -- Top to Down (default)
graph LR   -- Left to Right
graph BT   -- Bottom to Top
graph RL   -- Right to Left
```

## Sequence Diagrams

### Research Workflow Communication

```mermaid
sequenceDiagram
    participant R as Researcher
    participant DB as Database
    participant API as Analysis API
    participant J as Journal

    R->>DB: Query literature (search terms)
    DB-->>R: Return 500 results
    R->>R: Screen and select 45 papers
    R->>API: Submit dataset for analysis
    API-->>R: Return statistical results
    R->>R: Interpret findings
    R->>J: Submit manuscript
    J-->>R: Reviewer comments
    R->>R: Revise manuscript
    R->>J: Resubmit
    J-->>R: Accepted
```

### Arrow Types

```
->>    Solid line with arrowhead
-->>   Dashed line with arrowhead
-x     Solid line with cross (lost message)
--x    Dashed line with cross
-)     Solid line with open arrow (async)
--)    Dashed line with open arrow (async)
```

## Class Diagrams

### Object Model for Research Data

```mermaid
classDiagram
    class Paper {
        +String title
        +String doi
        +Date published
        +List~Author~ authors
        +getCitations() int
    }
    class Author {
        +String name
        +String orcid
        +String affiliation
        +getHIndex() int
    }
    class Dataset {
        +String name
        +String format
        +int sizeBytes
        +validate() bool
    }
    Paper "1" --> "*" Author : written by
    Paper "1" --> "0..*" Dataset : uses
    Paper "1" --> "*" Paper : cites
```

## Gantt Charts

### Research Project Timeline

```mermaid
gantt
    title PhD Research Timeline
    dateFormat  YYYY-MM-DD
    section Literature Review
    Initial review           :done, lit1, 2026-01-01, 2026-03-01
    Systematic search        :done, lit2, 2026-02-15, 2026-04-01
    section Data Collection
    IRB approval             :active, irb, 2026-03-01, 2026-04-15
    Pilot study              :pilot, after irb, 30d
    Main data collection     :data, after pilot, 90d
    section Analysis
    Data cleaning            :clean, after data, 30d
    Statistical analysis     :analysis, after clean, 45d
    section Writing
    Draft chapters           :draft, after analysis, 60d
    Revision                 :revise, after draft, 30d
    Defense                  :milestone, defense, after revise, 1d
```

## Entity-Relationship Diagrams

### Database Schema for Research

```mermaid
erDiagram
    RESEARCHER ||--o{ PAPER : authors
    PAPER ||--|{ CITATION : has
    PAPER }o--o{ KEYWORD : tagged_with
    PAPER ||--o{ DATASET : produces
    RESEARCHER {
        string orcid PK
        string name
        string institution
    }
    PAPER {
        string doi PK
        string title
        date published
        string journal
    }
```

## Practical Tips

### Embedding in Documentation

```markdown
To render Mermaid in Markdown files:

GitHub:    Supported natively in .md files (use ```mermaid code blocks)
GitLab:    Supported natively
Obsidian:  Supported natively
Notion:    Use /mermaid block
Jupyter:   Use mermaid-js or nb_mermaid extension
LaTeX:     Export as SVG/PDF, include with \includegraphics

For platforms that do not support Mermaid natively:
  - Mermaid CLI (mmdc): Renders to SVG/PNG/PDF from command line
  - Mermaid Live Editor (mermaid.live): Browser-based editor and export
```

### Styling and Themes

```mermaid
%%{init: {'theme': 'neutral', 'themeVariables': {'primaryColor': '#3B82F6'}}}%%
graph LR
    A[Input] --> B[Process] --> C[Output]
```

Available themes: `default`, `neutral`, `dark`, `forest`, `base`.

### Common Pitfalls

```
1. Special characters in node labels need quotes:
   BAD:  A[R^2 = 0.95]
   GOOD: A["R^2 = 0.95"]

2. Avoid very long labels (wrap text manually):
   A["This is a very long label<br/>that wraps across lines"]

3. Subgraphs for grouping:
   subgraph "Data Collection Phase"
     A --> B --> C
   end
```

Mermaid is particularly useful for research because diagrams live alongside your code and documentation in version control, making them easy to update as your project evolves.
