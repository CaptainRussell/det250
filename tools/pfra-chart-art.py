#!/usr/bin/env python3
"""Build the PFRA Calculator's scoring chart pictures.

    python3 tools/pfra-chart-art.py pfra/references/pfra-scoring-charts.pdf pfra/charts

Renders every page of the official scoring charts to <out>/p<N>.webp and
writes <out>/map.json: where each cell of each chart sits on its picture, so
the calculator can draw a box around the cell a score came from. Rows and
columns are found from the text the PDF carries (points, age bands, M/F) and
snapped to the ruled lines in the picture, so the box sits on the real grid.
Page 9 (the waist to height grid) is a picture with no text, so its axes
(height 58 to 78, waist 29 to 44, by half inches) are laid over the grid lines.
Rerun when a new edition of the charts comes out, and check the pages below.
"""
import json, os, re, subprocess, sys, tempfile
from PIL import Image

DPI = 150
SCALE = DPI / 72
BANDS = ['under25', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60plus']
PAGES = {1: 'whtr', 2: 'pushup', 3: 'hand_release_pushup', 4: 'situp',
         5: 'cross_leg_reverse_crunch', 6: 'forearm_plank', 7: 'run_2mile', 8: 'hamr_20m',
         9: 'whtr_grid', 10: 'walk_2km'}
WALK_ROWS = {'< 30': 'under30', '30-39': '30-39', '40-49': '40-49', '50-59': '50-59', '60+': '60plus'}


def words(pdf, page):
    out = subprocess.run(['pdftotext', '-bbox', '-f', str(page), '-l', str(page), pdf, '-'],
                         capture_output=True, text=True, check=True).stdout
    found = []
    for m in re.finditer(r'xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)</word>', out):
        x0, y0, x1, y1 = (float(v) * SCALE for v in m.groups()[:4])
        found.append({'x0': x0, 'y0': y0, 'x1': x1, 'y1': y1, 'cx': (x0 + x1) / 2,
                      'cy': (y0 + y1) / 2, 't': m.group(5).replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>')})
    return found


def lines(img, axis, lo, hi, dark=110, share=0.55):
    """Pixel positions of ruled lines across [lo, hi] of the other axis."""
    g = img.convert('L')
    w, h = g.size
    px = g.load()
    span = range(int(lo), int(hi))
    hits = []
    for i in range(h if axis == 'h' else w):
        n = sum(1 for j in span if (px[j, i] if axis == 'h' else px[i, j]) < dark)
        if n >= share * len(span):
            hits.append(i)
    return hits


def cell(edges, centre):
    """The two lines either side of a centre, skipping lines thicker runs share."""
    above = [e for e in edges if e < centre - 3]
    below = [e for e in edges if e > centre + 3]
    if not above or not below:
        return None
    return [max(above), min(below)]


def grid_page(img, ws):
    pts = [w for w in ws if w['x1'] < 75 * SCALE and re.fullmatch(r'\d+(\.\d)?', w['t'])]
    right_pts = [w for w in ws if w['x0'] > img.width - 90 * SCALE and re.fullmatch(r'\d+(\.\d)?', w['t'])]
    heads = [w for w in ws if w['t'] in ('M', 'F')]
    heads.sort(key=lambda w: w['cx'])
    assert len(heads) == 18, len(heads)
    top = min(w['y0'] for w in heads)
    bottom = max(w['y1'] for w in pts)
    left, right = 25 * SCALE, img.width - 25 * SCALE
    hl = lines(img, 'h', left + 60 * SCALE, right - 60 * SCALE)
    vl = lines(img, 'v', top, bottom)
    rows, cols = {}, {}
    for w in pts:
        r = cell(hl, w['cy'])
        if r:
            rows[str(float(w['t']))] = r
    for i, w in enumerate(heads):
        c = cell(vl, w['cx'])
        if c:
            cols[f"{BANDS[i // 2]}:{w['t']}"] = c
    # The Points columns at both edges, so the points a row is worth can be
    # outlined beside the box the measurement landed in.
    # They are filled navy, so there are no rules inside them to find: each
    # runs from the table's data columns out, centred on its labels.
    first, last = cols['under25:M'][0], cols['60plus:F'][1]
    pcols = []
    if pts:
        cx = pts[0]['cx']
        pcols.append([round(2 * cx - first), first])
    if right_pts:
        cx = right_pts[0]['cx']
        pcols.append([last, round(2 * cx - last)])
    crop = [0, int(min(w['y0'] for w in ws) - 12 * SCALE), img.width,
            int(max(r[1] for r in rows.values()) + 8 * SCALE)]
    return {'rows': rows, 'cols': cols, 'pcols': pcols, 'crop': crop}


def whtr_grid(img):
    """The waist (columns 28..44) by height (rows 58..78) grid, from its lines."""
    w, h = img.size
    def runs(v):
        out = []
        for p in v:
            if out and p - out[-1][-1] <= 2:
                out[-1].append(p)
            else:
                out.append([p])
        return [round(sum(r) / len(r)) for r in out]
    hl = runs(lines(img, 'h', w * 0.14, w * 0.87, dark=150, share=0.7))
    vl = runs(lines(img, 'v', h * 0.27, h * 0.75, dark=150, share=0.7))
    heights = [58 + i / 2 for i in range(41)]
    waists = [28 + i / 2 for i in range(33)]
    body = hl[1:]                       # below the header row
    pitch = (body[-1] - body[0]) / (len(body) - 1)
    while len(body) < len(heights) + 1:  # the bottom rule is too faint to find
        body.append(round(body[-1] + pitch))
    cols = vl[1:]                       # right of the height labels
    assert len(cols) == len(waists) + 1, len(cols)
    rows = {str(v): [body[i], body[i + 1]] for i, v in enumerate(heights)}
    colmap = {str(v): [cols[i], cols[i + 1]] for i, v in enumerate(waists)}
    crop = [vl[0] - 30, hl[0] - 60, cols[-1] + 30, body[-1] + 30]
    return {'rows': rows, 'cols': colmap, 'crop': crop}


def main(pdf, out):
    os.makedirs(out, exist_ok=True)
    tmp = tempfile.mkdtemp()
    subprocess.run(['pdftoppm', '-r', str(DPI), '-png', pdf, os.path.join(tmp, 'p')], check=True)
    pngs = sorted(f for f in os.listdir(tmp) if f.endswith('.png'))
    result = {'source': os.path.basename(pdf), 'pages': {}}
    for n, name in enumerate(pngs, start=1):
        img = Image.open(os.path.join(tmp, name)).convert('RGB')
        kind = PAGES.get(n)
        entry = {'page': n, 'kind': kind}
        if n <= 8:
            entry.update(grid_page(img, words(pdf, n)))
        elif kind == 'whtr_grid':
            entry.update(whtr_grid(img))
        elif kind == 'walk_2km':
            ws = words(pdf, n)
            hl = lines(img, 'h', img.width * 0.2, img.width * 0.8)
            times = [w for w in ws if re.fullmatch(r'\d\d:\d\d', w['t'])]
            ages = [w for w in ws if w['x1'] < img.width / 2]
            top = min(w['y0'] for w in times)
            bot = max(w['y1'] for w in times)
            vl = lines(img, 'v', top, bot)
            rows, cols = {}, {}
            for w in times:
                side = 'M' if w['cx'] < img.width / 2 else 'F'
                r, c = cell(hl, w['cy']), cell(vl, w['cx'])
                label = None
                line = sorted((a for a in ws if abs(a['cy'] - w['cy']) < 6 and a['cx'] < w['cx']
                               and (side == 'M' or a['cx'] > img.width / 2)), key=lambda a: a['cx'])
                label = ' '.join(a['t'] for a in line)
                key = WALK_ROWS.get(label)
                if key and r and c:
                    rows[key] = r
                    cols[side] = c
            entry.update({'rows': rows, 'cols': cols})
            ys = [v for r in rows.values() for v in r]
            entry['crop'] = [int(min(w['x0'] for w in ws) - 20 * SCALE), int(min(w['y0'] for w in ws) - 12 * SCALE),
                             int(max(w['x1'] for w in ws) + 20 * SCALE), int(max(ys) + 12 * SCALE)]
        crop = entry.get('crop')
        if crop:
            img = img.crop(crop)
            dx, dy = crop[0], crop[1]
            for key in ('rows',):
                entry[key] = {k: [round(v[0] - dy), round(v[1] - dy)] for k, v in entry[key].items()}
            entry['cols'] = {k: [round(v[0] - dx), round(v[1] - dx)] for k, v in entry['cols'].items()}
            if 'pcols' in entry:
                entry['pcols'] = [[round(v[0] - dx), round(v[1] - dx)] for v in entry['pcols']]
            del entry['crop']
        entry['w'], entry['h'] = img.size
        img.save(os.path.join(out, f'p{n}.webp'), 'WEBP', quality=82, method=6)
        result['pages'][kind] = entry
    with open(os.path.join(out, 'map.json'), 'w') as f:
        json.dump(result, f, separators=(',', ':'))


if __name__ == '__main__':
    main(*sys.argv[1:3])
