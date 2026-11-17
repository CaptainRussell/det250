/* Storm HQ ODT Module.
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
   Page (Captain Russell, 17 Nov 2026: a cadet comes for their room and van): All ODTs, then per ODT a
   "Find your room and van" box (the pick is kept in localStorage d250-odt-me-v1) and three tabs.
   Links: #<event id>/<tab> (tabs: rooms, vans, docs; old overview, roster, itinerary links still land), #all. */
(function(){
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const R = window.D250_ROSTER || {people:{}, seats:[], flights:{}, flightsPoc:{}};
const PASS_KEY = "d250-docs-pass";
const RING = {AS100:"r100",AS200:"r200",AS250:"r250",AS300:"r300",AS400:"r400",AS500:"r500",Graybeard:"rgb",Cadre:"rcad"};
const LABEL = {AS100:"AS 100",AS200:"AS 200",AS250:"AS 250",AS300:"AS 300",AS400:"AS 400",AS500:"AS 500",Graybeard:"Graybeard",Cadre:"Cadre"};
const CLASS_ORDER = ["Cadre","AS400","AS300","Graybeard","AS500","AS250","AS200","AS100"];
const FL = {afl:"Alpha",bfl:"Bravo",cfl:"Charlie",dfl:"Delta"};
const TABS = [["rooms","Rooms"],["vans","Vans"],["docs","Itinerary & docs"]];
const MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DOW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

let D = null, EVENTS = [], EV = "", TAB = "rooms";

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

/* ---------- what a cadet comes for: their room and van, then the itinerary and documents ---------- */
const ME_KEY = "d250-odt-me-v1";                     // the cadet this browser last picked, so their assignment shows first
let ME = ""; try{ ME = localStorage.getItem(ME_KEY) || ""; }catch(_){}
let JUMP = false;                                    // scroll to your own room or van after the tab opens
const ridersOf = v => [v.driver, v.relief, ...(v.riders || [])].filter(Boolean);
const roomOf = (e, k) => (e.rooms || []).find(r => r.cadets.includes(k));
const vanOf = (e, k) => (e.vans || []).find(v => ridersOf(v).includes(k));
const roleIn = (v, k) => v.driver === k ? "Driver" : v.relief === k ? "Relief driver" : "";
const nameKey = c => (c.first + " " + c.last + " " + c.last + " " + c.first).toLowerCase();
const short = c => [c.rank, c.last].filter(Boolean).join(" ");
const SEARCH = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`;
function meBox(e){
  const ros = rosterOf(e);
  if (!ros.length) return "";
  if (!ME || !ros.includes(ME)) return `<section class="me" aria-labelledby="meH"><h2 id="meH">Find your room and van</h2>
    <div class="find">${SEARCH}<label class="sr" for="meq">Type your name</label><input id="meq" type="search" placeholder="Type your name" autocomplete="off" aria-controls="meHits"></div>
    <div class="hits" id="meHits"></div></section>`;
  const c = who(ME), r = roomOf(e, ME), v = vanOf(e, ME);
  const mates = r ? r.cadets.filter(k => k !== ME).map(who) : [];
  const roomTxt = !(e.rooms || []).length ? "Not posted yet" : !r ? "Not assigned yet" : mates.length ? `With ${mates.map(m => `${face(m, 26)}<span>${esc(fullName(m))}</span>`).join(" and ")}` : "A room to yourself";
  const role = v ? roleIn(v, ME) : "", drv = v && v.driver && v.driver !== ME ? who(v.driver) : null;
  const vanTxt = !(e.vans || []).length ? "Not posted yet" : !v ? "Not assigned yet" : [role ? `You're the ${role.toLowerCase()}` : "", drv ? `Driver: ${short(drv)}` : "", KIND[v.kind] || ""].filter(Boolean).map(esc).join(" · ");
  return `<section class="me set" aria-label="Your assignment">
    <div class="mehd">${face(c, 52)}<div class="txt"><div class="nm">${esc(fullName(c))}</div><div class="pos">Your assignment for this ODT</div></div><button class="linkbtn" id="notMe" type="button">Not you?</button></div>
    <div class="slots">
      <button class="slot" type="button" data-jump="rooms"${r ? "" : " disabled"}><small>Room</small><b>${r ? esc(r.room) : "None"}</b><span class="with">${roomTxt}</span></button>
      <button class="slot" type="button" data-jump="vans"${v ? "" : " disabled"}><small>Van</small><b>${v ? esc(v.name) : "None"}</b><span class="with">${vanTxt}</span></button>
    </div></section>`;
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
    box.innerHTML = hits.length ? hits.map(c => `<button type="button" class="hit" data-me="${esc(c.key)}">${face(c, 32)}<span>${esc(fullName(c))}</span></button>`).join("")
      : `<p class="miss">No one by that name is on this ODT.</p>`;
    box.querySelectorAll("[data-me]").forEach(b => b.addEventListener("click", () => pick(b.dataset.me)));
    return hits;
  };
  q.addEventListener("input", list);
  q.addEventListener("keydown", ev => { if (ev.key === "Enter"){ const h = list(); if (h.length) pick(h[0].key); } });
}

