/* explore.js: the deck's slider charts, small enough for a phone (Captain Russell, 25 Nov 2026: "for these charts
 * that have a slider or options, have this shown on the user's phone, so they can interact with the chart and see
 * for themselves"). The deck says which one is on the screen; the phone page mounts the same chart here.
 *   FRExplore.mount(el, id)  draws chart id ('life', 'wait', 'tsp', 'zoom') into el, returns { destroy }
 *   FRExplore.has(id)        whether there is a phone version of that chart
 * Uses FR.LIFE (../lessons/shared/fr.js) and FR.DATA.fr3 (../lessons/c3-brs/scene.js), the same numbers as the deck.
 * Code organized with help from Claude (Anthropic), Nov 2026.
 */
(function (root) {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const W = 340, H = 210, X0 = 44, X1 = 330, Y0 = 186, Y1 = 14;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
  const kM = (n) => (n >= 1e6 ? '$' + (n / 1e6).toFixed(1) + 'M' : '$' + Math.round(n / 1000).toLocaleString('en-US') + 'K');
  const COL = { green: '#3fd69a', red: '#ff6f7d', cyan: '#4ea8ff', amber: '#e8b54a', line: '#2b4370', faint: '#7083a6', panel: '#152a4d' };
  function sv(tag, a, p) { const n = document.createElementNS(NS, tag); for (const k in a) n.setAttribute(k, a[k]); if (p) p.appendChild(n); return n; }
  const pathOf = (pts) => 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L');

  // the frame every chart shares: a title, the chart, readouts, then the controls
  function frame(el, title, hint) {
    el.innerHTML = `<div class="ex"><h2>${title}</h2><p class="hint">${hint}</p><svg viewBox="0 0 ${W} ${H}" class="exc"></svg><div class="exr"></div><div class="exs"></div></div>`;
    const svg = el.querySelector('svg');
    return { svg, r: el.querySelector('.exr'), s: el.querySelector('.exs') };
  }
  function grid(svg, lo, hi, step, f) {
    const g = sv('g', {}, svg);
    for (let v = lo; v <= hi + 1e-9; v += step) {
      const y = Y0 - (Y0 - Y1) * (v - lo) / (hi - lo);
      sv('line', { x1: X0, x2: X1, y1: y, y2: y, stroke: COL.line, 'stroke-width': 1 }, g);
      sv('text', { x: X0 - 6, y: y + 4, 'text-anchor': 'end', fill: COL.faint, 'font-size': 11, 'font-weight': 700 }, g).textContent = f(v);
    }
    return g;
  }
  function stat(host, lab, cls) { const d = document.createElement('div'); d.className = 'st'; d.innerHTML = `<span>${lab}</span><b class="${cls || ''}"></b>`; host.appendChild(d); return d.querySelector('b'); }
  function range(host, o) {
    const d = document.createElement('label'); d.className = 'rg';
    d.innerHTML = `<span class="rl">${o.label}<b></b></span><input type="range" min="${o.min}" max="${o.max}" step="${o.step}" value="${o.value}">` +
      (o.ends ? `<span class="re"><i>${o.ends[0]}</i><i>${o.ends[1]}</i></span>` : '');
    host.appendChild(d);
    const inp = d.querySelector('input'), out = d.querySelector('.rl b');
    const paint = () => { const v = +inp.value; inp.style.setProperty('--fill', ((v - o.min) / (o.max - o.min) * 100) + '%'); out.textContent = o.show(v); o.on(v); };
    inp.addEventListener('input', paint);
    return { paint, get value() { return +inp.value; } };
  }

  const CHARTS = {
    // ---- invest the difference for 4 years, then leave it alone
    life(el) {
      const L = root.FR.LIFE, MAXB = Math.round(L.PAY - 2000), HI = 2.4e6;
      const f = frame(el, 'How much do you invest?', `Your first month: ${money(L.PAY)}. About ${money(L.TAX)} goes to taxes. Slide right to invest more.`);
      // the paycheck bar above the chart, like the big screen: taxes, what you spend, what you invest
      const bar = document.createElementNS(NS, 'svg'); bar.setAttribute('viewBox', `0 0 ${W} 44`); bar.setAttribute('class', 'exc exbar'); f.svg.before(bar);
      const bx = (v) => (W - 4) * v / L.PAY;
      sv('rect', { x: 2, y: 2, width: W - 4, height: 40, rx: 8, fill: COL.panel, stroke: COL.line }, bar);
      sv('rect', { x: 2, y: 2, width: bx(L.TAX), height: 40, rx: 8, fill: COL.red }, bar);
      sv('text', { x: 2 + bx(L.TAX) / 2, y: 27, 'text-anchor': 'middle', fill: '#1c0507', 'font-size': 11, 'font-weight': 850 }, bar).textContent = 'Taxes';
      const spR = sv('rect', { x: 2 + bx(L.TAX), y: 2, height: 40, rx: 8, fill: COL.amber }, bar), inR = sv('rect', { y: 2, height: 40, rx: 8, fill: COL.green }, bar);
      const spT = sv('text', { x: 10 + bx(L.TAX), y: 27, fill: '#1a1203', 'font-size': 13, 'font-weight': 850 }, bar), inT = sv('text', { x: W - 10, y: 27, 'text-anchor': 'end', fill: '#04140e', 'font-size': 13, 'font-weight': 850 }, bar);
      grid(f.svg, 0, 2e6, 5e5, (v) => (v ? '$' + v / 1e6 + 'M' : '$0'));
      const ax = (a) => X0 + (X1 - X0) * (a - 22) / 38;
      [22, 26, 40, 60].forEach((a) => { sv('text', { x: ax(a), y: H - 2, 'text-anchor': 'middle', fill: COL.faint, 'font-size': 11, 'font-weight': 700 }, f.svg).textContent = a; });
      sv('line', { x1: ax(26), x2: ax(26), y1: Y1, y2: Y0, stroke: COL.faint, 'stroke-dasharray': '3 4' }, f.svg);
      const area = sv('path', { fill: 'rgba(63,214,154,.15)' }, f.svg), ln = sv('path', { fill: 'none', stroke: COL.green, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, f.svg);
      const b1 = stat(f.r, 'Invest a month', 'g'), b2 = stat(f.r, 'After 4 years', 'g'), b3 = stat(f.r, 'At 60', 'g');
      const rg = range(f.s, { label: 'You invest ', min: 0, max: MAXB, step: 1, value: 0, ends: ['Spend it all', 'Live on $2,000'], show: money,
        on(v) {
          const pts = L.curve(v).map(([a, b]) => [ax(a), Y0 - (Y0 - Y1) * Math.min(b, HI) / HI]);
          ln.setAttribute('d', pathOf(pts)); area.setAttribute('d', pathOf(pts) + `L${X1} ${Y0}L${X0} ${Y0}Z`);
          const ws = bx(L.TAKE - v); spR.setAttribute('width', Math.max(0, ws)); inR.setAttribute('x', 2 + bx(L.TAX) + ws); inR.setAttribute('width', Math.max(0, bx(v)));
          spT.textContent = ws > 120 ? 'Spend ' + money(L.TAKE - v) : ''; inT.textContent = bx(v) > 92 ? 'Invest ' + money(v) : '';
          const g = L.grow(v); b1.textContent = money(v); b2.textContent = kM(g.f4); b3.textContent = '$' + (g.f60 / 1e6).toFixed(1) + 'M';
        } });
      rg.paint();
      return {};
    },

    // ---- your own numbers: invest each month and a starting debt, on a locked axis (Captain Russell, 25 Nov 2026)
    wait(el) {
      const f = frame(el, 'Your own numbers', 'Pick what you\'d invest each month and any debt you start with. Debt grows at 6%, investments at 7%.');
      const ax = (a) => X0 + (X1 - X0) * (a - 22) / 38, LO = -2e5, HI = 4.5e6, ay = (v) => Y0 - (Y0 - Y1) * (Math.min(v, HI) - LO) / (HI - LO);
      [22, 30, 40, 50, 60].forEach((a) => { sv('text', { x: ax(a), y: H - 2, 'text-anchor': 'middle', fill: COL.faint, 'font-size': 11, 'font-weight': 700 }, f.svg).textContent = a; });
      for (let v = 0; v <= 4e6; v += 1e6) {
        sv('line', { x1: X0, x2: X1, y1: ay(v), y2: ay(v), stroke: v ? COL.line : COL.faint, 'stroke-width': 1 }, f.svg);
        sv('text', { x: X0 - 6, y: ay(v) + 4, 'text-anchor': 'end', fill: COL.faint, 'font-size': 11, 'font-weight': 700 }, f.svg).textContent = v ? '$' + v / 1e6 + 'M' : '$0';
      }
      const aA = sv('path', { fill: 'rgba(63,214,154,.12)' }, f.svg), lA = sv('path', { fill: 'none', stroke: COL.green, 'stroke-width': 3.5 }, f.svg);
      const run = (mo, debt) => { const pts = []; let b = debt, free = debt >= 0 ? 22 : null; for (let m = 0; m <= 456; m++) { if (m % 3 === 0) pts.push([22 + m / 12, b]); b = b * Math.pow(b < 0 ? 1.06 : 1.07, 1 / 12) + mo; if (free == null && b >= 0) free = 22 + (m + 1) / 12; } pts.free = free; return pts; };
      const R = root.FR.fmtR;
      const sA = stat(f.r, 'At 60', 'g'), sB = stat(f.r, 'You put in', ''), sC = stat(f.r, 'Out of debt', 'a');
      let mo = 500, d = 0;
      const draw = () => {
        const A = run(mo, d), pa = A.map(([a, v]) => [ax(a), ay(v)]), z = ay(0);
        lA.setAttribute('d', pathOf(pa)); aA.setAttribute('d', pathOf(pa) + `L${X1} ${z}L${X0} ${z}Z`);
        sA.textContent = R(A[A.length - 1][1]); sB.textContent = R(mo * 12 * 38);
        sC.textContent = d < 0 ? (A.free == null ? 'After 60' : 'Age ' + Math.ceil(A.free * 2) / 2) : 'No debt';
      };
      range(f.s, { label: 'Invest a month ', min: 100, max: 2000, step: 50, value: 500, ends: ['$100', '$2,000'], show: money, on(v) { mo = v; draw(); } }).paint();
      range(f.s, { label: 'Starting debt ', min: -50000, max: 0, step: 5000, value: 0, ends: ['−$50K', '$0'], show: (v) => (v ? '−' + kM(-v) : '$0'), on(v) { d = v; draw(); } }).paint();
      return {};
    },

    // ---- the TSP: you, the Air Force, 20 years later
    tsp(el) {
      const D3 = root.FR.DATA.fr3, BASE = 4150.20, MAXP = 25, AT = [];
      for (let x = 0; x <= MAXP; x++) AT.push(D3.at20(x));
      const f = frame(el, 'Your TSP contribution', 'The Air Force puts in 1%, then matches you up to 4% more once you hit 2 years.');
      const bw = (X1 - X0) / (MAXP + 1);
      grid(f.svg, 0, AT[MAXP], AT[MAXP] / 4, kM);
      const bars = AT.map((v, x) => {
        const h = (Y0 - Y1) * v / AT[MAXP];
        const r = sv('rect', { x: X0 + x * bw + 2, y: Y0 - h, width: bw - 4, height: h, rx: 2, fill: COL.panel }, f.svg);
        if (x % 5 === 0) sv('text', { x: X0 + x * bw + bw / 2, y: H - 2, 'text-anchor': 'middle', fill: COL.faint, 'font-size': 11, 'font-weight': 700 }, f.svg).textContent = x + '%';
        return r;
      });
      const sY = stat(f.r, 'You a month', 'c'), sG = stat(f.r, 'Air Force', 'g'), s20 = stat(f.r, 'After 20 yrs', 'g');
      range(f.s, { label: 'You put in ', min: 0, max: MAXP, step: 1, value: 0, ends: ['0%', '25%'], show: (v) => v + '%',
        on(v) {
          bars.forEach((b, i) => b.setAttribute('fill', i === v ? (i >= 5 ? COL.green : COL.red) : i >= 5 ? '#174a3a' : COL.panel));
          sY.textContent = money(BASE * v / 100); sG.textContent = money(BASE * D3.govPct(v, 3) / 100) + ' (' + D3.govPct(v, 3) + '%)'; s20.textContent = kM(AT[v]);
        } }).paint();
      return {};
    },

    // ---- when in doubt, zoom out
    zoom(el) {
      const Z = root.FR.DATA.fr3.ZOOMS, N = 90;
      const norm = Z.map((z) => {
        const ys = z.pts.map((p) => (z.log ? Math.log(p[1]) : p[1])), lo = Math.min(...ys), hi = Math.max(...ys), out = [];
        for (let i = 0; i < N; i++) {
          const t = i / (N - 1); let j = 0;
          while (j < z.pts.length - 2 && z.pts[j + 1][0] < t) j++;
          const a = z.pts[j], b = z.pts[j + 1], fr = clamp((t - a[0]) / Math.max(1e-9, b[0] - a[0]), 0, 1);
          out.push((lerp(z.log ? Math.log(a[1]) : a[1], z.log ? Math.log(b[1]) : b[1], fr) - lo) / (hi - lo || 1));
        }
        return { pts: out, chg: (z.pts[z.pts.length - 1][1] / z.pts[0][1] - 1) * 100 };
      });
      const f = frame(el, 'When in doubt, zoom out', 'The C Fund tracks the S&amp;P 500. Drag from one day out to a hundred years.');
      for (let i = 0; i <= 4; i++) sv('line', { x1: X0, x2: X1, y1: lerp(Y0, Y1, i / 4), y2: lerp(Y0, Y1, i / 4), stroke: COL.line }, f.svg);
      const area = sv('path', {}, f.svg), ln = sv('path', { fill: 'none', 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, f.svg);
      const when = sv('text', { x: X0, y: H - 2, fill: COL.faint, 'font-size': 11, 'font-weight': 700 }, f.svg);
      const sW = stat(f.r, 'Window', ''), sC = stat(f.r, 'Change', 'g');
      range(f.s, { label: 'Zoom out ', min: 0, max: 4, step: 0.01, value: 0, ends: [Z[0].name, Z[4].name], show: (v) => Z[Math.round(v)].name,
        on(v) {
          const k = Math.min(3, Math.floor(v)), fr = v - k, A = norm[k], B = norm[Math.min(4, k + 1)], near = Math.round(v), up = norm[near].chg >= 0, col = up ? COL.green : COL.red;
          const pts = A.pts.map((a, i) => [lerp(X0, X1, i / (N - 1)), lerp(Y0, Y1, lerp(a, B.pts[i], fr) * 0.9 + 0.05)]);
          ln.setAttribute('d', pathOf(pts)); ln.setAttribute('stroke', col);
          area.setAttribute('d', pathOf(pts) + `L${X1} ${Y0}L${X0} ${Y0}Z`); area.setAttribute('fill', up ? 'rgba(63,214,154,.14)' : 'rgba(255,111,125,.16)');
          when.textContent = Z[near].when + (Z[near].log ? ' (log scale)' : '');
          sW.textContent = Z[near].name; sC.className = up ? 'g' : 'r';
          sC.textContent = (up ? '+' : '−') + Math.abs(norm[near].chg).toLocaleString('en-US', { maximumFractionDigits: Math.abs(norm[near].chg) < 10 ? 1 : 0 }) + '%';
        } }).paint();
      return {};
    },
  };

  root.FRExplore = {
    has: (id) => !!CHARTS[id],
    mount(el, id) { const c = CHARTS[id]; if (!c) return { destroy() {} }; c(el); return { destroy() { el.innerHTML = ''; } }; },
  };
})(this);
