/* D250Refs: the "References" block every Storm HQ tool uses when it cites a
   regulation, form or publication. The documents themselves live in one place,
   documents/library.js (the Documents and Policy page); a tool only names the
   ids it cites and says, in one line, why it cites them.

   Load after ../documents/library.js:
     <script src="../documents/library.js"></script>
     <script src="../shared/doc-refs.js"></script>
     D250Refs.mount(el, {
       from: "ribbon-rack",                     // this tool's folder: the viewer's back button returns here
       items: [
         {id: "afrotci-36-2011v3", note: "Table 15.1: award criteria.", page: 120},  // page = PDF page to open at
         {id: "ext-dafi36-2903", note: "Ribbon placement (4.5.2)."}
       ]
     });
   Hosted PDFs open in documents/view/ (back button to the tool, previous and
   next, download). e-Publishing items open the official site in a new tab.
   D250Refs.href(id, from, page) gives just the link, for inline citations;
   D250Refs.view(id, from, page) does the same for a restricted (vault) id.
*/
(function(){
  const ROOT = "../";   // every tool sits one folder below the site root
  const lib = () => window.D250_DOCS || [];
  const sec = id => (window.D250_DOC_SECTIONS || []).find(s => s.id === id) || {};
  const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const SVG = p => `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const ICON = {
    afrotc: SVG('<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M8.5 11.5l2.5 2.5 4.5-5"/>'),
    fitness: SVG('<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/>'),
    external: SVG('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>'),
    forms: SVG('<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>')
  };
  const EXT = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-label="Opens e-Publishing in a new tab"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';

  const find = id => lib().find(d => d.id === id);
  // The viewer link for any document id, public or restricted (restricted ids
  // come from documents/restricted/vault.json and ask for the password).
  const view = (id, from, page) => ROOT + "documents/view/?id=" + encodeURIComponent(id) + (from ? "&from=" + encodeURIComponent(from) : "") + (page ? "&page=" + page : "");
  function href(id, from, page){
    const d = find(id);
    if(!d) return ROOT + "documents/";
    if(!d.src) return /^https?:/.test(d.href) ? d.href : ROOT + "documents/" + d.href;
    return view(id, from, page);
  }

  let styled = false;
  function style(){
    if(styled) return; styled = true;
    const css = `
.d250r{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px}
.d250r-card{position:relative;display:flex;gap:14px;align-items:flex-start;padding:14px 16px;background:var(--d250-surface);border:1px solid var(--d250-line);border-radius:14px;box-shadow:var(--d250-shadow);color:var(--d250-ink);text-decoration:none;font-family:var(--d250-font);transition:transform .25s var(--d250-ease),border-color .2s,box-shadow .25s}
.d250r-card:hover{transform:translateY(-3px);border-color:var(--tone);box-shadow:0 10px 24px rgba(0,0,0,.18)}
.d250r-card:focus-visible{outline:2px solid var(--d250-gold);outline-offset:2px}
.d250r-ic{flex:none;width:44px;height:44px;border-radius:12px;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,var(--tone),color-mix(in srgb,var(--tone) 60%,#000));transition:transform .3s var(--d250-ease)}
.d250r-card:hover .d250r-ic{transform:rotate(-6deg) scale(1.06)}
.d250r-b{min-width:0;flex:1}
.d250r-n{display:flex;align-items:center;gap:6px;font-size:15px;font-weight:800;line-height:1.25;overflow-wrap:anywhere}
.d250r-n svg{flex:none;color:var(--d250-soft)}
.d250r-t{display:block;margin-top:1px;font-size:12.5px;font-weight:700;color:var(--tone-ink,var(--tone))}
.d250r-w{margin:4px 0 0;font-size:13px;line-height:1.45;color:var(--d250-soft)}
.d250r-card{--tone-ink:var(--tone)}
:root[data-theme="dark"] .d250r-card{--tone-ink:color-mix(in srgb,var(--tone) 55%,#fff)}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .d250r-card{--tone-ink:color-mix(in srgb,var(--tone) 55%,#fff)}}
.d250r-all{display:inline-flex;align-items:center;gap:8px;margin-top:12px;font:700 13px var(--d250-font);color:var(--d250-gold);text-decoration:none}
.d250r-all:hover{text-decoration:underline}
@media (prefers-reduced-motion:reduce){.d250r-card,.d250r-ic{transition:none}.d250r-card:hover{transform:none}}`;
    const el = document.createElement("style"); el.textContent = css; document.head.append(el);
  }

  function card(item, from){
    const d = find(item.id);
    if(!d) return "";
    const s = sec(d.sec), ext = !d.src && /^https?:/.test(d.href);
    const icon = /form|sheet/i.test(d.num) && d.sec === "external" ? ICON.forms : (ICON[d.sec] || ICON.afrotc);
    return `<a class="d250r-card" href="${esc(href(item.id, from, item.page))}"${ext ? ' target="_blank" rel="noopener"' : ""} style="--tone:${s.tone || "#0369a1"}">
      <span class="d250r-ic">${icon}</span>
      <span class="d250r-b"><span class="d250r-n">${esc(d.num)}${ext ? EXT : ""}</span><span class="d250r-t">${esc(d.title)}</span><p class="d250r-w">${esc(item.note || d.what)}</p></span></a>`;
  }

  function mount(el, opts){
    if(!el) return;
    style();
    const from = opts.from || "";
    el.innerHTML = `<div class="d250r">${(opts.items || []).map(i => card(i, from)).join("")}</div>
      <a class="d250r-all" href="${ROOT}documents/">Every regulation and form in Documents and Policy <span aria-hidden="true">&rarr;</span></a>`;
  }

  // Remember exactly where the reader was (including #seat hashes, which the
  // referrer drops) so the viewer's back button returns to that spot.
  document.addEventListener("click", e => {
    const a = e.target.closest && e.target.closest('a[href*="documents/view/"]');
    if(!a) return;
    const from = new URL(a.href, location.href).searchParams.get("from");
    if(from) try { sessionStorage.setItem("d250-docs-back-" + from, location.href); } catch(_){}
  }, true);

  window.D250Refs = {mount, href, view, find};
})();
