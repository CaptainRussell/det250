/* fr.js: Financial Readiness additions to the Internet Secrets lesson engine
 * (../../../internet-secrets/lessons/shared/engine.js and lesson.js), which every chapter reuses as is.
 *
 *   FR.CHAPTERS     the four chapters in order (the chapter picker and each chapter's last button)
 *   FR.next(id)     where a chapter's score screen sends the learner
 *   Anim.KINDS.money  a dollar figure that counts smoothly between values: props num, fill; cfg size, weight, anchor, pre, post,
 *                     k (show in thousands), les (an LES amount, 7737.00), cents ($6,062.68), fit (as for text)
 *   FR.fmt(n)       "$10,732", "−$20,000"
 * Code organized with help from Claude (Anthropic), Nov 2026.
 */
(function (root) {
  'use strict';
  const { el, C, FONT } = root.Anim;
  const CHAPTERS = [
    { id: 'fr1', href: 'c1-from-minus-20k/', n: 1, name: 'From −$20K', blurb: 'Your discussion post, then my real net worth, budget and mistakes.' },
    { id: 'fr2', href: 'c2-first-les/', n: 2, name: 'Your first LES', blurb: 'Build a 2d Lt paycheck from the three types of pay.' },
    { id: 'fr3', href: 'c3-brs/', n: 3, name: 'The BRS', blurb: 'Pension, TSP match, continuation pay, and when in doubt, zoom out.' },
    { id: 'fr4', href: 'c4-money-calls/', n: 4, name: 'Money calls', blurb: 'Five decisions from your first ten years, next to my real line.' },
  ];
  function next(id) {
    const i = CHAPTERS.findIndex((c) => c.id === id);
    if (i < CHAPTERS.length - 1) return { href: '../' + CHAPTERS[i + 1].href, label: `Next: ${CHAPTERS[i + 1].name}` };
    return { href: '../', label: 'All chapters' };
  }
  const fmt = (n, o) => {
    o = o || {};
    if (o.les) return (n < 0 ? '-' : '') + Math.abs(n).toFixed(2);   // an LES amount: 7737.00
    if (o.cents) return (n < 0 ? '−' : '') + '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });   // $6,062.68
    let v = Math.round(n);
    const neg = v < 0; v = Math.abs(v);
    const body = o.k ? (v / 1000).toLocaleString('en-US', { maximumFractionDigits: v < 10000 && v % 1000 ? 1 : 0 }) + 'K' : v.toLocaleString('en-US');
    return (neg ? '−' : o.plus ? '+' : '') + (o.pre != null ? o.pre : '$') + body + (o.post || '');
  };
  root.Anim.KINDS.money = {
    defaults: { num: 0, fill: C.ink },
    create(g, cfg) {
      const r = el('g', {}, g);
      const t = el('text', { 'font-family': cfg.mono ? root.Anim.MONO : FONT, 'font-size': cfg.size || 40, 'font-weight': cfg.weight || 800,
        'text-anchor': cfg.anchor || 'middle', ...(cfg.fit != null ? { 'data-fit': cfg.fit === false ? 'no' : cfg.fit } : {}) }, r);
      return { root: r, t, cfg, s: null, a: {} };
    },
    update(h, p) {
      const sa = (n, k, v) => { if (h.a[n + k] !== v) { h.a[n + k] = v; (n === 'r' ? h.root : h.t).setAttribute(k, v); } };
      sa('r', 'transform', `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) scale(${p.s.toFixed(4)})`);
      sa('r', 'opacity', p.o.toFixed(3));
      sa('t', 'fill', p.fill);
      const s = fmt(p.num, h.cfg);
      if (s !== h.s) { h.t.textContent = s; h.s = s; }
    },
  };
  // pictures (rank insignia, photos) from ../assets/, wherever the page that loads fr.js lives
  const ASSET = (document.currentScript && document.currentScript.src || '').replace(/lessons\/shared\/fr\.js.*$/, 'assets/');
  // Anim.KINDS.img: a picture. props x, y (top left), w, h, o; cfg href (under assets/) or data (a data: URL), round (circle clip)
  root.Anim.KINDS.img = {
    defaults: { w: 40, h: 40 },
    create(g, cfg) {
      const r = el('g', {}, g);
      const i = el('image', { href: cfg.data || ASSET + cfg.href, preserveAspectRatio: cfg.cover ? 'xMidYMid slice' : 'xMidYMid meet' }, r);
      if (cfg.pixel) i.setAttribute('style', 'image-rendering:pixelated');
      return { root: r, i, a: {} };
    },
    update(h, p) {
      const sa = (n, k, v) => { if (h.a[n + k] !== v) { h.a[n + k] = v; (n === 'r' ? h.root : h.i).setAttribute(k, v); } };
      sa('r', 'transform', `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) scale(${p.s.toFixed(4)})`);
      sa('r', 'opacity', p.o.toFixed(3));
      sa('i', 'width', p.w.toFixed(1)); sa('i', 'height', p.h.toFixed(1));
    },
  };
  // the rank insignia files in assets/insignia (public domain, from Wikimedia Commons via Practicum Adventure): rank -> [file, width / height]
  const INSIGNIA = { 'O-1': ['2dLt', 0.4], 'O-2': ['1stLt', 0.4], 'O-3': ['Capt', 1.069], 'O-4': ['Maj', 0.953], 'O-5': ['LtCol', 0.953], 'O-6': ['Col', 2.0],
    'E-2': ['Amn', 2.182], 'E-3': ['A1C', 1.727], 'E-4': ['SrA', 1.429], 'E-5': ['SSgt', 1.218], 'E-6': ['TSgt', 1.063], 'E-7': ['MSgt', 0.735], 'E-8': ['SMSgt', 0.661], 'E-9': ['CMSgt', 0.597] };
  // rank names spelled out (Captain Russell, 25 Nov 2026)
  const RANK = { 'E-1': 'Airman Basic', 'E-2': 'Airman', 'E-3': 'Airman First Class', 'E-4': 'Senior Airman', 'E-5': 'Staff Sergeant', 'E-6': 'Technical Sergeant',
    'E-7': 'Master Sergeant', 'E-8': 'Senior Master Sergeant', 'E-9': 'Chief Master Sergeant', 'O-1': 'Second Lieutenant', 'O-2': 'First Lieutenant', 'O-3': 'Captain' };
  // Living on a college budget as a 2d Lt (Captain Russell, 25 Nov 2026: count the taxes). A single 2d Lt in San Antonio:
  // $6,062.68 a month (base pay $4,150.20, Basic Allowance for Housing $1,584, Basic Allowance for Subsistence $328.48).
  // Only base pay is taxed: 2026 federal income tax (single, $16,100 standard deduction, 10% to $12,400, 12% to $50,400)
  // and FICA (7.65%). Texas has no state income tax. The allowances aren't taxed.
  const LIFE = (function () {
    const PAY = 6062.68, BASE = 4150.20, yr = BASE * 12, taxable = Math.max(0, yr - 16100);
    const fedYr = Math.min(taxable, 12400) * 0.10 + Math.max(0, Math.min(taxable, 50400) - 12400) * 0.12;
    const FED = fedYr / 12, FICA = BASE * 0.0765, TAX = FED + FICA, TAKE = PAY - TAX, BUDGET = 3000;
    // commission age 23 (Captain Russell, 25 Nov 2026)
    const AGE = 23;
    const fv = (pmt, months, r) => { const i = Math.pow(1 + r, 1 / 12) - 1; return pmt * (Math.pow(1 + i, months) - 1) / i; };
    // invest an amount every month for the 4-year commitment (age 23 to 27), then never add another dime; 7% a year after inflation
    const grow = (bank) => { const f4 = fv(bank, 48, 0.07); return { f4, f60: f4 * Math.pow(1.07, 60 - AGE - 4) }; };
    const curve = (bank) => { const pts = []; let b = 0; for (let m = 0; m <= (60 - AGE) * 12; m++) { if (m % 3 === 0) pts.push([AGE + m / 12, b]); b = b * Math.pow(1.07, 1 / 12) + (m < 48 ? bank : 0); } return pts; };
    return { AGE, PAY, BASE, FED, FICA, TAX, TAKE, BUDGET, BANK: TAKE - BUDGET, fv, grow, curve };
  })();
  // a college student's month (Captain Russell, 25 Nov 2026: realistic Iowa State numbers, no student loans).
  // Housing and food: ISU 2026-27 cost of attendance, on campus with the Cardinal meal plan, $11,162 for the year (9 months).
  // Books: ISU's $800 a year. The rest is a typical month for a cadet with a car.
  const COLLEGE = [['Dorm + meal plan', 1240], ['Car payment', 350], ['Fun and trips home', 300], ['Eating out + coffee', 250], ['Clothes + personal', 200],
    ['Entertainment', 200], ['Car insurance', 150], ['Gas', 120], ['Books + supplies', 90], ['Phone', 60], ['Subscriptions', 40]];
  // big round numbers (Captain Russell, 25 Nov 2026): the nearest $10K, or the nearest tenth of a million from $1M up
  const fmtR = (v) => { const a = Math.abs(v), sg = v < -0.5 ? '−' : ''; return a >= 1e6 ? sg + '$' + (a / 1e6).toFixed(1) + 'M' : a < 5000 ? '$0' : sg + '$' + Math.round(a / 1e4) * 10 + 'K'; };
  root.FR = { CHAPTERS, next, fmt, fmtR, ASSET, INSIGNIA, RANK, LIFE, COLLEGE };
})(this);
