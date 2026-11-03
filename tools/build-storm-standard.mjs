// Builds the web reader for The Storm Standard from a text export of the PDF.
//
//   node tools/build-storm-standard.mjs <storm-standard.txt> documents/storm-standard/index.html
//
// The text export keeps the PDF's line breaks and puts each page number on its
// own line. This rejoins wrapped lines into paragraphs, turns the chapter page
// lists into links, and writes a single static page. Rerun it when a new
// edition comes out; the page itself is generated, so edit this script, not it.
import fs from "node:fs";

const [,, inFile, outFile] = process.argv;
if(!inFile || !outFile){ console.error("usage: node tools/build-storm-standard.mjs <in.txt> <out.html>"); process.exit(1); }

const esc = s => s.replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const lines = fs.readFileSync(inFile, "utf8").replace(/\r/g, "").split("\n").map(l => l.replace(/\s+$/, ""));

// ---- split into pages: a line that is only a number starts that page ----
const pages = [];               // {n, lines[]}
let cur = null, expect = 2;     // page 1 is the cover / contents
for(const raw of lines){
  const m = raw.match(/^\s*(\d{1,3})(.*)$/);
  if(m && +m[1] === expect && (m[2] === "" || /^[a-z]/.test(m[2]))){
    cur = {n: expect, lines: []}; pages.push(cur); expect++;
    if(m[2]) cur.lines.push(m[2]);   // text that the export glued to the number
    continue;
  }
  if(cur) cur.lines.push(raw);
}

// ---- line classes ----
const LEADER = /^(.*?\S)\s*\.{4,}\s*(\d{1,3})(?:\s*[–-]\s*(\d{1,3}))?\s*$/;
const BULLET = /^\s*(•|[-–]\s?(?=[A-Z])|\d{1,2}[.)]\s|[a-z][.)]\s)/;
const CITE = /^(AFI|DAFI|AFH|DAFH|AFMAN|DAFMAN|AFDP|AFPD|DAFPD|AFROTCI|AFTTP|Air Force Doctrine|JP\s|\d+\s*U\.?S\.?C|\(Constitutioncenter)/;
const ends = s => /[.!?:”"’)]$/.test(s);
const noStop = s => !/[,;:!?]$/.test(s) && (!/\.$/.test(s) || /\b(Jr|Sr|[A-Z])\.$/.test(s));
// A heading is a short title-like line after a finished sentence, followed by
// body text (a long line, a citation, a bullet or a page list).
const leadsBody = n => n !== undefined && (n.length >= 45 || /^[A-Z][A-Za-z ]{2,20}:\s/.test(n) || CITE.test(n) || BULLET.test(n) || LEADER.test(n));
const isHeading = (s, prevEnded, next) => prevEnded && leadsBody(next) && s.length <= 60 && /^[A-Z0-9“"]/.test(s) && noStop(s) && !BULLET.test(s) && !CITE.test(s) && !/:\s/.test(s) && (s.match(/(^|[\s“"])[a-z]{2,}/g) || []).length <= 4;

// ---- chapters: names come from the contents list on page 1 ----
const TOC_NAMES = {};
for(const l of lines.slice(0, 40)){
  const m = l.match(/^(Chapter \d+|Appendix [IVX]+):\s*(.*?)\s*\.{3,}/i);
  if(m) TOC_NAMES[m[1].toLowerCase()] = m[2];
}
const chapters = [];            // {id, label, title, page}
let pendingChapter = null;

