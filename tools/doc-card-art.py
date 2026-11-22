"""Card pictures for Documents and Policy.

Captain Russell, 16 Nov 2026: each card shows the document itself, not a
drawn icon. Redone 22 Nov 2026: the pictures must read at the small row size
(36 px on the Documents page, 56 px in other tools), so every one is zoomed in
on one thing you can recognize, and most carry a short label band at the
bottom (the form or publication number) in the section's color.

Run from the repo root:

    python3 tools/doc-card-art.py

Writes documents/art/<doc id>.webp, 224 px square with rounded corners, for
every entry in ART below. Then give the entry in data/documents.js an
"art":"art/<id>.webp" field (already done for the ones listed here).

Kinds:
  crop  (pdf, page, x0, y0, side): a square crop of the PDF page, all as
        fractions of the page width, rendered at 300 dpi.
  seal  (image): the issuing seal (the AFROTC seal cut from the AFROTCI 36-2011
        V3 cover, or the Secretary of the Air Force seal, which is on the cover of
        every DAF publication), full size on the tile.
  form  : a drawn form sheet, for forms we only link to on e-Publishing (the
        cloud session can't download them to crop).
  image (path, scale): any picture, e.g. the AFGSC shield for the 90th Missile
        Wing video, or the Det 250 patch for the locked detachment plans.
Each may add a label: the band text at the bottom.
"""
import os
import subprocess
import tempfile
from PIL import Image, ImageDraw, ImageFont, ImageFilter

S = 224
FONT = '/usr/share/fonts/opentype/inter/Inter-Black.otf'
OFF = 'documents/storm-standard/art/official/'
TONE = {'plans': (200, 16, 46), 'afrotc': (31, 78, 156), 'fitness': (194, 65, 12), 'external': (3, 105, 161)}

# id: (section, kind, args, label)
ART = {
    # Detachment plans (ids from documents/restricted/vault.json) and the Weekly
    # OPORDs row: encrypted, so no page to crop; the Det 250 patch.
    'fall-2026-oplan':         ('plans', 'image', ('shared/det250-patch.png', 0.98), 'OPLAN'),
    'fall-2026-policy-packet': ('plans', 'image', ('shared/det250-patch.png', 0.98), 'POLICY'),
    'cadre-additional-duties': ('plans', 'image', ('shared/det250-patch.png', 0.98), 'DUTIES'),
    'opords':                  ('plans', 'image', ('shared/det250-patch.png', 0.98), 'OPORDS'),
    # AFROTC publications: the AFROTC seal from their own covers.
    'afrotci-36-2011v1':       ('afrotc', 'seal', 'afrotc', 'VOL 1'),
    'afrotci-36-2011v2':       ('afrotc', 'seal', 'afrotc', 'VOL 2'),
    'afrotci-36-2011v3':       ('afrotc', 'seal', 'afrotc', 'VOL 3'),
    'dafi36-2903-afrotcsup':   ('afrotc', 'seal', 'afrotc', '2903'),
    'dafman36-2905-afrotcsup': ('afrotc', 'seal', 'afrotc', '2905'),
    # Fitness
    'af-form-4446':       ('fitness', 'crop', ('pfra/references/af-form-4446-flat.pdf', 1, 0.03, 0.03, 0.30), '4446'),
    'af-form-4446a':      ('fitness', 'crop', ('pfra/references/af-form-4446a-fsq-flat.pdf', 1, 0.03, 0.03, 0.30), '4446A'),
    'pfra-scoring-charts': ('fitness', 'crop', ('pfra/references/pfra-scoring-charts.pdf', 1, 0.115, 0.085, 0.16), ''),
    'hamr-shuttle-tally': ('fitness', 'crop', ('pfra/references/hamr-shuttle-tally.pdf', 1, 0.04, 0.10, 0.24), 'HAMR'),
    'hamr-audio':         ('fitness', 'audio', None, 'HAMR'),
    'pfra-verbiage-video': ('fitness', 'image', (OFF + 'majcom-afgsc.webp', 0.92), 'VIDEO'),
    'dafman36-2905':      ('fitness', 'seal', 'secaf', '2905'),
    # Air Force e-Publishing: Secretary of the Air Force seal, or a form sheet.
    'ext-dafi36-2903':   ('external', 'seal', 'secaf', '2903'),
    'ext-dafman36-2905': ('external', 'seal', 'secaf', '2905'),
    'ext-afh1':          ('external', 'seal', 'secaf', 'AFH 1'),
    'ext-afi1-1':        ('external', 'seal', 'secaf', 'AFI 1-1'),
    'ext-dafi90-1201':   ('external', 'seal', 'secaf', '1201'),
    'ext-dafi90-6001':   ('external', 'seal', 'secaf', '6001'),
    'ext-dafi51-508':    ('external', 'seal', 'secaf', '51-508'),
    'ext-dafi36-2614':   ('external', 'seal', 'secaf', '2614'),
    'ext-afh33-337':     ('external', 'seal', 'secaf', 'T&Q'),
    'ext-daf1206':       ('external', 'form', None, '1206'),
    'ext-af724':         ('external', 'form', None, '724'),
    'ext-daf174':        ('external', 'form', None, '174'),
}

def render(pdf, page, dpi, tmp):
    base = os.path.join(tmp, os.path.basename(pdf) + str(page) + str(dpi))
    if not os.path.exists(base + '.png'):
        subprocess.run(['pdftoppm', '-f', str(page), '-l', str(page), '-r', str(dpi), '-png',
                        '-singlefile', pdf, base], check=True)
    return Image.open(base + '.png').convert('RGB')

