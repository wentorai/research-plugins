---
name: math-equation-renderer
description: "Render LaTeX math equations as publication-ready PNG and SVG images"
metadata:
  openclaw:
    emoji: "🔢"
    category: "tools"
    subcategory: "ocr-translate"
    keywords: ["latex math", "equation rendering", "math images", "formula to png", "math typesetting", "tex rendering"]
    source: "https://clawhub.ai/huaruoji/math-images"
---

# Math Equation Renderer — LaTeX to Image

## Overview

Rendering LaTeX math equations as standalone images (PNG, SVG, PDF) is essential for presentations, social media, documentation, and any context where native LaTeX rendering is unavailable. This guide covers multiple methods: command-line tools, Python libraries, and web APIs. Choose based on your workflow: batch processing favors CLI tools, while one-off equations work well with web APIs.

## Method 1: TeX + dvipng (Command Line)

The classic approach using a minimal LaTeX document:

```bash
# Install prerequisites
# macOS: brew install --cask mactex
# Ubuntu: sudo apt install texlive-latex-base dvipng

# Create a minimal .tex file
cat > equation.tex << 'EOF'
\documentclass[border=2pt]{standalone}
\usepackage{amsmath,amssymb}
\begin{document}
$\displaystyle E = mc^2$
\end{document}
EOF

# Compile to DVI then PNG
latex equation.tex
dvipng -D 300 -bg Transparent -T tight equation.dvi -o equation.png

# Or compile directly to PDF
pdflatex equation.tex
```

### Batch Rendering Script

```bash
#!/bin/bash
# Render multiple equations from a text file (one per line)
INPUT="equations.txt"
OUTPUT_DIR="./rendered"
DPI=300
mkdir -p "$OUTPUT_DIR"

i=1
while IFS= read -r eq; do
    cat > "/tmp/eq_${i}.tex" << EOF
\documentclass[border=2pt]{standalone}
\usepackage{amsmath,amssymb}
\begin{document}
\$\displaystyle ${eq}\$
\end{document}
EOF
    (cd /tmp && latex -interaction=batchmode "eq_${i}.tex" && \
     dvipng -D "$DPI" -bg Transparent -T tight "eq_${i}.dvi" \
       -o "${OLDPWD}/${OUTPUT_DIR}/eq_${i}.png") 2>/dev/null
    echo "Rendered equation $i: $eq"
    ((i++))
done < "$INPUT"
echo "Done. $((i-1)) equations rendered to $OUTPUT_DIR/"
```

## Method 2: matplotlib (Python)

```python
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend

def render_equation(latex_str: str, output_path: str, dpi: int = 300,
                    fontsize: int = 20, color: str = "black"):
    """Render a LaTeX equation to PNG."""
    fig, ax = plt.subplots(figsize=(0.1, 0.1))
    ax.axis('off')
    text = ax.text(0.5, 0.5, f"${latex_str}$",
                   fontsize=fontsize, color=color,
                   ha='center', va='center',
                   transform=ax.transAxes)

    # Auto-size the figure to fit the equation
    fig.savefig(output_path, dpi=dpi, bbox_inches='tight',
                pad_inches=0.1, transparent=True)
    plt.close(fig)
    print(f"Saved: {output_path}")

# Usage
render_equation(r"\nabla \times \mathbf{E} = -\frac{\partial \mathbf{B}}{\partial t}",
                "maxwell.png")
render_equation(r"\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}",
                "gaussian.png")
```

### Batch Rendering with matplotlib

```python
equations = {
    "schrodinger": r"i\hbar\frac{\partial}{\partial t}\Psi = \hat{H}\Psi",
    "einstein":    r"R_{\mu\nu} - \frac{1}{2}Rg_{\mu\nu} = \frac{8\pi G}{c^4}T_{\mu\nu}",
    "euler":       r"e^{i\pi} + 1 = 0",
    "bayes":       r"P(A|B) = \frac{P(B|A)\,P(A)}{P(B)}",
    "fourier":     r"\hat{f}(\xi) = \int_{-\infty}^{\infty} f(x)\,e^{-2\pi ix\xi}\,dx",
}

for name, eq in equations.items():
    render_equation(eq, f"equations/{name}.png", dpi=300, fontsize=24)
```

## Method 3: sympy (Python — Symbolic Math)

```python
from sympy import *
from sympy.printing.preview import preview

x, y, z = symbols('x y z')
f = Function('f')

# Render symbolic expression
expr = Integral(exp(-x**2), (x, -oo, oo))
preview(expr, viewer='file', filename='integral.png',
        dvioptions=['-D', '300', '-bg', 'Transparent'])

# Render matrix
M = Matrix([[1, x], [y, x*y]])
preview(M, viewer='file', filename='matrix.png',
        dvioptions=['-D', '300', '-bg', 'Transparent'])
```

## Method 4: Web APIs (No Local TeX Required)

### Codecogs API

```bash
# URL-encoded LaTeX → PNG
curl -o equation.png \
  "https://latex.codecogs.com/png.image?\dpi{300}\bg{transparent}E=mc^2"

# SVG output
curl -o equation.svg \
  "https://latex.codecogs.com/svg.image?E=mc^2"
```

### MathJax (HTML to Image)

```python
# Using Playwright to render MathJax equations
from playwright.sync_api import sync_playwright

def mathjax_to_png(latex: str, output: str):
    html = f"""<!DOCTYPE html>
    <html><head>
    <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
    </head><body>
    <div id="eq">$$\\displaystyle {latex}$$</div>
    </body></html>"""

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.set_content(html)
        page.wait_for_function("() => window.MathJax && MathJax.startup.promise")
        element = page.query_selector("#eq")
        element.screenshot(path=output)
        browser.close()
```

## Output Format Comparison

| Format | Best For | Scalable? | Transparent BG? |
|--------|----------|-----------|-----------------|
| PNG | Presentations, docs, web | No (raster) | Yes (with `-bg Transparent`) |
| SVG | Web, scalable contexts | Yes (vector) | Yes |
| PDF | LaTeX inclusion, print | Yes (vector) | Yes |
| EPS | Legacy LaTeX workflows | Yes (vector) | No |

## Tips

- **DPI**: Use 300 for print, 150 for screen, 96 for web thumbnails
- **Font consistency**: Match the equation font to your document's body font
- **Dark mode**: Render with white text color for dark backgrounds: `color="white"`
- **Accessibility**: Always provide alt-text describing the equation when embedding images
- **Version control**: Store the LaTeX source alongside rendered images for reproducibility

## References

- [dvipng Documentation](https://ctan.org/pkg/dvipng)
- [matplotlib mathtext](https://matplotlib.org/stable/gallery/text_labels_and_annotations/mathtext_examples.html)
- [CodeCogs Equation Editor](https://latex.codecogs.com/)
- [MathJax Documentation](https://docs.mathjax.org/)
