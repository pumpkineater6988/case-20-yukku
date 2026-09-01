"""
Generate a printable A4 PDF of the love letter with handwritten styling.
Uses Dancing Script font + cream background + lined paper + pink accents.
Fits the entire letter on a single page.
"""

import os
import textwrap
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, Color
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ── Paths ──
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
LETTER_PATH = os.path.join(SCRIPT_DIR, "LETTER.txt")
OUTPUT_PATH = os.path.join(SCRIPT_DIR, "A Letter For Yu.pdf")
FONT_PATH = os.path.join(SCRIPT_DIR, "DancingScript-Variable.ttf")

# ── Read letter ──
with open(LETTER_PATH, "r", encoding="utf-8") as f:
    raw = f.read().strip()

# ── Register Font ──
pdfmetrics.registerFont(TTFont("DancingScript", FONT_PATH))

# ── Page Setup ──
W, H = A4  # 595.27 x 841.89 points
MARGIN_LEFT = 22 * mm
MARGIN_RIGHT = 22 * mm
MARGIN_TOP = 18 * mm
MARGIN_BOTTOM = 15 * mm
USABLE_W = W - MARGIN_LEFT - MARGIN_RIGHT

# Colors
PINK = HexColor("#D81B60")
CREAM = HexColor("#FFFCF5")
LINE_COLOR = Color(0.91, 0.82, 0.86, alpha=1)  # faint pink
TEXT_COLOR = HexColor("#2d1f1f")
FAINT_GRAY = HexColor("#b4b4b4")

c = canvas.Canvas(OUTPUT_PATH, pagesize=A4)

# ── Cream background ──
c.setFillColor(CREAM)
c.rect(0, 0, W, H, fill=1, stroke=0)

# ── Faint lined-paper effect ──
line_spacing = 5.5 * mm
y = H - MARGIN_TOP
while y > MARGIN_BOTTOM:
    c.setStrokeColor(LINE_COLOR)
    c.setLineWidth(0.25)
    c.line(MARGIN_LEFT - 2*mm, y, W - MARGIN_RIGHT + 2*mm, y)
    y -= line_spacing

# ── Top decorative line ──
c.setStrokeColor(PINK)
c.setLineWidth(1)
c.line(15*mm, H - 12*mm, W - 15*mm, H - 12*mm)

# ── Bottom decorative line ──
c.line(15*mm, 12*mm, W - 15*mm, 12*mm)

# ── Title ──
c.setFont("DancingScript", 20)
c.setFillColor(PINK)
title = "A Letter For Yu"
title_w = c.stringWidth(title, "DancingScript", 20)
c.drawString((W - title_w) / 2, H - MARGIN_TOP + 2*mm, title)

# ── Subtitle ──
c.setFont("Helvetica-Oblique", 7)
c.setFillColor(PINK)
sub = "--- with love ---"
sub_w = c.stringWidth(sub, "Helvetica-Oblique", 7)
c.drawString((W - sub_w) / 2, H - MARGIN_TOP - 5*mm, sub)

# ── Footer case code ──
c.setFont("Helvetica-Oblique", 5.5)
c.setFillColor(FAINT_GRAY)
footer = "CASE #CASE-20-YUKKU  |  CLASSIFIED  |  Filed: 2026"
footer_w = c.stringWidth(footer, "Helvetica-Oblique", 5.5)
c.drawString((W - footer_w) / 2, 14*mm, footer)

# ── Letter Body ──
# Split into paragraphs
paragraphs = raw.split("\n")

# Determine font size to fit on one page
# We have from (H - MARGIN_TOP - 10mm) down to (MARGIN_BOTTOM + 5mm) of usable vertical space
y_start = H - MARGIN_TOP - 10 * mm
y_end = MARGIN_BOTTOM + 6 * mm
available_height = y_start - y_end

# Try different font sizes to fit
for font_size in [8.5, 8.0, 7.5, 7.2, 7.0, 6.8, 6.5, 6.2, 6.0, 5.8, 5.5]:
    line_h = font_size * 1.55  # line height
    para_gap = font_size * 0.6  # paragraph spacing
    
    # Calculate how many lines we need
    total_height = 0
    for para in paragraphs:
        para = para.strip()
        if para == "":
            total_height += para_gap
            continue
        
        # Estimate character width and wrap
        avg_char_w = font_size * 0.42  # approximate for Dancing Script
        chars_per_line = int(USABLE_W / avg_char_w)
        wrapped = textwrap.wrap(para, width=chars_per_line)
        total_height += len(wrapped) * line_h + para_gap * 0.5
    
    if total_height <= available_height:
        break

# Now render the text
c.setFont("DancingScript", font_size)
c.setFillColor(TEXT_COLOR)

cursor_y = y_start
avg_char_w = font_size * 0.42
chars_per_line = int(USABLE_W / avg_char_w)

for para in paragraphs:
    para = para.strip()
    if para == "":
        cursor_y -= para_gap
        continue
    
    wrapped_lines = textwrap.wrap(para, width=chars_per_line)
    for line in wrapped_lines:
        if cursor_y < y_end:
            break
        c.drawString(MARGIN_LEFT, cursor_y, line)
        cursor_y -= line_h
    cursor_y -= para_gap * 0.3

c.save()

print(f"\n  PDF generated successfully!")
print(f"  File: {OUTPUT_PATH}")
print(f"  Font size: {font_size}pt | A4 format | Single page | Ready for printing!")