def afrotc_seal(tmp):
    # The round AFROTC seal on the AFROTCI 36-2011 V3 cover; outside the ring made clear.
    page = render('pfra/references/afrotci-36-2011v3.pdf', 1, 600, tmp)
    w = page.width
    x0, y0, s = int(0.088 * w), int(0.162 * w), int(0.17 * w)
    im = page.crop((x0, y0, x0 + s, y0 + s)).convert('L')
    # tighten to the ink
    bbox = im.point(lambda v: 255 if v < 160 else 0).getbbox()
    im = im.crop(bbox)
    side = max(im.size)
    sq = Image.new('L', (side, side), 255); sq.paste(im, ((side - im.width) // 2, (side - im.height) // 2))
    return sq

def tile_bg(color):
    return Image.new('RGBA', (S, S), color + (255,))

def paste_center(dst, im, box):
    x0, y0, x1, y1 = box
    im = im.copy(); im.thumbnail((x1 - x0, y1 - y0), Image.LANCZOS)
    dst.alpha_composite(im, (x0 + (x1 - x0 - im.width) // 2, y0 + (y1 - y0 - im.height) // 2))

def band(t, tone, label):
    if not label:
        return
    h = 64
    d = ImageDraw.Draw(t)
    d.rectangle((0, S - h, S, S), fill=tone + (255,))
    size = 58
    while True:
        f = ImageFont.truetype(FONT, size)
        l, tp, r, b = d.textbbox((0, 0), label, font=f)
        if r - l <= S - 22 or size <= 30:
            break
        size -= 2
    d.text(((S - (r - l)) / 2 - l, S - h / 2 - (b + tp) / 2), label, font=f, fill='white')

def make(key, sec, kind, args, label, tmp, cache):
    tone = TONE[sec]
    area = (0, 0, S, S - (64 if label else 0))
    if kind == 'crop':
        pdf, page_no, x, y, side = args
        page = render(pdf, page_no, 300, tmp)
        w = page.width
        s, x0, y0 = int(side * w), int(x * w), int(y * w)
        crop = page.crop((x0, y0, x0 + s, y0 + s))
        ah = area[3]
        # keep the top of the crop when a band covers the bottom
        crop = crop.crop((0, 0, s, int(s * ah / S))).resize((S, ah), Image.LANCZOS)
        t = tile_bg((255, 255, 255)); t.paste(crop, (0, 0))
    elif kind == 'seal':
        t = tile_bg((255, 255, 255))
        if args == 'afrotc':
            if 'afrotc' not in cache:
                cache['afrotc'] = afrotc_seal(tmp)
            seal = cache['afrotc'].convert('RGBA')
            # tint the black line art navy so it reads as a seal, not a smudge
            r, g, b, a = seal.split()
            L = seal.convert('L').filter(ImageFilter.MinFilter(5))  # thicken the thin line art
            navy = Image.new('RGBA', seal.size, (16, 42, 92, 255))
            white = Image.new('RGBA', seal.size, (255, 255, 255, 255))
            seal = Image.composite(white, navy, L.point(lambda v: 255 if v > 200 else 0))
        else:
            seal = Image.open(OFF + 'coc-secaf.webp').convert('RGBA')
        paste_center(t, seal, (6, 4, S - 6, area[3] - 2))
    elif kind == 'image':
        path, scale = args
        t = tile_bg((24, 26, 34))
        im = Image.open(path).convert('RGBA')
        m = int((1 - scale) * area[3] / 2)
        paste_center(t, im, (m, m + 2, S - m, area[3] - m))
    elif kind == 'form':
        t = tile_bg((236, 238, 242))
        d = ImageDraw.Draw(t)
        d.rectangle((18, 14, S - 18, S), fill='white', outline=(150, 156, 168), width=3)
        d.rectangle((18, 14, S - 18, 44), fill=(40, 48, 64))
        for i, y in enumerate(range(58, area[3] - 6, 18)):
            d.rectangle((32, y, S - 32 - (40 if i % 3 == 2 else 0), y + 7), fill=(178, 184, 196))
    elif kind == 'audio':
        t = tile_bg((40, 22, 10))
        d = ImageDraw.Draw(t)
        ah = area[3]; mid = ah // 2 + 4
        hs = [18, 40, 70, 100, 62, 116, 84, 50, 96, 60, 30, 14]
        bw = 12; gap = 5; x = (S - (len(hs) * bw + (len(hs) - 1) * gap)) // 2
        for h in hs:
            h = int(h * 0.95)
            d.rounded_rectangle((x, mid - h // 2, x + bw, mid + h // 2), radius=6, fill=(251, 146, 60))
            x += bw + gap
    band(t, tone, label)
    mask = Image.new('L', (S, S), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, S - 1, S - 1), radius=40, fill=255)
    t.putalpha(mask)
    t.save(f'documents/art/{key}.webp', 'WEBP', quality=90)
    return t

def main():
    os.makedirs('documents/art', exist_ok=True)
    cache = {}
    with tempfile.TemporaryDirectory() as tmp:
        for key, (sec, kind, args, label) in ART.items():
            make(key, sec, kind, args, label, tmp, cache)
            print('wrote', key)

if __name__ == '__main__':
    main()