function renderPage(p){
  const out = [];
  let para = null, prevEnded = true, prevShort = true;
  const flush = () => { if(para){ out.push(para.tag === "li" ? `<p class="li">${para.text}</p>` : `<p>${para.text}</p>`); para = null; } };
  const L = p.lines;
  for(let i = 0; i < L.length; i++){
    const s = L[i].trim();
    if(!s){ flush(); prevEnded = true; continue; }

    // Chapter / appendix opener
    let cm = s.match(/^(Chapter \d+|APPENDIX [IVX]+|Appendix [IVX]+)$/);
    if(cm){
      flush();
      const label = cm[1].replace(/^APPENDIX/, "Appendix");
      let title = TOC_NAMES[label.toLowerCase()] || "";
      while(i + 1 < L.length && !L[i + 1].trim()) i++;
      const nextLine = (L[i + 1] || "").trim();
      if(!title && nextLine && !LEADER.test(nextLine)){ title = nextLine; i++; }
      else if(nextLine.toLowerCase() === title.toLowerCase()) i++;
      const id = label.toLowerCase().replace(/\s+/g, "-");
      chapters.push({id, label, title, page: p.n});
      out.push(`<h2 class="chap" id="${id}"><span>${esc(label)}</span>${esc(title)}</h2>`);
      prevEnded = true; continue;
    }
    // Page list with dot leaders -> links
    const lm = s.match(LEADER);
    if(lm){
      flush();
      const to = lm[3] ? `&ndash;${lm[3]}` : "";
      out.push(`<a class="toc-line" href="#p-${lm[2]}"><span>${esc(lm[1])}</span><b>p. ${lm[2]}${to}</b></a>`);
      prevEnded = true; continue;
    }
    if(CITE.test(s) && s.length < 90 && prevEnded){
      flush(); out.push(`<p class="cite">${esc(s)}</p>`); prevEnded = true; continue;
    }
    let nx = i + 1; while(nx < L.length && !L[nx].trim()) nx++;
    if(isHeading(s, prevEnded || prevShort, L[nx] && L[nx].trim()) && !(para && !ends(para.last))){
      flush(); out.push(`<h3>${esc(s)}</h3>`); prevEnded = true; prevShort = true; continue;
    }
    const bullet = BULLET.test(s);
    const startNew = !para || bullet || (ends(para.last) && para.lastLen < 70);
    if(startNew){
      flush();
      para = {tag: bullet ? "li" : "p", text: esc(s), last: s, lastLen: s.length};
    } else {
      // rejoin a wrapped line; a trailing hyphen inside a word joins without a space
      para.text += (/[a-z]-$/.test(para.last) ? "" : " ") + esc(s);
      if(/[a-z]-$/.test(para.last)) para.text = para.text.replace(/-(\S*)$/, "$1");
      para.last = s; para.lastLen = s.length;
    }
    prevEnded = ends(s); prevShort = s.length < 60;
  }
  flush();
  return `<section class="pg" id="p-${p.n}" aria-label="Page ${p.n}"><div class="pno">p. ${p.n}</div>${out.join("\n")}</section>`;
}

const body = pages.map(renderPage).join("\n");
const nav = chapters.map(c => `<a href="#${c.id}"><small>${esc(c.label)}</small>${esc(c.title)}</a>`).join("");
const meta = (() => {
  const p2 = (pages.find(p => p.n === 2) || {lines: []}).lines.join("\n");
  const g = k => (p2.match(new RegExp(k + ":\\s*(.+)")) || [])[1] || "";
  return {edition: g("Edition"), version: g("Version"), rev: g("Revision Date")};
})();

