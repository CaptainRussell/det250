/* Storm HQ ODT Tool.
   Every ODT's details live in odt/vault.json, encrypted with the cadet password (the same one
   as Documents and Policy): PBKDF2-SHA256 + AES-256-GCM, the layout of tools/encrypt.mjs.
   Cadre edit it on the Cadre Admin ODT tab. People, photos, ranks and positions come from
   data/roster.js. The password is kept for this browser tab in sessionStorage d250-docs-pass,
   so one unlock opens both ODT and Documents and Policy.

   Decrypted data:
   { title, former:{key:[last, first, class]},
     events:[{ id, name, place, start, end (YYYY-MM-DD), note,
               info:[{title, text}], itinerary:[{date, time, end, what, where, note}],
               itin:{id, name, size} (the itinerary file, a PDF with the hotel address and the meals),
               roster:[roster keys, cadre too], sections:[room groups], rooms:[{room, sec, cadets:[keys]}],
               docs:[{id, title, note, name, size}],
               vans:[{id, name, kind (isu15, gov11, other), seats (driver included), driver, relief, riders:[keys]}] }] }
   The itinerary and each supporting document are their own locked files, files/<id>.json, same layout.
   Cadre (class "Cadre" in the roster) can be on the roster and always have a room to themselves.
   Older ODTs may still hold an itinerary list (itinerary:[{date, time, end, what, where, note}]); it shows
   when there is no itinerary file. Lodging and meal lists are no longer shown.
   Page (Captain Russell, 22 Nov 2026: get to the meat first): All ODTs, then per ODT the name, the
   Itinerary and document links (each opens a pop-out viewer with Download), "Your van" and "Your room"
   (the pick is kept in localStorage d250-odt-me-v1), Things to know folded, then Vans and Rooms tabs
   laid out compact so everyone fits one desktop screen.
   Links: #<event id>/<tab> (tabs: vans, rooms; old overview and roster links land, docs and itinerary
   open the vans with the itinerary popped out), #all. */
