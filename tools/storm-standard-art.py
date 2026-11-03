#!/usr/bin/env python3
"""Pull the graphics out of The Storm Standard PDF for the online highlights view.

Usage (from the repo root):
    python3 tools/storm-standard-art.py documents/storm-standard/The_Storm_Standard.pdf documents/storm-standard/art

Writes WebP images plus data.js (window.SS_ART: aircraft and space inventory,
major commands, specialty badges) into the art folder. documents/storm-standard/index.html
is hand written and reads data.js; rerun this when a new edition of the PDF comes
out, then check the page numbers in FIG below (they are PDF page numbers, cover = 1)
and the PDF page links in index.html.

Needs: pypdfium2, pdfplumber, Pillow (pip install pypdfium2 pdfplumber pillow).
"""
import json, os, re, sys
import pdfplumber, pypdfium2 as pdfium
from PIL import Image

PDF, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)
doc = pdfium.PdfDocument(PDF)
plumb = pdfplumber.open(PDF)
_cache = {}

def page_img(n, scale, alpha):
    key = (n, scale, alpha)
    if key not in _cache:
        kw = {"fill_color": (0, 0, 0, 0)} if alpha else {}
        _cache[key] = doc[n - 1].render(scale=scale, **kw).to_pil().convert("RGBA" if alpha else "RGB")
    return _cache[key]

def clear_border_white(im, thresh=40):
    """Make every near-white region that touches the border transparent (emblems
    pasted on a white box). Interior white stays."""
    im = im.convert("RGBA")
    w, h = im.size
    px = im.load()
    seen = bytearray(w * h)
    stack = [(x, y) for x in range(w) for y in (0, h - 1)] + [(x, y) for y in range(h) for x in (0, w - 1)]
    lim = 255 - thresh
    while stack:
        x, y = stack.pop()
        if x < 0 or y < 0 or x >= w or y >= h or seen[y * w + x]: continue
        seen[y * w + x] = 1
        r, g, b, a = px[x, y]
        if a and min(r, g, b) < lim: continue
        px[x, y] = (255, 255, 255, 0)
        stack += [(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)]
    return im

def save(name, n, box, width=900, alpha=False, scale=None, pad=0):
    """Crop box (PDF points: x0, top, x1, bottom) from page n and save as art/<name>.webp."""
    x0, t, x1, b = box
    x0, t, x1, b = x0 - pad, t - pad, x1 + pad, b + pad
    s = scale or max(2, min(10, width / max(1, (x1 - x0))))
    im = page_img(n, s, alpha)
    crop = im.crop((round(x0 * s), round(t * s), round(x1 * s), round(b * s)))
    if crop.width > width:
        crop = crop.resize((width, round(crop.height * width / crop.width)), Image.LANCZOS)
    if alpha:
        crop = clear_border_white(crop)
    crop.save(os.path.join(OUT, name + ".webp"), "WEBP", quality=82, method=6)
    return name + ".webp"

def rect_bounds(n):
    pg = plumb.pages[n - 1]
    rs = pg.rects
    return (min(r["x0"] for r in rs), min(r["top"] for r in rs), max(r["x1"] for r in rs), max(r["bottom"] for r in rs))

W, H = 287.5, 431.3   # page size in points