const html = `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>The Storm Standard · Storm HQ</title>
<link rel="icon" type="image/png" href="../../shared/det250-patch-icon.png">
<link rel="stylesheet" href="../../shared/det250.css">
<!-- GENERATED by tools/build-storm-standard.mjs. Edit the script, not this file. -->
<style>
:root{--tone:#0369a1;color-scheme:light}
:root[data-theme="dark"]{color-scheme:dark}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){color-scheme:dark}}
*{box-sizing:border-box}
html,body{margin:0}
html{scroll-padding-top:16px}
body{background:var(--d250-page);color:var(--d250-ink);font:16px/1.65 var(--d250-font);-webkit-font-smoothing:antialiased}
:focus-visible{outline:3px solid var(--d250-gold);outline-offset:2px}
.wrap{max-width:1120px;margin:0 auto;padding:20px 16px 0;display:grid;grid-template-columns:250px minmax(0,1fr);gap:28px;align-items:start}
@media (max-width:880px){.wrap{grid-template-columns:minmax(0,1fr)}}
.side{position:sticky;top:16px;display:flex;flex-direction:column;gap:12px}
@media (max-width:880px){.side{position:static}}
.box{background:var(--d250-surface);border:1px solid var(--d250-line);border-radius:14px;box-shadow:var(--d250-shadow)}
.back{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:700;color:var(--d250-soft);text-decoration:none}
.back:hover{color:var(--d250-ink)}
.nav{padding:8px}
.nav a{display:block;padding:7px 10px;border-radius:9px;color:var(--d250-ink);text-decoration:none;font-size:14px;font-weight:600;line-height:1.3}
.nav a small{display:block;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--d250-soft)}
.nav a:hover{background:var(--d250-surface-2)}
.nav a.on{background:color-mix(in srgb,var(--tone) 18%,transparent)}
.find{padding:10px;display:flex;flex-direction:column;gap:8px}
.find label{font-size:11.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--d250-soft)}
.find .row{display:flex;gap:6px}
.find input{flex:1;min-width:0;font:inherit;font-size:14px;color:inherit;padding:8px 10px;border-radius:9px;border:1px solid var(--d250-line-strong);background:var(--d250-surface-2)}
.find button{font:inherit;font-size:13px;font-weight:700;color:inherit;padding:0 10px;border-radius:9px;border:1px solid var(--d250-line-strong);background:transparent;cursor:pointer}
.find .st{font-size:12.5px;color:var(--d250-soft);min-height:18px}
.doc{min-width:0}
.meta{padding:14px 18px;margin-bottom:16px;font-size:14px;color:var(--d250-soft)}
.meta b{color:var(--d250-ink)}
.pg{position:relative;padding:22px 0 8px;border-top:1px dashed var(--d250-line)}
.pg:first-of-type{border-top:0}
.pno{position:absolute;top:-10px;right:0;font-size:11.5px;font-weight:700;color:var(--d250-faint);background:var(--d250-page);padding:0 0 0 8px}
.doc p{margin:0 0 12px;max-width:72ch;overflow-wrap:anywhere}
.doc p.li{padding-left:18px;text-indent:-12px;margin-bottom:6px}
.doc p.cite{font-size:12.5px;font-weight:700;letter-spacing:.04em;color:var(--d250-gold);margin:-6px 0 10px}
.doc h2.chap{margin:6px 0 16px;font-size:clamp(24px,4vw,32px);line-height:1.15;font-weight:800;letter-spacing:-.01em}
.doc h2.chap span{display:block;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--d250-gold);margin-bottom:4px}
.doc h3{margin:18px 0 8px;font-size:18px;line-height:1.3;font-weight:800}
.toc-line{display:flex;gap:12px;align-items:baseline;justify-content:space-between;max-width:72ch;padding:6px 8px;margin:0;border-radius:8px;color:var(--d250-ink);text-decoration:none;font-size:15px}
.toc-line b{flex:none;font-size:12.5px;color:var(--d250-soft);font-weight:700}
.toc-line:hover{background:var(--d250-surface-2)}
mark{background:color-mix(in srgb,var(--d250-gold) 45%,transparent);color:inherit;border-radius:3px}
mark.now{background:var(--d250-gold);color:#16161a}
@media print{.d250-bar,.d250-head,.side,.d250-foot{display:none!important}.wrap{display:block;padding:0}.pg{break-inside:auto}.pno{position:static}body{background:#fff;color:#000}}
</style>
</head>
<body>
<a class="d250-bar" href="../../" aria-label="Storm HQ, Det 250: all tools"><img src="../../shared/det250-patch-icon.png" alt="" width="26" height="26"><span class="d250-name">Storm HQ</span><span class="d250-sub">Det 250</span><span class="d250-all"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>All tools</span></a>
<header class="d250-head" style="--tone:#0369a1">
  <div class="d250-head-in">
    <span class="d250-head-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 21.5A2.5 2.5 0 0 1 6.5 19H20v3H6.5"/><path d="M12 6l1.2 2.5 2.8.4-2 2 .5 2.8-2.5-1.3-2.5 1.3.5-2.8-2-2 2.8-.4z"/></svg></span>
    <div class="d250-head-text">
      <p class="d250-eyebrow">Det 250 · Documents and Policy</p>
      <h1>The Storm Standard</h1>
      <p class="d250-head-sub">Detachment 250's cadet reference: legacy, officership, history, strategy and resources.</p>
    </div>
  </div>
</header>
<div class="wrap">
  <aside class="side">
    <a class="back" href="../"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>Documents and Policy</a>
    <nav class="box nav" aria-label="Chapters">${nav}</nav>
    <form class="box find" id="find" role="search">
      <label for="q">Find in the Standard</label>
      <div class="row"><input id="q" type="search" placeholder="e.g. Code of Conduct" autocomplete="off"><button type="submit" aria-label="Next match">Next</button></div>
      <div class="st" id="st" aria-live="polite"></div>
    </form>
  </aside>
  <main class="doc" id="doc">
    <div class="box meta"><b>${esc(meta.edition)}</b>, version ${esc(meta.version)}, revised ${esc(meta.rev)}. OPR: Education Officer. Approval: Detachment Commander, AFROTC Detachment 250. Official Air Force, Space Force, AFROTC and federal publications take precedence over this document.</div>
${body}
  </main>
</div>
<footer class="d250-foot">
  <img class="footer-patch" src="../../shared/det250-patch.png" alt="AFROTC Detachment 250 patch" width="96" height="100" loading="lazy">
  <p class="motto">Optimi In Medio Patrae</p>
  <p class="tagline">We Are The Storm</p>
  <p class="footer-note">Storm HQ &middot; AFROTC Detachment 250 &middot; Iowa State University</p>
  <p class="source-line">Web edition of The Storm Standard (${esc(meta.edition)}, ${esc(meta.rev)}), built from the detachment's PDF. Page numbers match the PDF. Recommend changes through the cadet chain of command to the Education Officer.</p>
  <p class="created-by">Created by Captain Scott Russell, Operations Flight Commander, AFROTC Detachment 250</p>
</footer>
<script>
(() => {
  // Highlight the chapter you're reading in the side nav
  const links = [...document.querySelectorAll(".nav a")];
  const heads = links.map(a => document.querySelector(a.getAttribute("href")));
  const mark = () => {
    let k = 0; heads.forEach((h, i) => { if(h && h.getBoundingClientRect().top < 120) k = i; });
    links.forEach((a, i) => a.classList.toggle("on", i === k));
  };
  addEventListener("scroll", mark, {passive:true}); mark();

  // Find: highlight every match, Next steps through them
  const doc = document.getElementById("doc"), q = document.getElementById("q"), st = document.getElementById("st");
  let hits = [], at = -1, last = "";
  const clear = () => { doc.querySelectorAll("mark").forEach(m => m.replaceWith(document.createTextNode(m.textContent))); doc.normalize(); hits = []; at = -1; };
  const run = term => {
    clear(); last = term; if(term.length < 2){ st.textContent = ""; return; }
    const re = new RegExp(term.replace(/[.*+?^\${}()|[\\]\\\\]/g, "\\\\$&"), "gi");
    const walk = document.createTreeWalker(doc, NodeFilter.SHOW_TEXT);
    const nodes = []; while(walk.nextNode()) nodes.push(walk.currentNode);
    for(const n of nodes){
      const t = n.nodeValue; re.lastIndex = 0; if(!re.test(t)) continue;
      const frag = document.createDocumentFragment(); let i = 0; re.lastIndex = 0; let m;
      while((m = re.exec(t))){ frag.append(t.slice(i, m.index)); const mk = document.createElement("mark"); mk.textContent = m[0]; frag.append(mk); hits.push(mk); i = m.index + m[0].length; }
      frag.append(t.slice(i)); n.replaceWith(frag);
    }
    st.textContent = hits.length ? hits.length + " matches" : "No matches";
  };
  document.getElementById("find").addEventListener("submit", e => {
    e.preventDefault();
    const term = q.value.trim();
    if(term !== last) run(term);
    if(!hits.length) return;
    if(hits[at]) hits[at].classList.remove("now");
    at = (at + 1) % hits.length;
    hits[at].classList.add("now");
    hits[at].scrollIntoView({block:"center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"});
    st.textContent = (at + 1) + " of " + hits.length;
  });
  q.addEventListener("input", () => { if(!q.value.trim()){ clear(); last = ""; st.textContent = ""; } });
})();
</script>
</body>
</html>
`;
fs.mkdirSync(outFile.replace(/[\\/][^\\/]+$/, ""), {recursive:true});
fs.writeFileSync(outFile, html);
console.log("wrote", outFile, pages.length, "pages,", chapters.length, "chapters,", (html.length/1024|0) + " KB");
