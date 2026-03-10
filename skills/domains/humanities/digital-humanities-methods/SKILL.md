---
name: digital-humanities-methods
description: "Computational methods for humanities research with text and network analysis"
metadata:
  openclaw:
    emoji: "📜"
    category: "domains"
    subcategory: "humanities"
    keywords: ["digital humanities", "text analysis", "corpus linguistics", "network analysis", "cultural analytics", "computational methods"]
    source: "https://clawhub.ai/digital-humanities"
---

# Digital Humanities Methods

## Overview

Digital Humanities (DH) applies computational methods to humanistic inquiry — analyzing literary texts, historical records, cultural artifacts, and social networks at scale. This guide covers the core computational methods used in DH research: text analysis, topic modeling, network analysis, spatial analysis, and corpus linguistics. These methods complement rather than replace traditional close reading and archival research.

## Text Analysis

### Preprocessing Pipeline

```python
import re
from collections import Counter

def preprocess_text(text: str, language: str = "en") -> list:
    """Standard preprocessing for humanities text analysis."""
    # Lowercase
    text = text.lower()

    # Remove metadata markers (page numbers, headers)
    text = re.sub(r'\[page \d+\]', '', text)
    text = re.sub(r'\n{3,}', '\n\n', text)

    # Tokenize (simple whitespace + punctuation split)
    tokens = re.findall(r'\b[a-z]+\b', text)

    # Remove stopwords (customize per corpus!)
    # Standard lists often remove words meaningful in literary analysis
    # e.g., "not", "but", "never" carry sentiment — keep them if relevant
    stopwords = {"the", "a", "an", "is", "are", "was", "were", "in",
                 "on", "at", "to", "for", "of", "with", "and", "or"}
    tokens = [t for t in tokens if t not in stopwords and len(t) > 2]

    return tokens

# Word frequency analysis
def word_frequencies(tokens: list, top_n: int = 50) -> list:
    return Counter(tokens).most_common(top_n)
```

### Stylometry (Authorship Analysis)

```python
"""Stylometric features for authorship attribution."""

def extract_style_features(text: str) -> dict:
    """Extract stylistic features from a text."""
    sentences = text.split('.')
    words = text.split()
    chars = list(text)

    return {
        "avg_sentence_length": len(words) / max(len(sentences), 1),
        "avg_word_length": sum(len(w) for w in words) / max(len(words), 1),
        "vocabulary_richness": len(set(words)) / max(len(words), 1),
        "hapax_ratio": sum(1 for w, c in Counter(words).items() if c == 1) / max(len(set(words)), 1),
        "comma_rate": text.count(',') / max(len(words), 1),
        "semicolon_rate": text.count(';') / max(len(words), 1),
        "question_rate": text.count('?') / max(len(sentences), 1),
        "exclamation_rate": text.count('!') / max(len(sentences), 1),
    }
```

### Sentiment Analysis for Historical Texts

```python
# Note: Modern NLP sentiment tools are trained on contemporary text.
# For historical texts, consider:
# 1. Historical sentiment lexicons (e.g., NRC Emotion Lexicon adapted)
# 2. Period-specific word lists
# 3. Manual validation on a sample before scaling

from transformers import pipeline

# Modern text sentiment (use with caution on historical texts)
sentiment = pipeline("sentiment-analysis")
result = sentiment("It was the best of times, it was the worst of times.")

# Better: keyword-based approach with custom lexicons
POSITIVE = {"virtue", "honor", "glory", "triumph", "beauty", "noble"}
NEGATIVE = {"vice", "shame", "defeat", "ruin", "wretched", "base"}

def lexicon_sentiment(tokens: list, pos: set, neg: set) -> float:
    """Simple lexicon-based sentiment score."""
    pos_count = sum(1 for t in tokens if t in pos)
    neg_count = sum(1 for t in tokens if t in neg)
    total = pos_count + neg_count
    if total == 0:
        return 0.0
    return (pos_count - neg_count) / total
```

## Topic Modeling

