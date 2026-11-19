"""Card pictures for Documents and Policy (Captain Russell, 16 Nov 2026).

Each reference card shows a crop of the document it opens instead of a drawn
icon. Run from the repo root:

    python3 tools/doc-card-art.py

It renders page 1 (or the page named after the box) of each PDF with pdftoppm (poppler) at 200 dpi, crops the box
below and writes documents/art/<doc id>.webp, 224 px square with rounded
corners. Boxes are (x0, y0, side) as fractions of the page width. Add a line
here and an "art":"art/<id>.webp" field to the entry in data/documents.js.
"""
import os
import subprocess
import tempfile
from PIL import Image, ImageDraw

BOX = {
    # id: (pdf, x0, y0, side)
    'af-form-4446': ('pfra/references/af-form-4446-flat.pdf', 0.0, 0.0, 0.55),
    'af-form-4446a': ('pfra/references/af-form-4446a-fsq-flat.pdf', 0.0, 0.0, 0.55),
    'afrotci-36-2011v3': ('pfra/references/afrotci-36-2011v3.pdf', 0.088, 0.162, 0.17),
    'dafman36-2905': ('pfra/references/dafman-36-2905.pdf', 0.097, 0.167, 0.17),
    # Page 9: the file opens on the 2026 guidance memorandum; the seal is on
    # the supplement's own cover behind it.
    'dafman36-2905-afrotcsup': ('pfra/references/dafman-36-2905-afrotcsup.pdf', 0.092, 0.19, 0.17, 9),
    'pfra-scoring-charts': ('pfra/references/pfra-scoring-charts.pdf', 0.0, 0.0, 0.4),
    'hamr-shuttle-tally': ('pfra/references/hamr-shuttle-tally.pdf', 0.0, 0.0, 0.55),
}

def main():
    os.makedirs('documents/art', exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        for key, (pdf, x, y, side, *rest) in BOX.items():
            page_no = str(rest[0] if rest else 1)
            base = os.path.join(tmp, key)
            subprocess.run(['pdftoppm', '-f', page_no, '-l', page_no, '-r', '200', '-png',
                            '-singlefile', pdf, base], check=True)
            page = Image.open(base + '.png').convert('RGB')
            w = page.width
            s, x0, y0 = int(side * w), int(x * w), int(y * w)
            tile = page.crop((x0, y0, x0 + s, y0 + s)).resize((224, 224), Image.LANCZOS)
            mask = Image.new('L', (224, 224), 0)
            ImageDraw.Draw(mask).rounded_rectangle((0, 0, 223, 223), radius=40, fill=255)
            tile = tile.convert('RGBA')
            tile.putalpha(mask)
            tile.save(f'documents/art/{key}.webp', 'WEBP', quality=88)
            print('wrote', key)

if __name__ == '__main__':
    main()
