/* Chapter 1 scene, shared by the chapter page (lesson player) and the slide deck (../../slides/).
   Exposes FR.SCENES.fr1. */
(function () {
'use strict';
/* =====================================================================
   Chapter 1: From −$20K
   My net worth at the start of each year, 2019 to now, drawn as it grew:
   three years digging out of debt, crossing zero in 2022, then the curve
   bending as each year's gain beats the last. Then my real October 2026
   budget (O-3 over 6, married, one child, Ames, Iowa): what comes in
   (base pay, BAH, BAS, TSP match), where it goes (half saved and
   invested), the line items, and what the net worth is made of.
   Source: my own budget spreadsheet (October 2026 tab).
   Code organized with help from Claude (Anthropic).
   ===================================================================== */
const { Scene, C } = Anim;
const fmt = FR.fmt;

// ---------------------------------------------------------------- data (October 2026 tab)
// today's total from the real balances on 23 and 24 Nov 2026 (TSP, both Fidelity Roth IRAs) plus the sheet's cash, cars and home equity
const NOW = 290039;
const NW = [[2019, -19421.40], [2020, -12000], [2021, -3500], [2022, 24000], [2023, 58000], [2024, 110000], [2025, 170000], [2026, 240000], [2026.9, NOW]];
const PAY_IN = [['Base pay', 7737, C.cyan], ['Basic Allowance for Housing', 2280, C.violet], ['Basic Allowance for Subsistence', 328.48, C.blue], ['TSP match', 386.85, C.green]];
const GROSS = 10732.33;
const OUT = [['Saving and investing', 5398.17, C.green], ['Living', 3945.47, C.amber], ['Taxes and insurance', 1334.16, C.red]];
const SAVE = [['Roth TSP (27% of base)', 2088.99], ['Emergency fund', 1672.33], ['Roth IRA', 625], ['Spouse Roth IRA', 625], ['TSP 1% + 4% match', 386.85]];
// a normal month (Captain Russell, 24 Nov 2026: October's $1,550 mortgage was a one-off escrow adjustment)
const LIVE = [['Mortgage', 1300], ['Groceries', 900], ['Sydney', 500], ['Utilities', 400], ['Misc', 300], ['Pets', 200],
  ['Subscriptions + haircut', 120], ['Gasoline', 100], ['Eating out', 100], ['Car insurance', 25.47]];
const WORTH = [['Roth TSP (C Fund)', 198148, C.green], ['Roth IRAs', 54091, C.cyan], ['Emergency fund', 16000, C.blue], ['Cars', 15000, C.violet], ['Home equity', 6500, C.amber], ['Brokerage', 300, C.soft]];
// What I put in the TSP (my W-2s; Captain Russell, 24 Nov 2026) and the taxable base pay on the same W-2s.
// Commissioned June 2019, active duty 14 June 2020, 1st Lt December 2021, Captain December 2023. Maxed out the TSP from 2023.
// each year's elective deferral limit (IRS, under 50) is the cap the bar fills toward (Captain Russell, 25 Nov 2026)
const TSP_IN = [[2021, 6308.33, 41155.49, '1st Lt', 19500], [2022, 16278.46, 59276.08, '', 20500], [2023, 22500, 67622.12, 'Capt', 22500], [2024, 23000, 81673.2, '', 23000], [2025, 23500, 87579.28, '', 23500],
  // 2026 isn't over yet, but he reaches the $24,500 limit this year (Captain Russell, 25 Nov 2026)
  [2026, 24500, 77370, '', 24500, true]];
const CAP26 = 24500;
// base pay on each W-2 (2026 through October), adding up to LIFETIME
const EARN = [[2020, 21295.29], [2021, 41155.49], [2022, 59276.08], [2023, 67622.12], [2024, 81673.2], [2025, 87579.28], [2026, 77370]];
const LIFETIME = 435971.46;   // all base pay on my W-2s, June 2020 to October 2026

// a horizontal bar made of segments, each in proportion to its amount
const BX = 160, BW = 1280;
function segs(list, total) { let x = BX; return list.map((s) => { const w = s[1] / total * BW; const r = { x, w, mid: x + w / 2 }; x += w; return r; }); }

function scene(st) {
  const S = new Scene('fr1');
  const all = [];
  const add = (id, kind, cfg, props) => { all.push(id); return S.add(id, kind, cfg, props); };

  // ---- the opener: the pre-class discussion post (O-1, 0 years, single, off base in San Antonio 78236, 2026 rates)
  // and lifestyle inflation (Captain Russell, 24 Nov 2026: "put away that excess above your baseline")
  const HW = [['Base pay (O-1, under 2 years)', 4150.20], ['Basic Allowance for Housing (San Antonio)', 1584], ['Basic Allowance for Subsistence', 328.48]];
  add('hwHead', 'text', { size: 44, anchor: 'middle', weight: 850, maxw: 1400 }, { x: 800, y: 130, content: 'Your discussion post: a brand new 2d Lt', fill: C.ink, o: 0 });
  add('hwSub', 'text', { size: 28, anchor: 'middle', weight: 600, maxw: 1400 }, { x: 800, y: 178, content: 'Single, off base in San Antonio, 2026 rates', fill: C.soft, o: 0 });
  HW.forEach(([n, v], i) => {
    add('hwL' + i, 'text', { size: 34, anchor: 'start', weight: 650, maxw: 760 }, { x: 260, y: 290 + i * 80, content: n, fill: C.ink, o: 0 });
    add('hwV' + i, 'text', { size: 38, anchor: 'end', weight: 800, mono: true }, { x: 1340, y: 290 + i * 80, content: fmt(v, { cents: true }), fill: C.ink, o: 0 });
  });
  add('hwRule', 'rect', {}, { x: 260, y: 482, w: 0, h: 4, rx: 2, fill: C.soft, o: 0 });
  add('hwM', 'money', { size: 96, weight: 850, mono: true, cents: true }, { x: 800, y: 620, num: 0, fill: C.green, o: 0 });
  add('hwML', 'text', { size: 32, anchor: 'middle', weight: 650 }, { x: 800, y: 680, content: 'a month', fill: C.soft, o: 0 });
  add('hwY', 'text', { size: 44, anchor: 'middle', weight: 800, mono: true }, { x: 800, y: 790, content: '$72,752.16 a year', fill: C.cyan, o: 0 });

  // officer vs enlisted (Captain Russell, 24 Nov 2026): base pay + Basic Allowance for Housing + Basic Allowance for Subsistence,
  // no dependents, off base in San Antonio (78252), 2026 rates, from his pay calculator screenshots. 25 Nov 2026: compare the
  // O-3 at 8 years ($10,460.50) with an E-9 at 20+ years ($10,558.10), and spell out each enlisted rank with its insignia.
  const OE = [['Day 1', 'O-1', 6062.20, 'E-1', 4242.20], ['2 years', 'O-2', 7601.20, 'E-3', 4850.00], ['4 years', 'O-3', 9717.70, 'E-4', 5493.50], ['8 years', 'O-3', 10460.50, 'E-5', 6275.90]];
  const E9 = 10558.10, OB = 676, OHmax = 380, oh = (v) => v / 11000 * OHmax, ogx = (i) => 250 + i * 270;
  const insImg = (id, g, cx, y, h) => { const ins = FR.INSIGNIA[g]; if (!ins) return; const ww = Math.min(64, h * ins[1]), h2 = ww / ins[1]; add(id, 'img', { href: 'insignia/' + ins[0] + '.svg' }, { x: cx - ww / 2, y: y + (h - h2) / 2, w: ww, h: h2, o: 0 }); };
  add('oeHead', 'text', { size: 44, anchor: 'middle', weight: 850, maxw: 1400 }, { x: 800, y: 96, content: 'Officer vs enlisted: the same Air Force', fill: C.ink, o: 0 });
  add('oeSub', 'text', { size: 26, anchor: 'middle', weight: 600, maxw: 1400 }, { x: 800, y: 138, content: 'A month of base pay and allowances. No dependents, San Antonio, 2026.', fill: C.soft, o: 0 });
  OE.forEach(([yrs, og, ov, eg, ev], i) => {
    const x = ogx(i);
    add('oeO' + i, 'rect', {}, { x: x - 100, y: OB, w: 96, h: 0, rx: 8, fill: C.cyan, o: 0 });
    add('oeOv' + i, 'text', { size: 26, anchor: 'middle', weight: 800, mono: true }, { x: x - 52, y: OB - oh(ov) - 14, content: ov >= 10000 ? '$' + (ov / 1000).toFixed(1) + 'K' : fmt(ov, { k: true }), fill: C.cyan, o: 0 });
    add('oeE' + i, 'rect', {}, { x: x + 4, y: OB, w: 96, h: 0, rx: 8, fill: C.amber, o: 0 });
    add('oeEv' + i, 'text', { size: 26, anchor: 'middle', weight: 800, mono: true }, { x: x + 52, y: OB - oh(ev) - 14, content: fmt(ev, { k: true }), fill: C.amber, o: 0 });
    add('oeG' + i, 'text', { size: 22, anchor: 'middle', weight: 800, mono: true }, { x: x - 52, y: OB + 30, content: og, fill: C.cyan, o: 0 });
    add('oeH' + i, 'text', { size: 22, anchor: 'middle', weight: 800, mono: true }, { x: x + 52, y: OB + 30, content: eg, fill: C.amber, o: 0 });
    add('oeN' + i, 'text', { size: 17, anchor: 'middle', weight: 700, maxw: 190 }, { x: x + 52, y: OB + 54, content: FR.RANK[eg], fill: C.ink, o: 0 });
    insImg('oeOi' + i, og, x - 52, OB + 64, 40);
    insImg('oeEi' + i, eg, x + 52, OB + 64, 40);
    add('oeY' + i, 'text', { size: 22, anchor: 'middle', weight: 600 }, { x, y: OB + 136, content: yrs, fill: C.faint, o: 0 });
  });
  const ex9 = 1380;
  add('oeE9', 'rect', {}, { x: ex9 - 48, y: OB, w: 96, h: 0, rx: 8, fill: C.amber, o: 0 });
  add('oeE9v', 'text', { size: 26, anchor: 'middle', weight: 800, mono: true }, { x: ex9, y: OB - oh(E9) - 14, content: '$' + (E9 / 1000).toFixed(1) + 'K', fill: C.amber, o: 0 });
  add('oeE9g', 'text', { size: 22, anchor: 'middle', weight: 800, mono: true }, { x: ex9, y: OB + 30, content: 'E-9', fill: C.amber, o: 0 });
  add('oeE9n', 'text', { size: 17, anchor: 'middle', weight: 700, maxw: 200 }, { x: ex9, y: OB + 54, content: FR.RANK['E-9'], fill: C.ink, o: 0 });
  insImg('oeE9i', 'E-9', ex9, OB + 64, 40);
  add('oeE9y', 'text', { size: 22, anchor: 'middle', weight: 600 }, { x: ex9, y: OB + 136, content: '20+ years', fill: C.faint, o: 0 });
  add('oeLine', 'rect', {}, { x: ogx(3) - 100, y: OB - oh(10460.5) - 2, w: 0, h: 4, rx: 2, fill: C.cyan, o: 0 });
  add('oeBig', 'text', { size: 34, anchor: 'end', weight: 850, maxw: 900 }, { x: 1440, y: 214, content: 'A captain at 8 years makes about what a', fill: C.ink, o: 0 });
  add('oeBig2', 'text', { size: 34, anchor: 'end', weight: 850, maxw: 900 }, { x: 1440, y: 256, content: 'chief master sergeant makes at 20.', fill: C.ink, o: 0 });
  add('oeKey', 'text', { size: 24, anchor: 'start', weight: 800 }, { x: 150, y: 214, content: '■ Officer', fill: C.cyan, o: 0 });
  add('oeKey2', 'text', { size: 24, anchor: 'start', weight: 800 }, { x: 150, y: 250, content: '■ Enlisted', fill: C.amber, o: 0 });

  // a brand new 2d Lt next to the Airmen who will work for them (Captain Russell, 25 Nov 2026: E-4 and below make less
  // than you on day 1). Same pay calculator numbers as the officer vs enlisted chart.
  const WK = [['O-1', 'Day 1', 6062.20, C.cyan], ['E-1', 'Day 1', 4242.20, C.amber], ['E-3', '2 years', 4850.00, C.amber], ['E-4', '4 years', 5493.50, C.amber], ['E-5', '8 years', 6275.90, C.amber]];
  const WX0 = 640, WX = (v) => WX0 + v / 7000 * 780, wy = (i) => 232 + i * 104;
  add('wkHead', 'text', { size: 44, anchor: 'middle', weight: 850, maxw: 1400 }, { x: 800, y: 110, content: 'You, next to the Airmen who work for you', fill: C.ink, o: 0 });
  add('wkSub', 'text', { size: 26, anchor: 'middle', weight: 600, maxw: 1400 }, { x: 800, y: 152, content: 'A month of base pay and allowances. No dependents, San Antonio, 2026.', fill: C.soft, o: 0 });
  WK.forEach(([g, yrs, v, col], i) => {
    const y = wy(i);
    insImg('wkI' + i, g, 190, y - 4, 52);
    add('wkN' + i, 'text', { size: 30, anchor: 'start', weight: 800, maxw: 380 }, { x: 250, y: y + 24, content: i ? FR.RANK[g] : 'You: ' + FR.RANK[g], fill: i ? C.ink : C.cyan, o: 0 });
    add('wkY' + i, 'text', { size: 21, anchor: 'start', weight: 600 }, { x: 250, y: y + 56, content: g + ' · ' + yrs, fill: C.faint, o: 0 });
    add('wkB' + i, 'rect', {}, { x: WX0, y: y, w: 0, h: 54, rx: 8, fill: col, fo: 0.88, o: 0 });
    add('wkV' + i, 'text', { size: 28, anchor: 'start', weight: 850, mono: true }, { x: WX(v) + 16, y: y + 38, content: fmt(v), fill: col, o: 0 });
  });
  add('wkLine', 'rect', {}, { x: WX(6062.20) - 2, y: wy(0) - 10, w: 4, h: 0, rx: 2, fill: C.cyan, o: 0 });
  add('wkBig', 'text', { size: 34, anchor: 'middle', weight: 850, maxw: 1400 }, { x: 800, y: 818, content: 'Every Airman E-4 and below makes less than you do on day 1.', fill: C.green, o: 0 });

  add('ldQ1', 'text', { size: 44, anchor: 'middle', weight: 850, maxw: 1400 }, { x: 800, y: 250, content: 'Your troops will have a harder time with money than you will.', fill: C.ink, o: 0 });
  add('ldA', 'text', { size: 38, anchor: 'middle', weight: 750, maxw: 1400 }, { x: 800, y: 400, content: 'Never brag about your money in front of them.', fill: C.red, o: 0 });
  add('ldB', 'text', { size: 38, anchor: 'middle', weight: 750, maxw: 1400 }, { x: 800, y: 470, content: 'Never complain about your pay in front of them.', fill: C.red, o: 0 });
  add('ldC', 'text', { size: 50, anchor: 'middle', weight: 850, maxw: 1400 }, { x: 800, y: 640, content: 'You are paid the big money', fill: C.green, o: 0 });
  add('ldD', 'text', { size: 50, anchor: 'middle', weight: 850, maxw: 1400 }, { x: 800, y: 710, content: 'to make big decisions.', fill: C.green, o: 0 });

  // lifestyle inflation with the taxes counted (Captain Russell, 25 Nov 2026): the 2d Lt paycheck is taxes, then the
  // college budget, then what's left to invest (FR.LIFE in ../shared/fr.js)
  const L = FR.LIFE, LB = L.BUDGET, LP = L.PAY, LX = 200, LWD = 1200, lw = (v) => LWD * v / LP, LG = L.grow(L.BANK);
  add('liHead', 'text', { size: 44, anchor: 'middle', weight: 850, maxw: 1400 }, { x: 800, y: 130, content: 'The easiest way to win', fill: C.ink, o: 0 });
  add('liAl', 'text', { size: 28, anchor: 'start', weight: 700 }, { x: LX, y: 236, content: 'A college student\'s budget', fill: C.soft, o: 0 });
  add('liA', 'rect', {}, { x: LX, y: 256, w: 0, h: 90, rx: 8, fill: C.amber, fo: 0.85, o: 0 });
  add('liAv', 'text', { size: 34, anchor: 'end', weight: 850, mono: true }, { x: LX + lw(LB) - 20, y: 314, content: fmt(LB), fill: '#06101c', o: 0 });
  add('liBl', 'text', { size: 28, anchor: 'start', weight: 700 }, { x: LX, y: 416, content: 'Your first month as a 2d Lt: ' + fmt(LP, { cents: true }), fill: C.soft, o: 0 });
  add('liT', 'rect', {}, { x: LX, y: 436, w: 0, h: 90, rx: 8, fill: C.red, fo: 0.85, o: 0 });
  add('liTv', 'text', { size: 22, anchor: 'middle', weight: 850 }, { x: LX + lw(L.TAX) / 2, y: 552, content: 'Taxes ' + fmt(L.TAX), fill: C.red, o: 0 });
  add('liB', 'rect', {}, { x: LX + lw(L.TAX), y: 436, w: 0, h: 90, rx: 8, fill: C.amber, fo: 0.85, o: 0 });
  add('liBv', 'text', { size: 30, anchor: 'middle', weight: 850, mono: true }, { x: LX + lw(L.TAX) + lw(LB) / 2, y: 494, content: 'Budget ' + fmt(LB), fill: '#06101c', o: 0 });
  add('liX', 'rect', {}, { x: LX + lw(L.TAX + LB), y: 436, w: 0, h: 90, rx: 8, fill: C.green, fo: 0.9, o: 0 });
  add('liXv', 'text', { size: 34, anchor: 'middle', weight: 850, mono: true }, { x: LX + lw(L.TAX + LB) + lw(L.BANK) / 2, y: 494, content: '+' + fmt(L.BANK), fill: '#06101c', o: 0 });
  add('liBig', 'text', { size: 52, anchor: 'middle', weight: 850, maxw: 1400 }, { x: 800, y: 650, content: 'Keep the college budget. Invest the rest.', fill: C.green, o: 0 });
  add('liSub', 'text', { size: 30, anchor: 'middle', weight: 600, maxw: 1400 }, { x: 800, y: 720, content: 'Invested for your 4-year commitment at 7%: about ' + fmt(Math.round(LG.f4 / 1000) * 1000) + '.', fill: C.ink, o: 0 });
  add('liSub2', 'text', { size: 30, anchor: 'middle', weight: 600, maxw: 1400 }, { x: 800, y: 770, content: 'Never add another dime, and at 60 it\'s about $' + (LG.f60 / 1e6).toFixed(1) + ' million, in today\'s dollars.', fill: C.amber, o: 0 });

  // ---- the opening number
  add('big', 'money', { size: 140, weight: 850, cents: true }, { x: 800, y: 430, num: -19421.40, fill: C.red, o: 0 });
  add('bigSub', 'text', { size: 38, anchor: 'middle', weight: 600 }, { x: 800, y: 640, content: 'Fresh out of college. Student loans. No savings.', fill: C.soft, o: 0 });
  add('bigYr', 'text', { size: 44, anchor: 'middle', weight: 800, mono: true }, { x: 800, y: 270, content: '2019', fill: C.soft, o: 0 });

  // ---- the paycheck: what comes in (Captain Russell, 25 Nov 2026: show each part's share of the whole paycheck)
  const pc = (v) => (v / GROSS < 0.005 ? 'under 1%' : Math.round(v / GROSS * 100) + '%');
  add('inHead', 'text', { size: 40, anchor: 'start', weight: 800 }, { x: BX, y: 100, content: 'My October paycheck: $10,732 a month', fill: C.ink, o: 0 });
  add('inSub', 'text', { size: 26, anchor: 'start', weight: 600 }, { x: BX, y: 142, content: 'Captain, over 6 years, married with one child, Ames, Iowa', fill: C.soft, o: 0 });
  const IN = segs(PAY_IN, GROSS);
  let outside = 0;
  PAY_IN.forEach((s, i) => {
    add('in' + i, 'rect', {}, { x: IN[i].x, y: 170, w: 0, h: 96, rx: 6, fill: s[2], fo: 0.85, o: 0 });
    const label = `${s[0]} ${fmt(s[1])} · ${pc(s[1])}`, wide = IN[i].w > label.length * 17;   // long names that don't fit go in a list under the bar
    add('inL' + i, 'text', { size: wide ? 30 : 24, anchor: wide ? 'middle' : 'end', weight: 800 },
      { x: wide ? IN[i].mid : BX + BW, y: wide ? 230 : 362 + (outside++) * 40, content: label, fill: wide ? '#06101c' : s[2], o: 0 });
  });
  // what kind of pay each is
  add('tTax', 'text', { size: 26, anchor: 'middle', weight: 700 }, { x: IN[0].mid, y: 312, content: 'Taxed', fill: C.soft, o: 0 });
  add('tFree', 'text', { size: 26, anchor: 'middle', weight: 700 }, { x: (IN[1].x + IN[2].x + IN[2].w) / 2, y: 312, content: 'Allowances: not taxed', fill: C.green, o: 0 });

  // ---- where it goes
  add('outHead', 'text', { size: 40, anchor: 'start', weight: 800 }, { x: BX, y: 525, content: 'Where it goes', fill: C.ink, o: 0 });
  const OU = segs(OUT, GROSS);
  OUT.forEach((s, i) => {
    add('out' + i, 'rect', {}, { x: OU[i].x, y: 552, w: 0, h: 96, rx: 6, fill: s[2], fo: 0.85, o: 0 });
    const wide = OU[i].w > 300;
    add('outL' + i, 'text', { size: wide ? 30 : 24, anchor: wide ? 'middle' : 'end', weight: 800 },
      { x: wide ? OU[i].mid : BX + BW, y: wide ? 610 : 692, content: `${s[0]} ${fmt(s[1])} · ${pc(s[1])}`, fill: wide ? '#06101c' : s[2], o: 0 });
  });
  add('outPct', 'text', { size: 64, anchor: 'start', weight: 850 }, { x: BX, y: 846, content: '50% saved and invested', fill: C.green, o: 0 });

  // ---- the line items: they rise out of the Where it goes bar, each with its share of the paycheck
  const ROW = 56, maxA = 2088.99, SY = 610;
  add('sHead', 'text', { size: 34, anchor: 'start', weight: 800 }, { x: OU[0].x + 20, y: SY, content: `Saving and investing  ${fmt(OUT[0][1])} · ${pc(OUT[0][1])}`, fill: C.green, o: 0 });
  SAVE.forEach((r, i) => {
    const y = 210 + i * ROW * 1.3;
    add('sL' + i, 'text', { size: 27, anchor: 'start', weight: 650, maxw: 420 }, { x: 110, y: SY, ty: y, content: r[0], fill: C.ink, o: 0 });
    add('sV' + i, 'text', { size: 27, anchor: 'end', weight: 800, mono: true }, { x: 740, y: SY, ty: y, content: `${fmt(r[1])} · ${pc(r[1])}`, fill: C.ink, o: 0 });
    add('sB' + i, 'rect', {}, { x: 110, y: SY, ty: y + 12, w: 0, h: 14, rx: 7, fill: C.green, o: 0, wTo: r[1] / maxA * 630 });
  });
  add('lHead', 'text', { size: 34, anchor: 'start', weight: 800 }, { x: OU[1].x + 20, y: SY, content: `Living  ${fmt(OUT[1][1])} · ${pc(OUT[1][1])}`, fill: C.amber, o: 0 });
  LIVE.forEach((r, i) => {
    const y = 210 + i * ROW * 1.12;
    add('lL' + i, 'text', { size: 26, anchor: 'start', weight: 650, maxw: 360 }, { x: 860, y: SY, ty: y, content: r[0], fill: C.ink, o: 0 });
    add('lV' + i, 'text', { size: 26, anchor: 'end', weight: 800, mono: true }, { x: 1490, y: SY, ty: y, content: `${fmt(r[1])} · ${pc(r[1])}`, fill: C.ink, o: 0 });
    add('lB' + i, 'rect', {}, { x: 860, y: SY, ty: y + 10, w: 0, h: 12, rx: 6, fill: C.amber, o: 0, wTo: r[1] / maxA * 630 });
  });

  // ---- what I put in the TSP each year, against that year's cap (Captain Russell, 25 Nov 2026)
  add('tspHead', 'text', { size: 40, anchor: 'middle', weight: 800 }, { x: 800, y: 110, content: 'What I put in the TSP each year', fill: C.ink, o: 0 });
  add('tspSub', 'text', { size: 26, anchor: 'middle', weight: 600, maxw: 1400 }, { x: 800, y: 152, content: 'From my W-2s. Each bar fills toward that year\'s limit. The 2026 limit is ' + fmt(CAP26) + '.', fill: C.soft, o: 0 });
  const TB = 680, TH = 400, th = (v) => v / CAP26 * TH;
  TSP_IN.forEach(([yr, amt, base, rank, cap, soon], i) => {
    const x = 800 + (i - (TSP_IN.length - 1) / 2) * 225, h = Math.max(4, th(amt)), full = amt >= cap;
    add('tspC' + i, 'rect', { dash: '10 8' }, { x: x - 75, y: TB - th(cap), w: 150, h: th(cap), rx: 10, fill: 'rgba(255,255,255,.03)', stroke: C.faint, sw: 2, o: 0 });
    add('tspCv' + i, 'text', { size: 21, anchor: 'middle', weight: 700, mono: true }, { x, y: TB - th(cap) - 14, content: 'Limit ' + fmt(cap), fill: C.faint, o: 0 });
    add('tspB' + i, 'rect', {}, { x: x - 71, y: TB, w: 142, h: 0, rx: 8, fill: full ? C.green : C.amber, o: 0, hTo: h });
    add('tspP' + i, 'text', { size: 30, anchor: 'middle', weight: 850, mono: true }, { x, y: TB - Math.max(h, 40) / 2 + 10, content: Math.round(amt / cap * 100) + '%', fill: '#06101c', o: 0 });
    add('tspY' + i, 'text', { size: 26, anchor: 'middle', weight: 700, mono: true }, { x, y: TB + 38, content: String(yr), fill: C.faint, o: 0 });
    add('tspV' + i, 'text', { size: 24, anchor: 'middle', weight: 800, mono: true }, { x, y: TB + 72, content: fmt(amt), fill: C.ink, o: 0 });
    add('tspR' + i, 'text', { size: 22, anchor: 'middle', weight: 800 }, { x, y: TB + 104, content: soon ? 'Maxed by December' : rank ? 'Promoted to ' + rank : '', fill: soon ? C.green : C.amber, o: 0 });
  });
  add('tsp401', 'text', { size: 26, anchor: 'middle', weight: 650, maxw: 1440 }, { x: 800, y: 850, content: 'The TSP is the military\'s 401(k). It works just like the one a big company offers, match included.', fill: C.green, o: 0 });

  // ---- what I earned vs what I have: each year's base pay, then all of it together, then what is left today
  const KW = 1280, kx = 160, EB = 600, EH = 330, ek = (v) => v / 90000 * EH, ex = (i) => 250 + i * 185;
  add('kHead', 'text', { size: 40, anchor: 'start', weight: 800 }, { x: kx, y: 110, content: 'What I earned vs what I have', fill: C.ink, o: 0 });
  add('kEl', 'text', { size: 28, anchor: 'start', weight: 700 }, { x: kx, y: 236, content: 'All my base pay, June 2020 to now (W-2s)', fill: C.soft, o: 0 });
  let cum = 0;
  EARN.forEach(([yr, v], i) => {
    const sx = kx + KW * cum / LIFETIME, sw = KW * v / LIFETIME; cum += v;
    add('kE' + i, 'rect', {}, { x: ex(i) - 60, y: EB, w: 120, h: 0, rx: 8, fill: C.cyan, fo: 0.55 + i * 0.06, o: 0, cx: sx, cw: sw - 3 });
    add('kEv' + i, 'text', { size: 25, anchor: 'middle', weight: 800, mono: true }, { x: ex(i), y: EB - ek(v) - 16, content: fmt(v, { k: true }), fill: C.ink, o: 0 });
    add('kEy' + i, 'text', { size: 24, anchor: 'middle', weight: 700, mono: true }, { x: ex(i), y: EB + 38, content: yr === 2026 ? '2026*' : String(yr), fill: C.faint, o: 0 });
  });
  add('kEn', 'text', { size: 22, anchor: 'start', weight: 600 }, { x: kx, y: EB + 90, content: '*2026 through October. The dotted bar is the whole year at that pace.', fill: C.faint, o: 0 });
  // 2026 isn't over: a dotted outline of the full year at the same pace shows the climb (Captain Russell, 25 Nov 2026)
  const E26 = EARN[EARN.length - 1][1] * 12 / 10, i26 = EARN.length - 1;
  add('kEx', 'rect', { dash: '10 8' }, { x: ex(i26) - 60, y: EB - ek(E26), w: 120, h: ek(E26), rx: 8, fill: 'rgba(78,168,255,.06)', stroke: C.cyan, sw: 3, o: 0 });
  add('kExv', 'text', { size: 22, anchor: 'middle', weight: 800, mono: true }, { x: ex(i26), y: EB - ek(E26) - 16, content: '~' + fmt(E26, { k: true }), fill: C.cyan, o: 0 });
  add('kEv', 'text', { size: 36, anchor: 'end', weight: 850, mono: true }, { x: kx + KW - 24, y: 314, content: fmt(LIFETIME), fill: '#06101c', o: 0 });
  add('kHl', 'text', { size: 28, anchor: 'start', weight: 700 }, { x: kx, y: 436, content: 'My net worth today', fill: C.soft, o: 0 });
  add('kH', 'rect', {}, { x: kx, y: 456, w: 0, h: 90, rx: 8, fill: C.green, fo: 0.85, o: 0 });
  add('kHv', 'text', { size: 36, anchor: 'end', weight: 850, mono: true }, { x: kx + KW * NOW / LIFETIME - 24, y: 514, content: fmt(NOW), fill: '#06101c', o: 0 });
  add('kBig', 'text', { size: 56, anchor: 'start', weight: 850, maxw: 1300 }, { x: kx, y: 660, content: `${Math.round(NOW / LIFETIME * 100)} cents of every dollar, still here`, fill: C.green, o: 0 });
  add('kTsp', 'text', { size: 40, anchor: 'start', weight: 800, maxw: 1300 }, { x: kx, y: 730, content: `And ${Math.round(WORTH[0][1] / NOW * 100)}% of what I have is in my TSP.`, fill: C.ink, o: 0 });
  add('kSub', 'text', { size: 28, anchor: 'start', weight: 600, maxw: 1300 }, { x: kx, y: 790, content: 'That\'s after taxes, a house, two cars, pets and a family.', fill: C.soft, o: 0 });

  // ---- what I got wrong, what I got right
  add('mHead', 'text', { size: 44, anchor: 'start', weight: 850 }, { x: 120, y: 120, content: 'What I got wrong', fill: C.ink, o: 0 });
  [['Trying to impress people with money', 'instead of just being myself.'],
   ['Not investing right away as a 2d Lt', 'Every month you wait is growth you never get back.'],
   ['Being so frugal it hurt my family', 'Now we spend on our pets and my wife\'s guilt-free money.']].forEach(([a, b], i) => {
    const y = 170 + i * 210;
    add('mR' + i, 'rect', {}, { x: 100, y, w: 1400, h: 180, rx: 22, fill: C.panel2, stroke: C.red, sw: 3, o: 0 });
    add('mN' + i, 'text', { size: 64, anchor: 'middle', weight: 850, mono: true }, { x: 180, y: y + 114, content: String(i + 1), fill: C.red, o: 0 });
    add('mA' + i, 'text', { size: 40, anchor: 'start', weight: 800, maxw: 1180 }, { x: 260, y: y + 78, content: a, fill: C.ink, o: 0 });
    add('mB' + i, 'text', { size: 30, anchor: 'start', weight: 600, maxw: 1180 }, { x: 260, y: y + 136, content: b, fill: C.soft, o: 0 });
  });

  add('wnHead', 'text', { size: 44, anchor: 'start', weight: 850 }, { x: 120, y: 120, content: 'What I got right: keep the big things small', fill: C.ink, o: 0 });
  [['HOME', '2 bed, 1 bath in Nevada, Iowa'], ['CAR', '2021 Hyundai Venue: paid off in 6 months, 60,000 miles'], ['CAR', '2006 Toyota Avalon from my grandma, 115,000 miles']].forEach(([a, b], i) => {
    const y = 230 + i * 110;
    add('wnA' + i, 'text', { size: 28, anchor: 'start', weight: 800, mono: true }, { x: 140, y: y + 40, content: a, fill: C.green, o: 0 });
    add('wnB' + i, 'text', { size: 36, anchor: 'start', weight: 700, maxw: 1150 }, { x: 300, y: y + 40, content: b, fill: C.ink, o: 0 });
  });
  add('wnBig', 'text', { size: 46, anchor: 'middle', weight: 850, maxw: 1400 }, { x: 800, y: 640, content: 'If the big things are in check,', fill: C.green, o: 0 });
  add('wnBig2', 'text', { size: 46, anchor: 'middle', weight: 850, maxw: 1400 }, { x: 800, y: 700, content: 'the little things don\'t hurt.', fill: C.green, o: 0 });
  add('wnQ', 'text', { size: 30, anchor: 'middle', weight: 650, maxw: 1400 }, { x: 800, y: 820, content: 'Freedom is bought with hard work and discipline over many years.', fill: C.amber, o: 0 });

  const hide = (s, ids) => ids.forEach((id) => { s[id].o = 0; });
  const ids = (pre) => all.filter((id) => id.startsWith(pre));

  // ================================================================ steps
  S.step({ head: 'What did you find?', body: 'Before class you worked out what a brand new 2d Lt makes. **Did you get $6,062.68?** If not, no big deal, let\'s look at it.', go: [800, 640, 900, 290, 'How does that compare?'] })
    .beat(0.6, (s) => { s.hwHead.o = 1; s.hwSub.o = 1; })
    .beat(1.4, (s) => { HW.forEach((_, i) => { s['hwL' + i].o = 1; s['hwV' + i].o = 1; }); }, (id) => { const m = /^hw[LV](\d)$/.exec(id); return m ? { w: [+m[1] / 3, (+m[1] + 1) / 3] } : null; })
    .beat(0.5, (s) => { s.hwRule.o = 1; s.hwRule.w = 1080; })
    .beat(1.4, (s) => { s.hwM.o = 1; s.hwM.num = 6062.68; s.hwML.o = 1; })
    .beat(0.6, (s) => { s.hwY.o = 1; });

  // one pair of bars per click on the same slide, then the E-9 by itself (Captain Russell, 25 Nov 2026)
  const pair = (s, i) => { const [, , ov, , ev] = OE[i]; s['oeO' + i].o = 1; s['oeO' + i].h = oh(ov); s['oeO' + i].y = OB - oh(ov); s['oeE' + i].o = 1; s['oeE' + i].h = oh(ev); s['oeE' + i].y = OB - oh(ev);
    ['Ov', 'Ev', 'G', 'H', 'N', 'Y', 'Oi', 'Ei'].forEach((k) => { if (s['oe' + k + i]) s['oe' + k + i].o = 1; }); };
  const OEB = 'Same base, same pay tables. **Watch each pair as the years go by.**';
  S.step({ head: 'Now compare it', key: 'oe0', grp: 'oe', body: OEB, go: [800, 485, 1420, 610, 'Next pair'] })
    .beat(0.7, (s) => { all.forEach((i) => { s[i].o = 0; }); s.oeHead.o = 1; s.oeSub.o = 1; s.oeKey.o = 1; s.oeKey2.o = 1; })
    .beat(1.0, (s) => pair(s, 0));
  [1, 2, 3].forEach((i) => S.step({ head: 'Now compare it', key: 'oe' + i, grp: 'oe', body: OEB, go: [800, 485, 1420, 610, 'Next pair'] }).beat(1.0, (s) => pair(s, i)));
  S.step({ head: 'Now compare it', key: 'oe4', grp: 'oe', body: 'Same base, same pay tables. **Check out the last two bars.**', go: [800, 485, 1420, 610, 'What that means'] })
    .beat(1.0, (s) => { s.oeE9.o = 1; s.oeE9.h = oh(E9); s.oeE9.y = OB - oh(E9); ['oeE9v', 'oeE9g', 'oeE9n', 'oeE9y', 'oeE9i'].forEach((k) => { s[k].o = 1; }); })
    .beat(0.9, (s) => { s.oeLine.o = 1; s.oeLine.w = ex9 + 60 - (ogx(3) - 100); })
    .beat(0.7, (s) => { s.oeBig.o = 1; s.oeBig2.o = 1; });

  S.step({ head: 'The Airmen who work for you', body: 'It takes a staff sergeant about **8 years** to make what you make on your first day.', go: [800, 480, 1420, 600, 'What that means'] })
    .beat(0.7, (s) => { all.forEach((i) => { s[i].o = 0; }); s.wkHead.o = 1; s.wkSub.o = 1; })
    .beat(1.0, (s) => { s.wkI0.o = 1; s.wkN0.o = 1; s.wkY0.o = 1; s.wkB0.o = 1; s.wkB0.w = WX(WK[0][2]) - WX0; s.wkV0.o = 1; })
    .beat(0.7, (s) => { s.wkLine.o = 1; s.wkLine.h = wy(4) + 64 - wy(0) + 10; })
    .beat(2.0, (s) => { WK.forEach(([, , v], i) => { if (!i) return; ['I', 'N', 'Y', 'V'].forEach((k) => { if (s['wk' + k + i]) s['wk' + k + i].o = 1; }); s['wkB' + i].o = 1; s['wkB' + i].w = WX(v) - WX0; }); },
      (id) => { const m = /^wk[INYVB](\d)$/.exec(id); return m && +m[1] ? { w: [(+m[1] - 1) / 4, +m[1] / 4] } : null; })
    .beat(0.8, (s) => { s.wkBig.o = 1; });

  S.step({ head: 'Lead with it', body: 'This one is really about leadership.', go: [800, 480, 1420, 600, 'So what do I do with mine?'] })
    .beat(0.7, (s) => { all.forEach((i) => { s[i].o = 0; }); })
    .beat(0.9, (s) => { s.ldQ1.o = 1; })
    .beat(0.8, (s) => { s.ldA.o = 1; s.ldB.o = 1; }, (id) => (id === 'ldB' ? { w: [0.4, 1] } : null))
    .beat(0.9, (s) => { s.ldC.o = 1; s.ldD.o = 1; });

  S.step({ head: 'Avoid lifestyle inflation', body: 'You already know how to live on a college budget, so keep doing it for a while. Taxes come out first, then **invest whatever is above that baseline**, every time you get a raise.', go: [800, 480, 1300, 600, 'Here is my story'] })
    .beat(0.7, (s) => { all.forEach((i) => { s[i].o = 0; }); s.liHead.o = 1; s.liAl.o = 1; })
    .beat(1.0, (s) => { s.liA.o = 1; s.liA.w = lw(LB); s.liAv.o = 1; })
    .beat(0.4, (s) => { s.liBl.o = 1; })
    .beat(0.8, (s) => { s.liT.o = 1; s.liT.w = lw(L.TAX); s.liTv.o = 1; })
    .beat(1.0, (s) => { s.liB.o = 1; s.liB.w = lw(LB); s.liBv.o = 1; })
    .beat(1.0, (s) => { s.liX.o = 1; s.liX.w = lw(L.BANK); s.liXv.o = 1; })
    .beat(0.8, (s) => { s.liBig.o = 1; })
    .beat(0.8, (s) => { s.liSub.o = 1; s.liSub2.o = 1; });

  S.step({ head: 'This was me in 2019.', body: 'Fresh out of college with student loans.', go: [800, 380, 760, 170, 'What happened next?'] })
    .beat(0.5, (s) => { all.forEach((i) => { s[i].o = 0; }); s.bigYr.o = 1; })
    .beat(1.0, (s) => { s.big.o = 1; s.big.s = 1; })
    .beat(0.7, (s) => { s.bigSub.o = 1; });

  S.step({ head: 'What I put in', body: 'The TSP is the same thing as a 401(k) at any big employer, and **we get a match too**. Every time I promoted, more went in, and **since 2023 I\'ve hit the limit every year.**', go: [800, 500, 1300, 580, 'Earned vs kept'] })
    .beat(0.7, (s) => { all.forEach((i) => { s[i].o = 0; }); s.tspHead.o = 1; s.tspSub.o = 1; })
    .beat(1.0, (s) => { TSP_IN.forEach((_, i) => { s['tspC' + i].o = 1; s['tspCv' + i].o = 1; s['tspY' + i].o = 1; }); })
    .beat(2.4, (s) => { TSP_IN.forEach(([, amt], i) => { const h = Math.max(4, s['tspB' + i].hTo); s['tspB' + i].o = 1; s['tspB' + i].h = h; s['tspB' + i].y = 680 - h; ['P', 'V', 'R'].forEach((k) => { s['tsp' + k + i].o = 1; }); }); },
      (id) => { const m = /^tsp[BPVR](\d)$/.exec(id); return m ? { w: [+m[1] / 8, (+m[1] + 2) / 8] } : null; })
    .beat(0.8, (s) => { s.tsp401.o = 1; });

  // one year per click on the same slide, then all of it together, then my net worth (Captain Russell, 25 Nov 2026)
  const KB = 'Every dollar of base pay I\'ve been paid since 2020, **one year at a time.**';
  const year = (s, i) => { const h = ek(EARN[i][1]); s['kE' + i].o = 1; s['kE' + i].h = h; s['kE' + i].y = EB - h; s['kEv' + i].o = 1; s['kEy' + i].o = 1; };
  S.step({ head: 'Earned vs kept', key: 'k0', grp: 'k', body: KB })
    .beat(0.7, (s) => { all.forEach((i) => { s[i].o = 0; }); s.kHead.o = 1; })
    .beat(0.9, (s) => year(s, 0));
  EARN.forEach((e, i) => {
    if (!i) return;
    const st = S.step({ head: 'Earned vs kept', key: 'k' + i, grp: 'k', body: i === EARN.length - 1 ? 'And 2026 isn\'t over yet. **The dotted bar is the whole year at the same pace.**' : KB })
      .beat(0.9, (s) => year(s, i));
    if (i === EARN.length - 1) st.beat(0.8, (s) => { s.kEx.o = 1; s.kExv.o = 1; s.kEn.o = 1; });
  });
  S.step({ head: 'Earned vs kept', key: 'kAll', grp: 'k', body: 'All of it together: **every dollar of base pay** since June 2020.' })
    .beat(1.6, (s) => { EARN.forEach((_, i) => { const r = s['kE' + i]; r.x = r.cx; r.w = r.cw; r.y = 256; r.h = 90; s['kEv' + i].o = 0; s['kEy' + i].o = 0; }); s.kEn.o = 0; s.kEx.o = 0; s.kExv.o = 0; s.kEl.o = 1; })
    .beat(0.6, (s) => { s.kEv.o = 1; });
  S.step({ head: 'Earned vs kept', key: 'kNw', grp: 'k', body: 'All my base pay since 2020, next to **what I have today.**', go: [800, 470, 1340, 650, 'Now, the budget'] })
    .beat(0.5, (s) => { s.kHl.o = 1; })
    .beat(1.4, (s) => { s.kH.o = 1; s.kH.w = KW * NOW / LIFETIME; s.kHv.o = 1; })
    .beat(0.8, (s) => { s.kBig.o = 1; })
    .beat(0.8, (s) => { s.kTsp.o = 1; s.kSub.o = 1; });

  S.step({ head: 'What comes in', body: '**Base pay** is taxed. **Basic Allowance for Housing** and **Basic Allowance for Subsistence** (food) are allowances, and they are not taxed. The **TSP match** is the BRS at work.', go: [800, 290, 1320, 260, 'Where does it go?'] })
    .beat(0.6, (s) => { all.forEach((i) => { s[i].o = 0; }); s.inHead.o = 1; s.inSub.o = 1; })
    .beat(1.6, (s) => { PAY_IN.forEach((p, i) => { s['in' + i].o = 1; s['in' + i].w = IN[i].w - 3; s['inL' + i].o = 1; }); }, (id) => { const m = /^inL?(\d)$/.exec(id); return m ? { w: [+m[1] / 5, (+m[1] + 2) / 5] } : null; })
    .beat(0.7, (s) => { s.tTax.o = 1; s.tFree.o = 1; });

  S.step({ head: 'Where it goes', body: 'About half of it, before I spend anything. Saving comes out first and we live on what\'s left.', go: [800, 628, 1320, 170, 'Show the line items'] })
    .beat(1.6, (s) => { s.outHead.o = 1; OUT.forEach((p, i) => { s['out' + i].o = 1; s['out' + i].w = OU[i].w - 3; s['outL' + i].o = 1; }); }, (id) => { const m = /^outL?(\d)$/.exec(id); return m ? { w: [+m[1] / 4, (+m[1] + 2) / 4] } : null; })
    .beat(0.8, (s) => { s.outPct.o = 1; });

  // the saving and living numbers lift out of the bar and open into their line items
  S.step({ head: 'The line items', body: 'This is our actual budget for a normal month, straight from my spreadsheet, with each line\'s share of the whole paycheck.', go: [425, 385, 680, 390, 'What I got wrong'] })
    .beat(0.6, (s) => { all.forEach((i) => { if (!/^out[01]$|^outL[01]$/.test(i)) s[i].o = 0; }); })
    .beat(1.0, (s) => { ['out0', 'out1', 'outL0', 'outL1'].forEach((i) => { s[i].o = 0; }); s.sHead.o = 1; s.sHead.x = 110; s.sHead.y = 150; s.lHead.o = 1; s.lHead.x = 860; s.lHead.y = 150; })
    .beat(2.4, (s) => {
      SAVE.forEach((r, i) => { ['sL', 'sV', 'sB'].forEach((k) => { s[k + i].o = 1; s[k + i].y = s[k + i].ty; }); s['sB' + i].w = s['sB' + i].wTo; });
      LIVE.forEach((r, i) => { ['lL', 'lV', 'lB'].forEach((k) => { s[k + i].o = 1; s[k + i].y = s[k + i].ty; }); s['lB' + i].w = s['lB' + i].wTo; }); },
    (id) => { const m = /^([sl])[LVB](\d)$/.exec(id); if (!m) return null; const k = +m[2] / (m[1] === 's' ? 5 : 10); return { w: [k * 0.7, k * 0.7 + 0.3] }; });

  S.step({ head: 'What I got wrong', body: 'I made plenty. Here are three you can skip. **It\'s not always about the spreadsheet.**', go: [800, 475, 1420, 640, 'What did I get right?'] })
    .beat(0.7, (s) => { all.forEach((i) => { s[i].o = 0; }); s.mHead.o = 1; })
    .beat(2.0, (s) => { [0, 1, 2].forEach((i) => { ['R', 'N', 'A', 'B'].forEach((k) => { s['m' + k + i].o = 1; }); }); },
      (id) => { const m = /^m[RNAB](\d)$/.exec(id); return m ? { w: [+m[1] / 3, (+m[1] + 1) / 3] } : null; });

  S.step({ head: 'What I got right', body: 'We\'ve saved about **50%** of our income for years, and that\'s what gives us options. **Up next, Chapter 2: your first paycheck.**' })
    .beat(0.7, (s) => { all.forEach((i) => { s[i].o = 0; }); s.wnHead.o = 1; })
    .beat(1.6, (s) => { [0, 1, 2].forEach((i) => { s['wnA' + i].o = 1; s['wnB' + i].o = 1; }); }, (id) => { const m = /^wn[AB](\d)$/.exec(id); return m ? { w: [+m[1] / 3, (+m[1] + 1) / 3] } : null; })
    .beat(0.9, (s) => { s.wnBig.o = 1; s.wnBig2.o = 1; })
    .beat(0.8, (s) => { s.wnQ.o = 1; });

  return S;
}

FR.SCENES = FR.SCENES || {};
FR.SCENES.fr1 = scene;
// the net worth line and today's total, for the deck's year-by-year chart
FR.DATA = FR.DATA || {};
FR.DATA.fr1 = { NW, NOW };
})();