(function(){
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const R = window.D250_ROSTER || {people:{}, seats:[], flights:{}, flightsPoc:{}};
const PASS_KEY = "d250-docs-pass";
const RING = {AS100:"r100",AS200:"r200",AS250:"r250",AS300:"r300",AS400:"r400",AS500:"r500",Graybeard:"rgb",Cadre:"rcad"};
const LABEL = {AS100:"AS 100",AS200:"AS 200",AS250:"AS 250",AS300:"AS 300",AS400:"AS 400",AS500:"AS 500",Graybeard:"Graybeard",Cadre:"Cadre"};
const CLASS_ORDER = ["Cadre","AS400","AS300","Graybeard","AS500","AS250","AS200","AS100"];
const FL = {afl:"Alpha",bfl:"Bravo",cfl:"Charlie",dfl:"Delta"};
const TABS = [["vans","Vans"],["rooms","Rooms"]];
const MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DOW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

let D = null, EVENTS = [], EV = "", TAB = "vans";

/* ---------- crypto ---------- */
const b64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
async function openBytes(pw, v){
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(pw), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey({name:"PBKDF2", salt:b64(v.salt), iterations:v.iter, hash:"SHA-256"}, base, {name:"AES-GCM", length:256}, false, ["decrypt"]);
  return new Uint8Array(await crypto.subtle.decrypt({name:"AES-GCM", iv:b64(v.iv)}, key, b64(v.data)));
}
const open = async (pw, v) => JSON.parse(new TextDecoder().decode(await openBytes(pw, v)));
let PW = "";
const BLOBS = {}, BYTES = {};
async function docBytes(id){
  if (!BYTES[id]){
    const r = await fetch(`files/${encodeURIComponent(id)}.json`, {cache:"no-store"});
    if (!r.ok) throw new Error("missing");
    BYTES[id] = await openBytes(PW, await r.json());
  }
  return BYTES[id];
}
async function docUrl(id){
  if (!BLOBS[id]) BLOBS[id] = URL.createObjectURL(new Blob([await docBytes(id)], {type:"application/pdf"}));
  return BLOBS[id];
}
async function drawPdf(id, box, label = "Itinerary"){   // a locked PDF (itinerary or document), page by page, sized to the column
  const lib = window.pdfjsLib; if (!lib) throw new Error("no pdf.js");
  lib.GlobalWorkerOptions.workerSrc = "../documents/vendor/pdfjs/pdf.worker.min.js";
  const pdf = await lib.getDocument({data:(await docBytes(id)).slice()}).promise;
  box.innerHTML = "";
  const w = box.clientWidth || 800, dpr = Math.min(window.devicePixelRatio || 1, 2);
  for (let n = 1; n <= pdf.numPages; n++){
    const page = await pdf.getPage(n), base = page.getViewport({scale:1});
    const v = page.getViewport({scale:(w * dpr) / base.width});
    const c = document.createElement("canvas"); c.width = v.width; c.height = v.height;
    c.setAttribute("role", "img"); c.setAttribute("aria-label", `${label} page ${n} of ${pdf.numPages}`);
    box.appendChild(c);
    await page.render({canvasContext:c.getContext("2d"), viewport:v}).promise;
  }
}
const PDF_ICON = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/></svg>`;

/* ---------- dates ---------- */
const day = s => { const m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(s || ""); return m ? new Date(+m[1], m[2] - 1, +m[3]) : null; };
const today = (() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); })();
const isPast = e => { const d = day(e.end || e.start); return !!d && d < today; };
const fmt = d => `${d.getDate()} ${MON[d.getMonth()]} ${d.getFullYear()}`;
function dates(e){
  const a = day(e.start), b = day(e.end) || a; if (!a) return "";
  if (+a === +b) return fmt(a);
  if (a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()) return `${a.getDate()} to ${fmt(b)}`;
  return `${fmt(a)} to ${fmt(b)}`;
}
const dayLabel = s => { const d = day(s); return d ? `${DOW[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]}` : "Any day"; };
function pill(e){
  if (isPast(e)) return `<span class="pill past">Past</span>`;
  const a = day(e.start); return `<span class="pill">${a && a > today ? "Upcoming" : "Happening now"}</span>`;
}
function defaultEvent(){
  const up = EVENTS.filter(e => !isPast(e)).sort((x, y) => (x.start || "").localeCompare(y.start || ""));
  return (up[0] || EVENTS[0] || {}).id || "";
}

/* ---------- people ---------- */
function who(key){
  const p = R.people[key] || (D.former || {})[key];
  if (!p) return {key, first:"", last:key, cls:"", rank:"", pos:"", flt:""};
  const seat = R.people[key] ? R.seats.find(s => s.poc && s.poc[0] === key) : null;
  let flt = "";
  if (R.people[key]) for (const list of [R.flights, R.flightsPoc]) for (const [f, ks] of Object.entries(list || {})) if (ks.includes(key)) flt = FL[f];
  if (!flt && seat && /FLT\//.test(seat.des || "")) flt = seat.des.split(" ")[0];
  const cls = p[2];
  const rank = seat ? seat.poc[1] : cls === "AS100" ? "C/4C" : /AS(200|250|500)/.test(cls) ? "C/3C" : "";
  if (cls === "Cadre") flt = "";
  return {key, first:p[1], last:p[0], cls, rank, pos:seat ? seat.title : "", flt};
}
function face(c, sz = 48){
  const ini = ((c.first || "")[0] || "") + ((c.last || "")[0] || "");
  return `<span class="d250-face ${RING[c.cls] || ""}" style="--sz:${sz}px" aria-hidden="true"><b>${esc(ini.toUpperCase())}</b><img src="../org-chart/photos/${encodeURIComponent(c.key)}.jpg" alt="" onerror="this.remove()"></span>`;
}
const fullName = c => [c.rank, c.first, c.last].filter(Boolean).join(" ");
function person(c){
  return `<div class="p" data-name="${esc((c.first + " " + c.last + " " + c.last + " " + c.first).toLowerCase())}">${face(c)}<div class="txt">
    <div class="nm">${esc(fullName(c))}</div>
    ${c.pos ? `<div class="pos">${esc(c.pos)}</div>` : ""}
    <div class="tg">${c.cls ? `<span class="cls ${RING[c.cls] || ""}">${esc(LABEL[c.cls] || c.cls)}</span>` : ""}${c.flt ? `<span class="flt">${esc(c.flt)} Flight</span>` : ""}</div></div></div>`;
}
function legend(keys){
  const used = new Set(keys.map(k => who(k).cls));
  return `<div class="legend" aria-label="AS class colors">${Object.keys(RING).filter(c => used.has(c)).map(c => `<span><i style="background:var(--${c === "Graybeard" ? "gb" : c.toLowerCase()})"></i>${LABEL[c]}</span>`).join("")}</div>`;
}
const rosterOf = e => e.roster && e.roster.length ? e.roster : [...new Set((e.rooms || []).flatMap(r => r.cadets))];
const empty = t => `<p class="empty">${esc(t)}</p>`;

/* ---------- what a cadet comes for (Captain Russell, 22 Nov 2026): my van, my roommate, then the
   when and where; the itinerary and documents are links at the top that open in a pop-out ---------- */
const ME_KEY = "d250-odt-me-v1";                     // the cadet this browser last picked, so their assignment shows first
let ME = ""; try{ ME = localStorage.getItem(ME_KEY) || ""; }catch(_){}
let JUMP = false, POP = "";             // POP: a document to pop out after render                                    // scroll to your own room or van after the tab opens
const ridersOf = v => [v.driver, v.relief, ...(v.riders || [])].filter(Boolean);
const roomOf = (e, k) => (e.rooms || []).find(r => r.cadets.includes(k));
const vanOf = (e, k) => (e.vans || []).find(v => ridersOf(v).includes(k));
const roleIn = (v, k) => v.driver === k ? "Driver" : v.relief === k ? "Relief driver" : "";
const nameKey = c => (c.first + " " + c.last + " " + c.last + " " + c.first).toLowerCase();
const short = c => [c.rank, c.last].filter(Boolean).join(" ");
const KIND = {isu15:"15-passenger ISU van", gov11:"11-passenger GOV"};
const SEARCH = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`;
const docsOf = e => [...(e.itin ? [{id:e.itin.id, title:"Itinerary", name:e.itin.name || "Itinerary.pdf", note:"The schedule, the hotel address and the meals provided."}] : []), ...(e.docs || [])];
function docBar(e){                                  // Itinerary, Excusal Letter, ... : each opens the pop-out viewer
  const L = docsOf(e); if (!L.length) return "";
  return `<nav class="doclinks" aria-label="Itinerary and documents">${L.map(d => `<button type="button" class="doclink" data-doc="${esc(d.id)}">${PDF_ICON}<span>${esc(d.title)}</span></button>`).join("")}</nav>`;
}
function meBox(e){
  const ros = rosterOf(e);
  if (!ros.length) return "";
  if (!ME || !ros.includes(ME)) return `<section class="me find-me" aria-labelledby="meH"><h2 id="meH">Find your van and room</h2>
    <div class="find">${SEARCH}<label class="sr" for="meq">Type your name</label><input id="meq" type="search" placeholder="Type your name" autocomplete="off" aria-controls="meHits"></div>
    <div class="hits" id="meHits"></div></section>`;
  const c = who(ME), r = roomOf(e, ME), v = vanOf(e, ME);
  const mates = r ? r.cadets.filter(k => k !== ME).map(who) : [];
  const role = v ? roleIn(v, ME) : "", drv = v && v.driver && v.driver !== ME ? who(v.driver) : null;
  const vanTxt = !(e.vans || []).length ? "Not posted yet" : !v ? "Not assigned yet" :
    [role ? `<span class="you">You're the ${esc(role.toLowerCase())}</span>` : "", drv ? `Driver ${face(drv, 22)}<span>${esc(short(drv))}</span>` : "", esc(KIND[v.kind] || "")].filter(Boolean).join(`<i class="dot" aria-hidden="true">·</i>`);
  const roomTxt = !(e.rooms || []).length ? "Not posted yet" : !r ? "Not assigned yet" :
    mates.length ? mates.map(m => `${face(m, 22)}<span>${esc(fullName(m))}</span>`).join(" and ") : "A room to yourself";
  return `<section class="me set" aria-label="Your assignment">
    <div class="mehd">${face(c, 40)}<div class="txt"><div class="nm">${esc(fullName(c))}</div><button class="linkbtn" id="notMe" type="button">Not you?</button></div></div>
    <button class="slot" type="button" data-jump="vans"${v ? "" : " disabled"}><small>Your van</small><b>${v ? esc(v.name) : "None"}</b><span class="with">${vanTxt}</span></button>
    <button class="slot" type="button" data-jump="rooms"${r ? "" : " disabled"}><small>Your room</small><b>${r ? esc(r.room) : "None"}</b><span class="with">${mates.length ? `<span class="lbl">Roommate${mates.length > 1 ? "s" : ""}</span>` : ""}${roomTxt}</span></button>
  </section>`;
}
function infoFold(e){                                // when, where and how: short notes cadre add; folded, it never pushes the lists down
  const L = e.info || [], old = !e.itin && (e.itinerary || []).length;
  if (!L.length && !old) return "";
  const oldItin = old ? `<div class="card wide"><h3>Itinerary</h3>${byDay(e.itinerary, x => `<div class="row"><div class="t">${esc(x.time || "")}${x.end ? `<span class="s"> to ${esc(x.end)}</span>` : ""}</div>
    <div><div class="w">${esc(x.what || "")}</div>${x.where ? `<div class="s">${esc(x.where)}</div>` : ""}${x.note ? `<div class="s">${esc(x.note)}</div>` : ""}</div></div>`)}</div>` : "";
  return `<details class="fold" id="infoFold"><summary><span class="ft">Things to know</span><span class="fh">${esc(L.map(i => i.title).slice(0, 4).join(" · ") || "Schedule")}</span><span class="caret" aria-hidden="true">▾</span></summary>
    <div class="cards">${L.map(i => `<div class="card"><h3>${esc(i.title)}</h3><p>${esc(i.text)}</p></div>`).join("")}${oldItin}</div></details>`;
}
function wireMe(e){
  const nm = $("#notMe");
  if (nm) nm.addEventListener("click", () => { ME = ""; try{ localStorage.removeItem(ME_KEY); }catch(_){} render(); const q = $("#meq"); if (q) q.focus(); });
  document.querySelectorAll("[data-jump]").forEach(b => b.addEventListener("click", () => { JUMP = true; go(`${EV}/${b.dataset.jump}`); }));
  const q = $("#meq"); if (!q) return;
  const pick = k => { ME = k; try{ localStorage.setItem(ME_KEY, k); }catch(_){} render(); };
  const ros = rosterOf(e).map(who);
  const list = () => {
    const s = q.value.trim().toLowerCase(), box = $("#meHits");
    if (s.length < 2){ box.innerHTML = ""; return []; }
    const hits = ros.filter(c => nameKey(c).includes(s)).sort((a, b) => (a.last + a.first).localeCompare(b.last + b.first)).slice(0, 8);
    box.innerHTML = hits.length ? hits.map(c => `<button type="button" class="hit" data-me="${esc(c.key)}">${face(c, 28)}<span>${esc(fullName(c))}</span></button>`).join("")
      : `<p class="miss">No one by that name is on this ODT.</p>`;
    box.querySelectorAll("[data-me]").forEach(b => b.addEventListener("click", () => pick(b.dataset.me)));
    return hits;
  };
  q.addEventListener("input", list);
  q.addEventListener("keydown", ev => { if (ev.key === "Enter"){ const h = list(); if (h.length) pick(h[0].key); } });
}

/* ---------- tabs: compact, so every cadet and cadre fits one desktop screen (like the Org Chart) ---------- */
const printBar = keys => `<div class="toolbar">${legend(keys)}<button class="btn small" id="print" type="button">Print</button></div>`;
const row = (c, extra = "", plain) => `<div class="p${c.key === ME ? " me-row" : ""}" title="${esc(fullName(c) + (c.pos ? ", " + c.pos : ""))}">${face(c, 26)}<span class="nm">${plain ? `${esc(c.first)} ${esc(c.last)}` : esc(fullName(c))}</span>${extra}</div>`;
function room(r){
  const ppl = (r.cadets || []).map(who), solo = ppl.length === 1, label = String(r.room || "");
  const cad = solo && ppl[0].cls === "Cadre", mine = r.cadets.includes(ME);
  return `<article class="room${solo ? " solo" : ""}${cad ? " cadre" : ""}${mine ? " mine" : ""}" aria-label="Room ${esc(label)}: ${esc(ppl.map(c => c.first + " " + c.last).join(" and "))}">
    <div class="rn"><b${label.length > 3 ? ` class="long"` : ""}>${esc(label)}</b></div>
    <div class="pp">${ppl.map(c => row(c, "", true)).join("")}${solo && !cad ? `<div class="p bonus"><span class="star" aria-hidden="true">★</span><span class="nm">Bonus room</span></div>` : ""}</div></article>`;
}
function rooms(e){
  const L = e.rooms || [];
  if (!L.length) return empty("Rooms aren't posted yet.");
  const secs = [...(e.sections || [])]; for (const r of L) if (!secs.includes(r.sec)) secs.push(r.sec);
  return printBar(L.flatMap(r => r.cadets)) + `<div id="rooms" class="roomgrid">${secs.map(s => {
    const list = L.filter(r => r.sec === s); if (!list.length) return "";
    return `<h2 class="gh">${esc(s)}<span>${list.length}</span></h2>${list.map(room).join("")}`;
  }).join("")}</div>`;
}
function vans(e){
  const L = e.vans || [];
  if (!L.length) return empty("Van assignments aren't posted yet.");
  const role = t => `<b class="role">${t}</b>`;
  return printBar(L.flatMap(ridersOf)) + `<div class="vangrid" style="--n:${L.length}">` + L.map(v => {
    const riders = (v.riders || []).slice().sort((a, b) => { const x = who(a), y = who(b); return (CLASS_ORDER.indexOf(x.cls) - CLASS_ORDER.indexOf(y.cls)) || (x.last + x.first).localeCompare(y.last + y.first); });
    const mine = ridersOf(v).includes(ME);
    return `<section class="van${mine ? " mine" : ""}"><h2>${esc(v.name)}<span>${esc(KIND[v.kind] || "Vehicle")} · ${ridersOf(v).length}</span></h2>
      ${v.driver ? row(who(v.driver), role("Driver")) : ""}${v.relief ? row(who(v.relief), role("Relief")) : ""}${riders.map(k => row(who(k))).join("")}</section>`;
  }).join("") + `</div>`;
}
function byDay(list, row_){
  const groups = {};
  for (const x of list) (groups[x.date || ""] = groups[x.date || ""] || []).push(x);
  return Object.keys(groups).sort().map(d => `<div class="day"><h3>${esc(dayLabel(d))}</h3>${groups[d].sort((a, b) => (a.time || "").localeCompare(b.time || "")).map(row_).join("")}</div>`).join("");
}

/* ---------- the pop-out document viewer (itinerary, excusal letter, ...) with Download ---------- */
let DOC = null;
async function openDoc(id){
  const e = EVENTS.find(x => x.id === EV), d = e && docsOf(e).find(x => x.id === id); if (!d) return;
  DOC = d;
  const dlg = $("#docdlg");
  $("#docT").textContent = d.title; $("#docN").textContent = d.note || ""; $("#docErr").textContent = "";
  const box = $("#docPages"); box.innerHTML = `<p class="empty">Opening ${esc(d.title)}…</p>`;
  if (!dlg.open) dlg.showModal();
  try{ await drawPdf(d.id, box, d.title); }
  catch(_){ box.innerHTML = `<p class="empty">Couldn't show this document here. Use Download.</p>`; }
}
$("#docClose").addEventListener("click", () => $("#docdlg").close());
$("#docdlg").addEventListener("click", ev => { if (ev.target === ev.currentTarget) ev.currentTarget.close(); });   // click outside the panel
$("#docDl").addEventListener("click", async () => {
  if (!DOC) return;
  try{ const a = document.createElement("a"); a.href = await docUrl(DOC.id); a.download = DOC.name || DOC.title + ".pdf"; document.body.appendChild(a); a.click(); a.remove(); }
  catch(_){ $("#docErr").textContent = "Couldn't download it. Reload and try again."; }
});

/* the emblem of the command an ODT visits, in place of the calendar date (Captain Russell, 17 Nov 2026) */
const EMBLEM = {"offutt-2026-12": {src:"../documents/storm-standard/art/official/cocom-usstratcom.webp", name:"U.S. Strategic Command"}};
function allList(){
  const card = e => { const d = day(e.start);         // emblem, name and date only (Captain Russell, 17 Nov 2026)
    return `<button type="button" class="evcard${isPast(e) ? " past" : ""}" data-ev="${esc(e.id)}">
      ${EMBLEM[e.id] ? `<span class="emblem" aria-hidden="true"><img src="${esc(EMBLEM[e.id].src)}" alt="" width="60" height="60"></span>` : `<span class="cal" aria-hidden="true"><small>${d ? MON[d.getMonth()].toUpperCase() : ""}</small><b>${d ? d.getDate() : "?"}</b></span>`}
      <span><span class="t1">${esc(e.name)}</span><br><span class="t2">${esc(dates(e))}</span></span></button>`; };
  const up = EVENTS.filter(e => !isPast(e)).sort((x, y) => (x.start || "").localeCompare(y.start || "")), past = EVENTS.filter(isPast);
  return (up.length ? `<section class="sec"><h2>Current and upcoming<span>${up.length}</span></h2><div class="evlist">${up.map(card).join("")}</div></section>` : "") +
    (past.length ? `<section class="sec"><h2>Past<span>${past.length}</span></h2><div class="evlist">${past.map(card).join("")}</div></section>` : "") ||
    empty("No ODTs are posted yet.");
}
const VIEWS = {rooms, vans};
const OLD_TABS = {overview:"vans", roster:"rooms"};   // links from the first layout still land
const DOC_TABS = {docs:1, itinerary:1};            // the old Itinerary & docs tab: the vans, with the itinerary popped out

/* ---------- render ---------- */
function barBack(toAll){                             // on an ODT the bar's back pill goes to All ODTs (Captain Russell, 22 Nov 2026)
  const bar = $(".d250-bar"), pill = bar && bar.querySelector(".d250-all"); if (!pill) return;
  bar.setAttribute("href", toAll ? "#all" : "../");
  bar.setAttribute("aria-label", toAll ? "Back to All ODTs" : "Storm HQ, Det 250: all tools");
  pill.lastChild.textContent = toAll ? "All ODTs" : "All tools";
}
function render(){
  const all = TAB === "all", e = EVENTS.find(x => x.id === EV);
  barBack(!all && !!e);
  $("#modbar").hidden = all || !e;
  $("#tabs").innerHTML = TABS.map(([id, label]) => `<button type="button" role="tab" data-tab="${id}" aria-selected="${!all && TAB === id}" tabindex="${!all && TAB === id ? 0 : -1}">${label}</button>`).join("");
  if (all || !e){
    $("#ev").innerHTML = `<div><h2>All ODTs</h2><div class="meta">Pick an ODT to find your room, your van and its documents.</div></div>`;
    $("#me").innerHTML = "";
    $("#view").innerHTML = allList();
    document.title = `All ODTs · ${D.title && D.title !== "ODT Module" ? D.title : "ODT Tool"} · Storm HQ`;
  } else {
    $("#ev").innerHTML = `<div class="evt"><h2>${esc(e.name)}${pill(e)}</h2><div class="meta">${esc([dates(e), e.place, e.note].filter(Boolean).join(" · "))}</div></div>${docBar(e)}`;
    $("#me").innerHTML = meBox(e) + infoFold(e);
    $("#view").innerHTML = VIEWS[TAB](e);
    const tb = $("#view .toolbar"); $("#modtools").replaceChildren(...(tb ? [tb] : []));   // legend and Print sit beside the tabs
    $("#view").setAttribute("aria-label", `${e.name}: ${TABS.find(t => t[0] === TAB)[1]}`);
    document.title = `${e.name} ${TABS.find(t => t[0] === TAB)[1]} · Storm HQ`;
    wireMe(e);
  }
  wireView();
}
function wireView(){
  document.querySelectorAll("#tabs [data-tab]").forEach(b => b.addEventListener("click", () => go(`${EV}/${b.dataset.tab}`)));
  document.querySelectorAll("[data-ev]").forEach(b => b.addEventListener("click", () => go(`${b.dataset.ev}/vans`)));
  document.querySelectorAll("[data-all]").forEach(b => b.addEventListener("click", () => go("all")));
  const pr = $("#print"); if (pr) pr.addEventListener("click", () => window.print());
  if (JUMP){ JUMP = false; const t = document.querySelector(".room.mine, .person.mine"); if (t) setTimeout(() => t.scrollIntoView({block:"center", behavior:reduce ? "auto" : "smooth"}), 30); }
  document.querySelectorAll("[data-doc]").forEach(b => b.addEventListener("click", () => openDoc(b.dataset.doc)));
  if (POP){ const id = POP; POP = ""; openDoc(id); }
}
function go(h){ if (location.hash.slice(1) !== h) location.hash = h; else route(); }
function route(){
  const h = decodeURIComponent(location.hash.slice(1));
  if (h === "all" || !h){ if (!EVENTS.some(e => e.id === EV)) EV = defaultEvent(); TAB = "all"; render(); return; }   // opens on All ODTs
  let [id, tab] = h.split("/");
  if (DOC_TABS[tab]){ const ev_ = EVENTS.find(x => x.id === id); POP = ev_ && docsOf(ev_).length ? docsOf(ev_)[0].id : ""; tab = "vans"; }
  tab = OLD_TABS[tab] || tab; id = OLD_TABS[id] || id;
  EV = EVENTS.some(e => e.id === id) ? id : (EVENTS.some(e => e.id === EV) ? EV : defaultEvent());
  TAB = TABS.some(t => t[0] === tab) ? tab : TABS.some(t => t[0] === id) ? id : "vans";
  render();
}

$("#tabs").addEventListener("keydown", ev => {
  if (ev.key !== "ArrowLeft" && ev.key !== "ArrowRight") return;
  const i = TABS.findIndex(t => t[0] === TAB), j = (i + (ev.key === "ArrowRight" ? 1 : -1) + TABS.length) % TABS.length;
  go(`${EV}/${TABS[j][0]}`); setTimeout(() => { const b = $(`#tabs [data-tab="${TABS[j][0]}"]`); if (b) b.focus(); }, 0);
});
window.addEventListener("hashchange", () => { if (D) route(); });

/* ---------- start ---------- */
let V = null;
function show(data){
  D = data; EVENTS = (D.events || []).slice().sort((x, y) => (y.start || "").localeCompare(x.start || ""));
  if (D.title && D.title !== "ODT Module") $("#title").textContent = D.title;   // renamed ODT Tool, 17 Nov 2026
  $("#lockwrap").hidden = true; $("#app").hidden = false; route();
}
async function start(){
  try{ const r = await fetch("vault.json", {cache:"no-store"}); V = r.ok ? await r.json() : null; }catch(_){ V = null; }
  $("#loading").hidden = true;
  if (!V){ $("#lockwrap").hidden = false; $("#unlock").hidden = true; $("#lockMsg").textContent = "The ODT Tool isn't set up yet. Cadre set it up on the Cadre Admin page (ODT tab)."; return; }
  let saved = ""; try{ saved = sessionStorage.getItem(PASS_KEY) || ""; }catch(_){}
  if (saved){ try{ const data = await open(saved, V); PW = saved; show(data); return; }catch(_){} }
  $("#lockwrap").hidden = false; $("#pw").focus();
}
$("#unlock").addEventListener("submit", async ev => {
  ev.preventDefault();
  const go_ = $("#go"); $("#err").textContent = ""; go_.disabled = true; go_.textContent = "Checking…";
  try{
    const real = (window.D250SignIn && await window.D250SignIn.docsPass($("#pw").value)) || $("#pw").value;   // admin password works too
    const data = await open(real, V); PW = real;
    try{ sessionStorage.setItem(PASS_KEY, real); }catch(_){}
    if (window.D250SignIn) window.D250SignIn.adopt($("#pw").value).catch(() => {});   // signs the tab in as cadet or cadre
    show(data);
  }catch(_){
    $("#err").textContent = "That password didn't work. Try again.";
    const l = $("#lock"); l.classList.remove("shake"); void l.offsetWidth; l.classList.add("shake");
  }finally{ go_.disabled = false; go_.textContent = "Unlock"; }
});
start();
})();