```python
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation

def run_topic_model(documents: list, n_topics: int = 10,
                     n_top_words: int = 15):
    """LDA topic modeling on a corpus of documents."""
    # Vectorize
    vectorizer = CountVectorizer(max_df=0.95, min_df=2,
                                  max_features=5000,
                                  stop_words="english")
    dtm = vectorizer.fit_transform(documents)
    feature_names = vectorizer.get_feature_names_out()

    # Fit LDA
    lda = LatentDirichletAllocation(n_components=n_topics,
                                     random_state=42,
                                     max_iter=50)
    lda.fit(dtm)

    # Display topics
    topics = {}
    for topic_idx, topic in enumerate(lda.components_):
        top_words = [feature_names[i] for i in topic.argsort()[-n_top_words:]]
        topics[f"Topic {topic_idx}"] = top_words
        print(f"Topic {topic_idx}: {', '.join(top_words)}")

    return lda, topics, dtm
```

## Network Analysis

### Social Network from Letters/Correspondence

```python
import networkx as nx

def build_correspondence_network(letters: list) -> nx.Graph:
    """Build a social network from letter metadata.

    Args:
        letters: list of dicts with 'sender', 'recipient', 'date', 'location'
    """
    G = nx.Graph()

    for letter in letters:
        sender = letter["sender"]
        recipient = letter["recipient"]

        if G.has_edge(sender, recipient):
            G[sender][recipient]["weight"] += 1
        else:
            G.add_edge(sender, recipient, weight=1)

    # Compute centrality measures
    centrality = nx.degree_centrality(G)
    betweenness = nx.betweenness_centrality(G)

    print(f"Network: {G.number_of_nodes()} individuals, "
          f"{G.number_of_edges()} connections")
    print(f"Most connected: {max(centrality, key=centrality.get)}")
    print(f"Most bridging: {max(betweenness, key=betweenness.get)}")

    return G
```

## Spatial Analysis (GIS for Humanities)

Common applications:
- Mapping historical events or migration patterns
- Georeferencing historical maps
- Spatial analysis of literary settings

```python
import folium

def create_historical_map(events: list, title: str = "Historical Events"):
    """Create an interactive map of historical events.

    Args:
        events: list of dicts with 'name', 'lat', 'lon', 'date', 'description'
    """
    center_lat = sum(e["lat"] for e in events) / len(events)
    center_lon = sum(e["lon"] for e in events) / len(events)

    m = folium.Map(location=[center_lat, center_lon], zoom_start=5)

    for event in events:
        popup = f"<b>{event['name']}</b><br>{event['date']}<br>{event['description']}"
        folium.Marker(
            location=[event["lat"], event["lon"]],
            popup=popup,
            tooltip=event["name"]
        ).add_to(m)

    m.save(f"{title.replace(' ', '_').lower()}.html")
    return m
```

## Key Data Sources for DH

| Source | Content | Access |
|--------|---------|--------|
| **Project Gutenberg** | 70,000+ free ebooks | gutenberg.org |
| **HathiTrust** | 17M+ digitized volumes | hathitrust.org |
| **Internet Archive** | Books, media, web archives | archive.org |
| **EEBO / ECCO** | Early English books (1475-1800) | Institutional |
| **Perseus Digital Library** | Greek and Latin classics | perseus.tufts.edu |
| **Europeana** | European cultural heritage | europeana.eu |
| **DPLA** | US digital public library | dp.la |
| **Old Bailey Online** | London criminal trials (1674-1913) | oldbaileyonline.org |

## Methodological Considerations

1. **Close reading still matters**: Computational methods reveal patterns; interpretation requires humanistic expertise
2. **Corpus bias**: Digitized collections over-represent certain periods, languages, and genres
3. **OCR quality**: Historical texts often have high OCR error rates — validate before analysis
4. **Anachronism**: Modern NLP tools may misinterpret historical language use
5. **Interdisciplinary collaboration**: Best DH work pairs domain expertise with technical skills

## References

- Moretti, F. (2013). *Distant Reading*. Verso.
- Jockers, M. L. (2013). *Macroanalysis: Digital Methods and Literary History*. University of Illinois Press.
- [Programming Historian](https://programminghistorian.org/) — Free tutorials for DH methods
- [DH Tools Directory](https://dirtdirectory.org/)
