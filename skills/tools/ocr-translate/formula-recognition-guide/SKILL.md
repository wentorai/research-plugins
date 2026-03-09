---
name: formula-recognition-guide
description: "Math OCR and formula recognition to LaTeX conversion"
metadata:
  openclaw:
    emoji: "math"
    category: "tools"
    subcategory: "ocr-translate"
    keywords: ["math OCR", "formula recognition", "LaTeX OCR"]
    source: "wentor-research-plugins"
---

# Formula Recognition Guide

Convert mathematical formulas from images, PDFs, and handwritten notes to LaTeX code using OCR tools, neural models, and API services.

## Tool Comparison

| Tool | Input | Output | Accuracy | Speed | Cost |
|------|-------|--------|----------|-------|------|
| Mathpix | Image, PDF, screenshot | LaTeX, MathML | Excellent | Fast | Free tier (50/month), then paid |
| LaTeX-OCR (Lukas Blecher) | Image | LaTeX | Very good | Medium | Free (open source) |
| Pix2Text (p2t) | Image | LaTeX + text | Good | Medium | Free (open source) |
| Nougat (Meta) | PDF pages | Markdown + LaTeX | Excellent (full page) | Slow (GPU) | Free (open source) |
| InftyReader | Image, PDF | LaTeX, MathML | Good | Medium | Commercial |
| Google Cloud Vision | Image | Text (limited math) | Poor for math | Fast | Pay per use |
| img2latex (Harvard) | Image | LaTeX | Good | Medium | Free (open source) |

## Mathpix API

Mathpix is the industry-standard math OCR service, handling printed and handwritten formulas, tables, and full documents.

### Setup

```bash
pip install mathpix
# Or use the REST API directly
```

### Single Image to LaTeX

```python
import requests
import base64
import json

def mathpix_ocr(image_path, app_id, app_key):
    """Convert an image of a formula to LaTeX using Mathpix API."""
    with open(image_path, "rb") as f:
        image_data = base64.b64encode(f.read()).decode()

    response = requests.post(
        "https://api.mathpix.com/v3/text",
        headers={
            "app_id": app_id,
            "app_key": app_key,
            "Content-Type": "application/json"
        },
        json={
            "src": f"data:image/png;base64,{image_data}",
            "formats": ["latex_styled", "latex_normal", "mathml"],
            "data_options": {
                "include_asciimath": True,
                "include_latex": True
            }
        }
    )

    result = response.json()
    return {
        "latex": result.get("latex_styled", ""),
        "latex_normal": result.get("latex_normal", ""),
        "confidence": result.get("confidence", 0),
        "mathml": result.get("mathml", "")
    }

# Usage
result = mathpix_ocr("equation.png", "YOUR_APP_ID", "YOUR_APP_KEY")
print(f"LaTeX: {result['latex']}")
print(f"Confidence: {result['confidence']:.2%}")
```

### Process a Full PDF Page

```python
def mathpix_pdf_page(image_path, app_id, app_key):
    """Process a full PDF page with mixed text and math."""
    with open(image_path, "rb") as f:
        image_data = base64.b64encode(f.read()).decode()

    response = requests.post(
        "https://api.mathpix.com/v3/text",
        headers={
            "app_id": app_id,
            "app_key": app_key,
            "Content-Type": "application/json"
        },
        json={
            "src": f"data:image/png;base64,{image_data}",
            "formats": ["text", "latex_styled"],
            "ocr": ["math", "text"],
            "math_inline_delimiters": ["$", "$"],
            "math_display_delimiters": ["$$", "$$"]
        }
    )

    result = response.json()
    return result.get("text", "")

# Returns Markdown with inline $...$ and display $$...$$ math
```

## LaTeX-OCR (Open Source, Local)

LaTeX-OCR by Lukas Blecher is a free, locally-running model for converting formula images to LaTeX.

### Installation and Usage

```bash
pip install "pix2tex[gui]"
```

```python
from pix2tex.cli import LatexOCR

# Initialize model (downloads on first use, ~1GB)
model = LatexOCR()

# From file
from PIL import Image

img = Image.open("equation.png")
latex = model(img)
print(f"LaTeX: {latex}")
# Output: \frac{\partial \mathcal{L}}{\partial \theta} = -\frac{1}{N} \sum_{i=1}^{N} \nabla_\theta \log p(y_i | x_i; \theta)
```

### Batch Processing

```python
from PIL import Image
from pathlib import Path

def batch_ocr(image_dir, model):
    """Process all formula images in a directory."""
    results = []
    for img_path in sorted(Path(image_dir).glob("*.png")):
        img = Image.open(img_path)
        latex = model(img)
        results.append({
            "file": img_path.name,
            "latex": latex
        })
        print(f"{img_path.name}: {latex[:80]}...")
    return results

model = LatexOCR()
results = batch_ocr("./formula_images/", model)
```

## Pix2Text (Chinese + English + Math)

Pix2Text handles mixed Chinese/English text alongside mathematical formulas.

```bash
pip install pix2text
```

```python
from pix2text import Pix2Text

p2t = Pix2Text()

# Recognize mixed content (text + math)
result = p2t.recognize("mixed_content.png")
print(result)
# Output includes both text and LaTeX formulas
```

## Nougat (Meta) — Full Document OCR

Nougat converts entire academic PDF pages to Markdown with LaTeX math, preserving document structure.

```bash
pip install nougat-ocr
```

