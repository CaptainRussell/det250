/* =====================================================================
   PRACTICUM ADVENTURE - instructor settings
   Loaded before data.js on every page. Lets any instructor run the game
   with their own name, course, Inspector General and NPC name rosters,
   without editing the code. Saved in the GM's browser (localStorage), so
   the projector window (same browser) picks it up too. Phones get the
   instructor's name from the join link (?gm=) and from the game state.
   ===================================================================== */
const PA_SETTINGS_KEY = 'd250-practicum-settings-v1';
const PA_DEFAULTS = { gm: 'Captain Russell', course: 'AFAS 3410 (Fall 2026)', bossRank: 'Lt Col', bossName: 'Cacic' };
const PA = (() => {
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(PA_SETTINGS_KEY) || 'null'); } catch (e) { }
  const s = Object.assign({}, PA_DEFAULTS, saved || {});
  // phones and the field guide: the GM's name comes from the join link, then is remembered
  let urlGm = '';
  try { urlGm = (new URLSearchParams(location.search).get('gm') || '').trim().slice(0, 40); } catch (e) { }
  if (urlGm) { s.gm = urlGm; try { localStorage.setItem('sq_gm_name', urlGm); } catch (e) { } }
  else if (!saved) { try { s.gm = localStorage.getItem('sq_gm_name') || s.gm; } catch (e) { } }
  s.saved = !!saved;
  return s;
})();
let GM_NAME = PA.gm;
const PA_COURSE = PA.course;

// Called at the end of data.js: swap in the instructor's rosters and IG.
let PA_DEFAULT_ROSTERS = null, PA_DEFAULT_GENDER = null;
function paApply() {
  PA_DEFAULT_ROSTERS = Object.fromEntries(ROSTER_OPTIONS.map(r => [r.id, r.names.slice()]));
  PA_DEFAULT_GENDER = Object.assign({}, GENDER);
  if (PA.rosters) ROSTER_OPTIONS.forEach(r => { const list = PA.rosters[r.id]; if (Array.isArray(list) && list.length) r.names = list.slice(); });
  if (PA.gender) Object.assign(GENDER, PA.gender);
  BOSS.name = `${PA.bossRank} ${PA.bossName}`.trim().toUpperCase();
}
const paBoss = () => ({ full: BOSS.name, name: PA.bossName, rank: PA.bossRank });

/* ---- editor card on the GM title screen ---- */
const paEsc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function paNamesText(r) {
  return r.names.map(n => n + (GENDER[n] ? ` (${GENDER[n]})` : '')).join('\n');
}
function paSettingsCard() {
  const pin = typeof rosterPin === 'function' ? rosterPin : () => '';
  return `<div class="gcard pa-settings"><h3>Game settings</h3>
    <p class="note">Make the game yours: your name (what cadets see, as in "Waiting for ${paEsc(GM_NAME)}"), your course, the Inspector General at the end, and the four name rosters the team picks from for NPCs. Saved in this browser.</p>
    <div class="pa-grid">
      <label>Instructor name<input type="text" id="paGm" maxlength="40" value="${paEsc(PA.gm)}"></label>
      <label>Course (title screen)<input type="text" id="paCourse" maxlength="40" value="${paEsc(PA.course)}"></label>
      <label>IG rank<input type="text" id="paBossRank" maxlength="12" value="${paEsc(PA.bossRank)}"></label>
      <label>IG last name<input type="text" id="paBossName" maxlength="24" value="${paEsc(PA.bossName)}"></label>
    </div>
    <p class="note">Rosters: one surname per line. Add <b>(f)</b> or <b>(m)</b> after a name so a civilian Unit member shows as Ms. or Mr. Use real classmates' names only if your class is fine with it: serious incidents always use an unnamed Airman.</p>
    <div class="pa-rosters">${ROSTER_OPTIONS.map(r => `<label><span class="row">${pin(r, 24)}<b>${paEsc(r.name)}</b><span class="note" data-pa-count="${r.id}">${r.names.length} names</span></span>
      <textarea id="paR_${r.id}" rows="7" spellcheck="false">${paEsc(paNamesText(r))}</textarea></label>`).join('')}</div>
    <div class="row"><button class="b pri" data-pa="save">💾 Save settings</button><button class="b" data-pa="defaults">↩️ Restore the original settings</button><span class="note" id="paMsg"></span></div></div>`;
}
function paParseNames(text) {
  const seen = new Set(), names = [], gender = {};
  text.split(/\r?\n/).forEach(line => {
    const m = line.trim().match(/^(.*?)\s*(?:\(([mfMF])\))?$/);
    const n = m ? m[1].trim() : '';
    if (!n || seen.has(n.toLowerCase())) return;
    seen.add(n.toLowerCase()); names.push(n);
    if (m[2]) gender[n] = m[2].toLowerCase();
  });
  return { names, gender };
}
if (typeof document !== 'undefined' && document.addEventListener) document.addEventListener('click', e => {
  const b = e.target.closest('[data-pa]');
  if (!b) return;
  const msg = document.getElementById('paMsg');
  if (b.dataset.pa === 'defaults') {
    if (!confirm('Restore the original instructor name, course, IG and rosters?')) return;
    try { localStorage.removeItem(PA_SETTINGS_KEY); } catch (err) { }
    location.reload(); return;
  }
  const val = id => (document.getElementById(id)?.value || '').trim();
  const rosters = {}, gender = {};
  for (const r of ROSTER_OPTIONS) {
    const p = paParseNames(val('paR_' + r.id));
    if (p.names.length < 6) { if (msg) msg.textContent = `${r.name} needs at least 6 names.`; return; }
    rosters[r.id] = p.names; Object.assign(gender, p.gender);
  }
  const s = {
    gm: val('paGm') || PA_DEFAULTS.gm, course: val('paCourse'), bossRank: val('paBossRank') || PA_DEFAULTS.bossRank, bossName: val('paBossName') || PA_DEFAULTS.bossName,
    rosters, gender
  };
  try { localStorage.setItem(PA_SETTINGS_KEY, JSON.stringify(s)); } catch (err) { if (msg) msg.textContent = 'Could not save in this browser.'; return; }
  location.reload();
});