/* ---------- tabs ---------- */
const printBar = keys => `<div class="toolbar">${legend(keys)}<button class="btn small" id="print" type="button">Print</button></div>`;
function room(r){
  const ppl = (r.cadets || []).map(who), solo = ppl.length === 1, label = String(r.room || "");
  const cad = solo && ppl[0].cls === "Cadre", mine = r.cadets.includes(ME);
  return `<article class="room${solo ? " solo" : ""}${cad ? " cadre" : ""}${mine ? " mine" : ""}" data-room="${esc(label)}" aria-label="Room ${esc(label)}: ${esc(ppl.map(c => c.first + " " + c.last).join(" and "))}">
    <div class="rn"><small>ROOM</small><b${label.length > 3 ? ` class="long"` : ""}>${esc(label)}</b></div>
    <div class="pp">${ppl.map(person).join("")}${solo ? `<div class="p bonus"><span class="star" aria-hidden="true">★</span><div class="txt"><div class="nm">${cad ? "Cadre room" : "Bonus room"}</div><div class="pos">Single occupancy</div></div></div>` : ""}</div></article>`;
}
function rooms(e){
  const L = e.rooms || [];
  if (!L.length) return empty("Rooms aren't posted yet.");
  const secs = [...(e.sections || [])]; for (const r of L) if (!secs.includes(r.sec)) secs.push(r.sec);
  return printBar(L.flatMap(r => r.cadets)) + `<div id="rooms">${secs.map(s => {
    const list = L.filter(r => r.sec === s); if (!list.length) return "";
    return `<section class="sec"><h2>${esc(s)}<span>${list.length} room${list.length === 1 ? "" : "s"}</span></h2><div class="grid">${list.map(room).join("")}</div></section>`;
  }).join("")}</div>`;
}
const KIND = {isu15:"15-passenger ISU van", gov11:"11-passenger GOV"};
function vans(e){
  const L = e.vans || [];
  if (!L.length) return empty("Van assignments aren't posted yet.");
  const card = (k, role) => { const c = who(k);
    return `<div class="person${role ? " role" : ""}${k === ME ? " mine" : ""}">${face(c, 40)}<div class="txt"><div class="nm">${esc(fullName(c))}</div><div class="pos">${role ? `<b>${esc(role)}</b>` : esc(LABEL[c.cls] || "")}</div></div></div>`; };
  return printBar(L.flatMap(ridersOf)) + L.map(v => {
    const riders = (v.riders || []).slice().sort((a, b) => { const x = who(a), y = who(b); return (CLASS_ORDER.indexOf(x.cls) - CLASS_ORDER.indexOf(y.cls)) || (x.last + x.first).localeCompare(y.last + y.first); });
    return `<section class="sec van"><h2>${esc(v.name)}<span>${esc(KIND[v.kind] || "Vehicle")} · ${ridersOf(v).length} people</span></h2>
      <div class="ppl">${v.driver ? card(v.driver, "Driver") : ""}${v.relief ? card(v.relief, "Relief driver") : ""}${riders.map(k => card(k, "")).join("")}</div></section>`;
  }).join("");
}
function byDay(list, row){
  const groups = {};
  for (const x of list) (groups[x.date || ""] = groups[x.date || ""] || []).push(x);
  return Object.keys(groups).sort().map(d => `<div class="day"><h3>${esc(dayLabel(d))}</h3>${groups[d].sort((a, b) => (a.time || "").localeCompare(b.time || "")).map(row).join("")}</div>`).join("");
}
function docs(e){                                   // the itinerary first, then each supporting document, drawn open
  const L = [...(e.itin ? [{id:e.itin.id, title:"Itinerary", note:"The schedule, the hotel address and the meals provided.", name:e.itin.name || "Itinerary.pdf"}] : []), ...(e.docs || [])];
  const info = (e.info || []).length ? `<section class="sec"><h2>Things to know</h2><div class="cards">${e.info.map(i => `<div class="card"><h3>${esc(i.title)}</h3><p>${esc(i.text)}</p></div>`).join("")}</div></section>` : "";
  const oldItin = !e.itin && (e.itinerary || []).length ? `<section class="sec"><h2>Itinerary</h2>${byDay(e.itinerary, x => `<div class="row"><div class="t">${esc(x.time || "")}${x.end ? `<span class="s"> to ${esc(x.end)}</span>` : ""}</div>
    <div><div class="w">${esc(x.what || "")}</div>${x.where ? `<div class="s">${esc(x.where)}</div>` : ""}${x.note ? `<div class="s">${esc(x.note)}</div>` : ""}</div></div>`)}</section>` : "";
  if (!L.length && !info && !oldItin) return empty("No itinerary or documents are posted for this ODT yet.");
  const jump = L.length > 1 ? `<nav class="doclinks" aria-label="Documents on this page">${L.map(d => `<a href="#" data-to="doc-${esc(d.id)}">${PDF_ICON}<span>${esc(d.title)}</span></a>`).join("")}</nav>` : "";
  return jump + info + oldItin + L.map(d => `<section class="sec docview" id="doc-${esc(d.id)}"><h2>${esc(d.title)}<span class="dbtns"><button class="btn small" type="button" data-doc="${esc(d.id)}">Open</button><button class="btn small" type="button" data-dl="${esc(d.id)}" data-name="${esc(d.name || d.title + ".pdf")}">Download</button></span></h2>${d.note ? `<p class="muted">${esc(d.note)}</p>` : ""}<p class="derr" role="status"></p>
    <div class="pdfpages" data-pdf="${esc(d.id)}" data-label="${esc(d.title)}"><p class="empty">Opening ${esc(d.title)}…</p></div></section>`).join("");
}
function allList(){
  const card = e => { const rs = e.rooms || [], ros = rosterOf(e), d = day(e.start);
    const cad = ros.filter(k => who(k).cls === "Cadre"), n = ros.length - cad.length;
    const faces = (cad.length ? cad : ros).slice(0, 4).map(k => face(who(k), 30)).join("");   // the cadre going, else the first cadets
    return `<button type="button" class="evcard${isPast(e) ? " past" : ""}" data-ev="${esc(e.id)}">
      <span class="cal" aria-hidden="true"><small>${d ? MON[d.getMonth()].toUpperCase() : ""}</small><b>${d ? d.getDate() : "?"}</b></span>
      <span><span class="t1">${esc(e.name)}</span><br><span class="t2">${esc([dates(e), e.place].filter(Boolean).join(" · "))}</span><br><span class="t2">${n} cadet${n === 1 ? "" : "s"}${cad.length ? ` · ${cad.length} cadre` : ""}${rs.length ? ` · ${rs.length} rooms` : ""}</span></span>
      <span class="stack" aria-hidden="true">${faces}</span></button>`; };
  const up = EVENTS.filter(e => !isPast(e)).sort((x, y) => (x.start || "").localeCompare(y.start || "")), past = EVENTS.filter(isPast);
  return (up.length ? `<section class="sec"><h2>Current and upcoming<span>${up.length}</span></h2><div class="evlist">${up.map(card).join("")}</div></section>` : "") +
    (past.length ? `<section class="sec"><h2>Past<span>${past.length}</span></h2><div class="evlist">${past.map(card).join("")}</div></section>` : "") ||
    empty("No ODTs are posted yet.");
}
const VIEWS = {rooms, vans, docs};
const OLD_TABS = {overview:"rooms", roster:"rooms", itinerary:"docs"};   // links from the first layout still land