```bash
# Convert a PDF to Markdown
nougat path/to/paper.pdf -o output_dir/ --no-skipping

# Output: Markdown files with LaTeX equations preserved
# e.g., The loss function is $\mathcal{L}(\theta) = ...$
```

```python
# Programmatic usage
from nougat import NougatModel
from nougat.utils.dataset import LazyDataset
from nougat.postprocessing import markdown_compatible

model = NougatModel.from_pretrained("facebook/nougat-base")
model.eval()

# Process pages...
```

## Screenshot-Based Workflow

### macOS Workflow

```bash
# 1. Take a screenshot of the formula (Cmd+Shift+4)
# 2. Process with LaTeX-OCR or Mathpix

# Automated with a shell script:
#!/bin/bash
# save as ~/bin/formula-ocr.sh
SCREENSHOT=$(mktemp /tmp/formula_XXXXXX.png)
screencapture -i "$SCREENSHOT"
python -c "
from pix2tex.cli import LatexOCR
from PIL import Image
model = LatexOCR()
img = Image.open('$SCREENSHOT')
latex = model(img)
print(latex)
# Copy to clipboard
import subprocess
subprocess.run(['pbcopy'], input=latex.encode())
print('Copied to clipboard!')
"
```

### Cross-Platform with Snipping Tool

```python
import tkinter as tk
from PIL import ImageGrab

def capture_and_ocr():
    """Capture screen region and convert to LaTeX."""
    # Simple screenshot capture
    print("Select the formula region...")
    img = ImageGrab.grab(bbox=None)  # Full screen; use tool for selection

    from pix2tex.cli import LatexOCR
    model = LatexOCR()
    latex = model(img)
    print(f"\nLaTeX: {latex}")
    return latex
```

## Post-Processing and Validation

### Common OCR Errors and Fixes

| OCR Error | Correct LaTeX | Fix Strategy |
|-----------|--------------|--------------|
| `\Sigma` vs `\sum` | Context-dependent | Check if it is a summation or sigma variable |
| Missing subscripts | `x_i` not `xi` | Verify variable names against source |
| Wrong delimiter size | `\left( \right)` | Add `\left` and `\right` for auto-sizing |
| Misrecognized symbols | `\theta` vs `\Theta` | Compare against original image |
| Missing spaces | `\frac{a}{b}c` | Add spacing commands (`\,`, `\;`, `\quad`) |

### Validation Script

```python
import subprocess
import tempfile
import os

def validate_latex(latex_string):
    """Check if a LaTeX string compiles without errors."""
    doc = f"""
    \\documentclass{{article}}
    \\usepackage{{amsmath,amssymb}}
    \\begin{{document}}
    ${latex_string}$
    \\end{{document}}
    """

    with tempfile.NamedTemporaryFile(mode="w", suffix=".tex", delete=False) as f:
        f.write(doc)
        tex_path = f.name

    try:
        result = subprocess.run(
            ["pdflatex", "-interaction=nonstopmode", tex_path],
            capture_output=True, text=True, timeout=10,
            cwd=tempfile.gettempdir()
        )
        success = result.returncode == 0
        if not success:
            # Extract error message
            for line in result.stdout.split("\n"):
                if line.startswith("!"):
                    print(f"LaTeX error: {line}")
        return success
    except subprocess.TimeoutExpired:
        return False
    finally:
        for ext in [".tex", ".pdf", ".aux", ".log"]:
            try:
                os.remove(tex_path.replace(".tex", ext))
            except FileNotFoundError:
                pass

# Test
latex = r"\frac{\partial \mathcal{L}}{\partial \theta}"
print(f"Valid: {validate_latex(latex)}")
```

## Integration with Note-Taking

### Obsidian / Markdown Notes

```markdown
# Lecture Notes: Statistical Mechanics

The partition function is defined as:

$$Z = \sum_{i} e^{-\beta E_i}$$

where $\beta = 1/k_B T$ is the inverse temperature.

The free energy is:

$$F = -k_B T \ln Z$$

[OCR'd from slide 15 using LaTeX-OCR, confidence: 0.97]
```

### Automated Pipeline

```python
def process_lecture_slides(pdf_path, output_md):
    """Convert lecture slides with formulas to Markdown notes."""
    from pdf2image import convert_from_path
    from pix2tex.cli import LatexOCR

    model = LatexOCR()
    images = convert_from_path(pdf_path, dpi=200)

    with open(output_md, "w") as f:
        f.write(f"# Notes from {pdf_path}\n\n")
        for i, img in enumerate(images):
            f.write(f"## Slide {i+1}\n\n")
            # Full page text extraction (use Nougat or Mathpix for best results)
            # For formula-only images, use LaTeX-OCR:
            try:
                latex = model(img)
                f.write(f"$$\n{latex}\n$$\n\n")
            except Exception as e:
                f.write(f"[OCR failed: {e}]\n\n")

    print(f"Notes saved to {output_md}")
```

## Best Practices

1. **Crop tightly**: OCR accuracy improves significantly when the formula is cropped with minimal surrounding whitespace.
2. **Use high resolution**: 200-300 DPI gives the best results. Lower resolution degrades recognition accuracy.
3. **Validate output**: Always compile the generated LaTeX to verify correctness before using in a manuscript.
4. **Handle multi-line equations**: For aligned equations, process each line separately or use a full-page model like Nougat.
5. **Combine tools**: Use Mathpix for critical formulas and LaTeX-OCR for bulk processing to balance cost and quality.
6. **Build a corrections dictionary**: Track common OCR errors for your domain and apply automated post-processing fixes.
