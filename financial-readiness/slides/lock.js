/* Financial Readiness lock (Captain Russell, 25 Nov 2026: cadets can't pre-watch the lesson).
   deck.lock.json holds the deck and the chapter 1, 2 and 4 scenes, sealed with the admin password by
   tools/fr-lock.mjs (PBKDF2-SHA256 310k + AES-256-GCM). This page opens it with a password this tab already
   has (the hub sign-in as cadre, or an earlier unlock), or asks for it, then runs the deck.
   The password is never in the repo. */
(function () {
  'use strict';
  const KEYS = ['d250-fr-pass', 'd250-admin-pass', 'd250-cadre-pass'];
  const ss = { get: (k) => { try { return sessionStorage.getItem(k) || ''; } catch (e) { return ''; } }, set: (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) {} } };
  const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  let pack = null;
  async function open(pw) {
    if (!pw || !pack) return null;
    try {
      const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']);
      const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: b64(pack.salt), iterations: pack.iter || 310000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
      return new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(pack.iv) }, key, b64(pack.data)));
    } catch (e) { return null; }
  }
  function run(code) {
    const s = document.createElement('script');
    s.src = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
    document.body.appendChild(s);
  }
  function box() {
    const solo = /[?&]solo=/.test(location.search);
    const d = document.createElement('div');
    d.id = 'lockbox';
    d.innerHTML = `<form class="panel" autocomplete="off">
        <img src="../../shared/card-art/financial-readiness.webp" alt="" width="72" height="72">
        <h2>Financial Readiness</h2>
        <p>${solo ? 'This slide opens on the presenter\'s screen. Use the phone view.' : 'This lesson is locked until class. Enter the admin password to present it.'}</p>
        ${solo ? '' : `<label for="lockpw">Password</label><input id="lockpw" type="password" autocomplete="current-password" required>
        <button type="submit">Unlock</button><p class="err" role="alert" hidden>That password doesn't open this lesson.</p>`}
        <a href="../../activities/">Back to Class Activities</a></form>`;
    document.body.appendChild(d);
    const f = d.querySelector('form'), inp = d.querySelector('#lockpw'), err = d.querySelector('.err');
    if (!inp) return;
    inp.focus();
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const pw = inp.value, btn = f.querySelector('button[type=submit]');
      btn.disabled = true; btn.textContent = 'Checking...'; err.hidden = true;
      const code = await open(pw);
      btn.disabled = false; btn.textContent = 'Unlock';
      if (!code) { err.hidden = false; inp.select(); return; }
      ss.set('d250-fr-pass', pw);
      if (window.D250SignIn) D250SignIn.adopt(pw);
      d.remove(); run(code);
    });
  }
  (async function () {
    if (window.D250SignIn) { D250SignIn.root = '../../'; try { await D250SignIn.resume(); } catch (e) {} }
    try { pack = await fetch('deck.lock.json', { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)); } catch (e) { pack = null; }
    for (const k of KEYS) { const code = await open(ss.get(k)); if (code) { if (k !== 'd250-fr-pass') ss.set('d250-fr-pass', ss.get(k)); run(code); return; } }
    box();
  })();
})();
