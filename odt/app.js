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
               roster:[roster keys], sections:[room groups], rooms:[{room, sec, cadets:[keys]}],
               lodging:[{name, address, phone, checkin, checkout, note}],
               meals:[{date, meal, time, where, note}],
               docs:[{id, title, note, name, size}] }] }
   Each supporting document is its own locked file, files/<doc id>.json, same layout, opened on click.
   Links: #<event id>/<tab> (tabs: overview, itinerary, roster, rooms, lodging, meals), #all. */
(function(){
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const R = window.D250_ROSTER || {people:{}, seats:[], flights:{}, flightsPoc:{}};
const PASS_KEY = "d250-docs-pass";
const RING = {AS100:"r100",AS200:"r200",AS250:"r250",AS300:"r300",AS400:"r400",AS500:"r500",Graybeard:"rgb"};
const LABEL = {AS100:"AS 100",AS200:"AS 200",AS250:"AS 250",AS300:"AS 300",AS400:"AS 400",AS500:"AS 500",Graybeard:"Graybeard"};
const CLASS_ORDER = ["AS400","AS300","Graybeard","AS500","AS250","AS200","AS100"];
const FL = {afl:"Alpha",bfl:"Bravo",cfl:"Charlie",dfl:"Delta"};
const TABS = [["overview","Overview"],["itinerary","Itinerary"],["roster","Roster"],["rooms","Rooms"],["lodging","Lodging"],["meals","Meals"]];
const MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DOW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

let D = null, EVENTS = [], EV = "", TAB = "overview";

/* ---------- crypto ---------- */
const b64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
async function openBytes(pw, v){
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(pw), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey({name:"PBKDF2", salt:b64(v.salt), iterations:v.iter, hash:"SHA-256"}, base, {name:"AES-GCM", length:256}, false, ["decrypt"]);
  return new Uint8Array(await crypto.subtle.decrypt({name:"AES-GCM", iv:b64(v.iv)}, key, b64(v.data)));
}
const open = async (pw, v) => JSON.parse(new TextDecoder().decode(await openBytes(pw, v)));
let PW = "";
const BLOBS = {};
async function docUrl(id){
  if (!BLOBS[id]){
    const r = await fetch(`files/${encodeURIComponent(id)}.json`, {cache:"no-store"});
    if (!r.ok) throw new Error("missing");
    BLOBS[id] = URL.createObjectURL(new Blob([await openBytes(PW, await r.json())], {type:"application/pdf"}));
  }
  return BLOBS[id];
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
  const seat = R.people[key] ? R.seats.find(s => s.poc && s.poc[0] === key && !s.cadre) : null;
  let flt = "";
  if (R.people[key]) for (const list of [R.flights, R.flightsPoc]) for (const [f, ks] of Object.entries(list || {})) if (ks.includes(key)) flt = FL[f];
  if (!flt && seat && /FLT\//.test(seat.des || "")) flt = seat.des.split(" ")[0];
  const cls = p[2];
  const rank = seat ? seat.poc[1] : cls === "AS100" ? "C/4C" : /AS(200|250|500)/.test(cls) ? "C/3C" : "";
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
const findBox = (ph) => `<div class="toolbar"><div class="find"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><label class="sr" for="q">${esc(ph)}</label><input id="q" type="search" placeholder="${esc(ph)}" autocomplete="off"></div><button class="btn" id="print" type="button">Print</button><span class="stats" id="stats"></span></div><p class="found" id="found" role="status" aria-live="polite"></p>`;
const printBar = () => `<div class="toolbar"><button class="btn" id="print" type="button">Print</button></div>`;

/* ---------- tabs ---------- */
function overview(e){
  const ros = rosterOf(e), rooms = e.rooms || [], lodge = (e.lodging || [])[0];
  const itin = (e.itinerary || []).slice().sort((a, b) => ((a.date || "") + (a.time || "")).localeCompare((b.date || "") + (b.time || "")));
  const first = itin[0];
  const tile = (tab, k, v, s) => `<button type="button" class="tile" data-go="${tab}"><small>${esc(k)}</small><b>${esc(v)}</b>${s ? `<span>${esc(s)}</span>` : ""}</button>`;
  return `${printBar()}<div class="tiles">
      ${tile("itinerary", "Dates", dates(e) || "Not set", first ? `First: ${dayLabel(first.date)} ${first.time || ""} ${first.what || ""}`.trim() : (e.place || ""))}
      ${tile("roster", "Going", `${ros.length} cadet${ros.length === 1 ? "" : "s"}`, "See the roster")}
      ${tile("rooms", "Rooms", rooms.length ? `${rooms.length} rooms` : "Not posted", rooms.length ? "Find your room" : "")}
      ${tile("lodging", "Lodging", lodge ? lodge.name : "Not posted", lodge ? lodge.address : "")}
    </div>
    ${(e.docs || []).length ? `<section class="sec"><h2>Documents<span>${e.docs.length}</span></h2><div class="cards">${e.docs.map(d => `<div class="card doc"><span class="dico">${PDF_ICON}</span><div class="dtx"><h3>${esc(d.title)}</h3>${d.note ? `<p>${esc(d.note)}</p>` : ""}<div class="dbtns"><button class="btn" type="button" data-doc="${esc(d.id)}">Open</button><button class="btn" type="button" data-dl="${esc(d.id)}" data-name="${esc(d.name || d.title + ".pdf")}">Download</button><span class="derr" role="status"></span></div></div></div>`).join("")}</div></section>` : ""}
    ${(e.info || []).length ? `<section class="sec"><h2>Things to know<span>${e.info.length}</span></h2><div class="cards">${e.info.map(i => `<div class="card"><h3>${esc(i.title)}</h3><p>${esc(i.text)}</p></div>`).join("")}</div></section>` : ""}`;
}
function byDay(list, row){
  const groups = {};
  for (const x of list) (groups[x.date || ""] = groups[x.date || ""] || []).push(x);
  return Object.keys(groups).sort().map(d => `<div class="day"><h3>${esc(dayLabel(d))}</h3>${groups[d].sort((a, b) => (a.time || "").localeCompare(b.time || "")).map(row).join("")}</div>`).join("");
}
function itinerary(e){
  const L = e.itinerary || [];
  if (!L.length) return empty("The itinerary isn't posted yet.");
  return printBar() + byDay(L, x => `<div class="row"><div class="t">${esc(x.time || "")}${x.end ? `<span class="s"> to ${esc(x.end)}</span>` : ""}</div>
    <div><div class="w">${esc(x.what || "")}</div>${x.where ? `<div class="s">${esc(x.where)}</div>` : ""}${x.note ? `<div class="s">${esc(x.note)}</div>` : ""}</div></div>`);
}
function meals(e){
  const L = e.meals || [];
  if (!L.length) return empty("Meals aren't posted yet.");
  return printBar() + byDay(L, x => `<div class="row"><div class="t">${esc(x.meal || "")}${x.time ? `<span class="s"> ${esc(x.time)}</span>` : ""}</div>
    <div><div class="w">${esc(x.where || "")}</div>${x.note ? `<div class="s">${esc(x.note)}</div>` : ""}</div></div>`);
}
function lodging(e){
  const L = e.lodging || [];
  if (!L.length) return empty("Lodging isn't posted yet.");
  return printBar() + `<div class="cards">${L.map(x => `<div class="card"><h3>${esc(x.name || "")}</h3>
    ${x.address ? `<p><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(x.address)}" target="_blank" rel="noopener">${esc(x.address)}</a></p>` : ""}
    <dl class="kv">${x.phone ? `<dt>Phone</dt><dd><a href="tel:${esc(x.phone.replace(/[^0-9+]/g, ""))}">${esc(x.phone)}</a></dd>` : ""}${x.checkin ? `<dt>Check in</dt><dd>${esc(x.checkin)}</dd>` : ""}${x.checkout ? `<dt>Check out</dt><dd>${esc(x.checkout)}</dd>` : ""}</dl>
    ${x.note ? `<p style="margin-top:8px">${esc(x.note)}</p>` : ""}</div>`).join("")}</div>`;
}
function roster(e){
  const ros = rosterOf(e).map(who);
  if (!ros.length) return empty("The roster isn't posted yet.");
  const groups = CLASS_ORDER.concat([...new Set(ros.map(c => c.cls))].filter(c => !CLASS_ORDER.includes(c)));
  return findBox("Find a cadet") + legend(ros.map(c => c.key)) + groups.map(cls => {
    const L = ros.filter(c => c.cls === cls).sort((a, b) => (a.last + a.first).localeCompare(b.last + b.first)); if (!L.length) return "";
    return `<section class="sec"><h2>${esc(LABEL[cls] || cls || "Other")}<span>${L.length}</span></h2><div class="ppl">${L.map(c => `<div class="person" data-name="${esc((c.first + " " + c.last + " " + c.last + " " + c.first).toLowerCase())}">${face(c, 40)}<div class="txt"><div class="nm">${esc(fullName(c))}</div>${c.pos ? `<div class="pos">${esc(c.pos)}</div>` : c.flt ? `<div class="pos">${esc(c.flt)} Flight</div>` : ""}</div></div>`).join("")}</div></section>`;
  }).join("");
}
function room(r){
  const ppl = (r.cadets || []).map(who), solo = ppl.length === 1, label = String(r.room || "");
  return `<article class="room${solo ? " solo" : ""}" data-room="${esc(label)}" aria-label="Room ${esc(label)}: ${esc(ppl.map(c => c.first + " " + c.last).join(" and "))}">
    <div class="rn"><small>ROOM</small><b${label.length > 3 ? ` class="long"` : ""}>${esc(label)}</b></div>
    <div class="pp">${ppl.map(person).join("")}${solo ? `<div class="p bonus"><span class="star" aria-hidden="true">★</span><div class="txt"><div class="nm">Bonus room</div><div class="pos">Single occupancy</div></div></div>` : ""}</div></article>`;
}
function rooms(e){
  const L = e.rooms || [];
  if (!L.length) return empty("Rooms aren't posted yet.");
  const secs = [...(e.sections || [])]; for (const r of L) if (!secs.includes(r.sec)) secs.push(r.sec);
  return findBox("Find your room: type your name") + legend(L.flatMap(r => r.cadets)) + `<div id="rooms">${secs.map(s => {
    const list = L.filter(r => r.sec === s); if (!list.length) return "";
    const c = list.reduce((t, r) => t + r.cadets.length, 0);
    return `<section class="sec"><h2>${esc(s)}<span>${list.length} room${list.length === 1 ? "" : "s"} · ${c} cadet${c === 1 ? "" : "s"}</span></h2><div class="grid">${list.map(room).join("")}</div></section>`;
  }).join("")}</div>`;
}
function allList(){
  const card = e => { const rs = e.rooms || [], n = rosterOf(e).length, d = day(e.start);
    const faces = rosterOf(e).slice(0, 4).map(k => face(who(k), 30)).join("");
    return `<button type="button" class="evcard${isPast(e) ? " past" : ""}" data-ev="${esc(e.id)}">
      <span class="cal" aria-hidden="true"><small>${d ? MON[d.getMonth()].toUpperCase() : ""}</small><b>${d ? d.getDate() : "?"}</b></span>
      <span><span class="t1">${esc(e.name)}</span><br><span class="t2">${esc([dates(e), e.place].filter(Boolean).join(" · "))}</span><br><span class="t2">${n} cadets${rs.length ? ` · ${rs.length} rooms` : ""}</span></span>
      <span class="stack" aria-hidden="true">${faces}</span></button>`; };
  const up = EVENTS.filter(e => !isPast(e)).sort((x, y) => (x.start || "").localeCompare(y.start || "")), past = EVENTS.filter(isPast);
  return (up.length ? `<section class="sec"><h2>Current and upcoming<span>${up.length}</span></h2><div class="evlist">${up.map(card).join("")}</div></section>` : "") +
    (past.length ? `<section class="sec"><h2>Past<span>${past.length}</span></h2><div class="evlist">${past.map(card).join("")}</div></section>` : "") ||
    empty("No ODTs are posted yet.");
}
const VIEWS = {overview, itinerary, roster, rooms, lodging, meals};

/* ---------- render ---------- */
function render(){
  const all = TAB === "all", e = EVENTS.find(x => x.id === EV);
  $("#allBtn").classList.toggle("on", all); $("#allBtn").setAttribute("aria-pressed", String(all));
  $("#tabs").hidden = all || !e;
  $("#tabs").innerHTML = TABS.map(([id, label]) => `<button type="button" role="tab" data-tab="${id}" aria-selected="${!all && TAB === id}" tabindex="${!all && TAB === id ? 0 : -1}">${label}</button>`).join("");
  if (all || !e){
    $("#ev").innerHTML = `<div><h2>All ODTs</h2><div class="meta">Every ODT, upcoming first. Pick one to see its details.</div></div>`;
    $("#view").innerHTML = allList();
    document.title = `All ODTs · ${D.title || "ODT Module"} · Storm HQ`;
  } else {
    $("#ev").innerHTML = `<div><h2>${esc(e.name)}${pill(e)}</h2><div class="meta">${esc([dates(e), e.place].filter(Boolean).join(" · "))}</div>${e.note ? `<div class="note">${esc(e.note)}</div>` : ""}</div>`;
    $("#view").innerHTML = VIEWS[TAB](e);
    $("#view").setAttribute("aria-label", `${e.name}: ${TABS.find(t => t[0] === TAB)[1]}`);
    document.title = `${e.name} ${TABS.find(t => t[0] === TAB)[1]} · Storm HQ`;
  }
  wireView();
}
function wireView(){
  document.querySelectorAll("#tabs [data-tab]").forEach(b => b.addEventListener("click", () => go(`${EV}/${b.dataset.tab}`)));
  document.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => go(`${EV}/${b.dataset.go}`)));
  document.querySelectorAll("[data-ev]").forEach(b => b.addEventListener("click", () => go(`${b.dataset.ev}/overview`)));
  const pr = $("#print"); if (pr) pr.addEventListener("click", () => window.print());
  const fail = b => { const m = b.parentNode.querySelector(".derr"); if (m) m.textContent = "Couldn't open it. Reload and try again."; };
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
  const q = $("#q"); if (!q) return;
  const e = EVENTS.find(x => x.id === EV);
  if (TAB === "rooms"){
    const L = e.rooms || [];
    $("#stats").textContent = `${L.reduce((t, r) => t + r.cadets.length, 0)} cadets · ${L.length} rooms`;
    q.addEventListener("input", () => {
      const s = q.value.trim().toLowerCase(), box = $("#rooms"); box.classList.toggle("searching", !!s);
      const hits = [];
      document.querySelectorAll(".room").forEach(r => { const on = !!s && [...r.querySelectorAll(".p[data-name]")].some(p => p.dataset.name.includes(s)); r.classList.toggle("hit", on); if (on) hits.push(r); });
      let msg = "";
      if (s && !hits.length) msg = "No one by that name.";
      else if (hits.length > 1) msg = `${hits.length} rooms match.`;
      else if (hits.length === 1){
        const r = hits[0], me = [...r.querySelectorAll(".p[data-name]")], mine = me.find(p => p.dataset.name.includes(s)), rest = me.filter(p => p !== mine);
        const nm = p => p.querySelector(".nm").textContent;
        msg = `${nm(mine)}: Room ${r.dataset.room}${rest.length ? ", with " + rest.map(nm).join(" and ") : " (bonus room)"}.`;
        r.scrollIntoView({block:"center", behavior:reduce ? "auto" : "smooth"});
      }
      $("#found").textContent = msg;
    });
  } else {
    $("#stats").textContent = `${rosterOf(e).length} cadets`;
    q.addEventListener("input", () => {
      const s = q.value.trim().toLowerCase(); let n = 0;
      document.querySelectorAll(".person").forEach(p => { const on = !s || p.dataset.name.includes(s); p.classList.toggle("hide", !on); if (on) n++; });
      document.querySelectorAll("#view .sec").forEach(sec => { sec.hidden = !!s && !sec.querySelector(".person:not(.hide)"); });
      $("#found").textContent = s ? (n ? `${n} match${n === 1 ? "" : "es"}.` : "No one by that name.") : "";
    });
  }
}
function go(h){ if (location.hash.slice(1) !== h) location.hash = h; else route(); }
function route(){
  const h = decodeURIComponent(location.hash.slice(1));
  if (h === "all"){ TAB = "all"; render(); return; }
  const [id, tab] = h.split("/");
  EV = EVENTS.some(e => e.id === id) ? id : (EVENTS.some(e => e.id === EV) ? EV : defaultEvent());
  TAB = TABS.some(t => t[0] === tab) ? tab : TABS.some(t => t[0] === id) ? id : "overview";
  render();
}
$("#allBtn").addEventListener("click", () => go(TAB === "all" ? `${EV || defaultEvent()}/overview` : "all"));
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
