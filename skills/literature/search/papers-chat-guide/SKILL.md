---
name: papers-chat-guide
description: "Conversational interface for querying and discussing papers"
metadata:
  openclaw:
    emoji: "💬"
    category: "literature"
    subcategory: "search"
    keywords: ["paper chat", "conversational search", "paper QA", "document QA", "RAG papers", "literature chat"]
    source: "https://github.com/paperswithcode/galai"
---

# Papers Chat Guide

## Overview

Papers Chat systems provide conversational interfaces for querying, discussing, and understanding academic papers. Instead of keyword searches, researchers ask natural language questions and get answers grounded in specific papers with citations. This guide covers building and using RAG-based paper chat systems — from local document Q&A to multi-paper discussion interfaces. Useful for literature comprehension, paper comparison, and research exploration.

## Architecture

```
User Question
      ↓
  Query Understanding (expand, decompose)
      ↓
  Retrieval (vector search over paper chunks)
      ↓
  Re-ranking (cross-encoder relevance scoring)
      ↓
  Answer Generation (grounded in retrieved passages)
      ↓
  Response + Citations + Follow-up Suggestions
```

## Local Paper Chat

```python
from papers_chat import PaperChat

chat = PaperChat(
    llm_provider="anthropic",
    embedding_model="all-MiniLM-L6-v2",
)

# Index papers
chat.add_papers([
    "papers/attention_is_all_you_need.pdf",
    "papers/bert.pdf",
    "papers/gpt3.pdf",
])

# Ask questions
response = chat.ask(
    "How does the attention mechanism in Transformers differ "
    "from the attention used in earlier seq2seq models?"
)

print(response.answer)
for cite in response.citations:
    print(f"  [{cite.paper}] p.{cite.page}: {cite.excerpt[:80]}...")
```

## Multi-Paper Discussion

```python
# Compare across papers
response = chat.ask(
    "Compare the pre-training objectives of BERT and GPT-3. "
    "What are the trade-offs?"
)

# Follow-up in conversation
response = chat.follow_up(
    "Which approach works better for few-shot learning?"
)

# Paper-specific questions
response = chat.ask(
    "What is the computational complexity of multi-head attention?",
    scope=["attention_is_all_you_need.pdf"],
)
```

## Building a Paper Index

```python
from papers_chat import PaperIndex

index = PaperIndex(
    embedding_model="all-MiniLM-L6-v2",
    chunk_size=512,
    chunk_overlap=64,
    storage_path="./paper_index",
)

# Add individual paper
index.add_paper(
    path="paper.pdf",
    metadata={
        "title": "Attention Is All You Need",
        "authors": ["Vaswani et al."],
        "year": 2017,
        "venue": "NeurIPS",
    },
)

# Add directory of papers
index.add_directory(
    "papers/",
    extract_metadata=True,  # Auto-extract from PDF
)

# Search
results = index.search("positional encoding", top_k=5)
for r in results:
    print(f"[{r.paper_title}] (score: {r.score:.3f})")
    print(f"  {r.text[:120]}...")
```

## RAG Pipeline Configuration

```python
from papers_chat import RAGConfig

chat = PaperChat(
    llm_provider="anthropic",
    rag_config=RAGConfig(
        # Retrieval
        retrieval_top_k=20,
        rerank_top_k=5,
        reranker="cross-encoder/ms-marco-MiniLM-L-6-v2",

        # Chunking
        chunk_size=512,
        chunk_overlap=64,
        chunk_by="paragraph",   # paragraph, sentence, fixed

        # Generation
        citation_style="inline",  # inline, footnote, endnote
        max_answer_length=500,
        include_quotes=True,
    ),
)
```

## Batch Question Answering

```python
# Process a list of research questions
questions = [
    "What datasets are used for evaluating language models?",
    "How is perplexity calculated and what are its limitations?",
    "What are the main approaches to reducing model size?",
]

results = chat.batch_ask(questions)

for q, r in zip(questions, results):
    print(f"Q: {q}")
    print(f"A: {r.answer[:200]}...")
    print(f"Sources: {[c.paper for c in r.citations]}")
    print()
```

## Table and Figure Extraction

```python
# Query specific paper elements
response = chat.ask(
    "What are the BLEU scores reported in Table 2?",
    scope=["attention_is_all_you_need.pdf"],
    include_tables=True,
)

# Extract all tables from a paper
tables = chat.extract_tables("paper.pdf")
for table in tables:
    print(f"Table {table.number}: {table.caption}")
    print(table.to_dataframe())
```

## Use Cases

1. **Literature comprehension**: Ask clarifying questions about papers
2. **Paper comparison**: Cross-paper analysis and synthesis
3. **Research exploration**: Discover connections across literature
4. **Study groups**: Collaborative paper discussion
5. **Quick reference**: Find specific results, methods, or citations

## References

- [Galactica](https://github.com/paperswithcode/galai) — Language model for science
- [LangChain RAG](https://python.langchain.com/docs/use_cases/question_answering/)
- [LlamaIndex](https://www.llamaindex.ai/) — Data framework for LLM applications