# ---- single figures: (name, page, box or "page" or "tables", options) ----
FIG = [
    ("cover", 1, (0, 0, W, H), dict(width=1000)),
    ("back-cover", 150, (0, 0, W, H), dict(width=1000)),
    ("patch-usaf", 10, (32, 226, 95, 291), dict(width=420, alpha=True)),
    ("patch-ussf", 11, (32, 97, 85, 171), dict(width=420, alpha=True)),
    ("cadet-rank", 26, (52, 63, 236, 274), dict(width=900)),
    ("afrotc-insignia", 27, (9, 59, 132, 214), dict(width=700)),
    ("uniform-service-men", 28, (21, 65, 127, 198), dict(width=700)),
    ("uniform-service-women", 28, (144, 65, 252, 199), dict(width=700)),
    ("uniform-blues-men", 28, (18, 251, 130, 398), dict(width=700)),
    ("uniform-blues-women", 28, (145, 251, 262, 398), dict(width=700)),
    ("uniform-ocp", 27, (38, 261, 142, 402), dict(width=700)),
    ("uniform-outergarments", 27, (142, 261, 251, 402), dict(width=700)),
    ("rank-enlisted-1", 29, "tables", dict(width=1100)),
    ("rank-enlisted-2", 30, "tables", dict(width=1100)),
    ("rank-warrant", 31, "tables", dict(width=1100)),
    ("rank-officer-1", 32, "tables", dict(width=1100)),
    ("rank-officer-2", 33, "tables", dict(width=1100)),
    ("code-of-conduct", 54, (51, 41, 236, 79), dict(width=1000)),
    ("prop-wings", 61, (113, 46, 175, 89), dict(width=600, alpha=True)),
    ("prop-wings-monument", 62, (50, 86, 237, 266), dict(width=900)),
    ("prop-wings-plaque", 62, (82, 304, 202, 387), dict(width=700)),
    ("combatant-commands", 89, (37, 278, 246, 359), dict(width=1100)),
    ("seal-air-force", 90, (103, 145, 139, 181), dict(width=320, alpha=True)),
    ("seal-space-force", 90, (147, 145, 183, 181), dict(width=320, alpha=True)),
    ("seal-army", 91, (125, 53, 160, 88), dict(width=320, alpha=True)),
    ("seal-navy", 91, (105, 232, 139, 267), dict(width=320, alpha=True)),
    ("space-field-commands", 94, (23, 114, 72, 179), dict(width=360, alpha=True)),
    ("seal-marines", 91, (147, 232, 181, 267), dict(width=320, alpha=True)),
]
for name, n, box, opt in FIG:
    if box == "tables":
        box = rect_bounds(n); opt = dict(opt, pad=2)
    save(name, n, box, **opt)

# ---- text helpers ----
def lines_of(pg):
    """Text lines with position and whether every letter is bold."""
    out = []
    for ln in pg.extract_text_lines(layout=False, strip=True, return_chars=True):
        chars = [c for c in ln["chars"] if c["text"].strip()]
        if not chars: continue
        bold = all("Bold" in c["fontname"] for c in chars)
        out.append(dict(text=ln["text"].strip(), x0=ln["x0"], x1=ln["x1"], top=ln["top"], bottom=ln["bottom"], bold=bold,
                        lead=("Bold" in chars[0]["fontname"])))
    return out

def fields_of(lines):
    """'Label: value' lines into a dict; wrapped lines continue the previous field."""
    f, key = {}, None
    for ln in lines:
        m = re.match(r"^([A-Z][A-Za-z ]{1,24}):\s*(.*)$", ln["text"])
        if m and ln["lead"]:
            key = m.group(1).strip(); f[key] = m.group(2).strip()
        elif key:
            f[key] = (f[key] + " " + ln["text"]).strip()
        else:
            f.setdefault("_text", "")
            f["_text"] = (f["_text"] + " " + ln["text"]).strip()
    for k in f:
        f[k] = re.sub(r"(\w)- (\w)", r"\1\2", f[k]).replace(" ,", ",")
    return f

def balance(t):
    return t + ")" if t.count("(") > t.count(")") else t

# ---- inventory: aircraft (PDF 107-118) and space systems (119-123) ----
inventory = []
for n in range(107, 124):
    pg = plumb.pages[n - 1]
    ims = sorted(pg.images, key=lambda i: (i["top"], i["x0"]))
    lines = lines_of(pg)
    lines = [l for l in lines if not re.fullmatch(r"\d{1,3}", l["text"])]
    # entry titles: bold lines with no label colon; consecutive ones merge
    entries = []
    for l in lines:
        is_title = l["bold"] and ":" not in l["text"]
        if is_title and entries and entries[-1]["open"] and abs(l["x0"] - entries[-1]["x0"]) < 30 and l["top"] - entries[-1]["tb"] < 14:
            entries[-1]["name"] += " " + l["text"]; entries[-1]["tb"] = l["bottom"]; continue
        if is_title:
            entries.append(dict(name=l["text"], x0=l["x0"], top=l["top"], tb=l["bottom"], body=[], open=True)); continue
        # body line: attach to the nearest title above it in the same column
        cands = [e for e in entries if e["top"] <= l["top"] and abs(e["x0"] - l["x0"]) < 60]
        if cands:
            e = max(cands, key=lambda e: e["top"]); e["body"].append(l); e["open"] = False
    if not entries: continue
    for e in entries:
        e["fields"] = fields_of(e["body"])
    # pair each image with the entry whose column it sits beside and whose block contains it
    used = set()
    for im in ims:
        cy = (im["top"] + im["bottom"]) / 2
        cands = [e for e in entries if id(e) not in used]
        if not cands: break
        def score(e):
            bottom = max([b["bottom"] for b in e["body"]] + [e["tb"]])
            inside = e["top"] - 8 <= cy <= bottom + 8
            return (0 if inside else 1, abs(cy - (e["top"] + bottom) / 2) + abs(im["x0"] - e["x0"]) * 0.05)
        e = min(cands, key=score); used.add(id(e))
        slug = re.sub(r"[^a-z0-9]+", "-", e["name"].lower()).strip("-")[:40]
        e["img"] = save("inv-" + slug, n, (im["x0"], im["top"], im["x1"], im["bottom"]), width=520)
    for e in entries:
        f = e["fields"]
        inventory.append(dict(
            name=balance(e["name"].replace(" )", ")")), page=n, img=e.get("img"),
            kind="space" if n >= 117 and ("Orbit" in f or "Constellation" in f or n >= 121) else "air",
            function=f.get("Function", ""), manufacturer=f.get("Manufacturer", ""), service=f.get("Service Date", ""),
            speed=f.get("Speed", ""), crew=f.get("Crew", ""), inventory=f.get("Inventory", ""),
            constellation=f.get("Constellation", ""), orbit=f.get("Orbit", ""),
            note=f.get("Commentary", f.get("_text", ""))))

