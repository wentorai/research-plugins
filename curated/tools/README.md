# Curated Research Productivity Tools

> Hand-picked tools for academic researchers covering diagrams, documents, code execution, scraping, knowledge graphs, and OCR/translation.

## Diagrams & Visualization

### Tools & Software
- **[Mermaid](https://mermaid.js.org/)** — Text-based diagramming tool that renders flowcharts, sequence diagrams, Gantt charts, and more from Markdown-like syntax.
- **[PlantUML](https://plantuml.com/)** — Open-source tool for creating UML diagrams from plain text; supports sequence, class, activity, and many other diagram types.
- **[draw.io (diagrams.net)](https://www.drawio.com/)** — Free, open-source diagramming tool with desktop and browser versions; exports to SVG, PNG, PDF.
- **[Excalidraw](https://excalidraw.com/)** — Virtual whiteboard with a hand-drawn aesthetic; great for informal research diagrams and brainstorming.
- **[Graphviz](https://graphviz.org/)** — Open-source graph visualization software; the DOT language is a standard for rendering directed and undirected graphs.
- **[TikZ/PGF (LaTeX)](https://tikz.dev/)** — Programmatic figure drawing in LaTeX; unmatched precision for publication-ready technical diagrams.

### Key References
- **[Mermaid Live Editor](https://mermaid.live/)** — Browser-based editor for writing and previewing Mermaid diagrams in real time.
- **[D2 Language](https://d2lang.com/)** — Modern declarative diagramming language; generates clean, readable diagrams from text.

## Document Processing

### PDF Tools
- **[GROBID](https://github.com/kermitt2/grobid)** — ML library for extracting structured metadata and full text from scholarly PDFs; powers many academic tools.
- **[PyMuPDF (fitz)](https://pymupdf.readthedocs.io/)** — Fast Python binding for MuPDF; extracts text, images, and annotations from PDFs.
- **[pdfplumber](https://github.com/jsvine/pdfplumber)** — Python library for extracting text, tables, and metadata from PDFs with precise positional data.
- **[Marker](https://github.com/VikParuchuri/marker)** — Converts PDF to Markdown with high accuracy; handles academic papers, books, and slides.
- **[Nougat (Meta)](https://github.com/facebookresearch/nougat)** — Neural OCR for academic PDFs; converts scanned papers to structured Markdown with math.

### Format Converters
- **[Pandoc](https://pandoc.org/)** — Universal document converter: Markdown, LaTeX, DOCX, HTML, EPUB, and 40+ other formats.
- **[Quarto](https://quarto.org/)** — Next-generation scientific publishing system; combines Jupyter, R Markdown, and Pandoc into one tool.
- **[nbconvert](https://nbconvert.readthedocs.io/)** — Convert Jupyter notebooks to HTML, PDF, LaTeX, Markdown, and slides.

## Code Execution & Notebooks

### Notebook Environments
- **[Jupyter](https://jupyter.org/)** — The standard interactive computing environment; supports Python, R, Julia, and 100+ kernels.
- **[Google Colab](https://colab.research.google.com/)** — Free cloud-hosted Jupyter notebooks with GPU/TPU access; zero setup required.
- **[Observable](https://observablehq.com/)** — Reactive JavaScript notebooks for data visualization and exploratory analysis.
- **[Deepnote](https://deepnote.com/)** — Collaborative data science notebook with real-time editing, SQL integration, and scheduling.

### Sandboxes & Reproducibility
- **[Binder (mybinder.org)](https://mybinder.org/)** — Turn any Git repo into a collection of interactive notebooks; one-click reproducible environments.
- **[Docker](https://www.docker.com/)** — Containerization platform for creating reproducible computational environments.
- **[Pixi](https://pixi.sh/)** — Fast, cross-platform package manager built on conda-forge; reproducible environments from a single lockfile.
- **[renv (R)](https://rstudio.github.io/renv/)** — Reproducible R environments; records and restores exact package versions per project.

## Web Scraping & APIs

### Scraping Tools
- **[Scrapy](https://scrapy.org/)** — Fast, high-level Python web crawling and scraping framework.
- **[Beautiful Soup](https://www.crummy.com/software/BeautifulSoup/)** — Python library for parsing HTML and XML; simple API for navigating and searching parse trees.
- **[Playwright](https://playwright.dev/)** — Browser automation library from Microsoft; handles JavaScript-rendered pages in Python, Node, and .NET.
- **[Selenium](https://www.selenium.dev/)** — Browser automation framework; the established tool for dynamic page scraping and testing.

### API Clients & Wrappers
- **[httpx](https://www.python-httpx.org/)** — Modern async-capable HTTP client for Python; successor to requests.
- **[Crossref API](https://api.crossref.org/)** — Free REST API for querying 140M+ scholarly metadata records.
- **[OpenAlex API](https://docs.openalex.org/)** — Fully open API for the global research graph; works, authors, institutions, topics.
- **[Unpaywall API](https://unpaywall.org/products/api)** — REST API to find open-access copies of papers by DOI.

## Knowledge Graph & RAG

### Knowledge Graph Tools
- **[Neo4j](https://neo4j.com/)** — Leading graph database; Cypher query language, free Community Edition.
- **[NetworkX](https://networkx.org/)** — Python package for creating, manipulating, and analyzing complex networks.
- **[Gephi](https://gephi.org/)** — Open-source network visualization and analysis platform; handles large graphs with interactive exploration.
- **[VOSviewer](https://www.vosviewer.com/)** — Free tool for constructing and visualizing bibliometric networks (co-citation, co-authorship, keyword co-occurrence).

### RAG Frameworks
- **[LlamaIndex](https://www.llamaindex.ai/)** — Data framework for building RAG applications; connects LLMs to external data sources.
- **[LangChain](https://www.langchain.com/)** — Framework for developing LLM-powered applications with retrieval, agents, and chains.
- **[ChromaDB](https://www.trychroma.com/)** — Open-source embedding database for building AI applications with semantic search.
- **[PaperQA2](https://github.com/Future-House/paper-qa)** — Purpose-built RAG for scientific literature; retrieves, reads, and cites full-text papers.

## OCR & Translation

### OCR Tools
- **[Tesseract OCR](https://github.com/tesseract-ocr/tesseract)** — Open-source OCR engine maintained by Google; supports 100+ languages.
- **[EasyOCR](https://github.com/JaidedAI/EasyOCR)** — Python OCR library with ready-to-use models for 80+ languages; simple API.
- **[PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR)** — High-accuracy multilingual OCR toolkit from Baidu; excels at CJK text and table recognition.
- **[Mathpix](https://mathpix.com/)** — AI-powered tool for converting handwritten or printed math equations to LaTeX; also handles tables and chemistry.

### Translation Services
- **[DeepL](https://www.deepl.com/)** — AI translator known for high-quality European and Asian language translations; API available.
- **[Google Cloud Translation](https://cloud.google.com/translate)** — Neural machine translation supporting 130+ languages; free tier available.
- **[Argos Translate](https://www.argosopentech.com/)** — Open-source offline translation library built on OpenNMT; fully self-hostable.
- **[GT4Sci (Google Translate for Science)](https://translate.google.com/)** — While not science-specific, Google Translate with domain glossary uploads handles technical text reasonably well.
