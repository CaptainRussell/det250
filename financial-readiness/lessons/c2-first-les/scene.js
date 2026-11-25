/* Chapter 2 scene, shared by the chapter page (lesson player) and the slide deck (../../slides/).
   Exposes FR.SCENES.fr2. */
(function () {
'use strict';
/* =====================================================================
   Chapter 2: Your First LES
   A Leave and Earnings Statement, read one column at a time: entitlements (base pay,
   then the allowances BAH and BAS, then the third type, special and
   incentive pay), deductions, allotments (what each one really is) and
   the net, walked through on a new 2d Lt's first LES (single, JBSA-
   Lackland, San Antonio). Then my real November 2026 LES, briefly, as
   where it goes (Captain Russell, 25 Nov 2026).
   Sources: my LES (DFAS Form 702), DFAS 2026 officer basic pay table
   (O-1 under 2 years $4,150.20), 2026 officer BAS $328.48, 2026 BAH
   San Antonio O-1 $1,584 without and $1,905 with dependents, 2026
   federal brackets and standard deductions ($16,100 single, $32,200
   married), FICA 6.2% and 1.45% of base pay.
   Code organized with help from Claude (Anthropic).
   ===================================================================== */
const { Scene, C } = Anim;
const fmt = FR.fmt;

// ---------------------------------------------------------------- data
const MINE = {
  head: ['RUSSELL SCOTT D', 'O3', '07', '1-30 NOV 26'],
  E: [['BASE PAY', 7737], ['BAS', 328.48], ['BAH', 2280]],
  D: [['FEDERAL TAXES', 681.81], ['FICA-SOC SECURITY', 479.69], ['FICA-MEDICARE', 112.19], ['SGLI', 26], ['SGLI FAM/SPOUSE', 4], ['ROTH TSP', 2088.99]],
  A: [['DISCRETIONARY ALT', 625], ['TRICARE DENTAL', 30.47], ['BANK ACCT ALLOT', 625], ['BANK ACCT ALLOT', 1672.33]],
  // what each allotment really is (Captain Russell, 24 Nov 2026)
  Areal: ['My Roth IRA', 'Dental plan', "Spouse's Roth IRA", 'Emergency fund'],
};
const sum = (rows) => Math.round(rows.reduce((a, r) => a + r[1], 0) * 100) / 100;
// a new 2d Lt at JBSA-Lackland (78236), 5% to the Roth TSP, no allotments yet
function yours(married) {
  const base = 4150.20, bah = married ? 1905 : 1584;
  const taxable = base * 12 - (married ? 32200 : 16100);                       // Roth TSP does not lower taxable pay
  const brk = married ? 24800 : 12400;
  const fed = Math.round((Math.min(taxable, brk) * 0.10 + Math.max(0, taxable - brk) * 0.12) / 12 * 100) / 100;
  return {
    head: ['YOU, 2D LT', 'O1', '00', 'YOUR FIRST MONTH'],
    E: [['BASE PAY', base], ['BAS', 328.48], ['BAH', bah]],
    D: [['FEDERAL TAXES*', fed], ['FICA-SOC SECURITY', 257.31], ['FICA-MEDICARE', 60.18], ['SGLI', 26], ['ROTH TSP (5%)', 207.51]],
    A: [],
  };
}

// ---------------------------------------------------------------- LES geometry
const COLS = [['ENTITLEMENTS', 'E'], ['DEDUCTIONS', 'D'], ['ALLOTMENTS', 'A'], ['SUMMARY', 'S']];
const PX = [40, 430, 820, 1210], PW = 350, PY = 196, PH = 470, ROW0 = 290, RH = 46, TOT_Y = 640;
const HEADS = [['NAME', 40, 400], ['GRADE', 470, 120], ['YRS SVC', 620, 150], ['PERIOD COVERED', 1210, 350]];
const LES_FIT = 1.1;   // LES text may grow only a little on a phone, so the columns keep their shape

function scene() {
  const S = new Scene('fr2');
  const all = [];
  const add = (id, kind, cfg, props) => { all.push(id); return S.add(id, kind, cfg, props); };
  // Captain Russell, 25 Nov 2026: walk a new 2d Lt's LES first, in detail, then show mine briefly as where it goes
  const Y = yours(false);
  const net = Math.round((sum(Y.E) - sum(Y.D)) * 100) / 100;

  // ---- the form, filled in with the 2d Lt's first month
  add('form', 'rect', {}, { x: 20, y: 40, w: 1560, h: 646, rx: 14, fill: '#0a1220', stroke: C.line, sw: 2, o: 0 });
  add('title', 'text', { size: 22, anchor: 'middle', weight: 800, mono: true, fit: LES_FIT }, { x: 800, y: 76, content: 'MILITARY LEAVE AND EARNINGS STATEMENT', fill: C.soft, o: 0 });
  HEADS.forEach(([k, x], i) => {
    add('hk' + i, 'text', { size: 17, anchor: 'start', weight: 700, mono: true, fit: LES_FIT }, { x, y: 112, content: k, fill: C.faint, o: 0 });
    add('hv' + i, 'text', { size: 26, anchor: 'start', weight: 800, mono: true, fit: LES_FIT }, { x, y: 148, content: Y.head[i], fill: i ? C.ink : C.amber, o: 0 });
  });
  COLS.forEach(([name], c) => {
    add('col' + c, 'rect', {}, { x: PX[c], y: PY, w: PW, h: PH, rx: 10, fill: C.panel2, stroke: C.line, sw: 2, o: 0 });
    add('cn' + c, 'text', { size: 22, anchor: 'middle', weight: 800, mono: true, fit: LES_FIT }, { x: PX[c] + PW / 2, y: PY + 40, content: name, fill: C.soft, o: 0 });
    add('cl' + c, 'rect', {}, { x: PX[c] + 16, y: PY + 56, w: PW - 32, h: 2, rx: 1, fill: C.line, o: 0 });
  });
  // rows: E 0-3 (3 is the special pay line), D 0-5, A 0-3
  const rows = { E: 4, D: 6, A: 4 };
  Object.entries(rows).forEach(([k, n]) => {
    const c = 'EDA'.indexOf(k);
    for (let r = 0; r < n; r++) {
      const src = Y[k][r];
      add(k + 'l' + r, 'text', { size: 19, anchor: 'start', weight: 700, mono: true, fit: LES_FIT }, { x: PX[c] + 18, y: ROW0 + r * RH, content: src ? src[0] : '', fill: C.ink, o: 0 });
      add(k + 'v' + r, 'money', { size: 20, anchor: 'end', weight: 800, mono: true, les: true, fit: LES_FIT }, { x: PX[c] + PW - 18, y: ROW0 + r * RH, num: src ? src[1] : 0, fill: C.ink, o: 0 });
    }
    add(k + 'tl', 'text', { size: 19, anchor: 'start', weight: 800, mono: true, fit: LES_FIT }, { x: PX[c] + 18, y: TOT_Y, content: 'TOTAL', fill: C.soft, o: 0 });
    add(k + 'tv', 'money', { size: 22, anchor: 'end', weight: 850, mono: true, les: true, fit: LES_FIT }, { x: PX[c] + PW - 18, y: TOT_Y, num: sum(Y[k]), fill: C.ink, o: 0 });
  });
  add('special', 'rect', { dash: '10 8' }, { x: PX[0] + 10, y: ROW0 + 3 * RH - 32, w: PW - 20, h: 44, rx: 8, fill: 'rgba(251,191,36,.06)', stroke: C.amber, sw: 2, o: 0 });
  add('none', 'text', { size: 24, anchor: 'middle', weight: 700, fit: LES_FIT }, { x: PX[2] + PW / 2, y: ROW0 + 60, content: 'None yet. Your call.', fill: C.faint, o: 0 });
  const SUM = [['+TOT ENT', sum(Y.E)], ['-TOT DED', sum(Y.D)], ['-TOT ALMT', 0]];
  SUM.forEach(([k, v], r) => {
    add('Sl' + r, 'text', { size: 19, anchor: 'start', weight: 700, mono: true, fit: LES_FIT }, { x: PX[3] + 18, y: ROW0 + r * RH, content: k, fill: C.ink, o: 0 });
    add('Sv' + r, 'money', { size: 20, anchor: 'end', weight: 800, mono: true, les: true, fit: LES_FIT }, { x: PX[3] + PW - 18, y: ROW0 + r * RH, num: v, fill: C.ink, o: 0 });
  });
  add('netl', 'text', { size: 22, anchor: 'start', weight: 850, mono: true, fit: LES_FIT }, { x: PX[3] + 18, y: ROW0 + 4 * RH + 30, content: '=NET AMT', fill: C.green, o: 0 });
  add('netv', 'money', { size: 34, anchor: 'end', weight: 850, mono: true, les: true, fit: LES_FIT }, { x: PX[3] + PW - 18, y: ROW0 + 4 * RH + 34, num: 0, fill: C.green, o: 0 });

  // ---- the key point under the form
  add('kp', 'text', { size: 40, anchor: 'start', weight: 800 }, { x: 40, y: 770, content: '', fill: C.ink, o: 0 });
  add('kp2', 'text', { size: 28, anchor: 'start', weight: 600 }, { x: 40, y: 818, content: '', fill: C.soft, o: 0 });
  add('kp3', 'text', { size: 28, anchor: 'start', weight: 600 }, { x: 40, y: 860, content: '', fill: C.soft, o: 0 });

  const ids = (re) => all.filter((i) => re.test(i));
  const FORM = ids(/^(form|title|h[kv]\d|col\d|cn\d|cl\d)$/);
  const focus = (s, c) => { COLS.forEach((_, k) => { s['col' + k].stroke = k === c ? C.cyan : C.line; s['col' + k].sw = k === c ? 4 : 2; }); };
  const rowsOf = (k) => ids(new RegExp('^' + k + '[lv]\\d$'));
  const showCol = (s, k, on) => { rowsOf(k).forEach((i) => { const r = +i.slice(-1); if ((k === 'E' && r === 3) || !s[k + 'l' + r].content) return; s[i].o = on; }); s[k + 'tl'].o = on; s[k + 'tv'].o = on; };
  const sumCol = (s, on) => ids(/^S[lv]\d$|^net[lv]$/).forEach((i) => { s[i].o = on; });
  const say = (s, a, b, c) => { s.kp.content = a; s.kp2.content = b || ''; s.kp3.content = c || ''; s.kp.o = 1; s.kp2.o = b ? 1 : 0; s.kp3.o = c ? 1 : 0; };
  const quiet = (s) => { s.kp.o = 0; s.kp2.o = 0; s.kp3.o = 0; };
  const colGo = (c, label) => [PX[c] + PW / 2, PY + PH / 2, PW + 8, PH + 8, label, 'top'];   // label above, so the key point below stays clear

  // ================================================================ steps
  S.step({ head: 'Your first LES', body: 'This is what a brand new 2d Lt\'s first Leave and Earnings Statement looks like: single, at JBSA-Lackland in San Antonio. **Four columns**, and once you know them you can read any LES.', go: colGo(0, 'Start with entitlements') })
    .beat(0.8, (s) => { FORM.forEach((i) => { s[i].o = 1; }); })
    // the empty form first; each column fills in as it's explained (Captain Russell, 25 Nov 2026: not all at once)
    .beat(0.6, (s) => { say(s, 'Entitlements, deductions, allotments, and what\'s left', 'Read it left to right, every month.', ''); });

  S.step({ head: 'Entitlements: what you earn', body: '**Type 1: base pay**, set by rank and years of service. It is taxed. **Type 2: allowances.** Basic Allowance for Housing pays for housing and Basic Allowance for Subsistence for food. They are not taxed.', go: [PX[0] + PW / 2, ROW0 + 3 * RH - 10, PW, 70, 'Is there a third type?'] })
    .beat(0.8, (s) => { quiet(s); focus(s, 0); showCol(s, 'E', 1); })
    .beat(0.8, (s) => { s.El0.fill = C.cyan; s.Ev0.fill = C.cyan; ['1', '2'].forEach((r) => { s['El' + r].fill = C.violet; s['Ev' + r].fill = C.violet; });
      say(s, `${fmt(sum(Y.E), { cents: true })} a month. Only the base pay is taxed.`, 'Basic Allowance for Housing: set by rank, zip code and dependents. San Antonio: $1,584.', 'Basic Allowance for Subsistence: $328.48 for every officer.'); });

  S.step({ head: 'Type 3: special and incentive pay', body: 'Extra pay for certain jobs or locations, like flight pay or hazardous duty pay. **Most new lieutenants don\'t get any yet**, so it\'s blank here.', go: colGo(1, 'Now, deductions') })
    .beat(0.8, (s) => { s.special.o = 1; s.El3.o = 1; s.El3.content = 'SPECIAL/INCENTIVE'; s.El3.fill = C.amber; s.Ev3.o = 1; s.Ev3.num = 0; s.Ev3.fill = C.amber; })
    .beat(0.6, (s) => { say(s, 'Flight, jump, dive, language, hazard pay', 'Only for certain jobs or places. Pilots pick up flight pay later.', ''); });

  S.step({ head: 'Deductions: what is taken out', body: 'Federal income tax, FICA (Social Security and Medicare), life insurance (SGLI) and your TSP. **Taxes come from base pay only**, because allowances aren\'t taxed.', go: colGo(2, 'Now, allotments') })
    .beat(0.6, (s) => { s.special.o = 0; s.El3.o = 0; s.Ev3.o = 0; showCol(s, 'E', 0.25); showCol(s, 'D', 1); focus(s, 1); quiet(s); })
    .beat(0.8, (s) => { s.Dl4.fill = C.green; s.Dv4.fill = C.green;
      say(s, 'Roth TSP: 5% of base pay, ' + fmt(Y.D[4][1], { cents: true }) + ' a month', 'That gets you the full Air Force match. More on that in the BRS.', 'Federal tax here is a 2026 estimate for a single 2d Lt.'); });

  S.step({ head: 'Allotments: pay yourself first', body: 'Money sent out **before** your pay ever hits the bank. You start with none, and **setting them up is your first big money decision.**', go: colGo(3, 'What is left?') })
    .beat(0.6, (s) => { showCol(s, 'D', 0.25); s.Atl.o = 1; s.Atv.o = 1; s.none.o = 1; focus(s, 2); quiet(s); })
    .beat(0.6, (s) => { say(s, 'Set it up once and it just happens', 'A Roth IRA, an emergency fund, a savings account: paid before you can spend it.', ''); });

  S.step({ head: 'What is left', body: 'Entitlements, minus deductions, minus allotments. **That\'s what lands in your bank account** every month.', go: colGo(3, 'And mine?') })
    .beat(0.6, (s) => { s.Atl.o = 0.25; s.Atv.o = 0.25; s.none.o = 0.25; focus(s, 3); sumCol(s, 1); s.netv.num = 0; quiet(s); })
    .beat(1.6, (s) => { s.netv.num = net; s.netv.s = 1.12;
      say(s, `${fmt(sum(Y.E), { cents: true })} − ${fmt(sum(Y.D), { cents: true })} − $0 = ${fmt(net, { cents: true })}`, 'Your take-home pay as a single 2d Lt, before you set up a single allotment.', ''); })
    .beat(0.4, (s) => { s.netv.s = 1; });

  // mine, as a reference (Captain Russell, 25 Nov 2026: the point is that a brand new 2d Lt could live bigger than I do
  // right now, 7 years in, and that spending everything you take home isn't the smart move)
  S.step({ head: 'My LES, 7 years in', body: 'A brand new 2d Lt could **live a bigger lifestyle than I do right now**, 7 years in. That doesn\'t make it smart to **spend everything you earn.**' })
    .beat(0.6, (s) => { quiet(s); focus(s, -1); ['E', 'D', 'A'].forEach((k) => { rowsOf(k).forEach((i) => { s[i].o = 0; }); s[k + 'tl'].o = 0; s[k + 'tv'].o = 0; }); s.none.o = 0; sumCol(s, 0); })
    .beat(1.6, (s) => {
      MINE.head.forEach((v, i) => { s['hv' + i].content = v; }); s.hv0.fill = C.ink;
      ['E', 'D', 'A'].forEach((k) => { for (let r = 0; r < rows[k]; r++) { const src = MINE[k][r]; s[k + 'l' + r].content = src ? (k === 'A' ? MINE.Areal[r] : src[0]) : ''; s[k + 'v' + r].num = src ? src[1] : 0; s[k + 'l' + r].fill = C.ink; s[k + 'v' + r].fill = C.ink; s[k + 'l' + r].o = src ? 1 : 0; s[k + 'v' + r].o = src ? 1 : 0; } s[k + 'tl'].o = 1; s[k + 'tv'].o = 1; s[k + 'tv'].num = sum(MINE[k]); });
      s.Dl5.fill = C.green; s.Dv5.fill = C.green; [0, 2, 3].forEach((r) => { s['Al' + r].fill = C.green; s['Av' + r].fill = C.green; });
      s.Sv0.num = sum(MINE.E); s.Sv1.num = sum(MINE.D); s.Sv2.num = sum(MINE.A); sumCol(s, 1); s.netv.num = 4000; },
      (id) => { const m = /^([EDAS])[lv](\d)$/.exec(id); return m ? { w: ['EDAS'.indexOf(m[1]) / 5, ('EDAS'.indexOf(m[1]) + 2) / 5] } : null; })
    .beat(0.6, (s) => { say(s, `A brand new 2d Lt takes home ${fmt(net)}. I live on $4,000.`, `You could live bigger than me on day 1. I bring in ${fmt(sum(MINE.E))}, and about half goes to work before I see it.`, 'Just because you can spend it all doesn\'t mean you should. Pay yourself first.'); });

  return S;
}

FR.SCENES = FR.SCENES || {};
FR.SCENES.fr2 = scene;
})();