# ---- major commands (PDF 92-94) ----
majcoms = []
for n in (92, 93, 94):
    pg = plumb.pages[n - 1]
    lines = lines_of(pg)
    heads = [l for l in lines if l["bold"] and re.search(r"\((?:[A-Z][A-Z-]+)\)$|Command$|Africa$|^\(USAFE", l["text"]) and l["x0"] > 60]
    # merge two-line titles such as "U.S. Air Forces in Europe-Air Forces Africa" + "(USAFE-AFAFRICA)"
    merged = []
    for h in heads:
        if merged and h["top"] - merged[-1]["bottom"] < 6:
            merged[-1] = dict(merged[-1], text=merged[-1]["text"] + " " + h["text"], bottom=h["bottom"])
        else:
            merged.append(dict(h))
    for im in sorted(pg.images, key=lambda i: i["top"]):
        if im["x1"] > 90: continue            # shields sit in the left margin
        cy = (im["top"] + im["bottom"]) / 2
        h = min(merged, key=lambda h: abs(h["top"] - im["top"]) if h["top"] <= cy + 20 else 999) if merged else None
        if not h or abs(h["top"] - im["top"]) > 45: continue
        nxt = [m["top"] for m in merged if m["top"] > h["top"]] + [pg.height]
        body = [l for l in lines if l["top"] > h["bottom"] - 1 and l["top"] < min(nxt) - 1 and l["x0"] > 60]
        f = fields_of(body)
        hq = re.sub(r"\s*Established:.*", "", f.get("HQ", "")).strip()
        est = (re.search(r"Established:\s*(.+)", f.get("HQ", "")) or [None, ""])[1].strip()
        slug = re.sub(r"[^a-z0-9]+", "-", h["text"].lower()).strip("-")[:40]
        majcoms.append(dict(name=h["text"], hq=hq, established=est,
                            mission=f.get("Mission", f.get("_text", "")), page=n,
                            img=save("cmd-" + slug, n, (im["x0"], im["top"], im["x1"], im["bottom"]), width=300, alpha=True)))

# ---- specialty badges (PDF 126-128) ----
badges = []
for n in (126, 127, 128):
    pg = plumb.pages[n - 1]
    words = pg.extract_words()
    for i, im in enumerate(sorted(pg.images, key=lambda i: (round(i["top"] / 20), i["x0"]))):
        cx = (im["x0"] + im["x1"]) / 2
        cell = [w for w in words if w["top"] > im["bottom"] - 2 and w["top"] < im["bottom"] + 24
                and abs((w["x0"] + w["x1"]) / 2 - cx) < 55]
        cell.sort(key=lambda w: (round(w["top"]), w["x0"]))
        label = " ".join(w["text"] for w in cell).strip()
        slug = re.sub(r"[^a-z0-9]+", "-", label.lower()).strip("-")[:40] or f"p{n}-{i}"
        badges.append(dict(name=label, page=n, img=save("badge-" + slug, n, (im["x0"], im["top"], im["x1"], im["bottom"]), width=360, alpha=True)))

with open(os.path.join(OUT, "data.js"), "w", encoding="utf-8") as fh:
    fh.write("/* GENERATED by tools/storm-standard-art.py from The_Storm_Standard.pdf. Do not edit by hand. */\n")
    fh.write("window.SS_ART = " + json.dumps(dict(inventory=inventory, majcoms=majcoms, badges=badges), indent=1, ensure_ascii=False) + ";\n")
print(len(inventory), "inventory,", len(majcoms), "commands,", len(badges), "badges,", len(os.listdir(OUT)), "files")
