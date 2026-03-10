---
name: weknora-guide
description: "Tencent document understanding engine with RAG capabilities"
metadata:
  openclaw:
    emoji: "📑"
    category: "tools"
    subcategory: "document"
    keywords: ["WeKnora", "document understanding", "RAG", "text mining", "Tencent", "knowledge extraction"]
    source: "https://github.com/Tencent/WeKnora"
---

# WeKnora Guide

## Overview

WeKnora is Tencent's open-source document understanding and retrieval-augmented generation engine. It processes complex documents (PDF, DOCX, HTML) into structured knowledge, supporting layout analysis, table extraction, formula recognition, and multi-modal content parsing. Integrates with RAG pipelines for question answering over document collections. Suited for academic paper processing, report analysis, and enterprise document intelligence.

## Installation

```bash
# Install WeKnora
pip install weknora

# With GPU support
pip install weknora[gpu]

# With all optional dependencies
pip install weknora[all]
```

## Document Parsing

```python
from weknora import DocumentParser

parser = DocumentParser()

# Parse a PDF document
doc = parser.parse("research_paper.pdf")

print(f"Pages: {doc.num_pages}")
print(f"Sections: {len(doc.sections)}")
print(f"Tables: {len(doc.tables)}")
print(f"Figures: {len(doc.figures)}")
print(f"Equations: {len(doc.equations)}")

# Access structured content
for section in doc.sections:
    print(f"\n## {section.title}")
    print(f"   {section.text[:200]}...")
    if section.tables:
        print(f"   Tables: {len(section.tables)}")
```

## Layout Analysis

```python
from weknora import LayoutAnalyzer

analyzer = LayoutAnalyzer(model="layoutlmv3")

# Detect document layout elements
layout = analyzer.analyze("paper.pdf")

for page in layout.pages:
    print(f"\nPage {page.number}:")
    for element in page.elements:
        print(f"  [{element.type}] ({element.bbox}) "
              f"{element.text[:50]}...")
    # Element types: title, text, table, figure,
    #   equation, header, footer, caption, list
```

## Table Extraction

```python
from weknora import TableExtractor

extractor = TableExtractor()

# Extract tables from document
tables = extractor.extract("paper.pdf")

for i, table in enumerate(tables):
    print(f"\nTable {i+1}: {table.caption}")
    df = table.to_dataframe()
    print(df.head())

    # Export
    df.to_csv(f"table_{i+1}.csv")

# Extract specific table by page
table = extractor.extract_from_page("paper.pdf", page=5, index=0)
```

## Formula Recognition

```python
from weknora import FormulaRecognizer

recognizer = FormulaRecognizer()

# Extract formulas from document
formulas = recognizer.extract("paper.pdf")

for formula in formulas:
    print(f"Page {formula.page}: {formula.latex}")
    # Output: "\\mathcal{L} = -\\sum_{i} y_i \\log(\\hat{y}_i)"
    print(f"  Type: {formula.type}")  # inline or display
```

## RAG Pipeline

```python
from weknora import RAGPipeline

# Build RAG over document collection
rag = RAGPipeline(
    embedding_model="bge-large-zh-v1.5",
    chunk_size=512,
    chunk_overlap=64,
)

# Index documents
rag.add_documents([
    "papers/transformer.pdf",
    "papers/bert.pdf",
    "papers/gpt3.pdf",
])

# Query
result = rag.query(
    "What is the computational complexity of self-attention?"
)
print(result.answer)
for source in result.sources:
    print(f"  [{source.document}] p.{source.page}: "
          f"{source.text[:80]}...")
```

## Multi-Modal Processing

```python
from weknora import MultiModalParser

parser = MultiModalParser()

# Process document with figures and tables
doc = parser.parse("paper.pdf", extract_all=True)

# Access figure descriptions
for fig in doc.figures:
    print(f"Figure {fig.number}: {fig.caption}")
    fig.save_image(f"figures/fig_{fig.number}.png")

# Cross-reference tables and text
for ref in doc.cross_references:
    print(f"'{ref.text}' → {ref.target_type} {ref.target_id}")
```

## Batch Processing

```python
from weknora import BatchProcessor

processor = BatchProcessor(
    workers=4,
    output_dir="./parsed_docs",
)

# Process directory of documents
results = processor.process_directory(
    "papers/",
    formats=["pdf", "docx"],
    output_format="json",  # or "markdown"
)

print(f"Processed: {results.success}/{results.total}")
print(f"Failed: {results.failures}")
```

## Configuration

```python
from weknora import Config

config = Config(
    parser={
        "layout_model": "layoutlmv3",
        "ocr_engine": "paddleocr",
        "formula_engine": "latex_ocr",
        "language": "en",  # or "zh", "multi"
    },
    rag={
        "embedding_model": "bge-large-zh-v1.5",
        "reranker": "bge-reranker-large",
        "chunk_strategy": "semantic",
        "vector_store": "faiss",
    },
)
```

## Use Cases

1. **Paper parsing**: Extract structured content from academic PDFs
2. **Table digitization**: Convert paper tables to spreadsheets
3. **Document QA**: RAG-based question answering over papers
4. **Knowledge extraction**: Build knowledge bases from documents
5. **Report analysis**: Process and compare technical reports

## References

- [WeKnora GitHub](https://github.com/Tencent/WeKnora)
- [LayoutLMv3](https://arxiv.org/abs/2204.08387)
- [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR)
