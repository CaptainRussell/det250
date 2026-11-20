/* Package charts for a semester (kind "proposal" in data/charts.js), and the cadre-only lock.

   The packages are not in the public repo. A semester with "lock":"cadre" keeps them in
   org-chart/locked/<semester id>.json, sealed with the cadre password (PBKDF2 310k + AES-GCM,
   tools/org-lock.mjs; the admin page re-locks it when the cadre password changes). The page
   opens it with the password this tab already holds (hub sign-in as cadre, Cadre Admin or the
   Cadre Dashboard), or asks once.
   Decrypted layout: {proposals:[{id, name, source, seats:[{id, des, title, last, rank, parent,
   changed, note}]}], duties:{<package>:{<seat key>:{heading, text, pages}}},
   changes:{<package>:[{title, before, after, seats:[seat ids]}]}}.
   "changed" seats get a gold mark, and "changes" fill the Summary of Changes window
   (Captain Russell, 20 Nov 2026: shows Kingery and Helle what cadre directed). */
(() => {
  const root = document.documentElement, T = window.D250_TERM;
  const params = new URLSearchParams(location.search);
  const host = document.getElementById('spring-proposals');
  const mapId = id => ({cc:'wgcc', cd:'wgcd', cos:'wgcos', ig:'wgig'})[id] || 'proposed-' + id;
  const originalSeats = [...SEATS], cadreSeats = originalSeats.filter(s => s.cadre);
  let proposals = [], DUTIES = {}, CHANGES = {}, selected = null, inTerm = [];

  /* ---------- the lock ---------- */
  const b64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  async function open(pw, v){
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey({name:'PBKDF2', salt:b64(v.salt), iterations:v.iter, hash:'SHA-256'}, base, {name:'AES-GCM', length:256}, false, ['decrypt']);
    return JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM', iv:b64(v.iv)}, key, b64(v.data))));
  }
  const ss = k => { try{ return sessionStorage.getItem(k) || ''; }catch(_){ return ''; } };
  async function unlock(){
    root.dataset.page = 'locked';
    const box = document.getElementById('lockbox');
    let vault;
    try{ const r = await fetch('locked/' + encodeURIComponent(T.id) + '.json', {cache:'no-cache'}); if(!r.ok) throw 0; vault = await r.json(); }
    catch(_){ box.querySelector('.lk-err').textContent = 'This chart is not set up yet.'; box.querySelector('form').hidden = true; return; }
    if(window.D250SignIn){ D250SignIn.root = '../'; try{ await D250SignIn.resume(); }catch(_){} }
    for(const pw of new Set([ss('d250-cadre-pass'), ss('d250-admin-pass')].filter(Boolean))){
      try{ return start(await open(pw, vault)); }catch(_){}
    }
    const form = box.querySelector('form'), input = form.querySelector('input'), btn = form.querySelector('button'), err = box.querySelector('.lk-err');
    form.addEventListener('submit', async e => {
      e.preventDefault(); err.textContent = ''; btn.disabled = true; btn.textContent = 'Checking…';
      try{
        const data = await open(input.value, vault);
        try{ sessionStorage.setItem('d250-cadre-pass', input.value); }catch(_){}
        start(data);
      }catch(_){ err.textContent = 'That password didn’t work.'; input.select(); }
      btn.disabled = false; btn.textContent = 'Unlock';
    });
    setTimeout(() => input.focus(), 50);
  }

  /* ---------- the package charts ---------- */
  const dutiesFor = (s, p) => (DUTIES[p.id] || {})[s.id.startsWith('bc-') ? 'bcflight' : s.id.startsWith('bcl-') ? (s.id.endsWith('d') ? 'bcldeputy' : 'bclflight') : s.id];
  function updateIndex(seats){
    SEATS.splice(0, SEATS.length, ...seats);
    Object.keys(byId).forEach(id => delete byId[id]); SEATS.forEach(s => byId[s.id] = s);
  }
  function toNative(s, p){
    let key = Object.keys(PEOPLE).find(key => PEOPLE[key][0] === s.last);
    if(!key){ key = s.last === 'Bienfang' ? 'BienfangMitchell' : 'ProposedTBD'; PEOPLE[key] = s.last === 'Bienfang' ? ['Bienfang', 'Mitchell', 'AS400'] : ['TBD', '', '']; }
    return {id:mapId(s.id), des:s.des, title:s.title, poc:[key, s.rank], parent:s.parent ? mapId(s.parent) : 'russell',
      dir:/^A\d$/.test(s.id) ? s.id : undefined, dirName:s.title.replace(/ Director$/, '').replace(/^Director of /, ''), proposal:true,
      proposalField:s.id === 'BC' || s.id === 'BCL' || s.id.startsWith('bc-') || s.id.startsWith('bcl-'), proposalDuty:dutiesFor(s, p),
      proposalSource:p.source, proposalTeam:p.name, changed:!!s.changed, note:s.note || ''};
  }
  window.renderProposedDuties = seat => {
    const d = seat.proposalDuty, note = seat.note ? '<p class="role-change">' + esc(seat.note) + '</p>' : '';
    if(!d) return note ? '<section class="role-description" aria-label="Position description">' + note + '</section>' : '';
    const parts = d.text.split(/Responsibilities:\s*/);
    const critical = (parts[0].match(/Critical Role:\s*([\s\S]*)/) || [])[1] || '';
    const responsibilities = (parts.slice(1).join('Responsibilities:').split(/\n\n(?=•)/)).map(s => s.replace(/^•\s*/, '').trim()).filter(Boolean);
    return `<section class="role-description" aria-label="Position description">${note}${critical ? '<h3 class="dh">Critical role</h3><p>' + esc(critical) + '</p>' : '<h3 class="dh">Position description</h3>'}${responsibilities.length ? '<details><summary>Responsibilities (' + responsibilities.length + ')</summary><ul>' + responsibilities.map(r => '<li>' + esc(r) + '</li>').join('') + '</ul></details>' : ''}<div class="role-source">Source: ${esc(seat.proposalSource)}, position descriptions, original PDF page${d.pages.length > 1 ? 's' : ''} ${d.pages.join(', ')}.</div></section>`;
  };
  function resetInteractions(){
    clearTimeout(switching); document.querySelectorAll('.po.leaving').forEach(el => el.classList.remove('leaving'));
    closeDrawer(); closeFlight(); hidePeek(); hideResults(); untrace();
  }
  function rebuild(){
    order = 0; build(); initCadreBar(); setCadre(false); refreshMode();
    document.querySelectorAll('.band').forEach(el => el.classList.add('in'));
  }
  function saveLocation(){
    const url = new URL(location); url.hash = ''; url.searchParams.delete('member');
    if(window.currentProposedChart){ url.searchParams.set('view', 'proposed'); url.searchParams.set('proposal', selected); }
    else { url.searchParams.delete('proposal'); MODE === 'flip' ? url.searchParams.set('view', 'flip') : url.searchParams.delete('view'); }
    history.replaceState(null, '', url.pathname + url.search);
  }
  const seg = () => document.getElementById('chart-seg');
  function showProposal(id, focus = false, save = true){
    const p = proposals.find(p => p.id === id); if(!p) return;
    resetInteractions(); selected = id; window.currentProposedChart = p; root.dataset.chartView = 'proposed'; MODE = 'poc'; root.dataset.mode = 'poc';
    updateIndex([...cadreSeats, ...p.seats.map(s => toNative(s, p))]);
    seg().querySelectorAll('[data-proposal]').forEach(b => { const on = b.dataset.proposal === id; b.setAttribute('aria-pressed', String(on)); if(on && focus) b.focus(); });
    const sq = p.seats.filter(s => s.id === 'BC' || s.id === 'BCL'), up = sq.length && sq.every(s => s.parent === 'cd') ? 'WG/CD' : 'WG/CC';
    document.getElementById('h-group').textContent = 'Squadrons';
    document.querySelector('#group .rt').textContent = 'SQ/CCs report to the ' + up;
    document.querySelector('#staff .rt').textContent = 'Directors report to the WG/COS';
    document.querySelector('.source-line').textContent = T.name + ' 250th Cadet Wing organization: the ' + p.name + ' Wing Command Package' + ((CHANGES[id] || []).length ? ', with the changes directed by cadre.' : '.');
    rebuild(); summaryButton(); if(save) saveLocation();
  }
  const currentLine = () => !T ? document.querySelector('.source-line').textContent : 'Positions reflect the ' + T.name + ' 250th Cadet Wing organization chart' + (window.D250_HAS_FLIP ? ', the Flip Week construct,' : '') + ' and flight assignments. Tap or click anyone for details; use the buttons at the top to switch charts.';
  function showCurrent(mode){
    if(window.currentProposedChart){
      resetInteractions(); window.currentProposedChart = null; updateIndex(originalSeats); MODE = 'poc'; root.dataset.mode = 'poc'; root.dataset.chartView = mode;
      document.getElementById('h-group').textContent = 'Group Staff'; document.querySelector('#group .rt').textContent = 'GP/CC reports to the WG/CC · GMC are assigned under each FLT/CC';
      rebuild(); saveLocation();
    }
    root.dataset.chartView = mode; seg().querySelectorAll('[data-proposal]').forEach(b => b.setAttribute('aria-pressed', 'false')); document.querySelector('.source-line').textContent = currentLine();
    summaryButton();
  }

  /* ---------- Summary of Changes ---------- */
  function summaryButton(){
    const list = window.currentProposedChart ? CHANGES[selected] || [] : [], b = document.getElementById('sum-btn');
    b.hidden = !list.length; b.querySelector('.n').textContent = list.length;
  }
  function openSummary(){
    const list = CHANGES[selected] || [], p = window.currentProposedChart; if(!list.length || !p) return;
    document.getElementById('f-title').textContent = 'Summary of Changes';
    document.getElementById('f-sub').textContent = 'Directed by cadre to the ' + p.name + ' Wing Command Package';
    document.getElementById('fbody').innerHTML = '<ol class="chg-list">' + list.map((c, i) => {
      const seats = c.seats.map(id => byId[mapId(id)]).filter(Boolean);
      return `<li style="--i:${i}"><span class="chg-n">${i + 1}</span><div class="chg-txt"><b>${esc(c.title)}</b>
        <span class="chg-was"><span>Was</span>${esc(c.before)}</span><span class="chg-now"><span>Now</span>${esc(c.after)}</span></div>
        <div class="chips">${seats.map(personChip).join('')}</div></li>`;
    }).join('') + '</ol>';
    if(!flightOpen) flightFocus = document.activeElement;
    flightOpen = 'summary';
    document.getElementById('fmodal').classList.add('open', 'summary'); document.getElementById('fscrim').classList.add('open');
    document.body.style.overflow = 'hidden'; document.getElementById('fpanel').scrollTop = 0;
    setTimeout(() => document.getElementById('fclose').focus({preventScroll:true}), 120);
  }
  new MutationObserver(() => { const m = document.getElementById('fmodal'); if(!m.classList.contains('open') && m.classList.contains('summary')) m.classList.remove('summary'); })
    .observe(document.getElementById('fmodal'), {attributes:true, attributeFilter:['class']});

  /* Keep the reader's place when switching charts (Captain Russell, 13 Nov 2026: compare charts without
     snapping to the top). Note which section sits under the sticky chart bar and how far into it, then hold
     that spot while the new chart builds, the Flip Week fade runs and the cadre panel closes. */
  let holdUntil = 0, holdRaf = 0;
  function spot(){
    const line = document.querySelector('.chartbar').getBoundingClientRect().bottom + 8;
    const els = ['cadre', 'command', 'staff', 'group'].map(id => document.getElementById(id)).filter(e => e && e.offsetParent);
    if(!els.length || els[0].getBoundingClientRect().top > line) return null;          // still above the chart: leave the scroll alone
    for(const el of els){ const r = el.getBoundingClientRect(); if(r.bottom > line) return {id:el.id, f:(line - r.top) / Math.max(r.height, 1), line}; }
    const el = els[els.length - 1], r = el.getBoundingClientRect(); return {id:el.id, f:1, line, past:r.bottom - line};
  }
  function hold(s){
    if(!s) return; cancelAnimationFrame(holdRaf); holdUntil = performance.now() + 700;
    const step = () => {
      const el = document.getElementById(s.id); if(!el) return;
      const r = el.getBoundingClientRect(), want = s.past != null ? r.bottom - s.past : r.top + s.f * r.height, d = want - s.line;
      if(Math.abs(d) > 1) window.scrollTo({top:window.scrollY + d, behavior:'instant'});
      if(performance.now() < holdUntil) holdRaf = requestAnimationFrame(step);
    }; step();
  }
  const stopHold = () => { holdUntil = 0; cancelAnimationFrame(holdRaf); };
  ['wheel', 'touchmove'].forEach(t => addEventListener(t, stopHold, {passive:true}));

  function start(data){
    data = data || {};
    proposals = data.proposals || []; DUTIES = data.duties || {}; CHANGES = data.changes || {};
    inTerm = ((T || {}).charts || []).filter(c => c.kind === 'proposal').map(c => c.proposal).filter(id => proposals.some(p => p.id === id));
    selected = inTerm.includes(params.get('proposal')) ? params.get('proposal') : inTerm[0];
    if(T && root.dataset.page === 'locked') root.dataset.page = 'chart';
    const panels = document.createElement('div'); panels.id = 'chart-panels';
    document.getElementById('main').append(panels);
    ['cadre', 'command', 'staff', 'group'].forEach(id => panels.append(document.getElementById(id)));
    host.hidden = true;
    document.addEventListener('click', event => {
      if(event.target.closest('#sum-btn')){ event.stopImmediatePropagation(); openSummary(); return; }
      const pb = event.target.closest('#chart-seg [data-proposal]');
      if(pb){ event.stopImmediatePropagation(); const s = spot(); showProposal(pb.dataset.proposal); hold(s); }
      else { const tab = event.target.closest('[data-set-mode]'); if(tab){ const s = spot(); showCurrent(tab.dataset.setMode); setTimeout(() => hold(s), 0); } }
    }, true);
    const initialSeat = location.hash.slice(1) || params.get('member');
    if(selected && (params.get('view') === 'proposed' || location.hash === '#spring-proposals' || location.hash.startsWith('#proposal-') || (!params.get('view') && (T.charts || [])[0] && T.charts[0].kind === 'proposal'))){
      const hashTeam = location.hash.replace('#proposal-', ''); if(inTerm.includes(hashTeam)) selected = hashTeam;
      showProposal(selected, false, false);
      if(initialSeat && byId[initialSeat]) setTimeout(() => openSeat(initialSeat), 300);
      else if(initialSeat && byId[mapId(initialSeat)]) setTimeout(() => openSeat(mapId(initialSeat)), 300);
    } else showCurrent(MODE);
    document.dispatchEvent(new Event('chartready'));
  }
  if(T && T.lock) unlock(); else start(null);
})();