/* ---------- render ---------- */
function render(){
  const all = TAB === "all", e = EVENTS.find(x => x.id === EV);
  $("#modbar").hidden = all || !e;
  $("#tabs").innerHTML = TABS.map(([id, label]) => `<button type="button" role="tab" data-tab="${id}" aria-selected="${!all && TAB === id}" tabindex="${!all && TAB === id ? 0 : -1}">${label}</button>`).join("");
  if (all || !e){
    $("#ev").innerHTML = `<div><h2>All ODTs</h2><div class="meta">Pick an ODT to find your room, your van and its documents.</div></div>`;
    $("#me").innerHTML = "";
    $("#view").innerHTML = allList();
    document.title = `All ODTs · ${D.title || "ODT Module"} · Storm HQ`;
  } else {
    $("#ev").innerHTML = `<div><button class="linkbtn back" type="button" data-all>‹ All ODTs</button><h2>${esc(e.name)}${pill(e)}</h2><div class="meta">${esc([dates(e), e.place, e.note].filter(Boolean).join(" · "))}</div></div>`;
    $("#me").innerHTML = meBox(e);
    $("#view").innerHTML = VIEWS[TAB](e);
    $("#view").setAttribute("aria-label", `${e.name}: ${TABS.find(t => t[0] === TAB)[1]}`);
    document.title = `${e.name} ${TABS.find(t => t[0] === TAB)[1]} · Storm HQ`;
    wireMe(e);
  }
  wireView();
}
function wireView(){
  document.querySelectorAll("#tabs [data-tab]").forEach(b => b.addEventListener("click", () => go(`${EV}/${b.dataset.tab}`)));
  document.querySelectorAll("[data-ev]").forEach(b => b.addEventListener("click", () => go(`${b.dataset.ev}/rooms`)));
  document.querySelectorAll("[data-all]").forEach(b => b.addEventListener("click", () => go("all")));
  const pr = $("#print"); if (pr) pr.addEventListener("click", () => window.print());
  if (JUMP){ JUMP = false; const t = document.querySelector(".room.mine, .person.mine"); if (t) setTimeout(() => t.scrollIntoView({block:"center", behavior:reduce ? "auto" : "smooth"}), 30); }
  document.querySelectorAll("[data-to]").forEach(a => a.addEventListener("click", ev => { ev.preventDefault(); const t = document.getElementById(a.dataset.to); if (t) t.scrollIntoView({block:"start", behavior:reduce ? "auto" : "smooth"}); }));
  (async () => { for (const box of document.querySelectorAll("[data-pdf]"))   // one at a time, top to bottom
    await drawPdf(box.dataset.pdf, box, box.dataset.label).catch(() => { box.innerHTML = `<p class="empty">Couldn't show this document here. Use Open or Download.</p>`; }); })();
  const fail = b => { const m = b.closest(".sec").querySelector(".derr"); if (m) m.textContent = "Couldn't open it. Reload and try again."; };
  document.querySelectorAll("[data-doc]").forEach(b => b.addEventListener("click", async () => {
    const w = window.open("", "_blank");             // opened now, so the browser doesn't block it
    if (w) w.document.title = "Opening…";
    try{ const u = await docUrl(b.dataset.doc); if (w) w.location.href = u; else location.href = u; }
    catch(_){ if (w) w.close(); fail(b); }
  }));
  document.querySelectorAll("[data-dl]").forEach(b => b.addEventListener("click", async () => {
    try{ const a = document.createElement("a"); a.href = await docUrl(b.dataset.dl); a.download = b.dataset.name; document.body.appendChild(a); a.click(); a.remove(); }
    catch(_){ fail(b); }
  }));
}
function go(h){ if (location.hash.slice(1) !== h) location.hash = h; else route(); }
function route(){
  const h = decodeURIComponent(location.hash.slice(1));
  if (h === "all" || !h){ if (!EVENTS.some(e => e.id === EV)) EV = defaultEvent(); TAB = "all"; render(); return; }   // opens on All ODTs
  let [id, tab] = h.split("/"); tab = OLD_TABS[tab] || tab; id = OLD_TABS[id] || id;
  EV = EVENTS.some(e => e.id === id) ? id : (EVENTS.some(e => e.id === EV) ? EV : defaultEvent());
  TAB = TABS.some(t => t[0] === tab) ? tab : TABS.some(t => t[0] === id) ? id : "rooms";
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
  if (D.title) $("#title").textContent = D.title;
  $("#lockwrap").hidden = true; $("#app").hidden = false; route();
}
async function start(){
  try{ const r = await fetch("vault.json", {cache:"no-store"}); V = r.ok ? await r.json() : null; }catch(_){ V = null; }
  $("#loading").hidden = true;
  if (!V){ $("#lockwrap").hidden = false; $("#unlock").hidden = true; $("#lockMsg").textContent = "The ODT Module isn't set up yet. Cadre set it up on the Cadre Admin page (ODT tab)."; return; }
  let saved = ""; try{ saved = sessionStorage.getItem(PASS_KEY) || ""; }catch(_){}
  if (saved){ try{ const data = await open(saved, V); PW = saved; show(data); return; }catch(_){} }
  $("#lockwrap").hidden = false; $("#pw").focus();
}
$("#unlock").addEventListener("submit", async ev => {
  ev.preventDefault();
  const go_ = $("#go"); $("#err").textContent = ""; go_.disabled = true; go_.textContent = "Checking…";
  try{
    const data = await open($("#pw").value, V); PW = $("#pw").value;
    try{ sessionStorage.setItem(PASS_KEY, $("#pw").value); }catch(_){}
    show(data);
  }catch(_){
    $("#err").textContent = "That password didn't work. Try again.";
    const l = $("#lock"); l.classList.remove("shake"); void l.offsetWidth; l.classList.add("shake");
  }finally{ go_.disabled = false; go_.textContent = "Unlock"; }
});
start();
})();
